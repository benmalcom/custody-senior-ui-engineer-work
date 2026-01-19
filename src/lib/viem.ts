import { formatUnits, parseUnits } from 'viem'

/**
 * Format a bigint value to a human-readable string with proper decimal places
 * @param value - The bigint value to format
 * @param decimals - Number of decimal places (default 18 for most ERC20 tokens)
 * @returns Formatted string
 */
export function formatTokenAmount(value: bigint, decimals: number = 18): string {
  return formatUnits(value, decimals)
}

/**
 * Parse a human-readable string to a bigint value
 * @param value - The string value to parse
 * @param decimals - Number of decimal places (default 18)
 * @returns BigInt value
 */
export function parseTokenAmount(value: string, decimals: number = 18): bigint {
  try {
    // Remove commas before parsing
    const cleaned = value.replace(/,/g, '')
    return parseUnits(cleaned, decimals)
  } catch {
    return BigInt(0)
  }
}

/**
 * Format input value according to requirements:
 * - Remove trailing 0s (0.00 -> 0)
 * - Remove trailing "." (0. -> 0)
 * - "," separated thousands places (1000 -> 1,000)
 * - Ensure only 1 leading zero (001 -> 1, 00.1 -> 0.1)
 */
export function formatAmountInput(value: string): string {
  if (!value) return ''

  // Remove any non-numeric characters except . and leading numbers
  let cleaned = value.replace(/[^\d.]/g, '')

  // Ensure only one decimal point
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = `${parts[0]}.${parts.slice(1).join('')}`
  }

  // Handle leading zeros
  if (cleaned.includes('.')) {
    const [intPart, decPart] = cleaned.split('.')
    // Remove leading zeros but keep one if it's before decimal
    const cleanedInt = intPart.replace(/^0+/, '') || '0'
    cleaned = `${cleanedInt}.${decPart}`
  } else {
    // Remove all leading zeros
    cleaned = cleaned.replace(/^0+/, '') || '0'
  }

  // Remove trailing zeros after decimal point
  if (cleaned.includes('.')) {
    cleaned = cleaned.replace(/\.?0+$/, '')
  }

  // Add thousand separators
  if (cleaned.includes('.')) {
    const [intPart, decPart] = cleaned.split('.')
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return decPart ? `${formattedInt}.${decPart}` : formattedInt
  } else {
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

/**
 * Subtract fee from balance and return formatted result
 * Returns '--' if balance or fee is unavailable
 */
export function calculateAvailableBalance(
  balance: bigint | undefined,
  fee: bigint | undefined,
  decimals: number = 18,
): string {
  if (balance === undefined || fee === undefined) {
    return '--'
  }

  const available = balance - fee
  return formatTokenAmount(available > 0 ? available : BigInt(0), decimals)
}

/**
 * Format a number with thousand separators
 */
export function formatWithCommas(value: string | number): string {
  const str = String(value)
  const [intPart, decPart] = str.split('.')
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${formattedInt}.${decPart}` : formattedInt
}
