import { cn } from '@/components/utils'
import { Card } from '@/components/ui'
import { Typography } from '@/components/ui'
import { Spinner } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'

interface FormFieldProps {
    label: string
    children: ReactNode
    isActive?: boolean
    isDisabled?: boolean
    isLoading?: boolean
    error?: string
    loadingText?: string
    className?: string
    onClick?: () => void
}

export function FormField({
                              label,
                              children,
                              isActive,
                              isDisabled,
                              isLoading,
                              error,
                              loadingText,
                              className,
                              onClick,
                          }: FormFieldProps) {
    const hasError = !!error && !isLoading

    return (
        <Card
            isActive={isActive}
            isDisabled={isDisabled}
            hasError={hasError}
            className={cn('px-[24px] py-[20px]', className)}
            onClick={isDisabled ? undefined : onClick}
        >
            <div className="flex items-start gap-[24px]">
                {/* Label */}
                <Typography
                    variant="h6"
                    className={cn(
                        'w-[100px] shrink-0 text-blue-1',
                        isDisabled && 'text-gray-1'
                    )}
                >
                    {label}
                </Typography>

                {/* Content */}
                <div className="flex-1">
                    {isLoading && !isDisabled ? (
                        <div className="flex items-center gap-[8px]">
                            <Typography className="text-gray-1">{loadingText}</Typography>
                            <Spinner size="sm" />
                        </div>
                    ) : hasError && !children ? (
                        <div className="flex items-center gap-[8px]">
                            <Typography className="text-red-highlight-1">{error}</Typography>
                            <AlertTriangle className="h-[18px] w-[18px] text-red-highlight-1" />
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>

            {/* Error message below content */}
            {hasError && children && (
                <div className="mt-[8px] pl-[124px]">
                    <Typography variant="caption" className="text-red-highlight-1">
                        {error}
                    </Typography>
                </div>
            )}
        </Card>
    )
}