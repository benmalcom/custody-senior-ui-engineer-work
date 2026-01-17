import { Button } from '@/components/ui'
import { Stepper } from './Stepper'
import { SelectField } from './SelectField'
import { AmountField } from './AmountField'
import { MemoField } from './MemoField'
import { SuccessScreen } from './SuccessScreen'
import { ResetDialog } from './ResetDialog'
import { useTransferForm } from './useTransferForm'
import { transferFormSchema } from './schemas'
import { User, Vault } from 'lucide-react'

export function TransferForm() {
    const {
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

        // Data
        selectedAsset,
        selectedVault,
        selectedToAddress,
        selectedBalance,
        selectedAssetId,
        selectedVaultId,
        vaults,

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
    } = useTransferForm()

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

    return (
        <div className="flex flex-col min-h-[700px] w-fit mx-auto">
            {/* Title aligned with stepper column */}
            <div className="flex gap-[24px] mb-[20px]">
                <div className="w-[198px]">
                    <span
                        className="text-[#191925] text-[30px] font-semibold leading-[120%]"
                        style={{ fontFamily: '"Inter Tight"' }}
                    >
                        Transfer
                    </span>
                </div>
                <div className="w-[786px]" />
            </div>

            {/* Stepper + Form row */}
            <div className="flex gap-[24px]">
                {/* Left Column: Stepper - 198px */}
                <div className="flex w-[198px]">
                    <Stepper totalSteps={Object.keys(STEPS).length} activeStep={activeStepIndex} />
                </div>

                {/* Center Column: Form - 786px */}
                <div className="w-[786px] relative">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="flex flex-col gap-[12px]"
                    >
                        {/* From Field */}
                        <form.Field
                            name="fromVaultId"
                            validators={{
                                onSubmit: ({ value }) => {
                                    const result = transferFormSchema.shape.fromVaultId.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
                            }}
                        >
                            {(field) => (
                                <SelectField
                                    label="From"
                                    placeholder="Select source"
                                    isLoading={vaultsLoading}
                                    error={vaultsError ? 'Error loading vaults' : undefined}
                                    validationError={field.state.meta.errors?.[0]}
                                    loadingText="Loading vaults..."
                                    value={
                                        selectedVault && (
                                            <span className="text-[#191925] text-[16px] font-medium leading-[19.2px]">
                                                {selectedVault.name}
                                            </span>
                                        )
                                    }
                                    options={fromOptions}
                                    onChange={(val) => {
                                        field.handleChange(val)
                                        handleFromSelect(val)
                                    }}
                                    filterTabs={[
                                        { id: 'vaults', label: 'Vaults', count: vaults?.length || 0 },
                                    ]}
                                    showSearch={true}
                                    showFilter={true}
                                    searchPlaceholder="Search"
                                />
                            )}
                        </form.Field>

                        {/* Asset Field */}
                        <form.Field
                            name="assetId"
                            validators={{
                                onSubmit: ({ value }) => {
                                    const result = transferFormSchema.shape.assetId.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
                            }}
                        >
                            {(field) => (
                                <SelectField
                                    label="Asset"
                                    placeholder="Select asset"
                                    isDisabled={!selectedVaultId}
                                    isLoading={assetsLoading}
                                    error={assetsError ? 'Error loading assets' : undefined}
                                    validationError={field.state.meta.errors?.[0]}
                                    loadingText="Loading assets..."
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
                                    options={assetOptions}
                                    onChange={(val) => {
                                        field.handleChange(val)
                                        handleAssetSelect(val)
                                    }}
                                    showSearch={true}
                                    showFilter={true}
                                    searchPlaceholder="Search"
                                />
                            )}
                        </form.Field>

                        {/* Amount Field */}
                        <form.Field
                            name="amount"
                            validators={{
                                onSubmit: ({ value }) => {
                                    const result = transferFormSchema.shape.amount.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
                            }}
                        >
                            {(field) => (
                                <AmountField
                                    value={field.state.value}
                                    onChange={(val) => field.handleChange(val)}
                                    balance={selectedBalance}
                                    fee={fee}
                                    decimals={selectedAsset?.decimals || 18}
                                    symbol={selectedAsset?.symbol || ''}
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
                                    balanceError={
                                        balancesError ? 'Unable to load usable balance' : undefined
                                    }
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

                        {/* To Field */}
                        <form.Field
                            name="toAddress"
                            validators={{
                                onSubmit: ({ value }) => {
                                    const result = transferFormSchema.shape.toAddress.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
                            }}
                        >
                            {(field) => (
                                <SelectField
                                    label="To"
                                    placeholder="Select destination"
                                    isDisabled={!selectedAssetId}
                                    validationError={field.state.meta.errors?.[0]}
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
                                    options={toOptions}
                                    onChange={(val) => {
                                        field.handleChange(val)
                                        handleToSelect(val)
                                    }}
                                    filterTabs={toFilterTabs}
                                    showSearch={true}
                                    showFilter={true}
                                    showInfoIcon={true}
                                    searchPlaceholder="Search"
                                />
                            )}
                        </form.Field>

                        {/* Memo Field */}
                        <form.Field
                            name="memo"
                            validators={{
                                onSubmit: ({ value }) => {
                                    const result = transferFormSchema.shape.memo.safeParse(value)
                                    return result.success ? undefined : result.error.issues[0]?.message
                                },
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
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowResetDialog(true)}
                            >
                                Start Over
                            </Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Transfer'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ResetDialog
                open={showResetDialog}
                onClose={() => setShowResetDialog(false)}
                onConfirm={handleReset}
            />
        </div>
    )
}