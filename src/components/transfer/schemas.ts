import { z } from 'zod'

export const transferFormSchema = z.object({
    fromVaultId: z.string().min(1, 'From is required'),
    fromAccountIndex: z.number().min(0, 'From is required'),
    assetId: z.string().min(1, 'Asset is required'),
    toAddress: z.string().min(1, 'To is required'),
    amount: z
        .string()
        .min(1, 'Amount is required')
        .refine(
            (val) => {
                const num = parseFloat(val.replace(/,/g, ''))
                return !isNaN(num) && num > 0
            },
            { message: 'Amount must be greater than 0' }
        ),
    memo: z.string().optional(),
})

export type TransferFormValues = z.infer<typeof transferFormSchema>

export const defaultTransferFormValues: TransferFormValues = {
    fromVaultId: '',
    fromAccountIndex: -1,
    assetId: '',
    toAddress: '',
    amount: '',
    memo: '',
}