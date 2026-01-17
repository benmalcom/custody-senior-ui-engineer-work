import { cn } from '@/components/utils'

interface StepperProps {
    activeStep: number
    totalSteps?: number
}

export function Stepper({ activeStep, totalSteps = 5 }: StepperProps) {
    return (
        <div className="flex flex-col items-end gap-[9px]">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        'w-[5px] relative',
                        index === activeStep ? 'h-[40px]' : 'h-[5px]'
                    )}
                >
                    <div
                        className={cn(
                            'absolute w-full rounded-[125px]',
                            index === activeStep
                                ? 'h-full top-0 bg-[#3470AB]'
                                : 'h-[5px] top-1/2 -translate-y-1/2 bg-[rgba(104,129,153,0.3)]'
                        )}
                    />
                </div>
            ))}
        </div>
    )
}