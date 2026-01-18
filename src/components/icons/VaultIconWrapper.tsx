import { Vault } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VaultIconWrapperProps {
    className?: string
}

export function VaultIconWrapper({ className }: VaultIconWrapperProps) {
    return (
        <div
            className={cn(
                'flex h-[30px] w-[30px] items-center justify-center rounded-full bg-blue-5/20',
                className
            )}
        >
            <Vault className="h-[16px] w-[16px] text-blue-1" />
        </div>
    )
}
