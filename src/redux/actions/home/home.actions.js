import { TezosToolkit } from "@taquito/taquito"
import axios from "axios"
import * as actions from "../index.action"
import CONFIG from "../../../config/config"

export const getHomeStatsData = () => {
	return async dispatch => {
		dispatch({ type: actions.HOME_STATS_FETCH })
		const res = await axios.get(
			"https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/homestats"
		)
		console.log(res.data.success)
		if (res.data.success) {
			dispatch({ type: actions.HOME_STATS_FETCH_SUCCESS, data: res.data.body })
		} else {
			dispatch({ type: actions.HOME_STATS_FETCH_FAILED })
		}
	}
}

export const getTVL = () => {
	return async dispatch => {
		dispatch({ type: actions.TVL_FETCH })
		const res = await axios.get(
			"https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/tvl"
		)
		console.log(res)
		if (res.data.success) {
			dispatch({ type: actions.TVL_FETCH_SUCCESS, data: res.data.body })
		} else {
			dispatch({ type: actions.TVL_FETCH_FAILED })
		}
	}
}

// export const fetchWalletBalance = async (
// 	addressOfUser,
// 	tokenContractAddress,
// 	icon,
// 	type,
// 	token_id,
// 	token_decimal
// ) => {
// 	try {
// 		const connectedNetwork = "testnet"
// 		const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork])
// 		Tezos.setProvider(CONFIG.RPC_NODES[connectedNetwork])
// 		const contract = await Tezos.contract.at(tokenContractAddress)
// 		const storage = await contract.storage()
// 		let userBalance = 0
// 		if (type === "FA1.2") {
// 			if (icon === "WRAP") {
// 				const userDetails = await storage.assets.ledger.get(addressOfUser)
// 				let userBalance = userDetails
// 				userBalance =
// 					userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3)
// 				userBalance = parseFloat(userBalance)
// 				return {
// 					success: true,
// 					balance: userBalance,
// 					symbol: icon,
// 					contractInstance: contract,
// 				}
// 			} else if (icon === "KALAM") {
// 				const userDetails = await storage.ledger.get(addressOfUser)
// 				let userBalance = userDetails
// 				userBalance =
// 					userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3)
// 				userBalance = parseFloat(userBalance)
// 				return {
// 					success: true,
// 					balance: userBalance,
// 					symbol: icon,
// 					contractInstance: contract,
// 				}
// 			} else {
// 				const userDetails = await storage.balances.get(addressOfUser)
// 				let userBalance = userDetails.balance
// 				userBalance =
// 					userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3)
// 				userBalance = parseFloat(userBalance)
// 				return {
// 					success: true,
// 					balance: userBalance,
// 					symbol: icon,
// 					contractInstance: contract,
// 				}
// 			}
// 		} else {
// 			const userDetails = await storage.assets.ledger.get({
// 				0: addressOfUser,
// 				1: token_id,
// 			})
// 			userBalance = (
// 				userDetails.toNumber() / Math.pow(10, token_decimal)
// 			).toFixed(3)
// 			userBalance = parseFloat(userBalance)
// 			return {
// 				success: true,
// 				balance: userBalance,
// 				symbol: icon,
// 				contractInstance: contract,
// 			}
// 		}
// 	} catch (e) {
// 		return {
// 			success: false,
// 			balance: 0,
// 			symbol: icon,
// 			error: e,
// 			contractInstance: null,
// 		}
// 	}
// }

// export const getUserPlentyBalance = addressOfUser => {
// 	const network = "testnet"
// 	const identifier = "PLENTY"
// 	const tokenContract = CONFIG.AMM[network][identifier].TOKEN_CONTRACT
// 	console.log(CONFIG.AMM)
// 	const tokenId = CONFIG.AMM[network][identifier].TOKEN_ID
// 	const tokenDecimal = CONFIG.AMM[network][identifier].TOKEN_DECIMAL
// 	const readType = CONFIG.AMM[network][identifier].READ_TYPE
// 	return async dispatch => {
// 		dispatch({ type: actions.PLENTY_BALANCE_FETCH })
// 		const res = await fetchWalletBalance({
// 			addressOfUser,
// 			tokenContract,
// 			identifier,
// 			readType,
// 			tokenId,
// 			tokenDecimal,
// 		})
// 		console.log(res)
// 	}
// }
