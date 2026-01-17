import { cn } from '@/components/utils'
import { useState } from 'react'

interface MemoFieldProps {
    value: string
    onChange: (value: string) => void
    isActive?: boolean
    isDisabled?: boolean
    error?: string
    onFocus?: () => void
    onBlur?: () => void
}

export function MemoField({
                              value,
                              onChange,
                              isActive,
                              isDisabled,
                              error,
                              onFocus,
                              onBlur,
                          }: MemoFieldProps) {
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = () => {
        setIsFocused(true)
        onFocus?.()
    }

    const handleBlur = () => {
        setIsFocused(false)
        onBlur?.()
    }

    const isActiveOrFocused = isActive || isFocused

    return (
        <div
            className={cn(
                // Base layout
                'flex min-h-[80px] px-[25px] py-[20px] items-center self-stretch',
                'rounded-[12px] transition-all duration-200',
                // Rest state
                'gap-[80px] border border-[rgba(104,129,153,0.15)] bg-[rgba(255,255,255,0.40)]',
                // Hover state (only when not disabled and not focused)
                !isDisabled && !isActiveOrFocused && 'hover:bg-white',
                // Active/focused state
                isActiveOrFocused && 'bg-white shadow-[0_4px_20px_0_rgba(104,129,153,0.30)] backdrop-blur-[20px]',
                // Error state
                error && 'border-[#D84E28]'
            )}
        >
            {/* Label */}
            <div className="w-[95px] shrink-0">
        <span
            className="text-[#191925] text-[20px] font-semibold leading-[21px]"
        >
          Memo
        </span>
            </div>

            {/* Input Container */}
            <div className="flex-1 flex flex-col gap-[8px]">
                <div
                    className={cn(
                        'h-[40px] flex justify-between items-center',
                        'rounded-[9px] transition-colors duration-200',
                        // Active/focused state - add border and padding
                        isActiveOrFocused && 'border border-[#90A0AF] px-[10px] pr-[5px]'
                    )}
                >
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Enter a memo"
                        disabled={isDisabled}
                        className={cn(
                            'flex-1 h-full bg-transparent outline-none',
                            'text-[#191925] text-[16px] font-medium leading-[19.2px]',
                            'placeholder:text-[#90A0AF]',
                            isDisabled && 'cursor-not-allowed'
                        )}
                    />
                </div>

                {/* Error Row */}
                {error && (
                    <div className="flex items-center gap-[4px]">
            <span className="text-[#E1856B] text-[12px] font-medium leading-normal tracking-[0.36px]">
              {error}
            </span>
                    </div>
                )}
            </div>
        </div>
    )
}