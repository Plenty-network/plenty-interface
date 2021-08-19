import { TezosToolkit } from "@taquito/taquito"
import axios from "axios"
import * as actions from "../index.action"
import * as homeApis from "./api.home"
import CONFIG from "../../../config/config"

export const getHomeStatsData = () => {
	return async dispatch => {
		dispatch({ type: actions.HOME_STATS_FETCH })
		const res = await axios.get(
			"https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/homestats"
		)
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
		if (res.data.success) {
			dispatch({ type: actions.TVL_FETCH_SUCCESS, data: res.data.body })
		} else {
			dispatch({ type: actions.TVL_FETCH_FAILED })
		}
	}
}

export const getPlentyToHarvest = addressOfUser => {
	let plentyToHarvest = 0
	return async dispatch => {
		dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH })
		let promises = [
			homeApis.getHarvestValue(addressOfUser, "FARMS", "active"),
			homeApis.getHarvestValue(addressOfUser, "FARMS", "inactive"),
			homeApis.getHarvestValue(addressOfUser, "POOLS", "active"),
			homeApis.getHarvestValue(addressOfUser, "POOLS", "inactive"),
			homeApis.getHarvestValue(addressOfUser, "PONDS", "active"),
			homeApis.getHarvestValue(addressOfUser, "PONDS", "inactive"),
		]
		const response = await Promise.all(promises)
		response.forEach(item => {
			if (item.success) {
				for (const key in item.response) {
					plentyToHarvest += item.response[key].totalRewards
				}
			} else {
				dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH_FAILED })
				return
			}
		})
		dispatch({
			type: actions.PLENTY_TO_HARVEST_FETCH_SUCCESS,
			data: plentyToHarvest,
		})
	}
}

export const getPlentyBalanceOfUser = userAddress => {
	return async dispatch => {
		dispatch({ type: actions.PLENTY_BALANCE_FETCH })
		const packedKey = homeApis.getPackedKey(0, userAddress, "FA1.2")
		const connectedNetwork = CONFIG.NETWORK
		const res = await homeApis.getBalanceAmount(
			CONFIG.TOKEN_CONTRACTS[connectedNetwork]["PLENTY"].mapId,
			packedKey,
			"PLENTY",
			CONFIG.TOKEN_CONTRACTS[connectedNetwork]["PLENTY"].decimal
		)
		console.log(res.success, "BALANCE")
		if (res.success) {
			dispatch({
				type: actions.PLENTY_BALANCE_FETCH_SUCCESS,
				data: res.balance,
			})
		} else {
			dispatch({ type: actions.PLENTY_BALANCE_FETCH_FAILED })
		}
	}
}
