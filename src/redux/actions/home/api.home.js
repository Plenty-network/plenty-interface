import { TezosParameterFormat, TezosMessageUtils } from "conseiljs"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { TezosToolkit, OpKind } from "@taquito/taquito"
const CONFIG = require("../../../config/config")
const axios = require("axios")

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
		const url = `https://mainnet.smartpy.io/chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`
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
		}
	}
}

export const CheckIfWalletConnected = async (wallet, somenet) => {
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

export const getAllActiveContractAddresses = async () => {
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

export const harvestAll = async () => {
	const allActiveContracts = getAllActiveContractAddresses()
	try {
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
			allActiveContracts.forEach(async contractAddress =>
				promises.push(await Tezos.wallet.at(contractAddress))
			)
			const response = await Promise.all(promises)

			console.log(response)
		}
	} catch (error) {
		console.log(error)
	}
}

const getStakedAmount = async (
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
