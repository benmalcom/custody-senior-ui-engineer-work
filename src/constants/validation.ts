export const VALIDATION_MESSAGES = {
  FROM_REQUIRED: 'From required',
  ASSET_REQUIRED: 'Asset required',
  TO_REQUIRED: 'To required',
  AMOUNT_REQUIRED: 'Amount required',
  AMOUNT_POSITIVE: 'Amount must be greater than 0',
  AMOUNT_EXCEEDS_BALANCE: 'Amount exceeds available balance',
  MEMO_REQUIRED: 'Memo required',
} as const

export const VALIDATION_CONSTRAINTS = {
  MIN_STRING_LENGTH: 1,
  MIN_ACCOUNT_INDEX: 0,
  MIN_AMOUNT: 0,
} as const
