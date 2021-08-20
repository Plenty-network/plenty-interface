import axios from 'axios';
import { TezosParameterFormat, TezosMessageUtils } from 'conseiljs';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, OpKind } from '@taquito/taquito';
import * as actions from '../index.action';
import * as homeApis from './api.home';
import { getUserStakes } from '../user/user.action';
import CONFIG from '../../../config/config';

export const getHomeStatsData = () => {
  return async (dispatch) => {
    dispatch({ type: actions.HOME_STATS_FETCH });
    const res = await axios.get(
      'https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/homestats'
    );
    if (res.data.success) {
      dispatch({ type: actions.HOME_STATS_FETCH_SUCCESS, data: res.data.body });
    } else {
      dispatch({ type: actions.HOME_STATS_FETCH_FAILED });
    }
  };
};

export const getTVL = () => {
  return async (dispatch) => {
    dispatch({ type: actions.TVL_FETCH });
    const res = await axios.get(
      'https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/tvl'
    );
    if (res.data.success) {
      dispatch({ type: actions.TVL_FETCH_SUCCESS, data: res.data.body });
    } else {
      dispatch({ type: actions.TVL_FETCH_FAILED });
    }
  };
};

export const getPlentyToHarvest = (addressOfUser) => {
  let plentyToHarvest = 0;
  return async (dispatch) => {
    dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH });
    let promises = [
      homeApis.getHarvestValue(addressOfUser, 'FARMS', true),
      homeApis.getHarvestValue(addressOfUser, 'FARMS', false),
      homeApis.getHarvestValue(addressOfUser, 'POOLS', true),
      homeApis.getHarvestValue(addressOfUser, 'POOLS', false),
      // homeApis.getHarvestValue(addressOfUser, "PONDS", "active"),
      // homeApis.getHarvestValue(addressOfUser, "PONDS", "inactive"),
    ];
    const response = await Promise.all(promises);
    response.forEach((item) => {
      if (item.success) {
        for (const key in item.response) {
          plentyToHarvest += item.response[key].totalRewards;
        }
      } else {
        dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH_FAILED });
        return;
      }
    });
    dispatch({
      type: actions.PLENTY_TO_HARVEST_FETCH_SUCCESS,
      data: plentyToHarvest,
    });
  };
};

export const getPlentyBalanceOfUser = (userAddress) => {
  return async (dispatch) => {
    dispatch({ type: actions.PLENTY_BALANCE_FETCH });
    const packedKey = homeApis.getPackedKey(0, userAddress, 'FA1.2');
    const connectedNetwork = CONFIG.NETWORK;
    const res = await homeApis.getBalanceAmount(
      CONFIG.TOKEN_CONTRACTS[connectedNetwork]['PLENTY'].mapId,
      packedKey,
      'PLENTY',
      CONFIG.TOKEN_CONTRACTS[connectedNetwork]['PLENTY'].decimal
    );
    if (res.success) {
      dispatch({
        type: actions.PLENTY_BALANCE_FETCH_SUCCESS,
        data: res.balance,
      });
    } else {
      dispatch({ type: actions.PLENTY_BALANCE_FETCH_FAILED });
    }
  };
};

const getCurrentBlockLevel = async () => {
  const response = await axios.get('https://api.better-call.dev/v1/head');
  if (response.data[0].network != 'mainnet') {
    throw 'Invalid Network';
  }
  return response.data[0].level;
};

export const harvestAll = userAddress => {
	return async dispatch => {
		dispatch({ type: actions.HARVEST_ALL_INITIATION })
		const allActiveContracts = await homeApis.getAllActiveContractAddresses()
		const blockLevel = await getCurrentBlockLevel()
		try {
			const network = {
				type: CONFIG.WALLET_NETWORK,
			}
			const options = {
				name: CONFIG.NAME,
			}
			const wallet = new BeaconWallet(options)
			const connectedNetwork = CONFIG.NETWORK
			const WALLET_RESP = await homeApis.CheckIfWalletConnected(
				wallet,
				network.type
			)
			if (WALLET_RESP.success) {
				const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork])
				Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork])
				Tezos.setWalletProvider(wallet)
				let promises = []
				const packedKey = await homeApis.getPackedKey(0, userAddress, "FA1.2")
				for (let key in allActiveContracts) {
					const output = await homeApis.calculateHarvestValue(
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
					// dispatch("transaction is submitted") processing: true
					// snackbar loading
					const batchConfirm = await batchOperation.confirmation()
					dispatch({ type: actions.HARVEST_ALL_SUCCESS, payload: batchConfirm }) // snack transaction success 
				} else {
					// console.log("Nothing to harvest")
				}
			}
		} catch (error) {
			// console.log(error)
			dispatch({ type: actions.HARVEST_ALL_FAILED, payload:error })
		} finally {
			setTimeout(() => {
				// dismiss snackbar
			}, 5000)
		}
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

export const getTVLOfUser = userAddress => {
	return async dispatch => {
		dispatch({ type: actions.USER_TVL_FETCH })
		try {
			let tvlOfUser = 0
			const {
				activeContracts: farmActiveContracts,
				inactiveContracts: farmInactiveContracts,
			} = await homeApis.getAllFarmsContracts()
			const {
				activeContracts: poolActiveContracts,
				inactiveContracts: poolsInactiveContracts,
			} = await homeApis.getAllPoolsContracts()
			const {
				activeContracts: pondActiveContracts,
				inactiveContracts: pondInactiveContract,
			} = await homeApis.getPondContracts()
			let tokenDataPromises = [
				homeApis.getStorageForPools("active"),
				homeApis.getStorageForPools("inactive"),
				homeApis.getStorageForPonds("active"),
				homeApis.getStorageForPonds("inactive"),
				homeApis.getStorageForFarms("active"),
				homeApis.getStorageForFarms("inactive"),
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

			const packedKey = homeApis.getPackedKey(0, userAddress, "FA1.2")

			//FARM ACTIVE
			let stakedAmountsFromActiveFarmsPromises = []
			for (let key in farmActiveContracts) {
				const { mapId, identifier, decimal, contract, tokenDecimal } =
					farmActiveContracts[key]
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
			// console.log(pondResponseInactive)
			for (let key in pondResponseInactive) {
				// console.log(pondResponseInactive[key].balance, pondTokenDataInactive)
				if (pondResponseInactive[key].success) {
					tvlOfUser += pondResponseInactive[key].balance * pondTokenDataInactive
				}
			}
			dispatch({ type: actions.USER_TVL_FETCH_SUCCESS, data: tvlOfUser })

			// console.log(tvlOfUser, "tvlOfUser")
		} catch (error) {
			dispatch({ type: actions.USER_TVL_FETCH_FAILED })
			// console.log(error)
		}
	}
}
