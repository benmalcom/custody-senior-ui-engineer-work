import { useState, useMemo, useCallback, useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import {
    useAssets,
    useVaults,
    useBalances,
    useFee,
    useAddresses,
    useNetworks,
} from '@/lib/queries'
import { transferFormSchema, defaultTransferFormValues } from './schemas'
import { submitTransfer } from '@/api'
import type { SelectOption } from './SelectField'
import { User, Vault } from 'lucide-react'

type FormStep = 'from' | 'asset' | 'amount' | 'to' | 'memo' | null

const STEPS: FormStep[] = ['from', 'asset', 'amount', 'to', 'memo']

export function useTransferForm() {
    const [activeStep, setActiveStep] = useState<FormStep>('from')
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Data fetching
    const { data: assets, isLoading: assetsLoading, error: assetsError } = useAssets()
    const { data: vaults, isLoading: vaultsLoading, error: vaultsError } = useVaults()
    const { data: networks } = useNetworks()

    // Form setup
    const form = useForm({
        defaultValues: defaultTransferFormValues,
        onSubmit: async ({ value }) => {
            const result = transferFormSchema.safeParse(value)
            if (!result.success) {
                console.error('Validation failed:', result.error)
                return
            }

            setIsSubmitting(true)
            try {
                await submitTransfer({
                    vaultId: value.fromVaultId,
                    accountIndex: value.fromAccountIndex,
                    assetId: value.assetId,
                    amount: value.amount,
                    to: value.toAddress,
                    memo: value.memo || '',
                })
                setIsSuccess(true)
            } catch (error) {
                console.error('Transfer failed:', error)
            } finally {
                setIsSubmitting(false)
            }
        },
    })

    // Subscribe to form state to ensure re-renders on value changes
    const [formValues, setFormValues] = useState(form.state.values)

    useEffect(() => {
        const unsubscribe = form.store.subscribe(() => {
            setFormValues(form.state.values)
        })
        return unsubscribe
    }, [form])

    const selectedAssetId = formValues.assetId
    const selectedVaultId = formValues.fromVaultId
    const selectedAccountIndex = formValues.fromAccountIndex

    const selectedAsset = useMemo(
        () => assets?.find((a) => a.id === selectedAssetId),
        [assets, selectedAssetId]
    )

    // Helper to get network name
    const getNetworkName = useCallback(
        (networkId: string) => {
            return networks?.find((n) => n.id === networkId)?.name || networkId
        },
        [networks]
    )

    // Fetch addresses for the selected network
    const { data: addressesVault1 } = useAddresses(selectedAsset?.networkId, '1')
    const { data: addressesVault2 } = useAddresses(selectedAsset?.networkId, '2')
    const { data: addressesVault3 } = useAddresses(selectedAsset?.networkId, '3')

    const allAddresses = useMemo(() => {
        const addresses: Array<{
            address: string
            name: string
            isExternal: boolean
            isVault: boolean
            vaultId: string
        }> = []

        if (addressesVault1) {
            addresses.push(...addressesVault1.map((a) => ({ ...a, vaultId: '1' })))
        }
        if (addressesVault2) {
            addresses.push(...addressesVault2.map((a) => ({ ...a, vaultId: '2' })))
        }
        if (addressesVault3) {
            addresses.push(...addressesVault3.map((a) => ({ ...a, vaultId: '3' })))
        }

        return addresses
    }, [addressesVault1, addressesVault2, addressesVault3])

    const {
        data: balances,
        isLoading: balancesLoading,
        error: balancesError,
    } = useBalances(selectedAssetId || undefined, selectedVaultId || undefined)

    const { data: fee, isLoading: feeLoading, error: feeError } = useFee(selectedAssetId || undefined)

    const selectedBalance = useMemo(() => {
        if (!balances || selectedAccountIndex < 0) return undefined
        const account = balances.find((b) => b.accountIndex === selectedAccountIndex)
        return account?.balance
    }, [balances, selectedAccountIndex])

    const selectedVault = useMemo(
        () => vaults?.find((v) => v.id === selectedVaultId),
        [vaults, selectedVaultId]
    )

    const selectedToAddress = useMemo(() => {
        if (!formValues.toAddress) return undefined
        return allAddresses.find((a) => a.address === formValues.toAddress)
    }, [allAddresses, formValues.toAddress])

    const validateField = useCallback(
        (fieldName: keyof typeof defaultTransferFormValues, value: unknown) => {
            const partialSchema = transferFormSchema.shape[fieldName]
            const result = partialSchema.safeParse(value)
            if (result.success) return undefined
            const firstIssue = result.error.issues?.[0]
            return firstIssue?.message
        },
        []
    )

    const handleFromSelect = useCallback(
        (vaultId: string) => {
            form.setFieldValue('fromVaultId', vaultId)
            form.setFieldValue('fromAccountIndex', 0)
            // Don't reset dependent fields - let them stay as-is with their errors
            setActiveStep('asset')
        },
        [form]
    )

    const handleAssetSelect = useCallback(
        (assetId: string) => {
            form.setFieldValue('assetId', assetId)
            // Don't reset dependent fields - let them stay as-is with their errors
            setActiveStep('amount')
        },
        [form]
    )

    const handleToSelect = useCallback(
        (address: string) => {
            form.setFieldValue('toAddress', address)
            setActiveStep('memo')
        },
        [form]
    )

    const handleReset = useCallback(() => {
        form.reset()
        setActiveStep(null)
        setShowResetDialog(false)
    }, [form])

    const handleNewRequest = useCallback(() => {
        form.reset()
        setActiveStep(null)
        setShowResetDialog(false)
        setIsSuccess(false)
    }, [form])

    // Asset options - with balance and network name
    const assetOptions = useMemo((): SelectOption[] => {
        if (!assets) return []
        return assets.map((asset) => ({
            id: asset.id,
            label: asset.symbol,
            sublabel: getNetworkName(asset.networkId),
            balance: '24.38 ' + asset.symbol,
            balanceUsd: '$876.72',
            icon: (
                <img
                    src={asset.logoUri}
                    alt={asset.symbol}
                    className="h-[30px] w-[30px] rounded-full"
                    onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/30'
                    }}
                />
            ),
        }))
    }, [assets, getNetworkName])

    // From options (vaults) - no icon, just vault names
    const fromOptions = useMemo((): SelectOption[] => {
        if (!vaults) return []

        return vaults.map((vault) => ({
            id: vault.id,
            label: vault.name,
            filterIds: ['vaults'],
        }))
    }, [vaults])

    // To options - matching Figma design, excluding source vault
    const toOptions = useMemo((): SelectOption[] => {
        return allAddresses
            .filter((addr) => {
                if (addr.isVault && addr.vaultId === selectedVaultId) {
                    return false
                }
                return true
            })
            .map((addr) => {
                const filterIds: string[] = []
                if (addr.isVault) filterIds.push('vaults')
                if (!addr.isExternal && !addr.isVault) filterIds.push('internal')
                if (addr.isExternal) filterIds.push('external')

                const sublabel = addr.isVault
                    ? undefined
                    : getNetworkName(selectedAsset?.networkId || '')

                return {
                    id: addr.address,
                    label: addr.name,
                    sublabel,
                    address: addr.address,
                    filterIds,
                    icon: addr.isVault ? (
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#688199]/20">
                            <Vault className="h-[16px] w-[16px] text-[#191925]" />
                        </div>
                    ) : (
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#688199]/20">
                            <User className="h-[16px] w-[16px] text-[#191925]" />
                        </div>
                    ),
                }
            })
    }, [allAddresses, selectedAsset, getNetworkName, selectedVaultId])

    // Filter tabs for To field
    const toFilterTabs = useMemo(() => {
        const filteredAddresses = allAddresses.filter(
            (a) => !(a.isVault && a.vaultId === selectedVaultId)
        )
        const vaultCount = filteredAddresses.filter((a) => a.isVault).length
        const internalCount = filteredAddresses.filter((a) => !a.isExternal && !a.isVault).length
        const externalCount = filteredAddresses.filter((a) => a.isExternal).length

        return [
            { id: 'vaults', label: 'Vaults', count: vaultCount },
            { id: 'internal', label: 'Internal Whitelist', count: internalCount },
            { id: 'external', label: 'External Whitelist', count: externalCount },
        ]
    }, [allAddresses, selectedVaultId])

    const activeStepIndex = activeStep ? STEPS.indexOf(activeStep) : -1

    return {
        // State
        activeStep,
        setActiveStep,
        showResetDialog,
        setShowResetDialog,
        isSuccess,
        isSubmitting,
        activeStepIndex,

        // Form
        form,
        validateField,

        // Data
        assets,
        vaults,
        networks,
        selectedAsset,
        selectedVault,
        selectedToAddress,
        selectedBalance,
        selectedAssetId,
        selectedVaultId,

        // Loading states
        assetsLoading,
        vaultsLoading,
        balancesLoading,
        feeLoading,

        // Errors
        assetsError,
        vaultsError,
        balancesError,
        feeError,

        // Other data
        fee,
        getNetworkName,

        // Options
        fromOptions,
        assetOptions,
        toOptions,
        toFilterTabs,

        // Handlers
        handleFromSelect,
        handleAssetSelect,
        handleToSelect,
        handleReset,
        handleNewRequest,

        // Constants
        STEPS,
    }
}