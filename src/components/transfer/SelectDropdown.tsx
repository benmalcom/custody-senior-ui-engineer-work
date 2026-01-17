import { cn } from '@/components/utils'
import { Search, Info } from 'lucide-react'
import { useState, useMemo, type ReactNode, type MouseEvent } from 'react'
import { FilterIcon } from '@/components/icons'

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
                <div className="w-full flex justify-start items-center gap-[10px]">
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
                            onClick={stopPropagation}
                            className="h-[40px] px-[15px] py-[12px] flex justify-center items-center gap-[10px] rounded-[9px] bg-[rgba(104,129,153,0.15)] backdrop-blur-[7.5px] cursor-pointer hover:bg-[rgba(104,129,153,0.25)] transition-colors"
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
            {filterTabs && filterTabs.length > 0 && (
                <div className="w-full flex justify-start items-center gap-[5px] flex-wrap">
                    {/* All tab */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            setActiveFilter('all')
                        }}
                        className={cn(
                            'h-[32px] px-[10px] rounded-[6px] flex justify-center items-center gap-[5px] cursor-pointer transition-colors',
                            activeFilter === 'all'
                                ? 'bg-[rgba(104,129,153,0.20)]'
                                : 'hover:bg-[rgba(104,129,153,0.10)]'
                        )}
                    >
                        <span className="text-[#191925] text-[14px] font-medium leading-[16.8px]">All</span>
                        <span
                            className={cn(
                                'px-[6px] py-[2px] rounded-[4px] text-[12px] font-semibold',
                                activeFilter === 'all'
                                    ? 'bg-[#191925] text-white'
                                    : 'bg-[rgba(104,129,153,0.30)] text-[#191925]'
                            )}
                        >
              {options.length}
            </span>
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
                                'h-[32px] px-[10px] rounded-[6px] flex justify-center items-center gap-[5px] cursor-pointer transition-colors',
                                activeFilter === tab.id
                                    ? 'bg-[rgba(104,129,153,0.20)]'
                                    : 'hover:bg-[rgba(104,129,153,0.10)]'
                            )}
                        >
              <span className="text-[#191925] text-[14px] font-medium leading-[16.8px]">
                {tab.label}
              </span>
                            <span
                                className={cn(
                                    'px-[6px] py-[2px] rounded-[4px] text-[12px] font-semibold',
                                    activeFilter === tab.id
                                        ? 'bg-[#191925] text-white'
                                        : 'bg-[rgba(104,129,153,0.30)] text-[#191925]'
                                )}
                            >
                {tab.count}
              </span>
                        </button>
                    ))}

                    {/* Info Icon */}
                    {showInfoIcon && (
                        <button
                            type="button"
                            onClick={stopPropagation}
                            className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[rgba(104,129,153,0.10)] transition-colors cursor-pointer"
                        >
                            <Info className="w-[16px] h-[16px] text-[#688199]" />
                        </button>
                    )}
                </div>
            )}

            {/* Options List */}
            <div className="w-full flex flex-col gap-[5px] max-h-[250px] overflow-y-auto">
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