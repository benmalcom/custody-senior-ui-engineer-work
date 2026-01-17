import { useState, useMemo, useRef, useCallback } from 'react'
import { useForm } from '@tanstack/react-form'
import {
    useAssets,
    useVaults,
    useBalances,
    useFee,
    useAddresses,
    useNetworks,
} from '@/lib/queries'
import { useOnClickOutside } from '@/hooks'
import {Button, Typography} from '@/components/ui'
import {Dialog, DialogActions, DialogBody} from '@/components/ui/Dialog'
import { Stepper } from './Stepper'
import { SelectField } from './SelectField'
import { SelectDropdown } from './SelectDropdown'
import { AmountField } from './AmountField'
import { MemoField } from './MemoField'
import { SuccessScreen } from './SuccessScreen'
import { transferFormSchema, defaultTransferFormValues } from './schemas'
import { submitTransfer } from '@/api'
import type { Asset } from '@/api/assets'
import { User, Vault } from 'lucide-react'

type FormStep = 'from' | 'asset' | 'amount' | 'to' | 'memo' | null

const STEPS: FormStep[] = ['from', 'asset', 'amount', 'to', 'memo']

export function TransferForm() {
    const [activeStep, setActiveStep] = useState<FormStep>(null)
    const [openField, setOpenField] = useState<FormStep | null>(null)
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const formRef = useRef<HTMLFormElement>(null)

    useOnClickOutside(
        formRef,
        useCallback(() => {
            setOpenField(null)
            setActiveStep(null)
        }, [])
    )

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

    const formValues = form.state.values
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

    const validateField = (fieldName: keyof typeof defaultTransferFormValues, value: unknown) => {
        const partialSchema = transferFormSchema.shape[fieldName]
        const result = partialSchema.safeParse(value)
        if (result.success) return undefined
        const firstIssue = result.error.issues?.[0]
        return firstIssue?.message
    }

    const handleFieldClick = (step: FormStep) => {
        if (openField === step) {
            setOpenField(null)
        } else {
            setActiveStep(step)
            setOpenField(step)
        }
    }

    const handleFromSelect = (vaultId: string) => {
        form.setFieldValue('fromVaultId', vaultId)
        form.setFieldValue('fromAccountIndex', 0) // Default to first account
        form.setFieldValue('assetId', '')
        form.setFieldValue('toAddress', '')
        form.setFieldValue('amount', '')
        setOpenField(null)
        setActiveStep('asset')
    }

    const handleAssetSelect = (asset: Asset) => {
        form.setFieldValue('assetId', asset.id)
        form.setFieldValue('toAddress', '')
        form.setFieldValue('amount', '')
        setOpenField(null)
        setActiveStep('amount')
    }

    const handleToSelect = (address: string) => {
        form.setFieldValue('toAddress', address)
        setOpenField(null)
        setActiveStep('memo')
    }

    const handleReset = () => {
        form.reset()
        setActiveStep(null)
        setOpenField(null)
        setShowResetDialog(false)
    }

    const handleNewRequest = () => {
        handleReset()
        setIsSuccess(false)
    }

    // Asset options - with balance and network name
    const assetOptions = useMemo(() => {
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
    const fromOptions = useMemo(() => {
        if (!vaults) return []

        return vaults.map((vault) => ({
            id: vault.id,
            label: vault.name,
            filterIds: ['vaults'],
        }))
    }, [vaults])

    // To options - matching Figma design, excluding source vault
    const toOptions = useMemo(() => {
        return allAddresses
            .filter((addr) => {
                // Exclude the source vault from destinations
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

                // Vaults don't show sublabel, wallets show network name
                const sublabel = addr.isVault ? undefined : getNetworkName(selectedAsset?.networkId || '')

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

    // Filter tabs for To field - update counts to exclude source vault
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

    if (isSuccess) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[700px]">
                <SuccessScreen
                    onViewTransaction={() => console.log('View transaction')}
                    onNewRequest={handleNewRequest}
                />
            </div>
        )
    }

    const activeStepIndex = activeStep ? STEPS.indexOf(activeStep) : -1

    return (
        <div className="flex gap-[24px] min-h-[700px]">
            <Stepper totalSteps={Object.keys(STEPS).length} activeStep={activeStepIndex} />


            <div className="flex-1 relative">
                <Typography variant="h3" className="mb-[24px] text-blue-1">
                    Transfer
                </Typography>

                <form
                    ref={formRef}
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="flex flex-col gap-[12px]"
                >
                    {/* From Field - always enabled (first step) */}
                    <SelectField
                        label="From"
                        placeholder="Select source"
                        isOpen={openField === 'from'}
                        isActive={activeStep === 'from'}
                        isLoading={vaultsLoading}
                        error={vaultsError ? 'Error loading vaults' : undefined}
                        loadingText="Loading vaults..."
                        onClick={() => handleFieldClick('from')}
                        value={
                            selectedVault && (
                                <span className="text-[#191925] text-[16px] font-medium leading-[19.2px]">
                  {selectedVault.name}
                </span>
                            )
                        }
                    >
                        <SelectDropdown
                            options={fromOptions}
                            filterTabs={[{ id: 'vaults', label: 'Vaults', count: vaults?.length || 0 }]}
                            onSelect={(opt) => handleFromSelect(opt.id)}
                            showSearch={true}
                            showFilter={true}
                            searchPlaceholder="Search"
                        />
                    </SelectField>

                    {/* Asset Field - disabled until From is selected */}
                    <SelectField
                        label="Asset"
                        placeholder="Select asset"
                        isOpen={openField === 'asset'}
                        isActive={activeStep === 'asset'}
                        isDisabled={!selectedVaultId}
                        isLoading={assetsLoading}
                        error={assetsError ? 'Error loading assets' : undefined}
                        loadingText="Loading assets..."
                        onClick={() => handleFieldClick('asset')}
                        value={
                            selectedAsset && (
                                <div className="flex items-center gap-[10px]">
                                    <img
                                        src={selectedAsset.logoUri}
                                        alt={selectedAsset.symbol}
                                        className="h-[30px] w-[30px] rounded-full"
                                    />
                                    <div className="flex flex-col justify-start items-start">
                    <span className="text-[#191925] text-base font-semibold leading-5">
                      {selectedAsset.symbol}
                    </span>
                                        <span className="text-[#688199] text-sm font-medium leading-[16.80px]">
                      {getNetworkName(selectedAsset.networkId)}
                    </span>
                                    </div>
                                </div>
                            )
                        }
                    >
                        <SelectDropdown
                            options={assetOptions}
                            onSelect={(opt) => {
                                const asset = assets?.find((a) => a.id === opt.id)
                                if (asset) handleAssetSelect(asset)
                            }}
                            showSearch={true}
                            showFilter={true}
                            searchPlaceholder="Search"
                        />
                    </SelectField>

                    {/* Amount Field - disabled until Asset is selected */}
                    <form.Field
                        name="amount"
                        validators={{
                            onBlur: ({ value }) => validateField('amount', value),
                        }}
                    >
                        {(field) => (
                            <AmountField
                                value={field.state.value}
                                onChange={(val) => field.handleChange(val)}
                                balance={selectedBalance}
                                fee={fee}
                                decimals={selectedAsset?.decimals || 18}
                                symbol={selectedAsset?.symbol}
                                icon={
                                    selectedAsset && (
                                        <img
                                            src={selectedAsset.logoUri}
                                            alt={selectedAsset.symbol}
                                            className="h-full w-full rounded-full"
                                        />
                                    )
                                }
                                isActive={activeStep === 'amount'}
                                isDisabled={!selectedAssetId}
                                isLoadingBalance={balancesLoading}
                                isLoadingFee={feeLoading}
                                balanceError={balancesError ? 'Unable to load usable balance' : undefined}
                                feeError={feeError ? 'Unable to load fee' : undefined}
                                error={field.state.meta.errors?.[0]}
                                onFocus={() => setActiveStep('amount')}
                                onBlur={() => {
                                    field.handleBlur()
                                    setActiveStep(null)
                                }}
                            />
                        )}
                    </form.Field>

                    {/* To Field - disabled until Asset is selected */}
                    <SelectField
                        label="To"
                        placeholder="Select destination"
                        isOpen={openField === 'to'}
                        isActive={activeStep === 'to'}
                        isDisabled={!selectedAssetId}
                        onClick={() => handleFieldClick('to')}
                        value={
                            selectedToAddress && (
                                <div className="flex items-center gap-[10px]">
                                    {selectedToAddress.isVault ? (
                                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#688199]/20">
                                            <Vault className="h-[16px] w-[16px] text-[#191925]" />
                                        </div>
                                    ) : (
                                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#688199]/20">
                                            <User className="h-[16px] w-[16px] text-[#191925]" />
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-start items-start">
                    <span className="text-[#191925] text-base font-semibold leading-5">
                      {selectedToAddress.name}
                    </span>
                                        <span className="text-[#688199] text-sm font-medium leading-[16.80px]">
                      {selectedToAddress.address.slice(0, 12)}...
                                            {selectedToAddress.address.slice(-8)}
                    </span>
                                    </div>
                                </div>
                            )
                        }
                    >
                        <SelectDropdown
                            options={toOptions}
                            filterTabs={toFilterTabs}
                            onSelect={(opt) => handleToSelect(opt.address || opt.id)}
                            showSearch={true}
                            showFilter={true}
                            showInfoIcon={true}
                            searchPlaceholder="Search"
                        />
                    </SelectField>

                    {/* Memo Field - disabled until Asset is selected */}
                    <form.Field
                        name="memo"
                        validators={{
                            onBlur: ({ value }) => validateField('memo', value),
                        }}
                    >
                        {(field) => (
                            <MemoField
                                value={field.state.value ?? ''}
                                onChange={(val) => field.handleChange(val)}
                                isActive={activeStep === 'memo'}
                                isDisabled={!selectedAssetId}
                                error={field.state.meta.errors?.[0]}
                                onFocus={() => setActiveStep('memo')}
                                onBlur={() => {
                                    field.handleBlur()
                                    setActiveStep(null)
                                }}
                            />
                        )}
                    </form.Field>

                    {/* Actions */}
                    <div className="mt-[24px] flex items-center justify-end gap-[12px]">
                        <Button type="button" variant="secondary" onClick={() => setShowResetDialog(true)}>
                            Start Over
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Review Transfer'}
                        </Button>
                    </div>
                </form>
            </div>

            <Dialog
                open={showResetDialog}
                onClose={() => setShowResetDialog(false)}
                title="Start over?"
            >
                <DialogBody>
                    This will erase everything you've entered so far.
                    <br />
                    Are you sure you want to reset and start from scratch?
                </DialogBody>
                <DialogActions>
                    <button
                        type="button"
                        onClick={() => setShowResetDialog(false)}
                        className="flex-1 h-[45px] px-[20px] py-[12px] bg-[rgba(104,129,153,0.3)] rounded-[9px] backdrop-blur-[7.5px] flex items-center justify-center text-[#05284B] text-[16px] font-semibold text-center cursor-pointer hover:bg-[rgba(104,129,153,0.4)] transition-colors"
                        style={{
                            fontFamily: '"Inter Tight"',
                            lineHeight: '120%',
                            fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                    >
                        Go back
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 h-[45px] px-[13px] py-[12px] bg-[#E2C889] rounded-[9px] flex items-center justify-center text-[#473508] text-[16px] font-semibold text-center cursor-pointer hover:bg-[#d4b97a] transition-colors"
                        style={{
                            fontFamily: '"Inter Tight"',
                            lineHeight: '120%',
                            fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                    >
                        Yes, start over
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    )
}