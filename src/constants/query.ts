export const QUERY_CONFIG = {
    DEFAULT_RETRY_COUNT: 2,
    REAL_TIME_STALE_TIME: 0,
} as const

export const QUERY_KEYS = {
    ASSETS: ['assets'] as const,
    VAULTS: ['vaults'] as const,
    ACCOUNTS: ['accounts'] as const,
    NETWORKS: ['networks'] as const,
    addresses: (networkId: string, vaultId: string) => ['addresses', networkId, vaultId] as const,
    balances: (assetId: string, vaultId: string) => ['balances', assetId, vaultId] as const,
    fee: (assetId: string) => ['fee', assetId] as const,
} as const
