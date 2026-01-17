import { cn } from '@/components/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, hasError, type = 'text', ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                className={cn(
                    'w-full bg-transparent text-[16px] font-medium text-blue-1 outline-none',
                    'placeholder:text-gray-1',
                    hasError && 'text-red-highlight-1',
                    props.disabled && 'cursor-not-allowed text-gray-1',
                    className
                )}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'