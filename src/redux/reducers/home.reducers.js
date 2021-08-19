import * as actions from "../actions/index.action"

const initState = {
	homeStats: {
		isPresent: false,
		loading: false,
		data: {},
	},
	tvl: {
		isPresent: false,
		loading: false,
		data: 0,
	},
	plentyBalance: {
		isPresent: false,
		loading: false,
		data: 0,
	},
	plentyToHarvest: {
		isPresent: false,
		loading: false,
		data: 0,
	},
}

const homeReducer = (state = initState, action) => {
	switch (action.type) {
		case actions.HOME_STATS_FETCH:
			return {
				...state,
				homeStats: {
					isPresent: false,
					loading: true,
					data: {},
				},
			}
		case actions.HOME_STATS_FETCH_SUCCESS:
			return {
				...state,
				homeStats: { isPresent: true, loading: false, data: action.data },
			}
		case actions.HOME_STATS_FETCH_FAILED:
			return {
				...state,
				homeStats: { isPresent: false, loading: false, data: {} },
			}

		case actions.TVL_FETCH:
			return {
				...state,
				tvl: {
					isPresent: false,
					loading: true,
					data: 0,
				},
			}
		case actions.TVL_FETCH_SUCCESS:
			return {
				...state,
				tvl: { isPresent: true, loading: false, data: action.data },
			}
		case actions.TVL_FETCH_FAILED:
			return {
				...state,
				tvl: { isPresent: false, loading: false, data: 0 },
			}
		case actions.PLENTY_BALANCE_FETCH:
			return {
				...state,
				plentyBalance: { isPresent: false, loading: true, data: 0 },
			}
		case actions.PLENTY_BALANCE_FETCH_SUCCESS:
			return {
				...state,
				plentyBalance: { isPresent: true, loading: false, data: action.data },
			}
		case actions.PLENTY_BALANCE_FETCH_FAILED:
			return {
				...state,
				plentyBalance: { isPresent: false, loading: false, data: 0 },
			}
		case actions.PLENTY_TO_HARVEST_FETCH:
			return {
				...state,
				plentyToHarvest: { isPresent: false, loading: true, data: 0 },
			}
		case actions.PLENTY_TO_HARVEST_FETCH_SUCCESS:
			return {
				...state,
				plentyToHarvest: { isPresent: true, loading: false, data: action.data },
			}
		case actions.PLENTY_TO_HARVEST_FETCH_FAILED:
			return {
				...state,
				plentyToHarvest: { isPresent: false, loading: false, data: 0 },
			}
		default:
			return {
				...state,
			}
	}
}

export default homeReducer
