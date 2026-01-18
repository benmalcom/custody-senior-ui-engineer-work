import { cn } from '@/components/utils'
import {
    formatBalance,
    formatInputValue,
    cleanInputValue,
    formatUsd,
    formatTokenAmount,
} from '@/lib/format'
import { useState, useEffect, useMemo, type ReactNode } from 'react'
import { InfoIcon, ErrorInfoIcon, LoadingIcon } from '@/components/icons'

interface AmountFieldProps {
    value: string
    onChange: (value: string) => void
    balance?: string
    fee?: string
    decimals: number
    symbol?: string
    icon?: ReactNode
    isActive?: boolean
    isDisabled?: boolean
    isLoadingBalance?: boolean
    isLoadingFee?: boolean
    balanceError?: string
    feeError?: string
    error?: string
    onFocus?: () => void
    onBlur?: () => void
    priceUsd?: number
}

export function AmountField({
                                value,
                                onChange,
                                balance,
                                fee,
                                decimals,
                                symbol,
                                icon,
                                isActive,
                                isDisabled,
                                isLoadingBalance,
                                isLoadingFee,
                                balanceError,
                                feeError,
                                error,
                                onFocus,
                                onBlur,
                                priceUsd = 0.037624,
                            }: AmountFieldProps) {
    const [displayValue, setDisplayValue] = useState(value)
    const [isFocused, setIsFocused] = useState(false)

    const hasValue = value && parseFloat(value) > 0

    useEffect(() => {
        if (!isFocused) {
            if (hasValue) {
                setDisplayValue(formatInputValue(value))
            } else {
                setDisplayValue('')
            }
        }
    }, [value, isFocused, hasValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/,/g, '')
        if (!/^[\d.]*$/.test(raw)) return

        setDisplayValue(e.target.value)
        onChange(cleanInputValue(raw))
    }

    const handleFocus = () => {
        setIsFocused(true)
        if (value) {
            setDisplayValue(value)
        }
        onFocus?.()
    }

    const handleBlur = () => {
        setIsFocused(false)
        if (hasValue) {
            setDisplayValue(formatInputValue(value))
        } else {
            setDisplayValue('')
        }
        onBlur?.()
    }

    const handleMax = () => {
        if (!balance || !fee) return
        const balanceBigInt = BigInt(balance)
        const feeBigInt = BigInt(fee)
        const maxAmount = balanceBigInt > feeBigInt ? balanceBigInt - feeBigInt : 0n
        const formatted = formatBalance(maxAmount.toString(), decimals)
        onChange(formatted.replace(/,/g, ''))
        setDisplayValue(formatted)
    }

    const formattedBalance = balance ? formatBalance(balance, decimals) : undefined
    const formattedFee = fee ? formatBalance(fee, decimals) : undefined

    // Calculate available balance (balance - fee)
    const availableBalance = useMemo(() => {
        if (!balance || !fee) return undefined
        const balanceBigInt = BigInt(balance)
        const feeBigInt = BigInt(fee)
        const available = balanceBigInt > feeBigInt ? balanceBigInt - feeBigInt : 0n
        return formatBalance(available, decimals)
    }, [balance, fee, decimals])

    const availableBalanceUsd = useMemo(() => {
        if (!availableBalance || !priceUsd) return undefined
        const balanceNum = parseFloat(availableBalance.replace(/,/g, '')) || 0
        return balanceNum * priceUsd
    }, [availableBalance, priceUsd])

    const showBalanceLoading = isLoadingBalance && !isDisabled
    const showBalanceError = !isLoadingBalance && balanceError

    const showFeeLoading = isLoadingFee && !isDisabled
    const showFeeError = !isLoadingFee && feeError
    const showFeePlaceholder = !isLoadingFee && !feeError && !formattedFee

    return (
        <div
            className={cn(
                'px-[25px] py-[15px] flex flex-col items-start gap-[10px] self-stretch',
                'rounded-[12px] transition-colors duration-200',
                'border border-[rgba(104,129,153,0.15)] bg-[rgba(255,255,255,0.40)]',
                !isDisabled && 'hover:bg-white',
                isFocused &&
                'bg-[rgba(255,255,255,0.40)] shadow-[0_4px_20px_0_rgba(104,129,153,0.30)] backdrop-blur-[20px]'
            )}
        >
            {/* Amount Row */}
            <div className="w-full flex items-center gap-[80px]">
                {/* Label */}
                <div className="w-[95px] shrink-0">
                    <span className="text-[#191925] text-[20px] font-semibold leading-[21px]">
                        Amount
                    </span>
                </div>

                {/* Input and MAX button container */}
                <div className="flex-1 flex flex-col gap-[8px]">
                    <div className="flex items-center gap-[10px]">
                        {/* Input */}
                        <div
                            className={cn(
                                'flex-1 h-[40px] pr-[10px] flex justify-between items-center rounded-[9px] border',
                                error
                                    ? 'border-[#D84E28]'
                                    : 'border-[rgba(104,129,153,0.30)]'
                            )}
                        >
                            <input
                                type="text"
                                value={displayValue}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="0.00"
                                disabled={isDisabled}
                                className={cn(
                                    'flex-1 h-full px-[10px] bg-transparent outline-none',
                                    'text-[#191925] text-[16px] font-medium leading-[19.2px]',
                                    'placeholder:text-[#688199]',
                                    isDisabled && 'cursor-not-allowed'
                                )}
                            />

                            {/* Token Badge */}
                            {symbol && (
                                <div className="flex items-center gap-[6px]">
                                    {icon && (
                                        <div
                                            className="w-[18px] h-[18px] rounded-full overflow-hidden shrink-0"
                                            style={{
                                                background:
                                                    'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, #191925 0%, #191925 100%)',
                                                backgroundBlendMode: 'normal, color-burn, normal',
                                            }}
                                        >
                                            <div className="w-full h-full">{icon}</div>
                                        </div>
                                    )}
                                    <span className="text-[#191925] text-[12px] font-semibold">
                                        {symbol}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* MAX Button */}
                        <button
                            type="button"
                            onClick={handleMax}
                            disabled={isDisabled || !balance || !fee}
                            className={cn(
                                'h-[40px] px-[20px] py-[12px] flex justify-center items-center',
                                'rounded-[9px] bg-[rgba(104,129,153,0.30)] backdrop-blur-[7.5px]',
                                'text-[#191925] text-[14px] font-semibold',
                                'cursor-pointer transition-colors hover:bg-[rgba(104,129,153,0.40)]',
                                'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                        >
                            MAX
                        </button>
                    </div>

                    {/* Error Row - directly under input */}
                    {error && (
                        <div className="flex items-center gap-[4px]">
                            <span className="text-[#E1856B] text-[12px] font-medium leading-normal tracking-[0.36px]">
                                {error}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Available Balance Row */}
            <div className="w-full flex items-center gap-[80px]">
                <div className="w-[95px] shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-[4px]">
                        <span className="text-[#90A0AF] text-[12px] font-medium leading-normal tracking-[0.36px]">
                            Available
                        </span>
                        {showBalanceLoading || showFeeLoading ? (
                            <LoadingIcon />
                        ) : showBalanceError ? (
                            <>
                                <span className="text-[#E1856B] text-[12px] font-medium leading-normal tracking-[0.36px]">
                                    {balanceError}
                                </span>
                                <ErrorInfoIcon />
                            </>
                        ) : !availableBalance ? (
                            <span className="text-[#688199] text-[12px] font-medium leading-normal tracking-[0.36px]">
                                -- {symbol}
                            </span>
                        ) : (
                            <span className="text-[#688199] text-[12px] font-medium leading-normal tracking-[0.36px]">
                                $ {formatUsd(availableBalanceUsd || 0)} ≈{' '}
                                {formatTokenAmount(availableBalance || '0')} {symbol}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Fee Row */}
            <div className="w-full flex items-center gap-[80px] pt-[10px] border-t border-[rgba(104,129,153,0.15)]">
                <div className="w-[95px] shrink-0 flex items-center gap-[6px]">
                    <span className="text-[#191925] text-[16px] font-semibold leading-[19.2px]">
                        Fee
                    </span>
                    <InfoIcon />
                </div>

                <div className="flex-1">
                    {showFeeLoading ? (
                        <LoadingIcon />
                    ) : showFeeError ? (
                        <div className="flex items-center gap-[4px]">
                            <span className="text-[#E1856B] text-[12px] font-medium leading-normal tracking-[0.36px]">
                                {feeError}
                            </span>
                            <ErrorInfoIcon />
                        </div>
                    ) : showFeePlaceholder ? (
                        <span className="text-[#688199] text-[16px] font-medium leading-[19.2px]">
                            --
                        </span>
                    ) : (
                        <span className="text-[#688199] text-[16px] font-medium leading-[19.2px]">
                            {formattedFee} {symbol}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}