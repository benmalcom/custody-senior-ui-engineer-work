export const VALIDATION_MESSAGES = {
    FROM_REQUIRED: 'From is required',
    ASSET_REQUIRED: 'Asset is required',
    TO_REQUIRED: 'To is required',
    AMOUNT_REQUIRED: 'Amount is required',
    AMOUNT_POSITIVE: 'Amount must be greater than 0',
    MEMO_REQUIRED: 'Memo is required',
} as const

export const VALIDATION_CONSTRAINTS = {
    MIN_STRING_LENGTH: 1,
    MIN_ACCOUNT_INDEX: 0,
    MIN_AMOUNT: 0,
} as const
