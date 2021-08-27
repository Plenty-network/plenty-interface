module.exports = {
  NAME: 'Plenty Defi',
  API: {
    url: 'https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false',
    API_KEY: '4824FE50-DB6E-4316-B099-72283C964891',
    tezToolTokenPrice: 'https://api.teztools.io/token/prices',
  },
  RPC_NODES: {
    testnet: 'https://testnet.tezster.tech/',
    //mainnet: 'https://mainnet.smartpy.io/',
    mainnet: 'https://tezos-prod.cryptonomic-infra.tech/',
  },
  TZKT_NODES: {
    mainnet: 'https://api.tzkt.io',
    testnet: 'https://api.florencenet.tzkt.io',
  },
  STAKING_CONTRACTS: {
    POOLS: {
      mainnet: {
        PLENTY: {
          active: [
            {
              address: 'KT1QqjR4Fj9YegB37PQEqXUPHmFbhz6VJtwE',
              mapId: 4494,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
          inactive: [
            {
              address: 'KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T',
              mapId: 3949,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
        },
        USDtz: {
          active: [
            {
              address: 'KT1MBqc3GHpApBXaBZyvY63LF6eoFyTWtySn',
              mapId: 4490,
              decimal: 18,
              tokenDecimal: 6,
            },
          ],
          inactive: [
            {
              address: 'KT1K5cgrw1A8WTiizZ5b6TxNdFnBq9AtyQ7X',
              mapId: 3953,
              decimal: 18,
              tokenDecimal: 6,
            },
          ],
        },
        ETHtz: {
          active: [
            {
              address: 'KT19asUVzBNidHgTHp8MP31YSphooMb3piWR',
              mapId: 4491,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
          inactive: [
            {
              address: 'KT1J7v85udA8GnaBupacgY9mMvrb8zQdYb3E',
              mapId: 3950,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
        },
        hDAO: {
          active: [
            {
              address: 'KT1Ga15wxGR5oWK1vBG2GXbjYM6WqPgpfRSP',
              mapId: 4496,
              decimal: 18,
              tokenDecimal: 6,
            },
          ],
          inactive: [
            {
              address: 'KT1Vs8gqh7YskPnUQMfmjogZh3A5ZLpqQGcg',
              mapId: 3952,
              decimal: 18,
              tokenDecimal: 6,
            },
          ],
        },
        wLINK: {
          active: [
            {
              address: 'KT1KyxPitU1xNbTriondmAFtPEcFhjSLV1hz',
              mapId: 4492,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
          inactive: [
            {
              address: 'KT1JCkdS3x5hTWdrTQdzK6vEkeAdQzsm2wzf',
              mapId: 3948,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
        },
        wMATIC: {
          active: [
            {
              address: 'KT1XherecVvrE6X4PV5RTwdEKNzA294ZE9T9',
              mapId: 4493,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
          inactive: [
            {
              address: 'KT1TNzH1KiVsWh9kpFrWACrDNnfK4ihvGAZs',
              mapId: 3947,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
        },
        WRAP: {
          active: [],
          inactive: [
            {
              address: 'KT18oB3x8SLxMJq2o9hKNupbZZ5ZMsgr2aho',
              mapId: 7988,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
        },
      },
    },
    FARMS: {
      mainnet: {
        'PLENTY - XTZ': {
          active: [
            {
              address: 'KT1JQAZqShNMakSNXc2cgTzdAWZFemGcU6n1',
              mapId: 4503,
              decimal: 18,
              tokenDecimal: 6,
            },
          ],
          inactive: [
            {
              address: 'KT1BfQLAsQNX8BjSBzgjTLx3GTd3qhwLoWNz',
              mapId: 3962,
              decimal: 18,
              tokenDecimal: 6,
            },
          ],
        },
        'KALAM - XTZ': {
          active: [],
          inactive: [
            {
              address: 'KT1DjDZio7k2GJwCJCXwK82ing3n51AE55DW',
              mapId: 4488,
              decimal: 18,
              tokenDecimal: 10,
            },
          ],
        },
        'PLENTY - wBUSD': {
          active: [
            {
              address: 'KT1KJhxkCpZNwAFQURDoJ79hGqQgSC9UaWpG',
              mapId: 10768,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
          inactive: [],
        },
        'PLENTY - wUSDC': {
          active: [
            {
              address: 'KT1Kp3KVT4nHFmSuL8bvETkgQzseUYP3LDBy',
              mapId: 11019,
              decimal: 18,
              tokenDecimal: 12,
            },
          ],
          inactive: [],
        },
        'PLENTY - wWBTC': {
          active: [
            {
              address: 'KT1M82a7arHVwcwaswnNUUuCnQ45xjjGKNd1',
              mapId: 11057,
              decimal: 18,
              tokenDecimal: 13,
            },
          ],
          inactive: [],
        },
        'PLENTY - wMATIC': {
          active: [
            {
              address: 'KT1UP9XHQigWMqNXYp9YXaCS1hV9jJkCF4h4',
              mapId: 11823,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
          inactive: [],
        },
        'PLENTY - wLINK': {
          active: [
            {
              address: 'KT1UqnQ6b1EwQgYiKss4mDL7aktAHnkdctTQ',
              mapId: 11819,
              decimal: 18,
              tokenDecimal: 18,
            },
          ],
          inactive: [],
        },
        'PLENTY - USDtz': {
          active: [
            {
              address: 'KT1VCrmywPNf8ZHH95HKHvYA4bBQJPa8g2sr',
              mapId: 11821,
              decimal: 18,
              tokenDecimal: 12,
            },
          ],
          inactive: [],
        },
      },
    },
    PONDS: {
      mainnet: {
        WRAP: {
          active: [],
          inactive: [
            {
              address: 'KT1GotpjdBaxt2GiMFcQExLEk9GTfYo4UoTa',
              mapId: 7985,
              decimal: 8,
              tokenDecimal: 18,
            },
          ],
        },
        KALAM: {
          active: [],
          inactive: [
            {
              address: 'KT1WfLprabHVTnNhWFigmopAduUpxG5HKvNf',
              mapId: 5137,
              decimal: 10,
              tokenDecimal: 18,
            },
          ],
        },
      },
    },
  },
  TOKEN_CONTRACTS: {
    mainnet: {
      PLENTY: {
        address: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
        mapId: 3943,
        decimal: 18,
        type: 'FA1.2',
        tokenId: 0,
      },
      wMATIC: {
        address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        decimal: 18,
        type: 'FA2',
        tokenId: 11,
      },
      wLINK: {
        address: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId: 1772,
        decimal: 18,
        type: 'FA2',
        tokenId: 10,
      },
      USDtz: {
        address: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
        mapId: 36,
        decimal: 6,
        type: 'FA1.2',
        tokenId: 0,
      },
      ETHtz: {
        address: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
        mapId: 199,
        decimal: 18,
        type: 'FA1.2',
        tokenId: 0,
      },
      hDAO: {
        address: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
        mapId: 515,
        decimal: 6,
        type: 'FA2',
        tokenId: 0,
      },
      WRAP: {
        address: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
        mapId: 1777,
        decimal: 8,
        type: 'FA1.2',
        tokenId: 0,
      },
      KALAM: {
        address: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
        mapId: 4178,
        decimal: 10,
        type: 'FA1.2',
        tokenId: 0,
      },
      'PLENTY - XTZ': {
        address: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
        mapId: 3956,
        decimal: 6,
        type: 'FA1.2',
        tokenId: 0,
      },
      'KALAM - XTZ': {
        address: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
        mapId: 4353,
        decimal: 6,
        type: 'FA1.2',
        tokenId: 0,
      },
      'PLENTY - wBUSD': {
        address: 'KT1UC3vcVZ4K9b39uQxaMNA2N1RuJXKLCnoA',
        mapId: 10749,
        decimal: 18,
        type: 'FA1.2',
        tokenId: 0,
      },
      'PLENTY - wUSDC': {
        address: 'KT1Gz1mx1jm7JHqU7GuMVWF6soB9RjsfLN3o',
        mapId: 10755,
        decimal: 12,
        type: 'FA1.2',
        tokenId: 0,
      },
      'PLENTY - wWBTC': {
        address: 'KT1La1qZiJtDRcd9ek8w5KYD47i9MQqAQHmP',
        mapId: 11051,
        decimal: 13,
        type: 'FA1.2',
        tokenId: 0,
      },
      'PLENTY - wMATIC': {
        address: 'KT1WCGPFvy97wwGxewKfvTr1QYPvpEgUKToS',
        mapId: 11807,
        decimal: 18,
        type: 'FA1.2',
        tokenId: 0,
      },
      'PLENTY - wLINK': {
        address: 'KT1Brqb3JvXNKzwjW82F8pUAxQ7ipCfApWki',
        mapId: 11811,
        decimal: 18,
        type: 'FA1.2',
        tokenId: 0,
      },
      'PLENTY - USDtz': {
        address: 'KT18qSo4Ch2Mfq4jP3eME7SWHB8B8EDTtVBu',
        mapId: 11814,
        decimal: 12,
        type: 'FA1.2',
        tokenId: 0,
      },
    },
  },
  SERVERLESS_BASE_URL: {
    mainnet: 'https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1',
    testnet: 'https://testnet.dummy-api.us-east-10.amazonaws.com/v1',
  },
  SERVERLESS_REQUEST: {
    mainnet: {
      'FARMS-ACTIVE': '/farms/active',
      'FARMS-INACTIVE': '/farms/inactive',
      'POOLS-ACTIVE': '/pools/active',
      'POOLS-INACTIVE': '/pools/inactive',
      'PONDS-ACTIVE': '/ponds/active',
      'PONDS-INACTIVE': '/ponds/inactive',
    },
    testnet: {},
  },
  AMM: {
    testnet: {
      PLENTY: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1TbkspJ8AzLmNs3ko9xr46ZE4zLpyZu9tX',
        READ_TYPE: 'FA1.2',
        CALL_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        DEX_PAIRS: {
          wDAI: {
            contract: 'KT1Qc52zbRaKi5cwCBnx8o4FSDbdxuePLqYB',
            property: 'token2_pool',
            liquidityToken: 'PltDaiLp',
          },
          WRAP: {
            contract: 'KT1HePFs4aA5u6A5BDw3ot7LuXvqa4ebqrTQ',
            property: 'token2_pool',
            liquidityToken: 'WrapLP',
          },
        },
      },
      WRAP: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1L1xYJit22TmuhDXaeng4AZDhRqZwcacNj',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 8,
        CALL_TYPE: 'FA2',
        DEX_PAIRS: {
          wDAI: {
            contract: 'KT1PnFKMA2v1ngvYUh5UKtaDuM5WxskrunFm',
            property: 'token1_pool',
            liquidityToken: 'WrapDaiLp',
          },
          PLENTY: {
            contract: 'KT1HePFs4aA5u6A5BDw3ot7LuXvqa4ebqrTQ',
            property: 'token1_pool',
            liquidityToken: 'WrapLP',
          },
        },
      },
      wDAI: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1DJwRryZ11dGDnqmmRtTiSsgxQDY4bw3j4',
        READ_TYPE: 'FA2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        CALL_TYPE: 'FA2',
        DEX_PAIRS: {
          PLENTY: {
            contract: 'KT1Qc52zbRaKi5cwCBnx8o4FSDbdxuePLqYB',
            property: 'token1_pool',
            liquidityToken: 'PltDaiLp',
          },
          WRAP: {
            contract: 'KT1PnFKMA2v1ngvYUh5UKtaDuM5WxskrunFm',
            property: 'token2_pool',
            liquidityToken: 'WrapDaiLp',
          },
        },
      },
      WrapLP: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1LHy8buFGtsZJjMc4C89Wk8VTowqaUwPbY',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 13,
        CALL_TYPE: 'FA1.2',
      },
      PltDaiLp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1CAmNNoetuxeYZWJLSmbh9N66SDYT8tkBJ',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 13,
        CALL_TYPE: 'FA1.2',
      },
      WrapDaiLp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1LcFzpTtkDtZwHty12PSuEsscxMPtdA2ZR',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 13,
        CALL_TYPE: 'FA1.2',
      },
    },
    mainnet: {
      PLENTY: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
        READ_TYPE: 'FA1.2',
        CALL_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        DEX_PAIRS: {
          wUSDC: {
            contract: 'KT1PuPNtDFLR6U7e7vDuxunDoKasVT6kMSkz',
            property: 'token2_pool',
            liquidityToken: 'PlentywUSDClp',
          },
          wBUSD: {
            contract: 'KT1XXAavg3tTj12W1ADvd3EEnm1pu6XTmiEF',
            property: 'token2_pool',
            liquidityToken: 'PlentywBUSDlp',
          },
          wWBTC: {
            contract: 'KT19Dskaofi6ZTkrw3Tq4pK7fUqHqCz4pTZ3',
            property: 'token2_pool',
            liquidityToken: 'PlentywWBTClp',
          },
          wMATIC: {
            contract: 'KT1VeNQa4mucRj36qAJ9rTzm4DTJKfemVaZT',
            property: 'token2_pool',
            liquidityToken: 'PlentywMaticlp',
          },
          wLINK: {
            contract: 'KT1XVrXmWY9AdVri6KpxKo4CWxizKajmgzMt',
            property: 'token2_pool',
            liquidityToken: 'Plentywlinklp',
          },
          USDtz: {
            contract: 'KT1D36ZG99YuhoCRZXLL86tQYAbv36bCq9XM',
            property: 'token2_pool',
            liquidityToken: 'Plentyusdtzlp',
          },
        },
      },
      wUSDC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        READ_TYPE: 'FA2',
        CALL_TYPE: 'FA2',
        TOKEN_ID: 17,
        TOKEN_DECIMAL: 6,
        DEX_PAIRS: {
          PLENTY: {
            contract: 'KT1PuPNtDFLR6U7e7vDuxunDoKasVT6kMSkz',
            property: 'token1_pool',
            liquidityToken: 'PlentywUSDClp',
          },
          USDtz: {
            contract: 'KT1EJMMismkf6TQdMzgx8hb1HpiiRVV8ZSm4',
            property: 'token2_pool',
            liquidityToken: 'wUSDC-USDtz-LP',
          },
        },
      },
      wBUSD: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        READ_TYPE: 'FA2',
        CALL_TYPE: 'FA2',
        TOKEN_ID: 1,
        TOKEN_DECIMAL: 18,
        DEX_PAIRS: {
          PLENTY: {
            contract: 'KT1XXAavg3tTj12W1ADvd3EEnm1pu6XTmiEF',
            property: 'token1_pool',
            liquidityToken: 'PlentywBUSDlp',
          },
        },
      },
      wWBTC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        READ_TYPE: 'FA2',
        CALL_TYPE: 'FA2',
        TOKEN_ID: 19,
        TOKEN_DECIMAL: 8,
        DEX_PAIRS: {
          PLENTY: {
            contract: 'KT19Dskaofi6ZTkrw3Tq4pK7fUqHqCz4pTZ3',
            property: 'token1_pool',
            liquidityToken: 'PlentywWBTClp',
          },
        },
      },
      wMATIC: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        READ_TYPE: 'FA2',
        CALL_TYPE: 'FA2',
        TOKEN_ID: 11,
        TOKEN_DECIMAL: 18,
        DEX_PAIRS: {
          PLENTY: {
            contract: 'KT1VeNQa4mucRj36qAJ9rTzm4DTJKfemVaZT',
            property: 'token1_pool',
            liquidityToken: 'PlentywMaticlp',
          },
        },
      },
      wLINK: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        READ_TYPE: 'FA2',
        CALL_TYPE: 'FA2',
        TOKEN_ID: 10,
        TOKEN_DECIMAL: 18,
        DEX_PAIRS: {
          PLENTY: {
            contract: 'KT1XVrXmWY9AdVri6KpxKo4CWxizKajmgzMt',
            property: 'token1_pool',
            liquidityToken: 'Plentywlinklp',
          },
        },
      },
      USDtz: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
        READ_TYPE: 'FA1.2',
        CALL_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 6,
        DEX_PAIRS: {
          PLENTY: {
            contract: 'KT1D36ZG99YuhoCRZXLL86tQYAbv36bCq9XM',
            property: 'token1_pool',
            liquidityToken: 'Plentyusdtzlp',
          },
          kUSD: {
            contract: 'KT1TnsQ6JqzyTz5PHMsGj28WwJyBtgc146aJ',
            property: 'token1_pool',
            liquidityToken: 'kUSD-USDtz-LP',
          },
          wUSDC: {
            contract: 'KT1EJMMismkf6TQdMzgx8hb1HpiiRVV8ZSm4',
            property: 'token1_pool',
            liquidityToken: 'wUSDC-USDtz-LP',
          },
        },
      },
      kUSD: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        READ_TYPE: 'FA1.2',
        CALL_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        DEX_PAIRS: {
          USDtz: {
            contract: 'KT1TnsQ6JqzyTz5PHMsGj28WwJyBtgc146aJ',
            property: 'token2_pool',
            liquidityToken: 'kUSD-USDtz-LP',
          },
        },
      },
      PlentywUSDClp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1Gz1mx1jm7JHqU7GuMVWF6soB9RjsfLN3o',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 12,
        CALL_TYPE: 'FA1.2',
      },
      PlentywBUSDlp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1UC3vcVZ4K9b39uQxaMNA2N1RuJXKLCnoA',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        CALL_TYPE: 'FA1.2',
      },
      PlentywWBTClp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1La1qZiJtDRcd9ek8w5KYD47i9MQqAQHmP',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 13,
        CALL_TYPE: 'FA1.2',
      },
      PlentywMaticlp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1WCGPFvy97wwGxewKfvTr1QYPvpEgUKToS',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        CALL_TYPE: 'FA1.2',
      },
      Plentywlinklp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT1Brqb3JvXNKzwjW82F8pUAxQ7ipCfApWki',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 18,
        CALL_TYPE: 'FA1.2',
      },
      Plentyusdtzlp: {
        ICON: '',
        TOKEN_CONTRACT: 'KT18qSo4Ch2Mfq4jP3eME7SWHB8B8EDTtVBu',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 12,
        CALL_TYPE: 'FA1.2',
      },
      'kUSD-USDtz-LP': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1HEdGi7rq1zgZ68dhAtKMZYKeD3EM5vYdf',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 12,
        CALL_TYPE: 'FA1.2',
      },
      'wUSDC-USDtz-LP': {
        ICON: '',
        TOKEN_CONTRACT: 'KT1FaoPYSyT4itmgTncvdshV7SeqqXk9RJXd',
        READ_TYPE: 'FA1.2',
        TOKEN_ID: 0,
        TOKEN_DECIMAL: 6,
        CALL_TYPE: 'FA1.2',
      },
    },
  },
  POOLS: {
    mainnet: {
      PLENTY: {
        active: [
          {
            TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CONTRACT: 'KT1QqjR4Fj9YegB37PQEqXUPHmFbhz6VJtwE',
            DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            TYPE: 'FA1.2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 0,
            DECIMAL: 18,
            CARD_TYPE: 'PLENTY',
            withdrawalFeeType: 'type1',
          },
        ],
        inactive: [
          {
            TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CONTRACT: 'KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T',
            DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            TYPE: 'FA1.2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 0,
            DECIMAL: 18,
            CARD_TYPE: 'PLENTY',
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 9',
          },
        ],
      },
      wMATIC: {
        active: [
          {
            TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
            CONTRACT: 'KT1XherecVvrE6X4PV5RTwdEKNzA294ZE9T9',
            DEX: 'KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S',
            TYPE: 'FA2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 11,
            DECIMAL: 18,

            CARD_TYPE: 'wMATIC',
            withdrawalFeeType: 'type1',
            message: 'Staking disabled - Rewards end August 26',
          },
        ],
        inactive: [
          {
            TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
            CONTRACT: 'KT1TNzH1KiVsWh9kpFrWACrDNnfK4ihvGAZs',
            DEX: 'KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S',
            TYPE: 'FA2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 11,
            DECIMAL: 18,

            CARD_TYPE: 'wMATIC',
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 9',
          },
        ],
      },
      wLINK: {
        active: [
          {
            TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
            CONTRACT: 'KT1KyxPitU1xNbTriondmAFtPEcFhjSLV1hz',
            DEX: 'KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt',
            TYPE: 'FA2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 10,
            DECIMAL: 18,

            CARD_TYPE: 'wLINK',
            withdrawalFeeType: 'type1',
            message: 'Staking disabled - Rewards end August 26',
          },
        ],
        inactive: [
          {
            TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
            CONTRACT: 'KT1JCkdS3x5hTWdrTQdzK6vEkeAdQzsm2wzf',
            DEX: 'KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt',
            TYPE: 'FA2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 10,
            DECIMAL: 18,

            CARD_TYPE: 'wLINK',
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 9',
          },
        ],
      },
      ETHtz: {
        active: [
          {
            TOKEN: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
            CONTRACT: 'KT19asUVzBNidHgTHp8MP31YSphooMb3piWR',
            DEX: 'KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo',
            TYPE: 'FA1.2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 0,
            DECIMAL: 18,

            CARD_TYPE: 'ETHtz',
            withdrawalFeeType: 'type1',
            message: 'Rewards end September 2',
          },
        ],
        inactive: [
          {
            TOKEN: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
            CONTRACT: 'KT1J7v85udA8GnaBupacgY9mMvrb8zQdYb3E',
            DEX: 'KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo',
            TYPE: 'FA1.2',
            TOKEN_DECIMAL: 18,
            TOKEN_ID: 0,
            DECIMAL: 18,

            CARD_TYPE: 'ETHtz',
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 9',
          },
        ],
      },
      hDAO: {
        active: [
          {
            TOKEN: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
            CONTRACT: 'KT1Ga15wxGR5oWK1vBG2GXbjYM6WqPgpfRSP',
            DEX: 'KT1QxLqukyfohPV5kPkw97Rs6cw1DDDvYgbB',
            TYPE: 'FA2',
            TOKEN_DECIMAL: 6,
            TOKEN_ID: 0,
            DECIMAL: 18,

            CARD_TYPE: 'hDAO',
            withdrawalFeeType: 'type1',
            message: 'Rewards end September 2',
          },
        ],
        inactive: [
          {
            TOKEN: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
            CONTRACT: 'KT1Vs8gqh7YskPnUQMfmjogZh3A5ZLpqQGcg',
            DEX: 'KT1QxLqukyfohPV5kPkw97Rs6cw1DDDvYgbB',
            TYPE: 'FA2',
            TOKEN_DECIMAL: 6,
            TOKEN_ID: 0,
            DECIMAL: 18,

            CARD_TYPE: 'hDAO',
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 9',
          },
        ],
      },
      USDtz: {
        active: [
          {
            TOKEN: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
            CONTRACT: 'KT1MBqc3GHpApBXaBZyvY63LF6eoFyTWtySn',
            DEX: 'KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb',
            TYPE: 'FA1.2',
            TOKEN_DECIMAL: 6,
            TOKEN_ID: 0,
            DECIMAL: 18,

            CARD_TYPE: 'USDtz',
            withdrawalFeeType: 'type1',
            message: 'Staking disabled - Rewards end August 26',
          },
        ],
        inactive: [
          {
            TOKEN: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
            CONTRACT: 'KT1K5cgrw1A8WTiizZ5b6TxNdFnBq9AtyQ7X',
            DEX: 'KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb',
            TYPE: 'FA1.2',
            TOKEN_DECIMAL: 6,
            TOKEN_ID: 0,
            DECIMAL: 18,

            CARD_TYPE: 'USDtz',
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 9',
          },
        ],
      },
      WRAP: {
        active: [],
        inactive: [
          {
            TOKEN: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
            CONTRACT: 'KT18oB3x8SLxMJq2o9hKNupbZZ5ZMsgr2aho',
            DEX: 'KT1FG63hhFtMEEEtmBSX2vuFmP87t9E7Ab4t',
            TYPE: 'FA2',
            TOKEN_DECIMAL: 8,
            TOKEN_ID: 0,
            DECIMAL: 18,
            CARD_TYPE: 'WRAP',
            withdrawalFeeType: 'type1',
            message: 'Rewards ended August 11',
          },
        ],
      },
    },
    testnet: {},
  },
  FARMS: {
    mainnet: {
      'PLENTY - XTZ': {
        active: [
          {
            LP_TOKEN: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            CONTRACT: 'KT1JQAZqShNMakSNXc2cgTzdAWZFemGcU6n1',
            DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / XTZ LP',
            TOKEN_DECIMAL: 6,
            TYPE: 'FA1.2',
            LP_DECIMAL: 18,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type2',
          },
        ],
        inactive: [
          {
            LP_TOKEN: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            CONTRACT: 'KT1BfQLAsQNX8BjSBzgjTLx3GTd3qhwLoWNz',
            DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / XTZ LP',
            TOKEN_DECIMAL: 6,
            TYPE: 'FA1.2',
            LP_DECIMAL: 18,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 9',
          },
        ],
      },
      'KALAM - XTZ': {
        active: [],
        inactive: [
          {
            LP_TOKEN: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
            CONTRACT: 'KT1DjDZio7k2GJwCJCXwK82ing3n51AE55DW',
            DEX: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'KALAM / XTZ LP',
            TOKEN_DECIMAL: 6,
            TYPE: 'FA2',
            TOKEN_ID: 0,
            LP_DECIMAL: 12,
            TEMP_ADDRESS: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
            DECIMAL: 18,
            withdrawalFeeType: 'type3',
            message: 'Rewards ended June 22',
          },
        ],
      },
      'PLENTY - wBUSD': {
        active: [
          {
            LP_TOKEN: 'KT1UC3vcVZ4K9b39uQxaMNA2N1RuJXKLCnoA',
            CONTRACT: 'KT1KJhxkCpZNwAFQURDoJ79hGqQgSC9UaWpG',
            DEX: 'KT1XXAavg3tTj12W1ADvd3EEnm1pu6XTmiEF',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / wBUSD LP',
            TOKEN_DECIMAL: 18,
            TYPE: 'FA1.2',
            LP_DECIMAL: 18,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type2',
          },
        ],
        inactive: [],
      },
      'PLENTY - wUSDC': {
        active: [
          {
            LP_TOKEN: 'KT1Gz1mx1jm7JHqU7GuMVWF6soB9RjsfLN3o',
            CONTRACT: 'KT1Kp3KVT4nHFmSuL8bvETkgQzseUYP3LDBy',
            DEX: 'KT1PuPNtDFLR6U7e7vDuxunDoKasVT6kMSkz',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / wUSDC LP',
            TOKEN_DECIMAL: 12,
            TYPE: 'FA1.2',
            LP_DECIMAL: 12,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type2',
          },
        ],
        inactive: [],
      },
      'PLENTY - wWBTC': {
        active: [
          {
            LP_TOKEN: 'KT1La1qZiJtDRcd9ek8w5KYD47i9MQqAQHmP',
            CONTRACT: 'KT1M82a7arHVwcwaswnNUUuCnQ45xjjGKNd1',
            DEX: 'KT19Dskaofi6ZTkrw3Tq4pK7fUqHqCz4pTZ3',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / wWBTC LP',
            TOKEN_DECIMAL: 13,
            TYPE: 'FA1.2',
            LP_DECIMAL: 12,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type2',
          },
        ],
        inactive: [],
      },
      'PLENTY - wMATIC': {
        active: [
          {
            LP_TOKEN: 'KT1WCGPFvy97wwGxewKfvTr1QYPvpEgUKToS',
            CONTRACT: 'KT1UP9XHQigWMqNXYp9YXaCS1hV9jJkCF4h4',
            DEX: 'KT1VeNQa4mucRj36qAJ9rTzm4DTJKfemVaZT',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / wMATIC LP',
            TOKEN_DECIMAL: 18,
            TYPE: 'FA1.2',
            LP_DECIMAL: 12,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type2',
          },
        ],
        inactive: [],
      },
      'PLENTY - wLINK': {
        active: [
          {
            LP_TOKEN: 'KT1Brqb3JvXNKzwjW82F8pUAxQ7ipCfApWki',
            CONTRACT: 'KT1UqnQ6b1EwQgYiKss4mDL7aktAHnkdctTQ',
            DEX: 'KT1XVrXmWY9AdVri6KpxKo4CWxizKajmgzMt',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / wLINK LP',
            TOKEN_DECIMAL: 18,
            TYPE: 'FA1.2',
            LP_DECIMAL: 12,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type2',
          },
        ],
        inactive: [],
      },
      'PLENTY - USDtz': {
        active: [
          {
            LP_TOKEN: 'KT18qSo4Ch2Mfq4jP3eME7SWHB8B8EDTtVBu',
            CONTRACT: 'KT1VCrmywPNf8ZHH95HKHvYA4bBQJPa8g2sr',
            DEX: 'KT1D36ZG99YuhoCRZXLL86tQYAbv36bCq9XM',
            TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            CARD_TYPE: 'PLENTY / USDtz LP',
            TOKEN_DECIMAL: 12,
            TYPE: 'FA1.2',
            LP_DECIMAL: 12,
            TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            DECIMAL: 18,
            withdrawalFeeType: 'type2',
          },
        ],
        inactive: [],
      },
    },
    testnet: {},
  },
  PONDS: {
    mainnet: {
      KALAM: {
        active: [],
        inactive: [
          {
            REWARD_TOKEN: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
            STAKING_TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            STAKING_CONTRACT: 'KT1WfLprabHVTnNhWFigmopAduUpxG5HKvNf',
            STAKING_TOKEN_DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            REWARD_TOKEN_DEX: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
            STAKING_TOKEN_DECIMAL: 18,
            REWARD_TOKEN_DECIMAL: 10,
            TYPE: 'FA1.2',
            CARD_TYPE: 'KALAM',
          },
        ],
      },
      WRAP: {
        active: [],
        inactive: [
          {
            REWARD_TOKEN: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
            STAKING_TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
            STAKING_CONTRACT: 'KT1GotpjdBaxt2GiMFcQExLEk9GTfYo4UoTa',
            STAKING_TOKEN_DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
            REWARD_TOKEN_DEX: 'KT1FG63hhFtMEEEtmBSX2vuFmP87t9E7Ab4t',
            STAKING_TOKEN_DECIMAL: 18,
            REWARD_TOKEN_DECIMAL: 8,
            TYPE: 'FA1.2',
            CARD_TYPE: 'WRAP',
          },
        ],
      },
    },
    testnet: {},
  },
  withdrawalFeeDistribution: {
    type1: [
      { block: 8192, rate: 25, duration: '< 3 days' },
      { block: 16384, rate: 12.5, duration: '< 6 days' },
      { block: 24576, rate: 10, duration: '< 9 days' },
      { block: 24576, rate: 4, duration: '> 9 days' },
    ],
    type2: [
      { block: 24576, rate: 4, duration: '< 9 days' },
      { block: 24576, rate: 0, duration: '> 9 days' },
    ],
    type3: [{ block: 0, rate: 0, duration: '> 0 days' }],
    type4: [
      { block: 8192, rate: 25, duration: '< 3 days' },
      { block: 16384, rate: 12.5, duration: '< 6 days' },
      { block: 24576, rate: 10, duration: '< 9 days' },
      { block: 24576, rate: 2, duration: '> 9 days' },
    ],
  },
  NETWORK: 'mainnet',
  WALLET_NETWORK: 'mainnet',
  ADMIN_ADDRESS: 'KT1GpTEq4p2XZ8w9p5xM7Wayyw5VR7tb3UaW',
  BURNER: 'tz1ZnK6zYJrC9PfKCPryg9tPW6LrERisTGtg',
};
