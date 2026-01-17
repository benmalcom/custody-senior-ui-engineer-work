import { useQuery } from '@tanstack/react-query'
import {
    fetchAssets,
    fetchVaults,
    fetchAccounts,
    fetchAddressesForVault,
    fetchBalancesForVault,
    fetchFee, fetchNetworks,
} from '@/api'

export function useAssets() {
    return useQuery({
        queryKey: ['assets'],
        queryFn: fetchAssets,
        retry: 2,
    })
}

export function useVaults() {
    return useQuery({
        queryKey: ['vaults'],
        queryFn: fetchVaults,
        retry: 2,
    })
}

export function useAccounts() {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts,
        retry: 2,
    })
}

export function useAddresses(networkId: string | undefined, vaultId: string | undefined) {
    return useQuery({
        queryKey: ['addresses', networkId, vaultId],
        queryFn: () => fetchAddressesForVault(networkId!, vaultId!),
        enabled: !!networkId && networkId.length > 0 && !!vaultId && vaultId.length > 0,
        retry: 2,
    })
}

export function useBalances(assetId: string | undefined, vaultId: string | undefined) {
    return useQuery({
        queryKey: ['balances', assetId, vaultId],
        queryFn: () => fetchBalancesForVault(assetId!, vaultId!),
        enabled: !!assetId && assetId.length > 0 && !!vaultId && vaultId.length > 0,
        retry: 2,
        staleTime: 0,
    })
}

export function useFee(assetId: string | undefined) {
    return useQuery({
        queryKey: ['fee', assetId],
        queryFn: () => fetchFee(assetId!),
        enabled: !!assetId && assetId.length > 0,
        retry: 2,
        staleTime: 0,
    })
}

export function useNetworks() {
    return useQuery({
        queryKey: ['networks'],
        queryFn: fetchNetworks,
    })
}