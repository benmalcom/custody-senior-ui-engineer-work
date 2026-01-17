import { cn } from '@/components/utils'
import {
    formatBalance,
    formatInputValue,
    cleanInputValue,
    formatUsd,
    formatTokenAmount,
} from '@/lib/format'
import { useState, useEffect, useMemo, type ReactNode } from 'react'

// Info icon for Fee (blue)
function InfoIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2"
            height="10"
            viewBox="0 0 2 10"
            fill="none"
            className={className}
        >
            <path
                d="M0.161537 9.05456V2.52507H1.43258V9.05456H0.161537ZM0.803433 1.5176C0.582383 1.5176 0.392506 1.44391 0.233803 1.29654C0.0779344 1.14634 0 0.967803 0 0.760923C0 0.551209 0.0779344 0.372668 0.233803 0.225301C0.392506 0.0751003 0.582383 0 0.803433 0C1.02448 0 1.21294 0.0751003 1.36881 0.225301C1.52751 0.372668 1.60687 0.551209 1.60687 0.760923C1.60687 0.967803 1.52751 1.14634 1.36881 1.29654C1.21294 1.44391 1.02448 1.5176 0.803433 1.5176Z"
                fill="#688199"
            />
        </svg>
    )
}

// Info icon for Error (red)
function ErrorInfoIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2"
            height="10"
            viewBox="0 0 2 10"
            fill="none"
            className={className}
        >
            <path
                d="M0.161537 9.05456V2.52507H1.43258V9.05456H0.161537ZM0.803433 1.5176C0.582383 1.5176 0.392506 1.44391 0.233803 1.29654C0.0779344 1.14634 0 0.967803 0 0.760923C0 0.551209 0.0779344 0.372668 0.233803 0.225301C0.392506 0.0751003 0.582383 0 0.803433 0C1.02448 0 1.21294 0.0751003 1.36881 0.225301C1.52751 0.372668 1.60687 0.551209 1.60687 0.760923C1.60687 0.967803 1.52751 1.14634 1.36881 1.29654C1.21294 1.44391 1.02448 1.5176 0.803433 1.5176Z"
                fill="#D84E28"
            />
        </svg>
    )
}

// Loading spinner matching Figma
function LoadingIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className={cn('animate-spin', className)}
        >
            <g clipPath="url(#clip0_amount_loading)">
                <g opacity="0.75">
                    <path
                        d="M7.49743 14.9998C6.98139 14.9998 6.57031 14.58 6.57031 14.0727V11.6937C6.57031 11.1777 6.99014 10.7666 7.49743 10.7666C8.00471 10.7666 8.42454 11.1864 8.42454 11.6937V14.0727C8.42454 14.5888 8.00471 14.9998 7.49743 14.9998Z"
                        fill="#191925"
                    />
                </g>
                <g opacity="0.25">
                    <path
                        d="M7.49743 4.24198C6.98139 4.24198 6.57031 3.82216 6.57031 3.31487V0.927114C6.57031 0.411079 6.99014 0 7.49743 0C8.00471 0 8.42454 0.419825 8.42454 0.927114V3.30612C8.42454 3.82216 8.00471 4.23324 7.49743 4.23324V4.24198Z"
                        fill="#191925"
                    />
                </g>
                <g opacity="0.5">
                    <path
                        d="M3.30612 8.43138H0.927114C0.411079 8.43138 0 8.01155 0 7.50426C0 6.99697 0.419825 6.57715 0.927114 6.57715H3.30612C3.82216 6.57715 4.23324 6.99697 4.23324 7.50426C4.23324 8.01155 3.81341 8.43138 3.30612 8.43138Z"
                        fill="#191925"
                    />
                </g>
                <path
                    d="M14.0639 8.43138H11.6849C11.1689 8.43138 10.7578 8.01155 10.7578 7.50426C10.7578 6.99697 11.1776 6.57715 11.6849 6.57715H14.0639C14.58 6.57715 14.991 6.99697 14.991 7.50426C14.991 8.01155 14.5712 8.43138 14.0639 8.43138Z"
                    fill="#191925"
                />
                <g opacity="0.62">
                    <path
                        d="M2.84946 13.0763C2.6133 13.0763 2.37715 12.9888 2.19348 12.8051C1.82613 12.4378 1.82613 11.8518 2.19348 11.4932L3.87278 9.81387C4.24013 9.45527 4.82613 9.45527 5.18473 9.81387C5.55208 10.1812 5.55208 10.7672 5.18473 11.1258L3.50543 12.8051C3.32176 12.9888 3.08561 13.0763 2.84946 13.0763Z"
                        fill="#191925"
                    />
                </g>
                <g opacity="0.12">
                    <path
                        d="M10.4588 5.46661C10.2227 5.46661 9.98653 5.37915 9.80285 5.19548C9.43551 4.82813 9.43551 4.24212 9.80285 3.88352L11.4822 2.20422C11.8495 1.83687 12.4355 1.83687 12.7941 2.20422C13.1615 2.57157 13.1615 3.15757 12.7941 3.51617L11.1148 5.19548C10.9311 5.37915 10.695 5.46661 10.4588 5.46661Z"
                        fill="#191925"
                    />
                </g>
                <path
                    opacity="0.37"
                    d="M4.54047 5.46627C4.30432 5.46627 4.06817 5.37881 3.8845 5.19513L2.2052 3.51583C1.83785 3.14849 1.83785 2.56248 2.2052 2.20388C2.57254 1.83653 3.15855 1.84528 3.51715 2.20388L5.19645 3.88318C5.5638 4.25053 5.5638 4.83653 5.19645 5.19513C5.01278 5.37881 4.77663 5.46627 4.54047 5.46627Z"
                    fill="#191925"
                />
                <g opacity="0.85">
                    <path
                        d="M12.1381 13.0763C11.902 13.0763 11.6658 12.9888 11.4822 12.8051L9.80285 11.1258C9.43551 10.7585 9.43551 10.1725 9.80285 9.81387C10.1702 9.45527 10.7562 9.45527 11.1148 9.81387L12.7941 11.4932C13.1615 11.8605 13.1615 12.4465 12.7941 12.8051C12.6104 12.9888 12.3743 13.0763 12.1381 13.0763Z"
                        fill="#191925"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_amount_loading">
                    <rect width="15" height="15" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

interface AmountFieldProps {
    value: string
    onChange: (value: string) => void
    balance?: string
    fee?: string
    decimals: number
    symbol: string
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
    // Price in USD for the token
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
                                priceUsd = 0.037624, // Default price for demo
                            }: AmountFieldProps) {
    const [displayValue, setDisplayValue] = useState(value)
    const [isFocused, setIsFocused] = useState(false)

    // Check if there's a valid non-zero value
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
        const raw = e.target.value.replace(/,/g, '') // Remove commas for parsing
        if (!/^[\d.]*$/.test(raw)) return

        setDisplayValue(e.target.value)
        onChange(cleanInputValue(raw))
    }

    const handleFocus = () => {
        setIsFocused(true)
        // Show raw value without formatting when focused
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
        onChange(formatted.replace(/,/g, '')) // Store without commas
        setDisplayValue(formatted)
    }

    const formattedBalance = balance ? formatBalance(balance, decimals) : undefined
    const formattedFee = fee ? formatBalance(fee, decimals) : undefined

    // Calculate USD value for balance
    const balanceUsd = useMemo(() => {
        if (!formattedBalance || !priceUsd) return undefined
        const balanceNum = parseFloat(formattedBalance.replace(/,/g, '')) || 0
        return balanceNum * priceUsd
    }, [formattedBalance, priceUsd])

    // Determine what to show for Available
    const showBalanceLoading = isLoadingBalance && !isDisabled
    const showBalanceError = !isLoadingBalance && balanceError
    const showBalancePlaceholder =
        !isLoadingBalance && !balanceError && !formattedBalance

    // Determine what to show for Fee
    const showFeeLoading = isLoadingFee && !isDisabled
    const showFeeError = !isLoadingFee && feeError
    const showFeePlaceholder = !isLoadingFee && !feeError && !formattedFee

    return (
        <div
            className={cn(
                // Base layout
                'px-[25px] py-[15px] flex flex-col items-start gap-[10px] self-stretch',
                'rounded-[12px] transition-colors duration-200',
                // Rest state
                'border border-[rgba(104,129,153,0.15)] bg-[rgba(255,255,255,0.40)]',
                // Hover state (only when not disabled)
                !isDisabled && 'hover:bg-white',
                // Active/focused state
                (isActive || isFocused) &&
                'bg-[rgba(255,255,255,0.40)] shadow-[0_4px_20px_0_rgba(104,129,153,0.30)] backdrop-blur-[20px]'
            )}
        >
            {/* Amount Row */}
            <div className="w-full flex items-center gap-[80px]">
                {/* Label */}
                <div className="w-[95px] shrink-0">
          <span
              className="text-[#191925] text-[20px] font-semibold leading-[21px]"
          >
            Amount
          </span>
                </div>

                {/* Input and MAX button container */}
                <div className="flex-1 flex items-center gap-[10px]">
                    {/* Input */}
                    <div className="flex-1 h-[40px] pr-[10px] flex justify-between items-center rounded-[9px] border border-[rgba(104,129,153,0.30)]">
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
                                'placeholder:text-[#90A0AF]',
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
                                <span className="text-[#191925] text-[12px] font-semibold">{symbol}</span>
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
            </div>

            {/* Available Balance Row */}
            <div className="w-full flex items-center gap-[80px]">
                <div className="w-[95px] shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-[4px]">
            <span className="text-[#90A0AF] text-[12px] font-medium leading-normal tracking-[0.36px]">
              Available
            </span>
                        {showBalanceLoading ? (
                            <LoadingIcon />
                        ) : showBalanceError ? (
                            <>
                <span className="text-[#E1856B] text-[12px] font-medium leading-normal tracking-[0.36px]">
                  {balanceError}
                </span>
                                <ErrorInfoIcon />
                            </>
                        ) : showBalancePlaceholder ? (
                            <span className="text-[#90A0AF] text-[12px] font-medium leading-normal tracking-[0.36px]">
                -- {symbol}
              </span>
                        ) : (
                            <span className="text-[#90A0AF] text-[12px] font-medium leading-normal tracking-[0.36px]">
                $ {formatUsd(balanceUsd || 0)} ≈ {formatTokenAmount(formattedBalance || '0')}{' '}
                                {symbol}
              </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Row */}
            {error && (
                <div className="w-full flex items-center gap-[80px]">
                    <div className="w-[95px] shrink-0" />
                    <div className="flex items-center gap-[4px]">
            <span className="text-[#E1856B] text-[12px] font-medium leading-normal tracking-[0.36px]">
              {error}
            </span>
                        <ErrorInfoIcon />
                    </div>
                </div>
            )}

            {/* Fee Row */}
            <div className="w-full flex items-center gap-[80px] pt-[10px] border-t border-[rgba(104,129,153,0.15)]">
                <div className="w-[95px] shrink-0 flex items-center gap-[6px]">
                    <span className="text-[#191925] text-[16px] font-semibold leading-[19.2px]">Fee</span>
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
                        <span className="text-[#688199] text-[16px] font-medium leading-[19.2px]">--</span>
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