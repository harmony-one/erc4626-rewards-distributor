export const toChainlinkPrice = (value: number) =>  {
    // @ts-ignore
    return parseInt(value * Math.pow(10, 8))
}

const commonParams = {
    maxCumulativeDeltaDiff: 250,
}

export const tokens = [
    {
        name: "Wrapped ONE",
        symbol: "ONE",
        decimals: 18,
        address: "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
        isWrapped: true,
        baseSymbol: "ONE",
        imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
        coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
        isV1Available: true,
        defaultPrice: toChainlinkPrice(0.0145),
        fastPricePrecision: 10000000,
        ...commonParams
    },
    {
        name: "Tether",
        symbol: "USDT",
        decimals: 6,
        address: "0xF2732e8048f1a411C63e2df51d08f4f52E598005",
        isStable: true,
        isV1Available: true,
        imageUrl: "https://etherscan.io/token/images/tethernew_32.png",
        coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
        explorerUrl: "https://explorer.harmony.one/token/0xF2732e8048f1a411C63e2df51d08f4f52E598005",
        defaultPrice: toChainlinkPrice(1),
        fastPricePrecision: 1000,
        ...commonParams
    },
    {
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        address: "0xBC594CABd205bD993e7FfA6F3e9ceA75c1110da5",
        isStable: true,
        isV1Available: true,
        imageUrl: "https://etherscan.io/token/images/centre-usdc_28.png",
        coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
        explorerUrl: "https://explorer.harmony.one/token/0xBC594CABd205bD993e7FfA6F3e9ceA75c1110da5",
        defaultPrice: toChainlinkPrice(1),
        fastPricePrecision: 1000,
        ...commonParams
    },
    {
        name: "Wrapped BTC",
        symbol: "WBTC",
        assetSymbol: "WBTC",
        decimals: 8,
        address: "0x118f50d23810c5E09Ebffb42d7D3328dbF75C2c2",
        isStable: false,
        isV1Available: true,
        imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
        coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
        explorerUrl: "https://explorer.harmony.one/token/0x118f50d23810c5E09Ebffb42d7D3328dbF75C2c2",
        defaultPrice: toChainlinkPrice(63599),
        fastPricePrecision: 1000,
        ...commonParams
    },
    {
        name: "Ethereum",
        symbol: "ETH",
        assetSymbol: "1ETH",
        decimals: 18,
        address: "0x4cC435d7b9557d54d6EF02d69Bbf72634905Bf11",
        isStable: false,
        isV1Available: true,
        imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
        coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
        explorerUrl: "https://explorer.harmony.one/token/0x4cC435d7b9557d54d6EF02d69Bbf72634905Bf11",
        defaultPrice: toChainlinkPrice(3405),
        fastPricePrecision: 1000,
        ...commonParams
    },
]