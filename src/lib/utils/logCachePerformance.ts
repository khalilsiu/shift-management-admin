/**
 * Cache performance logging utility
 * Logs cache operation performance in development mode
 */

export const logCachePerformance = async (
  operation: string,
  startTime: number,
  source: 'cache' | 'database'
): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const duration = Date.now() - startTime
  const emoji = source === 'cache' ? '⚡' : '💾'
  
  console.log(`${emoji} ${operation} (${source}): ${duration}ms`)
}