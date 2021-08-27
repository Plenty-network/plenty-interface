import * as actions from '../actions/index.action';
import { POOL_PAGE_MODAL } from "../../constants/poolsPage";

const initialState = {
    active : {
        isPresent : false,
        loading : false,
        data : {}
    },
    inactive : {
        isPresent : false,
        loading : false,
        data : {}
    },
    stakeOperation : {
        isLoading : false,
        processing: false,
        completed : false,
        failed : false,
        operationHash : null
    },
    unstakeOperation : {
        isLoading : false,
        processing: false,
        completed : false,
        failed : false,
        operationHash : null
    },
    harvestOperation : {
        isLoading : false,
        completed : false,
        failed : false,
        operationHash : null,
        tokenPair: null,
    },
    modals: {
        open: POOL_PAGE_MODAL.NULL,
        contractAddress: null,
        transactionId: '',
        snackbar: false,
    },
    stakeModal: {
        open: false,
        identifier: '',
        title: '',
        contractAddress: '',
        position: -1,
    },
    unstakeModal: {
        open: false,
        identifier: '',
        title: '',
        contractAddress: '',
        withdrawalFeeStructure: [],
    },
    isActiveOpen : true,
    poolsToRender : [],
}

const poolsReducer = (state = initialState , action) => {
    switch(action.type) 
    {
        case actions.START_ACTIVE_POOLS_DATA_FETCH:
            return {
                ...state,
                active : {
                    isPresent : false,
                    loading : true,
                    data : {}
                }
            }
        case actions.ACTIVE_POOLS_DATA_FETCH_SUCCESSFULL:
            return {
                ...state,
                active : {
                    isPresent : true,
                    loading : false,
                    data : action.data
                }
            }
        case actions.ACTIVE_POOLS_DATA_FETCH_FAILED:
            return {
                ...state,
                active : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        case actions.CLEAR_ACTIVE_POOLS_DATA:
            return {
                ...state,
                active : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        //
        case actions.START_INACTIVE_POOLS_DATA_FETCH:
            return {
                ...state,
                inactive : {
                    isPresent : false,
                    loading : true,
                    data : {}
                }
            }
        case actions.INACTIVE_POOLS_DATA_FETCH_SUCCESSFULL:
            return {
                ...state,
                inactive : {
                    isPresent : true,
                    loading : false,
                    data : action.data
                }
            }
        case actions.INACTIVE_POOLS_DATA_FETCH_FAILED:
            return {
                ...state,
                inactive : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        case actions.CLEAR_INACTIVE_POOLS_DATA:
            return {
                ...state,
                inactive : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        case actions.INITIATE_STAKING_ON_POOL:
            return {
                ...state,
                stakeOperation : {
                    isLoading : true,
                    processing: false,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.PROCESSING_STAKING_ON_POOL:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    open: POOL_PAGE_MODAL.TRANSACTION_SUCCESS,
                    transactionId: action.payload.opHash
                },
                stakeOperation : {
                    isLoading : false,
                    processing: true,
                    completed : false,
                    failed : false,
                    operationHash : null
                },
                stakeModal: {
                    ...state.stakeModal,
                    open: false
                }
            }
        case actions.STAKING_ON_POOL_SUCCESSFULL:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    processing: false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                },
                modals: { ...state.modals, snackbar: true }
            }
        case actions.STAKING_ON_POOL_FAILED:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    processing: false,
                    completed : false,
                    failed : true,
                    operationHash : null
                },
                modals: { ...state.modals, snackbar: true }
            }
        case actions.CLEAR_STAKING_ON_POOL_RESPONSE:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    processing: false,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        //
        case actions.INITIATE_UNSTAKING_ON_POOL:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : true,
                    processing: false,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.PROCESSING_UNSTAKING_ON_POOL:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    open: POOL_PAGE_MODAL.TRANSACTION_SUCCESS,
                    transactionId: action.payload.opHash
                },
                unstakeOperation : {
                    isLoading : false,
                    processing: true,
                    completed : false,
                    failed : false,
                    operationHash : null
                },
                unstakeModal: {
                    ...state.unstakeModal,
                    open: false,
                }
            }
        case actions.UNSTAKING_ON_POOL_SUCCESSFULL:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
                    processing: false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                },
                modals: { ...state.modals, snackbar: true }
            }
        case actions.UNSTAKING_ON_POOL_FAILED:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
                    processing: false,
                    completed : false,
                    failed : true,
                    operationHash : null
                },
                modals: { ...state.modals, snackbar: true }
            }
        case actions.CLEAR_UNSTAKING_ON_POOL_RESPONSE:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
                    processing: false,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        //
        case actions.INITIATE_HARVESTING_ON_POOL:
            return {
                ...state,
                harvestOperation : {
                    isLoading : true,
                    completed : false,
                    failed : false,
                    operationHash : null,
                    tokenPair: action.payload.tokenPair,
                }
            }
        case actions.HARVESTING_ON_POOL_SUCCESSFULL:
            return {
                ...state,
                harvestOperation : {
                    isLoading : false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data,
                    tokenPair: null,
                }
            }
        case actions.HARVESTING_ON_POOL_FAILED:
            return {
                ...state,
                harvestOperation : {
                    isLoading : false,
                    completed : false,
                    failed : true,
                    operationHash : null,
                    tokenPair: null,
                }
            }
        case actions.CLEAR_HARVESTING_ON_POOL_RESPONSE:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    completed : false,
                    failed : false,
                    operationHash : null,
                    tokenPair: null,
                }
            }
        case actions.OPEN_ACTIVE_POOLS:
            return {
                ...state,
                isActiveOpen : true,
            }
        case actions.OPEN_INACTIVE_POOLS:
            return {
                ...state,
                isActiveOpen : false
            }
        case actions.SET_POOLS_TO_RENDER:
            return {
                ...state,
                poolsToRender : action.data
            }
        case actions.CLEAR_RENDERED_POOLS:
            return {
                ...state,
                poolsToRender : []
            }
        case actions.OPEN_POOLS_STAKE_MODAL:
            return {
                ...state,
                stakeModal: {
                    ...state.stakeModal,
                    open: true,
                    identifier : action.data.identifier,
                    title : action.data.title,
                    position : action.data.position,
                    contractAddress : action.data.contractAddress
                }
            }
        case actions.CLOSE_POOLS_STAKE_MODAL:
            return {
                ...state,
                stakeModal: {
                    ...state.stakeModal,
                    open: false,
                    identifier: '',
                    title: '',
                    contractAddress: '',
                    position: -1,
                }
            }
        case actions.HANDLE_STAKE_ON_POOLS_INPUT_VALUE:
            return {
                ...state,
                stakeInputValue : action.data.value
            }
        case actions.OPEN_POOLS_UNSTAKE_MODAL:
            return {
                ...state,
                unstakeModal: {
                    ...state.unstakeModal,
                    open: true,
                    identifier: action.data.identifier,
                    title: action.data.title,
                    contractAddress: action.data.contractAddress,
                    withdrawalFeeStructure: action.data.withdrawalFeeStructure,
                    position: action.data.position,
                },
            }
        case actions.CLOSE_POOLS_UNSTAKE_MODAL:
            return {
                ...state,
                unstakeModal: {
                    ...state.unstakeModal,
                    open: false,
                    identifier: '',
                    title: '',
                    contractAddress: '',
                    withdrawalFeeStructure: [],
                }
            }

        case actions.OPEN_CLOSE_POOLS_MODAL:
            return {
                ...state,
                modals: { ...state.modals, ...action.payload }
            }

        case actions.DISMISS_POOLS_SNACKBAR:
            return {
                ...state,
                modals: { ...state.modals, snackbar: false, }
            }

        default:
            return {
                ...state
            }
    }
}

export default poolsReducer;