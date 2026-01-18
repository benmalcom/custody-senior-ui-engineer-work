import { cn } from '@/lib/utils'

interface StepperProps {
    activeStep: number
    totalSteps?: number
}

export function Stepper({ activeStep, totalSteps = 5 }: StepperProps) {
    return (
        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-[9px]">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        // Horizontal on mobile
                        'h-[5px] lg:w-[5px] relative',
                        // Active state: wide on mobile, tall on desktop
                        index === activeStep
                            ? 'w-[40px] lg:w-[5px] lg:h-[40px]'
                            : 'w-[5px] lg:h-[5px]'
                    )}
                >
                    <div
                        className={cn(
                            'absolute rounded-[125px]',
                            index === activeStep
                                ? 'w-full h-full top-0 left-0 bg-blue-highlight-dark-1'
                                : 'w-[5px] h-[5px] lg:w-full lg:h-[5px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:left-0 lg:translate-x-0 bg-blue-5-transparency-30'
                        )}
                    />
                </div>
            ))}
        </div>
    )
}