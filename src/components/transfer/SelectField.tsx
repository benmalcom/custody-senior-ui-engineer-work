import { cn } from '@/components/utils'
import type { ReactNode } from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { SelectDropdown, type SelectOption, type FilterTab } from './SelectDropdown'

export type { SelectOption, FilterTab }

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            className={className}
        >
            <path
                d="M10.6271 0.211847L11.5386 1.12361L11.6087 1.19509L11.5382 1.26521L6.40159 6.40208C6.26235 6.54231 6.07306 6.62117 5.87558 6.62129C5.67778 6.62129 5.48725 6.54257 5.34788 6.40203L5.34788 6.40105L0.211985 1.26542L0.140895 1.19491L0.211408 1.12382L1.12317 0.212329L1.19466 0.141242L1.26477 0.212729L5.87479 4.82832L10.4855 0.212423L10.556 0.141333L10.6271 0.211847Z"
                fill="#191925"
                stroke="#191925"
                strokeWidth="0.199971"
            />
        </svg>
    )
}

function LoadingIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className={cn('animate-spin', className)}
        >
            <g clipPath="url(#clip0_5415_553)">
                <g opacity="0.75">
                    <path
                        d="M7.49743 14.9998C6.98139 14.9998 6.57031 14.58 6.57031 14.0727V11.6937C6.57031 11.1777 6.99014 10.7666 7.49743 10.7666C8.00471 10.7666 8.42454 11.1864 8.42454 11.6937V14.0727C8.42454 14.5888 8.00471 14.9998 7.49743 14.9998Z"
                        fill="#191925"
                    />
                </g>
                <g opacity="0.25">
                    <path
                        d="M7.49743 4.24198C6.98139 4.24198 6.57031 3.82216 6.57031 3.31487V0.927114C6.57031 0.411079 6.99014 0 7.49743 0C8.00471 0 8.42454 0.419825 8.42454 0.927114V3.30612C8.42454 3.82216 8.00471 4.23324 7.49743 4.23324V4.24198Z"
                        fill="#191925"
                    />
                </g>
                <g opacity="0.5">
                    <path
                        d="M3.30612 8.43138H0.927114C0.411079 8.43138 0 8.01155 0 7.50426C0 6.99697 0.419825 6.57715 0.927114 6.57715H3.30612C3.82216 6.57715 4.23324 6.99697 4.23324 7.50426C4.23324 8.01155 3.81341 8.43138 3.30612 8.43138Z"
                        fill="#191925"
                    />
                </g>
                <path
                    d="M14.0639 8.43138H11.6849C11.1689 8.43138 10.7578 8.01155 10.7578 7.50426C10.7578 6.99697 11.1776 6.57715 11.6849 6.57715H14.0639C14.58 6.57715 14.991 6.99697 14.991 7.50426C14.991 8.01155 14.5712 8.43138 14.0639 8.43138Z"
                    fill="#191925"
                />
                <g opacity="0.62">
                    <path
                        d="M2.84946 13.0763C2.6133 13.0763 2.37715 12.9888 2.19348 12.8051C1.82613 12.4378 1.82613 11.8518 2.19348 11.4932L3.87278 9.81387C4.24013 9.45527 4.82613 9.45527 5.18473 9.81387C5.55208 10.1812 5.55208 10.7672 5.18473 11.1258L3.50543 12.8051C3.32176 12.9888 3.08561 13.0763 2.84946 13.0763Z"
                        fill="#191925"
                    />
                </g>
                <g opacity="0.12">
                    <path
                        d="M10.4588 5.46661C10.2227 5.46661 9.98653 5.37915 9.80285 5.19548C9.43551 4.82813 9.43551 4.24212 9.80285 3.88352L11.4822 2.20422C11.8495 1.83687 12.4355 1.83687 12.7941 2.20422C13.1615 2.57157 13.1615 3.15757 12.7941 3.51617L11.1148 5.19548C10.9311 5.37915 10.695 5.46661 10.4588 5.46661Z"
                        fill="#191925"
                    />
                </g>
                <path
                    opacity="0.37"
                    d="M4.54047 5.46627C4.30432 5.46627 4.06817 5.37881 3.8845 5.19513L2.2052 3.51583C1.83785 3.14849 1.83785 2.56248 2.2052 2.20388C2.57254 1.83653 3.15855 1.84528 3.51715 2.20388L5.19645 3.88318C5.5638 4.25053 5.5638 4.83653 5.19645 5.19513C5.01278 5.37881 4.77663 5.46627 4.54047 5.46627Z"
                    fill="#191925"
                />
                <g opacity="0.85">
                    <path
                        d="M12.1381 13.0763C11.902 13.0763 11.6658 12.9888 11.4822 12.8051L9.80285 11.1258C9.43551 10.7585 9.43551 10.1725 9.80285 9.81387C10.1702 9.45527 10.7562 9.45527 11.1148 9.81387L12.7941 11.4932C13.1615 11.8605 13.1615 12.4465 12.7941 12.8051C12.6104 12.9888 12.3743 13.0763 12.1381 13.0763Z"
                        fill="#191925"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_5415_553">
                    <rect width="15" height="15" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

function ErrorIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="16"
            viewBox="0 0 18 16"
            fill="none"
            className={className}
        >
            <path
                d="M8.75888 11.1871L8.76453 13.1871M8.73912 4.21254L8.75327 9.21155M2.70802 15.2169L14.8323 15.1827C16.3719 15.1783 17.3295 13.5089 16.5559 12.1778L10.4641 1.69496C9.6905 0.363809 7.766 0.36925 6.99997 1.70475L0.967497 12.2218C0.201468 13.5573 1.16843 15.2213 2.70802 15.2169Z"
                stroke="#D84E28"
                strokeWidth="1.4"
            />
        </svg>
    )
}

function ErrorInfoIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2"
            height="10"
            viewBox="0 0 2 10"
            fill="none"
            className={className}
        >
            <path
                d="M0.161537 9.05456V2.52507H1.43258V9.05456H0.161537ZM0.803433 1.5176C0.582383 1.5176 0.392506 1.44391 0.233803 1.29654C0.0779344 1.14634 0 0.967803 0 0.760923C0 0.551209 0.0779344 0.372668 0.233803 0.225301C0.392506 0.0751003 0.582383 0 0.803433 0C1.02448 0 1.21294 0.0751003 1.36881 0.225301C1.52751 0.372668 1.60687 0.551209 1.60687 0.760923C1.60687 0.967803 1.52751 1.14634 1.36881 1.29654C1.21294 1.44391 1.02448 1.5176 0.803433 1.5176Z"
                fill="#D84E28"
            />
        </svg>
    )
}

interface SelectFieldProps {
    label: string
    placeholder?: string
    value?: ReactNode
    options?: SelectOption[]
    onChange?: (value: string) => void
    isDisabled?: boolean
    isLoading?: boolean
    error?: string
    validationError?: string
    loadingText?: string
    filterTabs?: FilterTab[]
    showSearch?: boolean
    showFilter?: boolean
    showInfoIcon?: boolean
    searchPlaceholder?: string
}

export function SelectField({
                                label,
                                placeholder = 'Select...',
                                value,
                                options = [],
                                onChange,
                                isDisabled,
                                isLoading,
                                error,
                                validationError,
                                loadingText = 'Loading...',
                                filterTabs,
                                showSearch = true,
                                showFilter = true,
                                showInfoIcon = false,
                                searchPlaceholder = 'Search',
                            }: SelectFieldProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const hasError = !!error && !isLoading
    const hasValidationError = !!validationError && !hasError
    const showPlaceholder = !value && !isLoading && !hasError

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleToggle = useCallback(() => {
        if (!isDisabled && !isLoading) {
            setIsOpen((prev) => !prev)
        }
    }, [isDisabled, isLoading])

    const handleSelect = useCallback(
        (option: SelectOption) => {
            onChange?.(option.id)
            setIsOpen(false)
        },
        [onChange]
    )

    const triggerContent = (
        <div className="w-full h-[50px] flex justify-start items-center gap-[80px]">
            <div className="w-[95px] shrink-0">
                <span className="text-[#191925] text-[20px] font-semibold leading-[21px]">
                    {label}
                </span>
            </div>

            <div className="flex-1 flex justify-between items-center">
                <div>
                    {isLoading && !isDisabled ? (
                        <div className="flex items-center gap-[8px]">
                            <span className="text-[#688199] text-[16px] font-medium leading-[19.2px]">
                                {loadingText}
                            </span>
                        </div>
                    ) : hasError ? (
                        <div className="flex items-center gap-[8px]">
                            <span className="text-[#D84E28] text-[16px] font-medium leading-[19.2px]">
                                {error}
                            </span>
                        </div>
                    ) : showPlaceholder ? (
                        <span className="text-[#688199] text-[16px] font-medium leading-[19.2px]">
                            {placeholder}
                        </span>
                    ) : (
                        <div className="text-[#191925] text-[16px] font-medium leading-[19.2px]">
                            {value}
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    {isLoading && !isDisabled ? (
                        <LoadingIcon />
                    ) : hasError ? (
                        <ErrorIcon />
                    ) : (
                        <div
                            className={cn(
                                'w-[20px] h-[20px] flex justify-center items-center shrink-0 transition-transform duration-200',
                                isOpen && 'rotate-180'
                            )}
                        >
                            <ChevronDown />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div ref={containerRef} className="relative" style={{ zIndex: isOpen ? 50 : 'auto' }}>
            <div className={cn('min-h-[80px]', hasValidationError && !isOpen && 'min-h-[100px]')}>
                {/* Closed state */}
                {!isOpen && (
                    <div className="flex flex-col">
                        <button
                            type="button"
                            disabled={isDisabled}
                            onClick={handleToggle}
                            className={cn(
                                'w-full h-[80px] px-[25px] py-[15px] flex flex-col justify-center items-start',
                                'rounded-[12px] text-left',
                                'border border-[rgba(104,129,153,0.15)] bg-[rgba(255,255,255,0.40)]',
                                !isDisabled && 'cursor-pointer hover:bg-white',
                                (hasError || hasValidationError) && 'border-[#D84E28]'
                            )}
                        >
                            {triggerContent}
                        </button>

                        {hasValidationError && (
                            <div className="flex items-center gap-[4px] mt-[8px] pl-[175px]">
                                <span className="text-[#E1856B] text-[12px] font-medium leading-normal tracking-[0.36px]">
                                    {validationError}
                                </span>
                                <ErrorInfoIcon />
                            </div>
                        )}
                    </div>
                )}

                {/* Open state */}
                {isOpen && (
                    <div
                        className={cn(
                            'absolute left-0 right-0 top-0 w-full',
                            'px-[25px] py-[15px] flex flex-col items-start gap-[15px]',
                            'rounded-[12px]',
                            'border border-[rgba(104,129,153,0.15)] bg-[rgba(255,255,255,0.40)]',
                            'shadow-[0_4px_20px_0_rgba(104,129,153,0.30)] backdrop-blur-[20px]'
                        )}
                    >
                        <button
                            type="button"
                            disabled={isDisabled}
                            onClick={handleToggle}
                            className="w-full text-left cursor-pointer"
                        >
                            {triggerContent}
                        </button>

                        {isLoading ? (
                            <div className="w-full flex items-center justify-center py-[20px] gap-[8px]">
                                <span className="text-[#688199] text-[16px] font-medium leading-[19.2px]">
                                    {loadingText}
                                </span>
                                <LoadingIcon />
                            </div>
                        ) : (
                            <div className="w-full">
                                <SelectDropdown
                                    options={options}
                                    filterTabs={filterTabs}
                                    onSelect={handleSelect}
                                    searchPlaceholder={searchPlaceholder}
                                    showSearch={showSearch}
                                    showFilter={showFilter}
                                    showInfoIcon={showInfoIcon}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}