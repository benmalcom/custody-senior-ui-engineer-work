import { cn } from '@/components/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'active'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-[4px] px-[6px] py-[2px] text-[12px] font-medium',
                variant === 'default' && 'bg-gray-5 text-blue-4',
                variant === 'active' && 'bg-blue-5 text-white',
                className
            )}
            {...props}
        >
      {children}
    </span>
    )
}