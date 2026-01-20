export type FormStep = 'from' | 'asset' | 'amount' | 'to' | 'memo' | null

export const FORM_STEPS: FormStep[] = ['from', 'asset', 'amount', 'to', 'memo']

export const FILTER_TABS = {
  VAULTS: 'vaults',
  INTERNAL: 'internal',
  EXTERNAL: 'external',
} as const

/**
 * Mock price for USD conversion
 * In a real application, this would come from a price API
 */
export const MOCK_PRICE_USD = 0.037624
