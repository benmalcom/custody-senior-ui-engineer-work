interface AssetIconProps {
  logoUri: string
  symbol: string
}

export function AssetIcon({ logoUri, symbol }: AssetIconProps) {
  return (
    <img
      src={logoUri}
      alt={symbol}
      className="h-[30px] w-[30px] rounded-full"
      onError={(e) => {
        e.currentTarget.src = 'https://via.placeholder.com/30'
      }}
    />
  )
}
