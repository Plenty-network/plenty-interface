module.exports = {
  NAME: 'Plenty Defi',
  API: {
    url: 'https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false',
    API_KEY: '4824FE50-DB6E-4316-B099-72283C964891',
    tezToolTokenPrice : 'https://api.teztools.io/token/prices'
  },
  RPC_NODES: {
    testnet: 'https://testnet.tezster.tech/',
    //mainnet: 'https://mainnet.smartpy.io/',
    mainnet: 'https://cres2hr8uxm6.midl.dev/',
  },
  TZKT_NODES: {
    mainnet: 'https://api.tzkt.io',
    testnet: 'https://api.florencenet.tzkt.io',
  },
  STAKING_CONTRACTS : {
    POOLS : {
      mainnet : {
        PLENTY : {
          active : [
            {
              address : 'KT1QqjR4Fj9YegB37PQEqXUPHmFbhz6VJtwE',
              mapId : 4494,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
          inactive : [
            {
              address : 'KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T',
              mapId : 3949,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
        },
        USDtz : {
          active : [
            {
              address : 'KT1MBqc3GHpApBXaBZyvY63LF6eoFyTWtySn',
              mapId : 4490,
              decimal : 18,
              tokenDecimal : 6
            }
          ],
          inactive : [
            {
              address : 'KT1K5cgrw1A8WTiizZ5b6TxNdFnBq9AtyQ7X',
              mapId : 3953,
              decimal : 18,
              tokenDecimal : 6
            }
          ],
        },
        ETHtz : {
          active : [
            {
              address : 'KT19asUVzBNidHgTHp8MP31YSphooMb3piWR',
              mapId : 4491,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
          inactive : [
            {
              address : 'KT1J7v85udA8GnaBupacgY9mMvrb8zQdYb3E',
              mapId : 3950,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
        },
        hDAO : {
          active : [
            {
              address : 'KT1Ga15wxGR5oWK1vBG2GXbjYM6WqPgpfRSP',
              mapId : 4496,
              decimal : 18,
              tokenDecimal : 6
            }
          ],
          inactive : [
            {
              address : 'KT1Vs8gqh7YskPnUQMfmjogZh3A5ZLpqQGcg',
              mapId : 3952,
              decimal : 18,
              tokenDecimal : 6
            }
          ],
        },
        wLINK : {
          active : [
            {
              address : 'KT1KyxPitU1xNbTriondmAFtPEcFhjSLV1hz',
              mapId : 4492,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
          inactive : [
            {
              address : 'KT1JCkdS3x5hTWdrTQdzK6vEkeAdQzsm2wzf',
              mapId : 3948,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
        },
        wMATIC : {
          active : [
            {
              address : 'KT1XherecVvrE6X4PV5RTwdEKNzA294ZE9T9',
              mapId : 4493,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
          inactive : [
            {
              address : 'KT1TNzH1KiVsWh9kpFrWACrDNnfK4ihvGAZs',
              mapId : 3947,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
        },
        WRAP : {
          active : [],
          inactive : [
            {
              address : 'KT18oB3x8SLxMJq2o9hKNupbZZ5ZMsgr2aho',
              mapId : 7988,
              decimal : 18,
              tokenDecimal : 18
            }
          ],
        },

      },

    },
    FARMS : {
      mainnet : {
        'PLENTY-XTZ' : {
          active : [
            {
              address : 'KT1JQAZqShNMakSNXc2cgTzdAWZFemGcU6n1',
              mapId : 4503,
              decimal : 18,
              tokenDecimal : 6
            }
          ],
          inactive : [
            {
              address : 'KT1BfQLAsQNX8BjSBzgjTLx3GTd3qhwLoWNz',
              mapId : 3962,
              decimal : 18,
              tokenDecimal : 6
            }
          ]
        },
        'KALAM-XTZ' : {
          active : [],
          inactive : [
            {
            address : 'KT1DjDZio7k2GJwCJCXwK82ing3n51AE55DW',
            mapId : 4488,
            decimal : 18,
            tokenDecimal : 6
            }
          ]
        }
      }
    },
    PONDS : {
      mainnet : {
        WRAP : {
          active : [],
          inactive : [
            {
              address : 'KT1GotpjdBaxt2GiMFcQExLEk9GTfYo4UoTa',
              mapId : 7985,
              decimal : 8,
              tokenDecimal : 18
            }
          ]
        },
        KALAM : {
          active : [],
          inactive : [
            {
              address : 'KT1WfLprabHVTnNhWFigmopAduUpxG5HKvNf',
              mapId : 5137,
              decimal : 10,
              tokenDecimal : 18
            }
          ]
        }
      }
    }
  },
  TOKEN_CONTRACTS : {
    mainnet : {
      'PLENTY' : {
          address : 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
          mapId : 3943,
          decimal : 18,
          type: 'FA1.2',
          tokenId: 0
      },
      'wMATIC' : {
          address : 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
          mapId : 1772,
          decimal : 18,
          type: 'FA2',
          tokenId: 11
      },
      'wLINK' : {
          address : 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
          mapId : 1772,
          decimal : 18,
          type: 'FA2',
          tokenId: 10
      },
      'USDtz' : {
          address : 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
          mapId : 36,
          decimal : 6,
          type: 'FA1.2',
          tokenId: 0
      },
      'ETHtz' : {
          address : 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
          mapId : 199,
          decimal : 18,
          type: 'FA1.2',
          tokenId: 0
      },
      'hDAO' : {
          address : 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
          mapId : 515,
          decimal : 6,
          type: 'FA2',
          tokenId: 0
      },
      'WRAP' : {
          address : 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
          mapId : 1777,
          decimal : 8,
          type: 'FA1.2',
          tokenId: 0
      },
      'KALAM' : {
          address : 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
          mapId : 4178,
          decimal : 10,
          type: 'FA1.2',
          tokenId: 0
      },
      'PLENTY-XTZ' : {
          address : 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
          mapId : 3956,
          decimal : 6,
          type: 'FA1.2',
          tokenId: 0,
      },
      'KALAM-XTZ' : {
          address : 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
          mapId : 4353,
          decimal : 6,
          type: 'FA1.2',
          tokenId: 0,
      }
    }
  },
  SERVERLESS_BASE_URL : {
    mainnet : 'https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1',
    testnet : 'https://testnet.dummy-api.us-east-10.amazonaws.com/v1'
  },
  SERVERLESS_REQUEST : {
    mainnet : {
      'FARMS-ACTIVE' : '/farms/active',
      'FARMS-INACTIVE':'/farms/inactive',
      'POOLS-ACTIVE':'/pools/active',
      'POOLS-INACTIVE':'/pools/inactive',
      'PONDS-ACTIVE':'/ponds/active',
      'PONDS-INACTIVE':'/ponds/inactive'
    },
    testnet : {}
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
  },
  POOLS : {
      mainnet : {
          PLENTY : {
              active : [
                  {
                      TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      CONTRACT: 'KT1QqjR4Fj9YegB37PQEqXUPHmFbhz6VJtwE',
                      DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      TYPE: 'FA1.2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 0,
                      DECIMAL: 18,
                  }
              ],
              inactive : [
                  {
                      TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      CONTRACT: 'KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T',
                      DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      TYPE: 'FA1.2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 0,
                      DECIMAL: 18,
                  }
              ]
          },
          wMATIC : {
              active : [
                  {
                      TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
                      CONTRACT: 'KT1XherecVvrE6X4PV5RTwdEKNzA294ZE9T9',
                      DEX: 'KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S',
                      TYPE: 'FA2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 11,
                      DECIMAL: 18,
                    }
              ],
              inactive : [
                  {
                      TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
                      CONTRACT: 'KT1TNzH1KiVsWh9kpFrWACrDNnfK4ihvGAZs',
                      DEX: 'KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S',
                      TYPE: 'FA2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 11,
                      DECIMAL: 18,
                  }
              ]
          },
          wLINK : {
              active : [
                  {
                      TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
                      CONTRACT: 'KT1KyxPitU1xNbTriondmAFtPEcFhjSLV1hz',
                      DEX: 'KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt',
                      TYPE: 'FA2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 10,
                      DECIMAL: 18,
                  }
              ],
              inactive : [
                  {
                      TOKEN: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
                      CONTRACT: 'KT1JCkdS3x5hTWdrTQdzK6vEkeAdQzsm2wzf',
                      DEX: 'KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt',
                      TYPE: 'FA2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 10,
                      DECIMAL: 18,
                  }
              ]
          },
          ETHtz : {
              active : [
                  {
                      TOKEN: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
                      CONTRACT: 'KT19asUVzBNidHgTHp8MP31YSphooMb3piWR',
                      DEX: 'KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo',
                      TYPE: 'FA1.2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 0,
                      DECIMAL: 18,
                  },
              ],
              inactive : [
                  {
                      TOKEN: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
                      CONTRACT: 'KT1J7v85udA8GnaBupacgY9mMvrb8zQdYb3E',
                      DEX: 'KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo',
                      TYPE: 'FA1.2',
                      TOKEN_DECIMAL: 18,
                      TOKEN_ID: 0,
                      DECIMAL: 18,
                  },
              ]
          },
          hDAO : {
            active : [
                {
                    TOKEN: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
                    CONTRACT: 'KT1Ga15wxGR5oWK1vBG2GXbjYM6WqPgpfRSP',
                    DEX: 'KT1QxLqukyfohPV5kPkw97Rs6cw1DDDvYgbB',
                    TYPE: 'FA2',
                    TOKEN_DECIMAL: 6,
                    TOKEN_ID: 0,
                    DECIMAL: 18,
                },
            ],
            inactive : [
                {
                    TOKEN: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
                    CONTRACT: 'KT1Vs8gqh7YskPnUQMfmjogZh3A5ZLpqQGcg',
                    DEX: 'KT1QxLqukyfohPV5kPkw97Rs6cw1DDDvYgbB',
                    TYPE: 'FA2',
                    TOKEN_DECIMAL: 6,
                    TOKEN_ID: 0,
                    DECIMAL: 18,
                },
            ]
          },
          USDtz : {
              active : [
                  {
                      TOKEN: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
                      CONTRACT: 'KT1MBqc3GHpApBXaBZyvY63LF6eoFyTWtySn',
                      DEX: 'KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb',
                      TYPE: 'FA1.2',
                      TOKEN_DECIMAL: 6,
                      TOKEN_ID: 0,
                      DECIMAL: 18,
                  }
              ],
              inactive : [
                  {
                      TOKEN: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
                      CONTRACT: 'KT1K5cgrw1A8WTiizZ5b6TxNdFnBq9AtyQ7X',
                      DEX: 'KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb',
                      TYPE: 'FA1.2',
                      TOKEN_DECIMAL: 6,
                      TOKEN_ID: 0,
                      DECIMAL: 18,
                  }
              ]
          },
          WRAP : {
              active : [],
              inactive : [
                  {
                      TOKEN: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
                      CONTRACT: 'KT18oB3x8SLxMJq2o9hKNupbZZ5ZMsgr2aho',
                      DEX: 'KT1FG63hhFtMEEEtmBSX2vuFmP87t9E7Ab4t',
                      TYPE: 'FA2',
                      TOKEN_DECIMAL: 8,
                      TOKEN_ID: 0,
                      DECIMAL: 18,
                  }
              ]
          }
      },
      testnet : {}
  },
  FARMS : {
      mainnet : {
          'PLENTY - XTZ' : {
              active : [
                  {
                      LP_TOKEN: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      CONTRACT: 'KT1JQAZqShNMakSNXc2cgTzdAWZFemGcU6n1',
                      DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      CARD_TYPE : 'PLENTY / XTZ LP',
                      TOKEN_DECIMAL: 6,
                      TYPE: 'FA1.2',
                      LP_DECIMAL: 18,
                      TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      DECIMAL: 18,
                      withdrawalFeeType : 'type2'
                  }
              ],
              inactive : [
                  {
                      LP_TOKEN: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      CONTRACT: 'KT1BfQLAsQNX8BjSBzgjTLx3GTd3qhwLoWNz',
                      DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      CARD_TYPE : 'PLENTY / XTZ LP',
                      TOKEN_DECIMAL: 6,
                      TYPE: 'FA1.2',
                      LP_DECIMAL: 18,
                      TEMP_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      DECIMAL: 18,
                  }
              ]
          },
          'KALAM - XTZ' : {
              active : [],
              inactive : [
                  {
                      LP_TOKEN: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
                      CONTRACT: 'KT1DjDZio7k2GJwCJCXwK82ing3n51AE55DW',
                      DEX: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
                      TOKEN_ADDRESS: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      CARD_TYPE : 'KALAM / XTZ LP',
                      TOKEN_DECIMAL: 6,
                      TYPE: 'FA2',
                      TOKEN_ID: 0,
                      LP_DECIMAL: 12,
                      TEMP_ADDRESS: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
                      DECIMAL: 18,
                  }
              ]
          },
          "PLENTY - wBUSD": {
            active: [
              {
                LP_TOKEN: "KT1UC3vcVZ4K9b39uQxaMNA2N1RuJXKLCnoA",
                CONTRACT: "KT1KJhxkCpZNwAFQURDoJ79hGqQgSC9UaWpG",
                DEX: "KT1XXAavg3tTj12W1ADvd3EEnm1pu6XTmiEF",
                TOKEN_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
                CARD_TYPE: "PLENTY / wBUSD LP",
                TOKEN_DECIMAL: 12,
                TYPE: "FA1.2",
                LP_DECIMAL: 18,
                TEMP_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
                DECIMAL: 18,
              },
            ],
            inactive: [],
          },
          "PLENTY - wUSDC": {
            active: [
              {
                LP_TOKEN: "KT1Gz1mx1jm7JHqU7GuMVWF6soB9RjsfLN3o",
                CONTRACT: "KT1VV1ZG2phFCWjPGkqZ9DQ9JXJJGK7P54Fs",
                DEX: "KT1PuPNtDFLR6U7e7vDuxunDoKasVT6kMSkz",
                TOKEN_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
                CARD_TYPE: "PLENTY / wUSDC LP",
                TOKEN_DECIMAL: 12,
                TYPE: "FA1.2",
                LP_DECIMAL: 12,
                TEMP_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
                DECIMAL: 18,
              },
            ],
            inactive: [],
          },
      },
      testnet : {}
  },
  PONDS : {
      mainnet : {
          KALAM : {
              active : [],
              inactive : [
                  {
                      REWARD_TOKEN: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
                      STAKING_TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      STAKING_CONTRACT: 'KT1WfLprabHVTnNhWFigmopAduUpxG5HKvNf',
                      STAKING_TOKEN_DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      REWARD_TOKEN_DEX: 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
                      STAKING_TOKEN_DECIMAL: 18,
                      REWARD_TOKEN_DECIMAL: 10,
                      TYPE: 'FA1.2',
                  }
              ],
          },
          WRAP : {
              active : [
                  {
                      REWARD_TOKEN: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
                      STAKING_TOKEN: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
                      STAKING_CONTRACT: 'KT1GotpjdBaxt2GiMFcQExLEk9GTfYo4UoTa',
                      STAKING_TOKEN_DEX: 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
                      REWARD_TOKEN_DEX: 'KT1FG63hhFtMEEEtmBSX2vuFmP87t9E7Ab4t',
                      STAKING_TOKEN_DECIMAL: 18,
                      REWARD_TOKEN_DECIMAL: 8,
                      TYPE: 'FA1.2',
                  }
              ],
              inactive : []
          }
      },
      testnet : {}
  },
  withdrawalFeeDistribution: {
    type1: [
      { block: 4096, rate: 25 },
      { block: 8192, rate: 12.5 },
      { block: 12288, rate: 7.5 },
      { block: 16384, rate: 2.5 },
    ],
    type2 : [
      { block: 12288, rate: 4 },
      { block: 12288, rate: 0 },
    ]
  },
  NETWORK: 'mainnet',
  WALLET_NETWORK: 'mainnet',
  ADMIN_ADDRESS: 'KT1GpTEq4p2XZ8w9p5xM7Wayyw5VR7tb3UaW',
  BURNER: 'tz1ZnK6zYJrC9PfKCPryg9tPW6LrERisTGtg',
};
