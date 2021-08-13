module.exports = {
	NAME: "Plenty Defi",
	API: {
		url: "https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false",
		API_KEY: "4824FE50-DB6E-4316-B099-72283C964891",
		tezToolTokenPrice: "https://api.teztools.io/token/prices",
	},
	RPC_NODES: {
		testnet: "https://testnet.tezster.tech/",
		mainnet: "https://mainnet.smartpy.io/",
	},
	TZKT_NODES: {
		mainnet: "https://api.tzkt.io",
		testnet: "https://api.florencenet.tzkt.io",
	},
	SERVERLESS_BASE_URL: {
		mainnet: "https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1",
		testnet: "https://testnet.dummy-api.us-east-10.amazonaws.com/v1",
	},
	SERVERLESS_REQUEST: {
		mainnet: {
			"FARMS-ACTIVE": "/farms/active",
			"FARMS-INACTIVE": "/farms/inactive",
			"POOLS-ACTIVE": "/pools/active",
			"POOLS-INACTIVE": "/pools/inactive",
			"PONDS-ACTIVE": "/ponds/active",
			"PONDS-INACTIVE": "/ponds/inactive",
		},
		testnet: {},
	},
	AMM: {
		testnet: {
			PLENTY: {
				ICON: "",
				TOKEN_CONTRACT: "KT1TbkspJ8AzLmNs3ko9xr46ZE4zLpyZu9tX",
				READ_TYPE: "FA1.2",
				CALL_TYPE: "FA1.2",
				TOKEN_ID: 0,
				TOKEN_DECIMAL: 18,
				DEX_PAIRS: {
					wDAI: {
						contract: "KT1Qc52zbRaKi5cwCBnx8o4FSDbdxuePLqYB",
						property: "token2_pool",
						liquidityToken: "PltDaiLp",
					},
					WRAP: {
						contract: "KT1HePFs4aA5u6A5BDw3ot7LuXvqa4ebqrTQ",
						property: "token2_pool",
						liquidityToken: "WrapLP",
					},
				},
			},
			WRAP: {
				ICON: "",
				TOKEN_CONTRACT: "KT1L1xYJit22TmuhDXaeng4AZDhRqZwcacNj",
				READ_TYPE: "FA1.2",
				TOKEN_ID: 0,
				TOKEN_DECIMAL: 8,
				CALL_TYPE: "FA2",
				DEX_PAIRS: {
					wDAI: {
						contract: "KT1PnFKMA2v1ngvYUh5UKtaDuM5WxskrunFm",
						property: "token1_pool",
						liquidityToken: "WrapDaiLp",
					},
					PLENTY: {
						contract: "KT1HePFs4aA5u6A5BDw3ot7LuXvqa4ebqrTQ",
						property: "token1_pool",
						liquidityToken: "WrapLP",
					},
				},
			},
			wDAI: {
				ICON: "",
				TOKEN_CONTRACT: "KT1DJwRryZ11dGDnqmmRtTiSsgxQDY4bw3j4",
				READ_TYPE: "FA2",
				TOKEN_ID: 0,
				TOKEN_DECIMAL: 18,
				CALL_TYPE: "FA2",
				DEX_PAIRS: {
					PLENTY: {
						contract: "KT1Qc52zbRaKi5cwCBnx8o4FSDbdxuePLqYB",
						property: "token1_pool",
						liquidityToken: "PltDaiLp",
					},
					WRAP: {
						contract: "KT1PnFKMA2v1ngvYUh5UKtaDuM5WxskrunFm",
						property: "token2_pool",
						liquidityToken: "WrapDaiLp",
					},
				},
			},
			WrapLP: {
				ICON: "",
				TOKEN_CONTRACT: "KT1LHy8buFGtsZJjMc4C89Wk8VTowqaUwPbY",
				READ_TYPE: "FA1.2",
				TOKEN_ID: 0,
				TOKEN_DECIMAL: 13,
				CALL_TYPE: "FA1.2",
			},
			PltDaiLp: {
				ICON: "",
				TOKEN_CONTRACT: "KT1CAmNNoetuxeYZWJLSmbh9N66SDYT8tkBJ",
				READ_TYPE: "FA1.2",
				TOKEN_ID: 0,
				TOKEN_DECIMAL: 13,
				CALL_TYPE: "FA1.2",
			},
			WrapDaiLp: {
				ICON: "",
				TOKEN_CONTRACT: "KT1LcFzpTtkDtZwHty12PSuEsscxMPtdA2ZR",
				READ_TYPE: "FA1.2",
				TOKEN_ID: 0,
				TOKEN_DECIMAL: 13,
				CALL_TYPE: "FA1.2",
			},
		},
	},
	POOLS: {
		mainnet: {
			PLENTY: {
				active: [
					{
						TOKEN: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						CONTRACT: "KT1QqjR4Fj9YegB37PQEqXUPHmFbhz6VJtwE",
						DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
				inactive: [
					{
						TOKEN: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						CONTRACT: "KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T",
						DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
			},
			wMATIC: {
				active: [
					{
						TOKEN: "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
						CONTRACT: "KT1XherecVvrE6X4PV5RTwdEKNzA294ZE9T9",
						DEX: "KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S",
						TYPE: "FA2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 11,
						DECIMAL: 18,
					},
				],
				inactive: [
					{
						TOKEN: "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
						CONTRACT: "KT1TNzH1KiVsWh9kpFrWACrDNnfK4ihvGAZs",
						DEX: "KT1RsfuBee5o7GtYrdB7bzQ1M6oVgyBnxY4S",
						TYPE: "FA2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 11,
						DECIMAL: 18,
					},
				],
			},
			wLINK: {
				active: [
					{
						TOKEN: "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
						CONTRACT: "KT1KyxPitU1xNbTriondmAFtPEcFhjSLV1hz",
						DEX: "KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt",
						TYPE: "FA2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 10,
						DECIMAL: 18,
					},
				],
				inactive: [
					{
						TOKEN: "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
						CONTRACT: "KT1JCkdS3x5hTWdrTQdzK6vEkeAdQzsm2wzf",
						DEX: "KT1Lpysr4nzcFegC9ci9kjoqVidwoanEmJWt",
						TYPE: "FA2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 10,
						DECIMAL: 18,
					},
				],
			},
			ETHtz: {
				active: [
					{
						TOKEN: "KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8",
						CONTRACT: "KT19asUVzBNidHgTHp8MP31YSphooMb3piWR",
						DEX: "KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
				inactive: [
					{
						TOKEN: "KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8",
						CONTRACT: "KT1J7v85udA8GnaBupacgY9mMvrb8zQdYb3E",
						DEX: "KT1Evsp2yA19Whm24khvFPcwimK6UaAJu8Zo",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
			},
			USDtz: {
				active: [
					{
						TOKEN: "KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9",
						CONTRACT: "KT1MBqc3GHpApBXaBZyvY63LF6eoFyTWtySn",
						DEX: "KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 6,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
				inactive: [
					{
						TOKEN: "KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9",
						CONTRACT: "KT1K5cgrw1A8WTiizZ5b6TxNdFnBq9AtyQ7X",
						DEX: "KT1WxgZ1ZSfMgmsSDDcUn8Xn577HwnQ7e1Lb",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 6,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
			},
			PLENTY: {
				active: [
					{
						TOKEN: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						CONTRACT: "KT1QqjR4Fj9YegB37PQEqXUPHmFbhz6VJtwE",
						DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
				inactive: [
					{
						TOKEN: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						CONTRACT: "KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T",
						DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						TYPE: "FA1.2",
						TOKEN_DECIMAL: 18,
						TOKEN_ID: 0,
						DECIMAL: 18,
					},
				],
			},
		},
		testnet: {},
	},
	FARMS: {
		mainnet: {
			"PLENTY - XTZ": {
				active: [
					{
						LP_TOKEN: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						CONTRACT: "KT1JQAZqShNMakSNXc2cgTzdAWZFemGcU6n1",
						DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						TOKEN_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						CARD_TYPE: "PLENTY / XTZ LP",
						TOKEN_DECIMAL: 6,
						TYPE: "FA1.2",
						LP_DECIMAL: 18,
						TEMP_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						DECIMAL: 18,
					},
				],
				inactive: [
					{
						LP_TOKEN: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						CONTRACT: "KT1BfQLAsQNX8BjSBzgjTLx3GTd3qhwLoWNz",
						DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						TOKEN_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						CARD_TYPE: "PLENTY / XTZ LP",
						TOKEN_DECIMAL: 6,
						TYPE: "FA1.2",
						LP_DECIMAL: 18,
						TEMP_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						DECIMAL: 18,
					},
				],
			},
			"KALAM - XTZ": {
				active: [],
				inactive: [
					{
						LP_TOKEN: "KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34",
						CONTRACT: "KT1DjDZio7k2GJwCJCXwK82ing3n51AE55DW",
						DEX: "KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34",
						TOKEN_ADDRESS: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						CARD_TYPE: "KALAM / XTZ LP",
						TOKEN_DECIMAL: 6,
						TYPE: "FA2",
						TOKEN_ID: 0,
						LP_DECIMAL: 12,
						TEMP_ADDRESS: "KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT",
						DECIMAL: 18,
					},
				],
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
						REWARD_TOKEN: "KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT",
						STAKING_TOKEN: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						STAKING_CONTRACT: "KT1WfLprabHVTnNhWFigmopAduUpxG5HKvNf",
						STAKING_TOKEN_DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						REWARD_TOKEN_DEX: "KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34",
						STAKING_TOKEN_DECIMAL: 18,
						REWARD_TOKEN_DECIMAL: 10,
						TYPE: "FA1.2",
					},
				],
			},
			WRAP: {
				active: [
					{
						REWARD_TOKEN: "KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd",
						STAKING_TOKEN: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b",
						STAKING_CONTRACT: "KT1GotpjdBaxt2GiMFcQExLEk9GTfYo4UoTa",
						STAKING_TOKEN_DEX: "KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z",
						REWARD_TOKEN_DEX: "KT1FG63hhFtMEEEtmBSX2vuFmP87t9E7Ab4t",
						STAKING_TOKEN_DECIMAL: 18,
						REWARD_TOKEN_DECIMAL: 8,
						TYPE: "FA1.2",
					},
				],
				inactive: [],
			},
		},
		testnet: {},
	},
	withdrawalFeeDistribution: {
		type1: [
			{ block: 4096, rate: 25 },
			{ block: 8192, rate: 12.5 },
			{ block: 12288, rate: 7.5 },
			{ block: 16384, rate: 2.5 },
		],
		type2: [
			{ block: 12288, rate: 4 },
			{ block: 12288, rate: 0 },
		],
	},
	NETWORK: "testnet",
	WALLET_NETWORK: "florencenet",
	ADMIN_ADDRESS: "KT1GpTEq4p2XZ8w9p5xM7Wayyw5VR7tb3UaW",
	BURNER: "tz1ZnK6zYJrC9PfKCPryg9tPW6LrERisTGtg",
}
