import { User } from 'lucide-react'
import { cn } from '@/components/utils'

interface UserIconWrapperProps {
    className?: string
}

export function UserIconWrapper({ className }: UserIconWrapperProps) {
    return (
        <div
            className={cn(
                'flex h-[30px] w-[30px] items-center justify-center rounded-full bg-blue-5/20',
                className
            )}
        >
            <User className="h-[16px] w-[16px] text-blue-1" />
        </div>
    )
}
