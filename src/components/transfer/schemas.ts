import { z } from 'zod'
import { VALIDATION_MESSAGES, VALIDATION_CONSTRAINTS } from '@/constants/validation'

export const transferFormSchema = z.object({
    fromVaultId: z.string().min(VALIDATION_CONSTRAINTS.MIN_STRING_LENGTH, VALIDATION_MESSAGES.FROM_REQUIRED),
    fromAccountIndex: z.number().min(VALIDATION_CONSTRAINTS.MIN_ACCOUNT_INDEX, VALIDATION_MESSAGES.FROM_REQUIRED),
    assetId: z.string().min(VALIDATION_CONSTRAINTS.MIN_STRING_LENGTH, VALIDATION_MESSAGES.ASSET_REQUIRED),
    toAddress: z.string().min(VALIDATION_CONSTRAINTS.MIN_STRING_LENGTH, VALIDATION_MESSAGES.TO_REQUIRED),
    amount: z
        .string()
        .min(VALIDATION_CONSTRAINTS.MIN_STRING_LENGTH, VALIDATION_MESSAGES.AMOUNT_REQUIRED)
        .refine(
            (val) => {
                const num = parseFloat(val.replace(/,/g, ''))
                return !isNaN(num) && num > VALIDATION_CONSTRAINTS.MIN_AMOUNT
            },
            { message: VALIDATION_MESSAGES.AMOUNT_POSITIVE }
        ),
    memo: z.string().min(VALIDATION_CONSTRAINTS.MIN_STRING_LENGTH, VALIDATION_MESSAGES.MEMO_REQUIRED),
})

export type TransferFormValues = z.infer<typeof transferFormSchema>

export const defaultTransferFormValues: TransferFormValues = {
    fromVaultId: '',
    fromAccountIndex: 0,
    assetId: '',
    toAddress: '',
    amount: '',
    memo: '',
}