import { formatUnits, parseUnits } from 'viem'

/**
 * Formats a BigInt balance to a human-readable string
 * Removes trailing zeros and unnecessary decimals
 */
export function formatBalance(
    value: string | bigint,
    decimals: number
): string {
    const formatted = formatUnits(
        typeof value === 'string' ? BigInt(value) : value,
        decimals
    )

    // Remove trailing zeros after decimal point
    return removeTrailingZeros(formatted)
}

/**
 * Parses a human-readable string to BigInt
 */
export function parseBalance(value: string, decimals: number): bigint {
    if (!value || value === '' || value === '.') return 0n

    // Remove commas from formatted input
    const cleanValue = value.replace(/,/g, '')

    try {
        return parseUnits(cleanValue, decimals)
    } catch {
        return 0n
    }
}

/**
 * Removes trailing zeros from a decimal string
 * "1.500" -> "1.5"
 * "1.000" -> "1"
 * "1." -> "1"
 */
export function removeTrailingZeros(value: string): string {
    if (!value.includes('.')) return value

    // Remove trailing zeros
    let result = value.replace(/0+$/, '')

    // Remove trailing decimal point
    if (result.endsWith('.')) {
        result = result.slice(0, -1)
    }

    return result
}

/**
 * Formats input value with thousand separators
 * "1000" -> "1,000"
 * "1000.50" -> "1,000.50"
 */
export function formatInputValue(value: string): string {
    if (!value) return ''

    // Remove existing commas
    const cleanValue = value.replace(/,/g, '')

    // Handle leading zeros (001 -> 1, but 0.1 stays 0.1)
    let normalized = cleanValue
    if (normalized.match(/^0+\d/)) {
        normalized = normalized.replace(/^0+/, '')
    }
    if (normalized.startsWith('.')) {
        normalized = '0' + normalized
    }

    // Split by decimal point
    const parts = normalized.split('.')

    // Add thousand separators to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return parts.join('.')
}

/**
 * Cleans input value for processing
 * Removes commas, handles edge cases
 */
export function cleanInputValue(value: string): string {
    // Remove commas
    let clean = value.replace(/,/g, '')

    // Remove leading zeros (except for "0." case)
    if (clean.match(/^0+\d/) && !clean.startsWith('0.')) {
        clean = clean.replace(/^0+/, '')
    }

    // Handle empty or just decimal
    if (clean === '' || clean === '.') {
        return '0'
    }

    // Remove trailing decimal point
    if (clean.endsWith('.')) {
        clean = clean.slice(0, -1)
    }

    return clean
}

/**
 * Format number for USD display with commas and 2 decimal places
 * 376244 -> "376,244.00"
 */
export function formatUsd(value: number): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

/**
 * Format token amount with commas
 * 10000000 -> "10,000,000"
 */
export function formatTokenAmount(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
    if (isNaN(num)) return '0'

    // For very small numbers, show more precision
    if (num > 0 && num < 0.01) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
        })
    }

    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
    })
}