import { describe, expect, it } from 'vitest'
import { MOCK_PRICE_USD } from '@/constants/form'

describe('USD Conversion', () => {
  it('converts tokens to USD correctly', () => {
    const tokenAmount = 100
    const usdAmount = tokenAmount * MOCK_PRICE_USD
    // 100 tokens * 0.037624 = $3.7624
    expect(usdAmount).toBeCloseTo(3.7624, 4)
  })

  it('converts USD to tokens correctly', () => {
    const usdAmount = 50
    const tokenAmount = usdAmount / MOCK_PRICE_USD
    // $50 / 0.037624 = 1328.94 tokens
    expect(tokenAmount).toBeCloseTo(1328.94, 1)
  })

  it('handles decimal token amounts', () => {
    const tokenAmount = 3333.67
    const usdAmount = tokenAmount * MOCK_PRICE_USD
    // 3333.67 * 0.037624 = $125.426
    expect(usdAmount).toBeCloseTo(125.43, 1)
  })

  it('handles small USD amounts', () => {
    const usdAmount = 1
    const tokenAmount = usdAmount / MOCK_PRICE_USD
    // $1 / 0.037624 = 26.58 tokens
    expect(tokenAmount).toBeCloseTo(26.58, 1)
  })

  it('mock price is a positive number', () => {
    expect(MOCK_PRICE_USD).toBeGreaterThan(0)
    expect(typeof MOCK_PRICE_USD).toBe('number')
  })

  it('rounds to 2 decimal places for USD display', () => {
    const tokenAmount = 100
    const usdAmount = (tokenAmount * MOCK_PRICE_USD).toFixed(2)
    expect(usdAmount).toBe('3.76')
  })
})
