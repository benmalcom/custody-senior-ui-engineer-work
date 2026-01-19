import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { SelectDropdown, type SelectOption, type FilterTab } from './SelectDropdown'
import { ChevronDown, LoadingIcon, ErrorIcon } from '@/components/icons'

export type { SelectOption, FilterTab }

interface SelectFieldProps {
    label: string
    placeholder?: string
    value?: ReactNode
    selectedId?: string
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
                                selectedId,
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
        <div className="w-full min-h-[50px] flex flex-col sm:flex-row justify-start items-start sm:items-center gap-[12px] sm:gap-[80px]">
            <div className="w-full sm:w-[95px] shrink-0">
                <span
                    className="text-blue-1 text-[20px] font-semibold leading-[21px]"
                    style={{ fontFamily: 'Inter Tight', fontFeatureSettings: "'liga' off, 'clig' off" }}
                >
                    {label}
                </span>
            </div>

            <div className="flex-1 w-full flex justify-between items-center">
                <div>
                    {isLoading ? (
                        <div className="flex items-center gap-[8px]">
                            <span className="text-blue-5 text-[16px] font-medium leading-[19.2px]">
                                {loadingText}
                            </span>
                        </div>
                    ) : hasError ? (
                        <div className="flex items-center gap-[8px]">
                            <span className="text-red-highlight-1 text-[16px] font-medium leading-[19.2px]">
                                {error}
                            </span>
                        </div>
                    ) : showPlaceholder ? (
                        <span
                            className={cn(
                                'text-[16px] font-medium leading-[120%]',
                                isOpen ? 'text-blue-1' : 'text-blue-5 group-hover:text-blue-1'
                            )}
                            style={{ fontFamily: 'Inter Tight', fontFeatureSettings: "'liga' off, 'clig' off" }}
                        >
                            {placeholder}
                        </span>
                    ) : (
                        <div className="text-blue-1 text-[16px] font-medium leading-[19.2px]">
                            {value}
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    {isLoading ? (
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
            <div className={cn('min-h-[80px]', hasValidationError && !isOpen && 'min-h-[120px] sm:min-h-[100px]')}>
                {/* Closed state */}
                {!isOpen && (
                    <div className="flex flex-col">
                        <button
                            type="button"
                            disabled={isDisabled}
                            onClick={handleToggle}
                            className={cn(
                                'group w-full min-h-[80px] px-[16px] sm:px-[25px] py-[15px] flex flex-col justify-center items-start',
                                'rounded-[12px] text-left',
                                'border border-blue-5-transparency-15 bg-white-transparency-40',
                                !isDisabled && 'cursor-pointer hover:bg-white',
                                (hasError || hasValidationError) && 'border-red-highlight-1'
                            )}
                        >
                            {triggerContent}
                        </button>

                        {hasValidationError && (
                            <div className="flex items-center gap-[4px] mt-[8px] pl-[16px] sm:pl-[200px]">
                                <span className="text-red-highlight-2 text-[12px] font-medium leading-normal tracking-[0.36px]">
                                    {validationError}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Open state */}
                {isOpen && (
                    <div
                        className={cn(
                            'absolute left-0 right-0 top-0 w-full',
                            'px-[16px] sm:px-[25px] py-[15px] flex flex-col items-start gap-[15px]',
                            'rounded-[12px]',
                            'border border-blue-5-transparency-15 bg-white-transparency-40',
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
                                <span className="text-blue-5 text-[16px] font-medium leading-[19.2px]">
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
                                    selectedId={selectedId}
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