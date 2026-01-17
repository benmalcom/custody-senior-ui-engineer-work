import type { SelectOption } from './SelectField'
import type { Asset } from '@/api/assets'
import type { Vault } from '@/api/vaults'
import { User, Vault as VaultIcon } from 'lucide-react'
import { FILTER_TABS } from '@/constants/form'

interface Address {
    address: string
    name: string
    isExternal: boolean
    isVault: boolean
    vaultId: string
}

export function buildFromOptions(vaults: Vault[] | undefined): SelectOption[] {
    if (!vaults) return []

    return vaults.map((vault) => ({
        id: vault.id,
        label: vault.name,
        filterIds: [FILTER_TABS.VAULTS],
    }))
}

export function buildAssetOptions(
    assets: Asset[] | undefined,
    getNetworkName: (networkId: string) => string
): SelectOption[] {
    if (!assets) return []

    return assets.map((asset) => ({
        id: asset.id,
        label: asset.symbol,
        sublabel: getNetworkName(asset.networkId),
        balance: '24.38 ' + asset.symbol,
        balanceUsd: '$876.72',
        icon: (
            <img
                src={asset.logoUri}
                alt={asset.symbol}
                className="h-[30px] w-[30px] rounded-full"
                onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/30'
                }}
            />
        ),
    }))
}

export function buildToOptions(
    allAddresses: Address[],
    selectedVaultId: string | undefined,
    selectedAsset: Asset | undefined,
    getNetworkName: (networkId: string) => string
): SelectOption[] {
    return allAddresses
        .filter((addr) => {
            // Exclude the source vault from destinations
            if (addr.isVault && addr.vaultId === selectedVaultId) {
                return false
            }
            return true
        })
        .map((addr) => {
            const filterIds: string[] = []
            if (addr.isVault) filterIds.push(FILTER_TABS.VAULTS)
            if (!addr.isExternal && !addr.isVault) filterIds.push(FILTER_TABS.INTERNAL)
            if (addr.isExternal) filterIds.push(FILTER_TABS.EXTERNAL)

            // Vaults don't show sublabel, wallets show network name
            const sublabel = addr.isVault ? undefined : getNetworkName(selectedAsset?.networkId || '')

            return {
                id: addr.address,
                label: addr.name,
                sublabel,
                address: addr.address,
                filterIds,
                icon: addr.isVault ? (
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#688199]/20">
                        <VaultIcon className="h-[16px] w-[16px] text-[#191925]" />
                    </div>
                ) : (
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#688199]/20">
                        <User className="h-[16px] w-[16px] text-[#191925]" />
                    </div>
                ),
            }
        })
}

export function buildToFilterTabs(allAddresses: Address[], selectedVaultId: string | undefined) {
    const filteredAddresses = allAddresses.filter((a) => !(a.isVault && a.vaultId === selectedVaultId))
    const vaultCount = filteredAddresses.filter((a) => a.isVault).length
    const internalCount = filteredAddresses.filter((a) => !a.isExternal && !a.isVault).length
    const externalCount = filteredAddresses.filter((a) => a.isExternal).length

    return [
        { id: FILTER_TABS.VAULTS, label: 'Vaults', count: vaultCount },
        { id: FILTER_TABS.INTERNAL, label: 'Internal Whitelist', count: internalCount },
        { id: FILTER_TABS.EXTERNAL, label: 'External Whitelist', count: externalCount },
    ]
}
