module.exports = {
    NAME: 'Plenty Defi',
    API: {
        url:
            'https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false',
        API_KEY: '4824FE50-DB6E-4316-B099-72283C964891',
    },
    RPC_NODES: {
        testnet: 'https://testnet-tezos.giganode.io/',
        mainnet: 'https://mainnet-tezos.giganode.io/',
    },
    TZKT_NODES: {
        mainnet: 'https://api.tzkt.io',
        testnet: 'https://api.florencenet.tzkt.io',
    },
    CONTRACT: {
        testnet: {
            POOLS: {
                PLENTY: {
                    TOKEN: 'KT1JCq5sWnE8EivqhY7RuNSHgC5injKYLUCT',
                    CONTRACT: 'KT1RA4WgHFCP33WTV1QiBeNebimxS57kbcV7',
                    DEX: 'KT1SVjwMhHjokd6iJY6XZAk6p1T1hfuNYHkr',
                    TYPE: 'FA1.2',
                    TOKEN_DECIMAL: 18,
                },
                wBUSD: {
                    TOKEN: 'KT1E9sVkhpWTArYktCT2y6HYXMQvttzrpG9t',
                    CONTRACT: 'KT1EMet7icBnyfD6WDPKAizF4sFNEmKPJcfq',
                    DEX: 'KT1MxGmZ9UWourzGPmvXNuVLHZzr1ecjTYzU',
                    TYPE: 'FA1.2',
                    TOKEN_DECIMAL: 18,
                },
                ETHtz: {
                    TOKEN: 'KT1DJwRryZ11dGDnqmmRtTiSsgxQDY4bw3j4',
                    CONTRACT: 'KT1P2sbrXteRQDxLwzUTtPoUw71DxH1EEnGz',
                    DEX: 'KT1FkFC5ovz9UrGoQJLd5hyjmz6aSnASTDsx',
                    TYPE: 'FA2',
                    TOKEN_DECIMAL: 18,
                    TOKEN_ID: 0,
                },
            },
            FARMS: {
                'PLENTY - XTZ': {
                    LP_TOKEN: 'KT1SVjwMhHjokd6iJY6XZAk6p1T1hfuNYHkr',
                    CONTRACT: 'KT1R3WLa7QsDvNLScGTKhAV1PDWHZcQzVUsZ',
                    DEX: 'KT1SVjwMhHjokd6iJY6XZAk6p1T1hfuNYHkr',
                    TOKEN_DECIMAL: 18,
                },
            },
        },
        mainnet: {
            POOLS: {
                PLENTY: {
                    TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                    CONTRACT: 'KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T',
                    DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                    TYPE: 'FA1.2',
                    TOKEN_DECIMAL: 18,
                    TOKEN_ID: 0,
                },
                wMATIC: {
                    TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
                    CONTRACT: 'KT1TNzH1KiVsWh9kpFrWACrDNnfK4ihvGAZs',
                    DEX: 'KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S',
                    TYPE: 'FA2',
                    TOKEN_DECIMAL: 18,
                    TOKEN_ID: 11,
                },
                wLINK: {
                    TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
                    CONTRACT: 'KT1JCkdS3x5hTWdrTQdzK6vEkeAdQzsm2wzf',
                    DEX: 'KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt',
                    TYPE: 'FA2',
                    TOKEN_DECIMAL: 18,
                    TOKEN_ID: 10,
                },
                USDtz: {
                    TOKEN: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
                    CONTRACT: 'KT1K5cgrw1A8WTiizZ5b6TxNdFnBq9AtyQ7X',
                    DEX: 'KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb',
                    TYPE: 'FA1.2',
                    TOKEN_DECIMAL: 6,
                    TOKEN_ID: 0,
                },
                ETHtz: {
                    TOKEN: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
                    CONTRACT: 'KT1J7v85udA8GnaBupacgY9mMvrb8zQdYb3E',
                    DEX: 'KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo',
                    TYPE: 'FA1.2',
                    TOKEN_DECIMAL: 18,
                    TOKEN_ID: 0,
                },
                hDAO: {
                    TOKEN: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
                    CONTRACT: 'KT1Vs8gqh7YskPnUQMfmjogZh3A5ZLpqQGcg',
                    DEX: 'KT1QxLqukyfohPV5kPkw97Rs6cw1DDDvYgbB',
                    TYPE: 'FA2',
                    TOKEN_DECIMAL: 6,
                    TOKEN_ID: 0,
                },
            },
            FARMS: {
                'PLENTY - XTZ': {
                    LP_TOKEN: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                    CONTRACT: 'KT1BfQLAsQNX8BjSBzgjTLx3GTd3qhwLoWNz',
                    DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                    TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                    TOKEN_DECIMAL: 18,
                },
            },
        },
    },
    withdrawalFeeDistribution: {
        testnet: [
            { block: 4096, rate: 25 },
            { block: 8192, rate: 12.5 },
            { block: 12288, rate: 7.5 },
            { block: 16384, rate: 2.5 },
        ],
        mainnet: [],
    },
    NETWORK: 'mainnet',
    WALLET_NETWORK: 'mainnet',
    ADMIN_ADDRESS: 'KT1MKwzJqCeUSLCbL6GaEKb77mjSufPFGjoN',
    ENCRYPTION_STRING: 'b2b70775aa6e8545ed6d9751ab92273fbc6b1fa9',
};
