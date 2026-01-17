import { useQuery } from '@tanstack/react-query'
import {
    fetchAssets,
    fetchVaults,
    fetchAccounts,
    fetchAddressesForVault,
    fetchBalancesForVault,
    fetchFee,
    fetchNetworks,
} from '@/api'
import { QUERY_CONFIG, QUERY_KEYS } from '@/constants/query'

export function useAssets() {
    return useQuery({
        queryKey: QUERY_KEYS.ASSETS,
        queryFn: fetchAssets,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    })
}

export function useVaults() {
    return useQuery({
        queryKey: QUERY_KEYS.VAULTS,
        queryFn: fetchVaults,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    })
}

export function useAccounts() {
    return useQuery({
        queryKey: QUERY_KEYS.ACCOUNTS,
        queryFn: fetchAccounts,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    })
}

export function useAddresses(networkId: string | undefined, vaultId: string | undefined) {
    return useQuery({
        queryKey: networkId && vaultId ? QUERY_KEYS.addresses(networkId, vaultId) : ['addresses', networkId, vaultId],
        queryFn: () => {
            if (!networkId || !vaultId) {
                throw new Error('networkId and vaultId are required')
            }
            return fetchAddressesForVault(networkId, vaultId)
        },
        enabled: !!networkId && networkId.length > 0 && !!vaultId && vaultId.length > 0,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
    })
}

export function useBalances(assetId: string | undefined, vaultId: string | undefined) {
    return useQuery({
        queryKey: assetId && vaultId ? QUERY_KEYS.balances(assetId, vaultId) : ['balances', assetId, vaultId],
        queryFn: () => {
            if (!assetId || !vaultId) {
                throw new Error('assetId and vaultId are required')
            }
            return fetchBalancesForVault(assetId, vaultId)
        },
        enabled: !!assetId && assetId.length > 0 && !!vaultId && vaultId.length > 0,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
        staleTime: QUERY_CONFIG.REAL_TIME_STALE_TIME,
    })
}

export function useFee(assetId: string | undefined) {
    return useQuery({
        queryKey: assetId ? QUERY_KEYS.fee(assetId) : ['fee', assetId],
        queryFn: () => {
            if (!assetId) {
                throw new Error('assetId is required')
            }
            return fetchFee(assetId)
        },
        enabled: !!assetId && assetId.length > 0,
        retry: QUERY_CONFIG.DEFAULT_RETRY_COUNT,
        staleTime: QUERY_CONFIG.REAL_TIME_STALE_TIME,
    })
}

export function useNetworks() {
    return useQuery({
        queryKey: QUERY_KEYS.NETWORKS,
        queryFn: fetchNetworks,
    })
}