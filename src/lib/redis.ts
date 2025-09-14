import { Redis } from '@upstash/redis'
import { logCachePerformance } from './utils/logCachePerformance'
import { createHash } from 'crypto'
import type { ShiftSearchParams } from '@/types/shift'

/**
 * Redis Error Classes for better error handling
 */
export class RedisConnectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RedisConnectionError'
  }
}

export class RedisCacheError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RedisCacheError'
  }
}

/**
 * Environment validation for Redis configuration
 */
const validateRedisEnvironment = (): { url: string; token: string } => {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new RedisConnectionError(
      'Missing required Redis environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN'
    )
  }

  return { url, token }
}

// Validate environment and create Redis client instance
const { url, token } = validateRedisEnvironment()

export const redis = new Redis({
  url,
  token,
  retry: {
    retries: 3,
    backoff: (retryCount: number) => Math.min(1000 * Math.pow(2, retryCount), 10000), // Exponential backoff with max 10s
  },
  // Additional connection options for production
  automaticDeserialization: true,
})

/**
 * Cache key generators for consistent naming
 */
export const cacheKeys = {
  // Shifts data keys
  shifts: {
    all: 'shifts:all',
    filtered: (params: ShiftSearchParams) => `shifts:${hashParams(params)}`,
  },
} as const

/**
 * Cache TTL constants (in seconds)
 */
export const cacheTTL = {
  shifts: 300,           // 5 minutes
} as const

/**
 * Hash function for creating consistent cache keys from parameters
 */
const hashParams = (params: Record<string, any>): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      const value = params[key]
      if (value !== undefined && value !== null && value !== '') {
        result[key] = value
      }
      return result
    }, {} as Record<string, any>)
  
  return createHash('sha256').update(JSON.stringify(sortedParams)).digest('hex')
}

/**
 * Cache utilities for common patterns
 */
export const cacheUtils = {
  getWithFallback: async <T>(
    key: string,
    fallbackFn: () => Promise<T>,
    ttl: number = cacheTTL.shifts
  ): Promise<{ data: T; source: 'cache' | 'database' }> => {
    const startTime = Date.now()
    
    try {
      // Try cache first
      const cached = await redis.get(key)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Redis cache key:', key)
        console.log('Redis cache hit:', cached !== null)
      }
      
      if (cached !== null) {
        // Performance logging for cache hit
        await logCachePerformance('getWithFallback', startTime, 'cache')
        
        // Upstash Redis automatically deserializes JSON
        return {
          data: cached as T,
          source: 'cache'
        }
      }
      
      // Cache miss - fetch from source
      const data = await fallbackFn()

      // Performance logging for cache miss
      await logCachePerformance('getWithFallback', startTime, 'database')

      // Store in cache (fire and forget)
      redis.setex(key, ttl, JSON.stringify(data)).catch((error) => {
        console.error('Cache storage error:', error)
      })

      return { data, source: 'database' }
    } catch (error) {
      console.error('Redis cache error:', error)
      
      // Fallback to source on Redis errors
      const data = await fallbackFn()
      return { data, source: 'database' }
    }
  },

  /**
   * Invalidate cache pattern for production efficiency
   * Large datasets
   * Pattern matching
   */
  invalidatePattern: async (pattern: string): Promise<void> => {
    try {
      let cursor = 0
      const keysToDelete: string[] = []
      
      do {
        const [nextCursor, keys] = await redis.scan(cursor, { 
          match: pattern,
          count: 100
        })
        keysToDelete.push(...keys)
        cursor = parseInt(nextCursor.toString(), 10)
      } while (cursor !== 0)
      
      if (keysToDelete.length > 0) {
        const batchSize = 100
        for (let i = 0; i < keysToDelete.length; i += batchSize) {
          const batch = keysToDelete.slice(i, i + batchSize)
          await redis.del(...batch)
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🗑️ Invalidated ${keysToDelete.length} cache keys matching: ${pattern}`)
        }
      }
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  },

  /**
   * Invalidate multiple patterns concurrently
   */
  invalidatePatterns: async (patterns: string[]): Promise<void> => {
    await Promise.all(
      patterns.map(pattern => cacheUtils.invalidatePattern(pattern))
    )
  },
}
