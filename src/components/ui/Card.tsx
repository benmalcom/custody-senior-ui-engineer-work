import { cn } from '@/components/utils'
import { forwardRef, type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    isActive?: boolean
    isDisabled?: boolean
    hasError?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, isActive, isDisabled, hasError, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-[12px] border border-gray-5 bg-white transition-all duration-200',
                    // Hover state
                    !isDisabled && 'hover:border-gray-3',
                    // Focus/Active state - box shadow
                    isActive && 'shadow-[0_0_0_2px_rgba(104,129,153,0.3)]',
                    // Error state
                    hasError && 'border-red-highlight-1',
                    // Disabled state
                    isDisabled && 'bg-gray-soft-2 opacity-60',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'