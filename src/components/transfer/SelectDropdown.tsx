import { cn } from '@/components/utils'
import { Search } from 'lucide-react'
import { useState, useMemo, type ReactNode, type MouseEvent } from 'react'
import { FilterIcon, InfoIcon } from '@/components/icons'

export interface FilterTab {
    id: string
    label: string
    count: number
}

export interface SelectOption {
    id: string
    label: string
    sublabel?: string
    icon?: ReactNode
    address?: string
    balance?: string
    balanceUsd?: string
    filterIds?: string[]
}

interface SelectDropdownProps {
    options: SelectOption[]
    filterTabs?: FilterTab[]
    onSelect: (option: SelectOption) => void
    searchPlaceholder?: string
    showSearch?: boolean
    showFilter?: boolean
    showInfoIcon?: boolean
}

export function SelectDropdown({
                                   options,
                                   filterTabs,
                                   onSelect,
                                   searchPlaceholder = 'Search',
                                   showSearch = true,
                                   showFilter = true,
                                   showInfoIcon = false,
                               }: SelectDropdownProps) {
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState<string>('all')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const filteredOptions = useMemo(() => {
        let filtered = options

        if (search) {
            const searchLower = search.toLowerCase()
            filtered = filtered.filter(
                (opt) =>
                    opt.label.toLowerCase().includes(searchLower) ||
                    opt.sublabel?.toLowerCase().includes(searchLower) ||
                    opt.address?.toLowerCase().includes(searchLower)
            )
        }

        if (activeFilter !== 'all' && filterTabs) {
            filtered = filtered.filter((opt) => opt.filterIds?.includes(activeFilter))
        }

        return filtered
    }, [options, search, activeFilter, filterTabs])

    const stopPropagation = (e: MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className="w-full flex flex-col gap-[15px]" onClick={stopPropagation}>
            {/* Search and Filter Row */}
            {showSearch && (
                <div className="flex justify-start items-center gap-[10px] ml-[175px]">
                    {/* Search Input */}
                    <div
                        className="flex-1 h-[40px] px-[10px] py-[12px] flex items-center gap-[10px] rounded-[9px] border border-[rgba(104,129,153,0.30)]"
                        onClick={stopPropagation}
                    >
                        <Search className="w-[21px] h-[21px] text-[#191925]" strokeWidth={1.5} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={stopPropagation}
                            placeholder={searchPlaceholder}
                            className="flex-1 bg-transparent text-[#191925] text-[16px] font-medium leading-[19.2px] outline-none placeholder:text-[#90a0af]"
                        />
                    </div>

                    {/* Filter Button */}
                    {showFilter && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsFilterOpen(!isFilterOpen)
                            }}
                            className={cn(
                                "h-[40px] px-[15px] py-[12px] flex justify-center items-center gap-[10px] rounded-[9px] backdrop-blur-[7.5px] cursor-pointer transition-colors",
                                isFilterOpen
                                    ? "bg-[rgba(104,129,153,0.30)] hover:bg-[rgba(104,129,153,0.40)]"
                                    : "bg-[rgba(104,129,153,0.15)] hover:bg-[rgba(104,129,153,0.25)]"
                            )}
                        >
              <span className="text-[#191925] text-[16px] font-medium leading-[19.2px]">
                Filter
              </span>
                            <FilterIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {/* Filter Tabs */}
            {filterTabs && filterTabs.length > 0 && isFilterOpen && (
                <div className="flex h-[40px] p-[5px] justify-between items-center rounded-[12px] border border-[rgba(104,129,153,0.15)] bg-[rgba(255,255,255,0.40)] backdrop-blur-[20px] ml-[175px]">
                    <div className="h-[36px] flex justify-start items-center">
                        {/* All tab */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setActiveFilter('all')
                            }}
                            className={cn(
                                'h-[30px] px-[10px] py-[7px] rounded-[9px] flex justify-center items-center gap-[5px] cursor-pointer transition-colors',
                                activeFilter === 'all'
                                    ? 'bg-[#CBDBEB]'
                                    : ''
                            )}
                        >
                            <span
                                className={cn(
                                    'text-[16px] leading-[120%]',
                                    activeFilter === 'all'
                                        ? 'text-[#05284B] font-semibold'
                                        : 'text-[#688199] font-medium'
                                )}
                                style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                            >
                                All
                            </span>
                            <div className="flex w-[16px] h-[20px] rotate-90 px-[3px] py-[8px] flex-col justify-center items-center gap-[10px] rounded-[7.177px] bg-[#90A0AF] overflow-hidden">
                                <div className="-rotate-90 text-center flex flex-col justify-end text-white text-[12px] font-medium tracking-[0.36px]">
                                    {options.length}
                                </div>
                            </div>
                        </button>

                        {filterTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveFilter(tab.id)
                                }}
                                className={cn(
                                    'h-[30px] px-[10px] py-[7px] rounded-[9px] flex justify-center items-center gap-[5px] cursor-pointer transition-colors',
                                    activeFilter === tab.id
                                        ? 'bg-[#CBDBEB]'
                                        : ''
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-[16px] leading-[120%]',
                                        activeFilter === tab.id
                                            ? 'text-[#05284B] font-semibold'
                                            : 'text-[#688199] font-medium'
                                    )}
                                    style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
                                >
                                    {tab.label}
                                </span>
                                <div className="flex w-[16px] h-[20px] rotate-90 px-[3px] py-[8px] flex-col justify-center items-center gap-[10px] rounded-[7.177px] bg-[#90A0AF] overflow-hidden">
                                    <div className="-rotate-90 text-center flex flex-col justify-end text-white text-[12px] font-medium tracking-[0.36px]">
                                        {tab.count}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Info Icon */}
                    {showInfoIcon && (
                        <button
                            type="button"
                            onClick={stopPropagation}
                            className="h-[34px] px-[10px] py-[7px] rounded-[9px] flex justify-center items-center gap-[10px] transition-colors cursor-pointer"
                        >
                            <InfoIcon />
                        </button>
                    )}
                </div>
            )}

            {/* Options List */}
            <div className="flex flex-col gap-[5px] max-h-[250px] overflow-y-auto ml-[175px]">
                {filteredOptions.length === 0 ? (
                    <div className="w-full h-[55px] p-[10px] flex justify-center items-center">
            <span className="text-[#688199] text-[16px] font-medium leading-[19.2px]">
              No results found
            </span>
                    </div>
                ) : (
                    filteredOptions.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onSelect(option)
                            }}
                            className={cn(
                                'w-full h-[55px] p-[10px] flex justify-between items-center',
                                'rounded-[9px] bg-[rgba(255,255,255,0.40)]',
                                'cursor-pointer transition-colors duration-200',
                                'border border-transparent',
                                'hover:bg-white hover:border-[rgba(104,129,153,0.15)]'
                            )}
                        >
                            {/* Left side - Icon and Labels */}
                            <div className="flex justify-start items-center gap-[10px]">
                                {option.icon && (
                                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center shrink-0">
                                        {option.icon}
                                    </div>
                                )}
                                <div className="flex flex-col justify-start items-start">
                  <span className="text-[#191925] text-[16px] font-semibold leading-[19.2px]">
                    {option.label}
                  </span>
                                    {option.sublabel && (
                                        <span className="text-[#688199] text-[14px] font-medium leading-[16.8px]">
                      {option.sublabel}
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* Right side - Balance or Address */}
                            <div className="flex flex-col justify-center items-end">
                                {option.balance ? (
                                    <>
                    <span className="text-[#191925] text-[16px] font-medium leading-[19.2px]">
                      {option.balance}
                    </span>
                                        {option.balanceUsd && (
                                            <span className="text-[#688199] text-[14px] font-medium leading-[16.8px]">
                        {option.balanceUsd}
                      </span>
                                        )}
                                    </>
                                ) : option.address ? (
                                    <span className="text-[#688199] text-[14px] font-medium leading-[16.8px]">
                    {truncateAddress(option.address)}
                  </span>
                                ) : null}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}

function truncateAddress(address: string): string {
    if (address.length <= 20) return address
    return `${address.slice(0, 12)}....${address.slice(-10)}`
}