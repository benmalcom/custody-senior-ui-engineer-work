export type FormStep = 'from' | 'asset' | 'amount' | 'to' | 'memo' | null

export const FORM_STEPS: FormStep[] = ['from', 'asset', 'amount', 'to', 'memo']

export const FILTER_TABS = {
    VAULTS: 'vaults',
    INTERNAL: 'internal',
    EXTERNAL: 'external',
} as const
