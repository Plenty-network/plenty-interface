import { TezosParameterFormat, TezosMessageUtils } from "conseiljs"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { TezosToolkit, OpKind } from "@taquito/taquito"
const CONFIG = require("../../../config/config")
const axios = require("axios")

export const getHomeStatsDataApi = async () => {
	const res = await axios.get(
		"https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/homestats"
	)
	if (res.data.success) {
		return {
			success: true,
			data: res.data.body,
		}
	} else {
		return {
			success: false,
		}
	}
}

export const getTVLHelper = async () => {
	const res = await axios.get(
		"https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/tvl"
	)
	if (res.data.success) {
		return {
			success: true,
			data: res.data.body,
		}
	} else {
		return {
			success: false,
		}
	}
}

export const calculateHarvestValue = async (
	stakingContractAddress,
	DECIMAL,
	currentBlockLevel,
	mapId,
	packedAddress
) => {
	try {
		let url = `${
			CONFIG.RPC_NODES[CONFIG.NETWORK]
		}chains/main/blocks/head/context/contracts/${stakingContractAddress}/storage`
		const smartContractResponse = await axios.get(url)
		let periodFinish = smartContractResponse.data.args[1].args[0].args[0].int
		let lastUpdateTime = smartContractResponse.data.args[0].args[2].int
		let rewardRate = smartContractResponse.data.args[1].args[1].int
		let totalSupply = smartContractResponse.data.args[3].int
		let rewardPerTokenStored =
			smartContractResponse.data.args[1].args[0].args[1].int
		if (totalSupply == 0) {
			throw "No One Staked"
		}
		let rewardPerToken = Math.min(currentBlockLevel, parseInt(periodFinish))
		rewardPerToken = rewardPerToken - parseInt(lastUpdateTime)
		rewardPerToken *= parseInt(rewardRate) * Math.pow(10, DECIMAL)
		rewardPerToken =
			rewardPerToken / totalSupply + parseInt(rewardPerTokenStored)
		url = `${
			CONFIG.RPC_NODES[CONFIG.NETWORK]
		}chains/main/blocks/head/context/big_maps/${mapId}/${packedAddress}`
		let bigMapResponse = await axios.get(url)
		let userBalance = bigMapResponse.data.args[0].args[1].int
		let userRewardPaid = bigMapResponse.data.args[3].int
		let rewards = bigMapResponse.data.args[2].int
		let totalRewards =
			parseInt(userBalance) * (rewardPerToken - parseInt(userRewardPaid))
		totalRewards = totalRewards / Math.pow(10, DECIMAL) + parseInt(rewards)
		totalRewards = totalRewards / Math.pow(10, DECIMAL)
		if (totalRewards < 0) {
			totalRewards = 0
		}
		return {
			success: true,
			totalRewards,
			address: stakingContractAddress,
		}
	} catch (error) {
		return {
			success: false,
			totalRewards: 0,
			address: stakingContractAddress,
		}
	}
}

export const getPackedKey = (tokenId, address, type) => {
	const accountHex = `0x${TezosMessageUtils.writeAddress(address)}`
	let packedKey = null
	if (type === "FA2") {
		packedKey = TezosMessageUtils.encodeBigMapKey(
			Buffer.from(
				TezosMessageUtils.writePackedData(
					`(Pair ${accountHex} ${tokenId})`,
					"",
					TezosParameterFormat.Michelson
				),
				"hex"
			)
		)
	} else {
		packedKey = TezosMessageUtils.encodeBigMapKey(
			Buffer.from(
				TezosMessageUtils.writePackedData(
					`${accountHex}`,
					"",
					TezosParameterFormat.Michelson
				),
				"hex"
			)
		)
	}
	return packedKey
}

export const getHarvestValue = async (address, type, isActive) => {
	try {
		let packedKey = getPackedKey(0, address, "FA1.2")
		let blockData = await axios.get(
			`${CONFIG.TZKT_NODES[CONFIG.NETWORK]}/v1/blocks/count`
		)
		let promises = []
		let harvestResponse = {}
		for (let identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK]) {
			for (let i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
				isActive === true ? "active" : "inactive"
			]) {
				promises.push(
					calculateHarvestValue(
						CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
							isActive === true ? "active" : "inactive"
						][i].address,
						CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
							isActive === true ? "active" : "inactive"
						][i].decimal,
						blockData.data,
						CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
							isActive === true ? "active" : "inactive"
						][i].mapId,
						packedKey
					)
				)
			}
		}
		const response = await Promise.all(promises)

		for (let i in response) {
			harvestResponse[response[i].address] = {
				totalRewards: response[i].totalRewards,
			}
		}
		return {
			success: true,
			response: harvestResponse,
		}
	} catch (error) {
		return {
			success: false,
			response: {},
		}
	}
}

export const getBalanceAmount = async (
	mapId,
	packedKey,
	identifier,
	decimal
) => {
	try {
		let balance
		const url = `${
			CONFIG.RPC_NODES[CONFIG.NETWORK]
		}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`
		const response = await axios.get(url)
		if (mapId === 3956 || mapId === 4353) {
			balance = response.data.args[0].args[1].int
		} else if (mapId === 3943) {
			balance = response.data.args[1].int
		} else if (mapId === 199 || mapId === 36) {
			balance = response.data.args[0].int
		} else if (
			mapId === 1777 ||
			mapId === 1772 ||
			mapId === 515 ||
			mapId === 4178
		) {
			balance = response.data.int
		}

		balance = parseInt(balance)
		balance = balance / Math.pow(10, decimal)

		return {
			success: true,
			balance,
			identifier,
		}
	} catch (error) {
		return {
			success: false,
			balance: 0,
			identifier,
			error: error,
		}
	}
}

const CheckIfWalletConnected = async (wallet, somenet) => {
	try {
		const connectedNetwork = CONFIG.NETWORK
		const network = {
			type: connectedNetwork,
		}
		const activeAccount = await wallet.client.getActiveAccount()
		if (!activeAccount) {
			await wallet.client.requestPermissions({
				network,
			})
		}
		return {
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			error,
		}
	}
}

const getAllActiveContractAddresses = async () => {
	let contracts = []
	const connectedNetwork = CONFIG.NETWORK
	for (let x in CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][x]["active"].length > 0
		) {
			for (let y in CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][x][
				"active"
			]) {
				contracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][x]["active"][y][
							"address"
						],
					mapId:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][x]["active"][y][
							"mapId"
						],
				})
			}
		}
	}
	for (let x in CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][x]["active"].length > 0
		) {
			for (let y in CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][x][
				"active"
			]) {
				contracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][x]["active"][y][
							"address"
						],
					mapId:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][x]["active"][y][
							"mapId"
						],
				})
			}
		}
	}
	return contracts
}

const getLpPriceFromDex = async (identifier, dexAddress) => {
	try {
		const response = await axios.get(
			`${
				CONFIG.RPC_NODES[CONFIG.NETWORK]
			}chains/main/blocks/head/context/contracts/${dexAddress}/storage`
		)
		let tez_pool = parseInt(response.data.args[1].args[0].args[1].args[2].int)
		let total_Supply = null
		if (identifier === "PLENTY - XTZ") {
			total_Supply = parseInt(response.data.args[1].args[0].args[4].int)
		} else {
			total_Supply = parseInt(response.data.args[1].args[1].args[0].args[0].int)
		}
		let lpPriceInXtz = (tez_pool * 2) / total_Supply
		return {
			success: true,
			identifier,
			lpPriceInXtz,
			tez_pool,
			total_Supply,
			dexAddress,
		}
	} catch (error) {
		return {
			success: false,
			identifier,
			lpPriceInXtz: 0,
		}
	}
}

export const getStorageForFarms = async isActive => {
	try {
		// let promises = []
		let dexPromises = []
		const xtzPriceResponse = await axios.get(
			"https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
		)
		const xtzPriceInUsd = xtzPriceResponse.data.market_data.current_price.usd
		const tokenPrices = await axios.get("https://api.teztools.io/token/prices")
		const tokenPricesData = tokenPrices.data.contracts
		let priceOfPlenty = 0
		for (let i in tokenPricesData) {
			if (
				tokenPricesData[i].symbol === "PLENTY" &&
				tokenPricesData[i].tokenAddress ===
					"KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b"
			) {
				priceOfPlenty = tokenPricesData[i].usdValue
			}
		}

		for (let key in CONFIG.FARMS[CONFIG.NETWORK]) {
			for (let key1 in CONFIG.FARMS[CONFIG.NETWORK][key][isActive]) {
				if (key === "PLENTY - XTZ" || key === "KALAM - XTZ") {
					dexPromises.push(
						getLpPriceFromDex(
							key,
							CONFIG.FARMS[CONFIG.NETWORK][key][isActive][key1].DEX
						)
					)
				} else if (
					key === "PLENTY - wBUSD" ||
					key === "PLENTY - wUSDC" ||
					key === "PLENTY - wWBTC" ||
					key === "PLENTY - wMATIC" ||
					key === "PLENTY - wLINK" ||
					key === "PLENTY - USDtz"
				) {
					dexPromises.push(
						getPriceForPlentyLpTokens(
							key,
							CONFIG.FARMS[CONFIG.NETWORK][key][isActive][key1].TOKEN_DECIMAL,
							CONFIG.FARMS[CONFIG.NETWORK][key][isActive][key1].DEX
						)
					)
				}
			}
		}
		// console.log(dexPromises, "<-------dexPromises-------->")
		const response = await Promise.all(dexPromises)
		// console.log(response, "<-----Dex Promises Response------->")
		let lpPricesInUsd = {}
		for (let i in response) {
			if (response[i].lpPriceInXtz * xtzPriceInUsd) {
				lpPricesInUsd[response[i].identifier] =
					response[i].lpPriceInXtz * xtzPriceInUsd
			} else {
				lpPricesInUsd[response[i].identifier] = response[i].totalAmount
			}
		}

		return {
			success: true,
			priceOfLPToken: lpPricesInUsd,
		}
	} catch (error) {
		return {
			success: false,
			response: {},
		}
	}
}

const getPriceForPlentyLpTokens = async (
	identifier,
	lpTokenDecimal,
	dexAddress
) => {
	try {
		const connectedNetwork = CONFIG.NETWORK
		const url = CONFIG.RPC_NODES[connectedNetwork]
		const storageResponse = await axios.get(
			`${url}/chains/main/blocks/head/context/contracts/${dexAddress}/storage`
		)
		let token1Pool = parseInt(storageResponse.data.args[1].args[1].int)
		// token1Pool = token1Pool / Math.pow(10, 12);
		let token2Pool = parseInt(storageResponse.data.args[4].int)
		let lpTokenTotalSupply = parseInt(storageResponse.data.args[5].int)

		let token1Address = storageResponse.data.args[0].args[2].string.toString()
		// let token1Id = parseInt(storageResponse.data.args[1].args[0].args[0].int)
		let token1Check = storageResponse.data.args[0].args[3].prim.toString()

		let token2Address = storageResponse.data.args[1].args[2].string.toString()
		let token2Id = parseInt(storageResponse.data.args[2].args[1].int)
		let token2Check = storageResponse.data.args[2].args[0].prim.toString()

		const tokenPriceResponse = await axios.get(
			"https://api.teztools.io/token/prices"
		)
		const tokenPricesData = tokenPriceResponse.data.contracts
		let tokenData = {}

		let token1Type
		let token2Type

		if (token1Check.match("True")) {
			token1Type = "fa2"
		} else {
			token1Type = "fa1.2"
		}

		if (token2Check.match("True")) {
			token2Type = "fa2"
		} else {
			token2Type = "fa1.2"
		}

		for (let i in tokenPricesData) {
			if (
				tokenPricesData[i].tokenAddress === token1Address &&
				tokenPricesData[i].type === token1Type
			) {
				tokenData["token0"] = {
					tokenName: tokenPricesData[i].symbol,
					tokenValue: tokenPricesData[i].usdValue,
					tokenDecimal: tokenPricesData[i].decimals,
				}
			}

			if (token2Type === "fa2") {
				if (
					tokenPricesData[i].tokenAddress === token2Address &&
					tokenPricesData[i].type === token2Type &&
					tokenPricesData[i].tokenId === token2Id
				) {
					tokenData["token1"] = {
						tokenName: tokenPricesData[i].symbol,
						tokenValue: tokenPricesData[i].usdValue,
						tokenDecimal: tokenPricesData[i].decimals,
					}
				}
			} else if (token2Type === "fa1.2") {
				if (
					tokenPricesData[i].tokenAddress === token2Address &&
					tokenPricesData[i].type === token2Type
				) {
					tokenData["token1"] = {
						tokenName: tokenPricesData[i].symbol,
						tokenValue: tokenPricesData[i].usdValue,
						tokenDecimal: tokenPricesData[i].decimals,
					}
				}
			}
		}

		var token1Amount =
			(Math.pow(10, lpTokenDecimal) * token1Pool) / lpTokenTotalSupply
		token1Amount =
			(token1Amount * tokenData["token0"].tokenValue) /
			Math.pow(10, tokenData["token0"].tokenDecimal)

		var token2Amount =
			(Math.pow(10, lpTokenDecimal) * token2Pool) / lpTokenTotalSupply
		token2Amount =
			(token2Amount * tokenData["token1"].tokenValue) /
			Math.pow(10, tokenData["token1"].tokenDecimal)

		let totalAmount = (token1Amount + token2Amount).toFixed(2)

		return {
			success: true,
			identifier,
			totalAmount,
		}
	} catch (error) {
		return {
			success: false,
		}
	}
}

export const getAllFarmsContracts = async () => {
	let activeContracts = []
	let inactiveContracts = []
	const connectedNetwork = CONFIG.NETWORK
	for (let key in CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["active"].length > 0
		) {
			for (let key2 in CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key][
				"active"
			]) {
				activeContracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["active"][
							key2
						]["address"],
					mapId:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["active"][
							key2
						]["mapId"],
					identifier: key,
					decimal:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["active"][
							key2
						]["decimal"],
					tokenDecimal:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["active"][
							key2
						]["tokenDecimal"],
				})
			}
		}
	}
	for (let key in CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["inactive"].length >
			0
		) {
			for (let key2 in CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key][
				"inactive"
			]) {
				inactiveContracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["inactive"][
							key2
						]["address"],
					mapId:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["inactive"][
							key2
						]["mapId"],
					identifier: key,
					decimal:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["inactive"][
							key2
						]["decimal"],
					tokenDecimal:
						CONFIG.STAKING_CONTRACTS.FARMS[connectedNetwork][key]["inactive"][
							key2
						]["tokenDecimal"],
				})
			}
		}
	}
	return {
		activeContracts: activeContracts,
		inactiveContracts: inactiveContracts,
	}
}

export const getAllPoolsContracts = async () => {
	let activeContracts = []
	let inactiveContracts = []
	const connectedNetwork = CONFIG.NETWORK
	for (let key in CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["active"].length > 0
		) {
			for (let key2 in CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key][
				"active"
			]) {
				activeContracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["active"][
							key2
						]["address"],
					mapId:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["active"][
							key2
						]["mapId"],
					identifier: key,
					decimal:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["active"][
							key2
						]["decimal"],
					tokenDecimal:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["active"][
							key2
						]["tokenDecimal"],
				})
			}
		}
	}
	for (let key in CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["inactive"].length >
			0
		) {
			for (let key2 in CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key][
				"inactive"
			]) {
				inactiveContracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["inactive"][
							key2
						]["address"],
					mapId:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["inactive"][
							key2
						]["mapId"],
					identifier: key,
					decimal:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["inactive"][
							key2
						]["decimal"],
					identifier: key,
					tokenDecimal:
						CONFIG.STAKING_CONTRACTS.POOLS[connectedNetwork][key]["inactive"][
							key2
						]["tokenDecimal"],
				})
			}
		}
	}
	return {
		activeContracts: activeContracts,
		inactiveContracts: inactiveContracts,
	}
}

export const getStorageForPools = async isActive => {
	try {
		const tokenPrices = await axios.get("https://api.teztools.io/token/prices")
		const tokenPricesData = tokenPrices.data.contracts
		let priceOfPlenty = 0
		let priceOfToken = []
		let tokenData = {}

		for (let i in tokenPricesData) {
			if (
				tokenPricesData[i].symbol === "PLENTY" &&
				tokenPricesData[i].tokenAddress ===
					"KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b"
			) {
				priceOfPlenty = tokenPricesData[i].usdValue
				tokenData["PLENTY"] = {
					tokenName: tokenPricesData[i].symbol,
					tokenAddress: tokenPricesData[i].tokenAddress,
					tokenValue: tokenPricesData[i].usdValue,
				}
			} else if (
				tokenPricesData[i].tokenAddress !==
				"KT1CU9BhZZ7zXJKwZ264xhzNx2eMNoUGVyCy"
			) {
				tokenData[tokenPricesData[i].symbol] = {
					tokenName: tokenPricesData[i].symbol,
					tokenAddress: tokenPricesData[i].tokenAddress,
					tokenValue: tokenPricesData[i].usdValue,
				}
			}
		}

		for (let key in CONFIG.POOLS[CONFIG.NETWORK]) {
			for (let key1 in CONFIG.POOLS[CONFIG.NETWORK][key][isActive]) {
				if (
					tokenData[key].tokenName === key &&
					tokenData[key].tokenAddress ===
						CONFIG.POOLS[CONFIG.NETWORK][key][isActive][key1].TOKEN
				) {
					priceOfToken[key] = tokenData[key].tokenValue
				}
			}
		}

		return {
			success: true,
			priceOfToken: priceOfToken,
		}
	} catch (error) {
		return {
			success: false,
			response: {},
		}
	}
}

export const getPondContracts = async () => {
	let activeContracts = []
	let inactiveContracts = []
	const connectedNetwork = CONFIG.NETWORK
	for (let key in CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["active"].length > 0
		) {
			for (let key2 in CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key][
				"active"
			]) {
				activeContracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["active"][
							key2
						]["address"],
					mapId:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["active"][
							key2
						]["mapId"],
					identifier: key,
					decimal:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["active"][
							key2
						]["decimal"],
					tokenDecimal:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["active"][
							key2
						]["tokenDecimal"],
				})
			}
		}
	}
	for (let key in CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork]) {
		if (
			CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["inactive"].length >
			0
		) {
			for (let key2 in CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key][
				"inactive"
			]) {
				inactiveContracts.push({
					contract:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["inactive"][
							key2
						]["address"],
					mapId:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["inactive"][
							key2
						]["mapId"],
					decimal:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["inactive"][
							key2
						]["decimal"],
					tokenDecimal:
						CONFIG.STAKING_CONTRACTS.PONDS[connectedNetwork][key]["inactive"][
							key2
						]["tokenDecimal"],
					identifier: key,
				})
			}
		}
	}
	return {
		activeContracts: activeContracts,
		inactiveContracts: inactiveContracts,
	}
}

export const getStorageForPonds = async isActive => {
	try {
		const tokenPrices = await axios.get("https://api.teztools.io/token/prices")
		const tokenPricesData = tokenPrices.data.contracts
		let priceOfPlenty = 0
		let tokenData = {}

		for (let i in tokenPricesData) {
			if (
				tokenPricesData[i].symbol === "PLENTY" &&
				tokenPricesData[i].tokenAddress ===
					"KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b"
			) {
				priceOfPlenty = tokenPricesData[i].usdValue
				tokenData["PLENTY"] = {
					tokenName: tokenPricesData[i].symbol,
					tokenAddress: tokenPricesData[i].tokenAddress,
					tokenValue: tokenPricesData[i].usdValue,
				}
			}
		}

		return {
			success: true,
			priceOfPlenty: priceOfPlenty,
		}
	} catch (error) {
		return {
			success: false,
			response: {},
		}
	}
}

export const getStakedAmount = async (
	mapId,
	packedKey,
	identifier,
	decimal,
	address,
	tokenDecimal
) => {
	try {
		const url = `${
			CONFIG.RPC_NODES[CONFIG.NETWORK]
		}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`
		const response = await axios.get(url)
		let balance = response.data.args[0].args[1].int
		balance = parseInt(balance)
		balance = balance / Math.pow(10, decimal)
		let singularStakes = []
		for (let i = 0; i < response.data.args[0].args[0].length; i++) {
			let amount = parseInt(
				response.data.args[0].args[0][i].args[1].args[0].int
			)
			amount = parseFloat(
				response.data.args[0].args[0][i].args[1].args[0].int /
					Math.pow(10, tokenDecimal)
			)
			singularStakes.push({
				mapId: response.data.args[0].args[0][i].args[0].int,
				amount: amount,
				block: response.data.args[0].args[0][i].args[1].args[1].int,
			})
		}

		return {
			success: true,
			balance,
			identifier,
			address,
			singularStakes,
		}
	} catch (error) {
		return {
			success: false,
			balance: 0,
			identifier,
			singularStakes: [],
		}
	}
}

export const getStakedAmountForAllContracts = async (
	address,
	type,
	isActive
) => {
	try {
		let packedKey = getPackedKey(0, address, "FA1.2")

		let promises = []
		let blockData = await axios.get(
			`${CONFIG.TZKT_NODES[CONFIG.NETWORK]}/v1/blocks/count`
		)

		for (let identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK]) {
			for (let i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
				isActive === true ? "active" : "inactive"
			]) {
				promises.push(
					getStakedAmount(
						CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
							isActive === true ? "active" : "inactive"
						][i].mapId,
						packedKey,
						identifier,
						CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
							isActive === true ? "active" : "inactive"
						][i].decimal,
						CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
							isActive === true ? "active" : "inactive"
						][i].address,
						CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
							isActive === true ? "active" : "inactive"
						][i].tokenDecimal
					)
				)
			}
		}
		const response = await Promise.all(promises)
		let stakedAmountResponse = {}
		for (let i in response) {
			stakedAmountResponse[response[i].address] = {
				stakedAmount: response[i].balance,
				identifier: response[i].identifier,
				singularStakes: response[i].singularStakes,
			}
		}

		return {
			success: true,
			response: stakedAmountResponse,
			currentBlock: blockData.data,
		}
	} catch (error) {
		return {
			success: false,
			response: {},
			currentBlock: 0,
		}
	}
}

const getCurrentBlockLevel = async () => {
	const response = await axios.get("https://api.better-call.dev/v1/head")
	if (response.data[0].network != "mainnet") {
		throw "Invalid Network"
	}
	return response.data[0].level
}

export const harvestAllHelper = async (
	userAddress,
	dispatchHarvestAllProcessing
) => {
	try {
		const allActiveContracts = await getAllActiveContractAddresses()
		// console.log(allActiveContracts, "allActiveContracts")
		const blockLevel = await getCurrentBlockLevel()
		const network = {
			type: CONFIG.WALLET_NETWORK,
		}
		const options = {
			name: CONFIG.NAME,
		}
		const wallet = new BeaconWallet(options)
		const connectedNetwork = CONFIG.NETWORK
		const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type)
		if (WALLET_RESP.success) {
			const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork])
			Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork])
			Tezos.setWalletProvider(wallet)
			let promises = []
			const packedKey = await getPackedKey(0, userAddress, "FA1.2")
			for (let key in allActiveContracts) {
				const output = await calculateHarvestValue(
					allActiveContracts[key].contract,
					18,
					blockLevel,
					allActiveContracts[key].mapId,
					packedKey
				)
				if (output.totalRewards > 0) {
					promises.push(await Tezos.wallet.at(allActiveContracts[key].contract))
				}
			}
			if (promises.length > 0) {
				const response = await Promise.all(promises)
				let harvestBatch = []
				for (let key1 in response) {
					harvestBatch.push({
						kind: OpKind.TRANSACTION,
						...response[key1].methods.GetReward(1).toTransferParams(),
					})
				}
				let batch = await Tezos.wallet.batch(harvestBatch)
				let batchOperation = await batch.send()
				dispatchHarvestAllProcessing(batchOperation)
				const batchConfirm = await batchOperation.confirmation()
				return {
					success: true,
					batchConfirm: batchConfirm,
				}
			} else {
				// console.log("Nothing to harvest!")
			}
		}
	} catch (error) {
		return { success: false, error: error }
	}
}

export const getTVLOfUserHelper = async userAddress => {
	try {
		let tvlOfUser = 0
		const {
			activeContracts: farmActiveContracts,
			inactiveContracts: farmInactiveContracts,
		} = await getAllFarmsContracts()
		const {
			activeContracts: poolActiveContracts,
			inactiveContracts: poolsInactiveContracts,
		} = await getAllPoolsContracts()
		const {
			activeContracts: pondActiveContracts,
			inactiveContracts: pondInactiveContract,
		} = await getPondContracts()
		let tokenDataPromises = [
			getStorageForPools("active"),
			getStorageForPools("inactive"),
			getStorageForPonds("active"),
			getStorageForPonds("inactive"),
			getStorageForFarms("active"),
			getStorageForFarms("inactive"),
		]

		const responseTokenData = await Promise.all(tokenDataPromises)
		const poolTokenDataActive = responseTokenData[0].priceOfToken
		const poolTokenDataInactive = responseTokenData[1].priceOfToken
		const pondTokenDataActive = responseTokenData[2].priceOfPlenty
		const pondTokenDataInactive = responseTokenData[3].priceOfPlenty
		const farmTokenDataActive = responseTokenData[4].priceOfLPToken
		const farmTokenDataInactive = responseTokenData[5].priceOfLPToken

		// console.log(poolTokenDataActive, poolTokenDataInactive, "POOL TOKEN DATA")
		// console.log(pondTokenDataActive, pondTokenDataInactive, "POND TOKEN DATA")
		// console.log(farmTokenDataActive, farmTokenDataInactive, "FARM TOKEN DATA")

		const packedKey = getPackedKey(0, userAddress, "FA1.2")

		//FARM ACTIVE
		let stakedAmountsFromActiveFarmsPromises = []
		for (let key in farmActiveContracts) {
			const { mapId, identifier, decimal, contract, tokenDecimal } =
				farmActiveContracts[key]
			// console.log(
			// 	mapId,
			// 	identifier,
			// 	decimal,
			// 	contract,
			// 	tokenDecimal,
			// 	"ACTIVE FARMS"
			// )
			stakedAmountsFromActiveFarmsPromises.push(
				getStakedAmount(
					mapId,
					packedKey,
					identifier,
					decimal,
					contract,
					tokenDecimal
				)
			)
		}
		const farmResponsesActive = await Promise.all(
			stakedAmountsFromActiveFarmsPromises
		)
		// console.log(farmResponsesActive)
		for (let key in farmResponsesActive) {
			// console.log(
			// 	farmResponsesActive[key].balance,
			// 	typeof farmTokenDataActive["PLENTY - XTZ"],
			// 	isNaN(farmTokenDataActive["PLENTY - XTZ"]),
			// 	farmTokenDataActive[farmResponsesActive[key].identifier],
			// 	farmResponsesActive[key].identifier
			// )
			if (farmResponsesActive[key].success) {
				tvlOfUser +=
					farmResponsesActive[key].balance *
					farmTokenDataActive[farmResponsesActive[key].identifier]
			}
		}

		//FARM INACTIVE
		let stakedAmountsFromInactiveFarmsPromises = []
		// console.log(farmInactiveContracts, "farmInactiveContracts")
		for (let key in farmInactiveContracts) {
			const { mapId, identifier, decimal, contract, tokenDecimal } =
				farmInactiveContracts[key]
			stakedAmountsFromInactiveFarmsPromises.push(
				getStakedAmount(
					mapId,
					packedKey,
					identifier,
					decimal,
					contract,
					tokenDecimal
				)
			)
		}
		const farmResponsesInactive = await Promise.all(
			stakedAmountsFromInactiveFarmsPromises
		)
		// console.log(farmResponsesInactive)
		for (let key in farmResponsesInactive) {
			// console.log(
			// 	farmResponsesInactive[key].balance,
			// 	farmTokenDataInactive[farmResponsesInactive[key].identifier],
			// 	"INACTIVE FARMS",
			// 	farmTokenDataInactive, "<-----Inactive Farm Tokens----->"
			// )
			if (farmResponsesInactive[key].success) {
				tvlOfUser +=
					farmResponsesInactive[key].balance *
					farmTokenDataInactive[farmResponsesInactive[key].identifier]
			}
		}

		//POOLS ACTIVE
		let stakedAmountsFromActivePoolsPromises = []
		for (let key in poolActiveContracts) {
			const { mapId, identifier, decimal, contract, tokenDecimal } =
				poolActiveContracts[key]
			stakedAmountsFromActivePoolsPromises.push(
				getStakedAmount(
					mapId,
					packedKey,
					identifier,
					decimal,
					contract,
					tokenDecimal
				)
			)
		}
		const poolResponseActive = await Promise.all(
			stakedAmountsFromActivePoolsPromises
		)
		// console.log(poolResponseActive)
		for (let key in poolResponseActive) {
			// console.log(
			// 	poolResponseActive[key].balance,
			// 	poolTokenDataActive[poolResponseActive[key].identifier]
			// )
			if (poolResponseActive[key].success) {
				tvlOfUser +=
					poolResponseActive[key].balance *
					poolTokenDataActive[poolResponseActive[key].identifier]
			}
		}

		//POOL Inactive

		let stakedAmountsFromInactivePoolsPromises = []
		for (let key in poolsInactiveContracts) {
			const { mapId, identifier, decimal, contract, tokenDecimal } =
				poolsInactiveContracts[key]
			stakedAmountsFromInactivePoolsPromises.push(
				getStakedAmount(
					mapId,
					packedKey,
					identifier,
					decimal,
					contract,
					tokenDecimal
				)
			)
		}
		const poolResponseInactive = await Promise.all(
			stakedAmountsFromInactivePoolsPromises
		)
		// console.log(poolResponseInactive)
		for (let key in poolResponseInactive) {
			// console.log(
			// 	poolResponseInactive[key].balance,
			// 	poolTokenDataInactive[poolResponseInactive[key].identifier]
			// )
			if (poolResponseInactive[key].success) {
				tvlOfUser +=
					poolResponseInactive[key].balance *
					poolTokenDataInactive[poolResponseInactive[key].identifier]
			}
		}

		//POND Active
		let stakedAmountsFromActivePondPromises = []
		for (let key in pondActiveContracts) {
			const { mapId, identifier, decimal, contract, tokenDecimal } =
				pondActiveContracts[key]
			stakedAmountsFromActivePondPromises.push(
				getStakedAmount(
					mapId,
					packedKey,
					identifier,
					decimal,
					contract,
					tokenDecimal
				)
			)
		}
		const pondResponseActive = await Promise.all(
			stakedAmountsFromActivePondPromises
		)
		// console.log(pondResponseActive)
		for (let key in pondResponseActive) {
			// console.log(pondResponseActive[key].balance, pondTokenDataActive)
			if (pondResponseActive[key].success) {
				tvlOfUser += pondResponseActive[key].balance * pondTokenDataActive
			}
		}

		//POND Inactive
		let stakedAmountsFromInactivePondPromises = []
		for (let key in pondInactiveContract) {
			const { mapId, identifier, decimal, contract, tokenDecimal } =
				pondInactiveContract[key]
			stakedAmountsFromInactivePondPromises.push(
				getStakedAmount(
					mapId,
					packedKey,
					identifier,
					decimal,
					contract,
					tokenDecimal
				)
			)
		}
		const pondResponseInactive = await Promise.all(
			stakedAmountsFromInactivePondPromises
		)
		for (let key in pondResponseInactive) {
			if (pondResponseInactive[key].success) {
				tvlOfUser += pondResponseInactive[key].balance * pondTokenDataInactive
			}
		}
		return {
			success: true,
			data: tvlOfUser,
		}
	} catch (error) {
		return {
			success: false,
			error: error,
		}
	}
}

export const plentyToHarvestHelper = async addressOfUser => {
	let plentyToHarvest = 0
	let promises = [
		getHarvestValue(addressOfUser, "FARMS", true),
		getHarvestValue(addressOfUser, "FARMS", false),
		getHarvestValue(addressOfUser, "POOLS", true),
		getHarvestValue(addressOfUser, "POOLS", false),
	]
	const response = await Promise.all(promises)
	response.forEach(item => {
		// console.log("<---getHarvestValue--->", item)
		if (item.success) {
			for (const key in item.response) {
				plentyToHarvest += item.response[key].totalRewards
			}
		} else {
			return {
				success: false,
			}
		}
	})
	return {
		success: true,
		data: plentyToHarvest,
	}
}
