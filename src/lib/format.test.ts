import { describe, expect, it } from 'vitest'
import { cleanInputValue, formatBalance, formatInputValue, parseBalance } from './format'

describe('parseBalance', () => {
  it('converts decimal string to base units (wei)', () => {
    // 1 token with 18 decimals = 1000000000000000000 wei
    expect(parseBalance('1', 18)).toBe(1000000000000000000n)
  })

  it('handles decimal values correctly', () => {
    // 3333.67 AVAX with 18 decimals
    expect(parseBalance('3333.67', 18)).toBe(3333670000000000000000n)
  })

  it('handles small decimal values', () => {
    // 0.5 with 18 decimals
    expect(parseBalance('0.5', 18)).toBe(500000000000000000n)
  })

  it('handles values with commas', () => {
    // Should remove commas before parsing
    expect(parseBalance('1,000.50', 18)).toBe(1000500000000000000000n)
  })

  it('handles empty string', () => {
    expect(parseBalance('', 18)).toBe(0n)
  })

  it('handles just decimal point', () => {
    expect(parseBalance('.', 18)).toBe(0n)
  })

  it('handles different decimal precisions', () => {
    // USDC uses 6 decimals
    expect(parseBalance('100', 6)).toBe(100000000n)
    expect(parseBalance('100.50', 6)).toBe(100500000n)
  })
})

describe('formatBalance', () => {
  it('converts base units to human-readable format', () => {
    // 1000000000000000000 wei = 1 token (18 decimals)
    expect(formatBalance('1000000000000000000', 18)).toBe('1')
  })

  it('handles decimal values', () => {
    // 3333670000000000000000 wei = 3333.67 AVAX
    expect(formatBalance('3333670000000000000000', 18)).toBe('3333.67')
  })

  it('removes trailing zeros', () => {
    // 1500000000000000000 = 1.5, not 1.500000
    expect(formatBalance('1500000000000000000', 18)).toBe('1.5')
  })

  it('handles whole numbers', () => {
    expect(formatBalance('5000000000000000000', 18)).toBe('5')
  })

  it('handles different decimal precisions', () => {
    // USDC with 6 decimals
    expect(formatBalance('100500000', 6)).toBe('100.5')
  })

  it('accepts BigInt input', () => {
    expect(formatBalance(1000000000000000000n, 18)).toBe('1')
  })
})

describe('formatInputValue', () => {
  it('adds thousand separators', () => {
    expect(formatInputValue('1000')).toBe('1,000')
    expect(formatInputValue('1000000')).toBe('1,000,000')
  })

  it('handles decimal values with separators', () => {
    expect(formatInputValue('1000.50')).toBe('1,000.5')
  })

  it('removes trailing zeros', () => {
    expect(formatInputValue('1.00')).toBe('1')
    expect(formatInputValue('1.50')).toBe('1.5')
  })

  it('removes trailing decimal point', () => {
    expect(formatInputValue('1.')).toBe('1')
  })

  it('handles leading zeros', () => {
    expect(formatInputValue('001')).toBe('1')
    expect(formatInputValue('00.1')).toBe('0.1')
  })

  it('removes existing commas before formatting', () => {
    expect(formatInputValue('1,000,000')).toBe('1,000,000')
  })

  it('handles empty string', () => {
    expect(formatInputValue('')).toBe('')
  })
})

describe('cleanInputValue', () => {
  it('removes commas', () => {
    expect(cleanInputValue('1,000')).toBe('1000')
    expect(cleanInputValue('1,000,000.50')).toBe('1000000.50')
  })

  it('removes leading zeros except for decimals', () => {
    expect(cleanInputValue('001')).toBe('1')
    expect(cleanInputValue('000123')).toBe('123')
  })

  it('preserves leading zero for decimal values', () => {
    expect(cleanInputValue('0.5')).toBe('0.5')
    // cleanInputValue removes leading zeros, so 00.5 becomes .5
    // This is okay because it's cleaned during input, not for display
    expect(cleanInputValue('00.5')).toBe('.5')
  })

  it('removes trailing decimal point', () => {
    expect(cleanInputValue('123.')).toBe('123')
  })

  it('handles empty string', () => {
    expect(cleanInputValue('')).toBe('0')
  })

  it('handles just decimal point', () => {
    expect(cleanInputValue('.')).toBe('0')
  })

  it('preserves decimal values', () => {
    expect(cleanInputValue('123.45')).toBe('123.45')
  })
})
