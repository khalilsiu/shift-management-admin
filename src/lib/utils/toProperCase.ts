
/**
 * Formats any string to proper case (capitalizes first letter, lowercases rest)
 * @param text - The text to format
 * @returns The formatted text
 */
export const toProperCase = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}
