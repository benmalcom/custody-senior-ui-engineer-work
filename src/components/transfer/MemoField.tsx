import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MemoFieldProps {
  value: string
  onChange: (value: string) => void
  isDisabled?: boolean
  error?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function MemoField({ value, onChange, isDisabled, error, onFocus, onBlur }: MemoFieldProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  return (
    <div
      className={cn(
        // Base layout
        'flex flex-col sm:flex-row min-h-[80px] px-[16px] sm:px-[25px] py-[20px] sm:items-center self-stretch',
        'rounded-[12px] transition-all duration-200',
        // Rest state
        'gap-[12px] sm:gap-[80px] border border-blue-5-transparency-15 bg-white-transparency-40',
        // Hover state (only when not disabled and not focused)
        !isDisabled && !isFocused && 'hover:bg-white',
        // Focused state
        isFocused && 'bg-white shadow-[0_4px_20px_0_rgba(104,129,153,0.30)] backdrop-blur-[20px]',
        // Error state
        error && 'border-red-highlight-1',
      )}
    >
      {/* Label */}
      <div className="form-field-label-container">
        <span className="form-field-label">Memo</span>
      </div>

      {/* Input Container */}
      <div className="flex-1 w-full flex flex-col gap-[8px]">
        <div
          className={cn(
            'h-[40px] flex justify-between items-center',
            'rounded-[9px] transition-colors duration-200',
            isFocused && 'border px-[10px] pr-[5px]',
            isFocused && (error ? 'border-red-highlight-1' : 'border-gray-1'),
          )}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={(e) => {
              // Check if blur is happening because user is clicking submit button
              const relatedTarget = e.relatedTarget as HTMLButtonElement
              if (relatedTarget?.type === 'submit') {
                setIsFocused(false)
                onBlur?.()
                return
              }
              handleBlur()
            }}
            placeholder="Enter a memo"
            disabled={isDisabled}
            className={cn(
              'flex-1 h-full bg-transparent outline-none',
              'text-blue-1 text-[16px] font-medium leading-[120%]',
              'placeholder:text-blue-5 font-inter-tight',
              isDisabled && 'cursor-not-allowed',
            )}
          />
        </div>

        {/* Error Row */}
        {error && (
          <div className="flex items-center gap-[4px]">
            <span className="form-field-error">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}
