import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { ErrorInfoIcon, InfoIcon, LoadingIcon } from '@/components/icons'
import { MOCK_PRICE_USD } from '@/constants/form'
import { formatBalance, formatInputValue, formatTokenAmount, formatUsd } from '@/lib/format'
import { cn } from '@/lib/utils'

interface AmountFieldProps {
  value: string
  onChange: (value: string) => void
  balance?: string
  fee?: string
  decimals: number
  symbol?: string
  icon?: ReactNode
  isDisabled?: boolean
  isLoadingBalance?: boolean
  isLoadingFee?: boolean
  balanceError?: string
  feeError?: string
  error?: string
  onFocus?: () => void
  onBlur?: () => void
  priceUsd?: number
  networkId?: string
}

export function AmountField({
  value,
  onChange,
  balance,
  fee,
  decimals,
  symbol,
  icon,
  isDisabled,
  isLoadingBalance,
  isLoadingFee,
  balanceError,
  feeError,
  error,
  onFocus,
  onBlur,
  priceUsd = MOCK_PRICE_USD,
  networkId,
}: AmountFieldProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const [isUsdMode, setIsUsdMode] = useState(false)

  const hasValue = value && parseFloat(value) > 0

  // Get native currency symbol from network ID
  const getNativeCurrency = (netId?: string): string => {
    if (!netId) return ''
    if (netId.includes('eip155:11155111')) return 'ETH'
    if (netId.includes('avax') || netId.includes('43113')) return 'AVAX'
    if (netId.includes('bip122')) return 'BTC'
    return ''
  }

  const nativeCurrency = getNativeCurrency(networkId)

  useEffect(() => {
    if (!isFocused) {
      if (hasValue) {
        if (isUsdMode) {
          // Show USD value when not focused in USD mode
          const tokenAmount = parseFloat(value.replace(/,/g, ''))
          const usdAmount = (tokenAmount * priceUsd).toFixed(2)
          setDisplayValue(usdAmount)
        } else {
          setDisplayValue(formatInputValue(value))
        }
      } else {
        setDisplayValue('')
      }
    }
  }, [value, isFocused, hasValue, isUsdMode, priceUsd])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '')
    if (!/^[\d.]*$/.test(raw)) return

    setDisplayValue(e.target.value)

    if (isUsdMode) {
      // User is typing in USD - convert to token amount for storage
      const usdAmount = parseFloat(raw) || 0
      const tokenAmount = priceUsd > 0 ? usdAmount / priceUsd : 0
      onChange(tokenAmount.toString())
    } else {
      // User is typing in token amount - store directly
      onChange(raw)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (value) {
      if (isUsdMode) {
        // Show USD value when focusing in USD mode
        const tokenAmount = parseFloat(value.replace(/,/g, ''))
        const usdAmount = (tokenAmount * priceUsd).toFixed(2)
        setDisplayValue(usdAmount)
      } else {
        setDisplayValue(value)
      }
    }
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (hasValue) {
      if (isUsdMode) {
        // Format as USD (2 decimal places)
        const tokenAmount = parseFloat(value.replace(/,/g, ''))
        const usdAmount = (tokenAmount * priceUsd).toFixed(2)
        setDisplayValue(usdAmount)
      } else {
        setDisplayValue(formatInputValue(value))
      }
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
    const cleanValue = formatted.replace(/,/g, '')

    if (isUsdMode) {
      // Convert to USD for display
      const tokenAmount = parseFloat(cleanValue)
      const usdAmount = (tokenAmount * priceUsd).toFixed(2)
      onChange(cleanValue) // Store token amount
      setDisplayValue(usdAmount) // Display USD
    } else {
      onChange(cleanValue)
      setDisplayValue(formatted)
    }
  }

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
        'px-[16px] sm:px-[25px] py-[15px] flex flex-col items-start gap-[10px] self-stretch',
        'rounded-[12px] transition-colors duration-200',
        'border border-blue-5-transparency-15 bg-white-transparency-40',
        !isDisabled && 'hover:bg-white',
        isFocused &&
          'bg-white-transparency-40 shadow-[0_4px_20px_0_rgba(104,129,153,0.30)] backdrop-blur-[20px]',
      )}
    >
      {/* Amount Row */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-[12px] sm:gap-[80px]">
        {/* Label */}
        <div className="form-field-label-container">
          <span className="form-field-label">Amount</span>
        </div>

        {/* Input and MAX button container */}
        <div className="flex-1 w-full flex flex-col gap-[8px]">
          <div className="flex items-center gap-[10px]">
            {/* Input */}
            <div
              className={cn(
                'flex-1 h-[40px] pr-[10px] flex justify-between items-center rounded-[9px] border',
                error ? 'border-red-highlight-1' : 'border-blue-5-transparency-30',
              )}
            >
              <input
                type="text"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={(e) => {
                  // Check if blur is happening because user is clicking submit button
                  // If so, don't format the display value to avoid re-render that cancels click
                  const relatedTarget = e.relatedTarget as HTMLButtonElement
                  if (relatedTarget?.type === 'submit') {
                    setIsFocused(false)
                    onBlur?.()
                    return
                  }
                  handleBlur()
                }}
                placeholder="0.00"
                disabled={isDisabled}
                className={cn(
                  'flex-1 h-full px-[10px] bg-transparent outline-none',
                  'text-blue-1 text-[16px] font-medium leading-[19.2px]',
                  'placeholder:text-blue-5',
                  isDisabled && 'cursor-not-allowed',
                )}
              />

              {/* Token Badge */}
              {symbol && (
                <div className="flex items-center gap-[5px]">
                  {(icon || isUsdMode) && (
                    <div
                      className="w-[18px] h-[18px] rounded-full overflow-hidden shrink-0"
                      style={{
                        background:
                          'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, #191925 0%, #191925 100%)',
                        backgroundBlendMode: 'normal, color-burn, normal',
                      }}
                    >
                      {isUsdMode ? (
                        <img src="/images/usdt_logo.svg" alt="USDT" className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full">{icon}</div>
                      )}
                    </div>
                  )}
                  <span className="text-blue-1 text-[12px] font-semibold">
                    {isUsdMode ? 'USDT' : symbol}
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
                'rounded-[9px] bg-blue-5-transparency-30 backdrop-blur-[7.5px]',
                'text-blue-1 text-[14px] font-semibold',
                'cursor-pointer transition-colors hover:bg-blue-5/40',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              MAX
            </button>
          </div>

          {/* Error Row - directly under input */}
          {error && (
            <div className="flex items-center gap-[4px]">
              <span className="form-field-error">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Available Balance Row */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-[4px] sm:gap-[80px]">
        <div className="hidden sm:block sm:w-[95px] shrink-0" />
        <div className="flex-1 w-full flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <span className="text-gray-1 text-[12px] font-medium leading-normal tracking-[0.36px]">
              Available
            </span>
            {showBalanceLoading || showFeeLoading ? (
              <LoadingIcon />
            ) : showBalanceError ? (
              <>
                <span className="form-field-error">{balanceError}</span>
                <ErrorInfoIcon />
              </>
            ) : !availableBalance ? (
              <span className="text-blue-5 text-[12px] font-medium leading-normal tracking-[0.36px]">
                -- {symbol}
              </span>
            ) : (
              <span className="text-blue-5 text-[12px] font-medium leading-normal tracking-[0.36px]">
                $ {formatUsd(availableBalanceUsd || 0)} ≈{' '}
                {formatTokenAmount(availableBalance || '0')} {symbol}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (!hasValue || !value) return

              const newMode = !isUsdMode
              setIsUsdMode(newMode)

              if (newMode) {
                // Switching TO USD mode: convert token amount to USD
                const tokenAmount = parseFloat(value.replace(/,/g, ''))
                const usdAmount = (tokenAmount * priceUsd).toFixed(2)
                setDisplayValue(usdAmount)
              } else {
                // Switching TO token mode: value is already in tokens, just reformat
                setDisplayValue(formatInputValue(value))
              }
            }}
            disabled={isDisabled || !hasValue || !nativeCurrency}
            className="text-[12px] font-medium leading-normal tracking-[0.36px] underline transition-colors font-inter-tight"
            style={{
              color: isDisabled || !hasValue || !nativeCurrency ? '#81ACD6' : '#3470AB',
              textDecorationSkipInk: 'none',
              textUnderlinePosition: 'from-font',
              cursor: isDisabled || !hasValue || !nativeCurrency ? 'not-allowed' : 'pointer',
            }}
          >
            {isUsdMode && nativeCurrency ? `Amt. in ${nativeCurrency}` : 'Amt. in USD'}
          </button>
        </div>
      </div>

      {/* Fee Row */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-[12px] sm:gap-[80px] pt-[10px] border-t border-blue-5-transparency-15">
        <div className="form-field-label-container flex items-center gap-[6px]">
          <span className="text-blue-1 text-[14px] sm:text-[16px] font-semibold leading-[19.2px]">
            Fee
          </span>
          <InfoIcon />
        </div>

        <div className="flex-1 w-full">
          {showFeeLoading ? (
            <LoadingIcon />
          ) : showFeeError ? (
            <div className="flex items-center gap-[4px]">
              <span className="form-field-error">{feeError}</span>
              <ErrorInfoIcon />
            </div>
          ) : showFeePlaceholder ? (
            <span className="text-blue-5 text-[16px] font-medium leading-[19.2px]">--</span>
          ) : (
            <span className="text-blue-5 text-[16px] font-medium leading-[19.2px]">
              {formattedFee} {symbol}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
