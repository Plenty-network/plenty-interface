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
        completed : false,
        failed : false,
        operationHash : null
    },
    unstakeOperation : {
        isLoading : false,
        completed : false,
        failed : false,
        operationHash : null
    },
    harvestOperation : {
        isLoading : false,
        completed : false,
        failed : false,
        operationHash : null
    },
    modals: {
        open: POOL_PAGE_MODAL.NULL,
        contractAddress: null,
    },
    isActiveOpen : true,
    poolsToRender : [],
    isStakeModalOpen : false,
    stakeModalIdentifier :'',
    stakeModalTitle : '',
    stakeModalPoolPosition : -1,
    stakeModalContractAddress : '',
    stakeInputValue : 0
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
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.STAKING_ON_POOL_SUCCESSFULL:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                }
            }
        case actions.STAKING_ON_POOL_FAILED:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    completed : false,
                    failed : true,
                    operationHash : null
                }
            }
        case actions.CLEAR_STAKING_ON_POOL_RESPONSE:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
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
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.UNSTAKING_ON_POOL_SUCCESSFULL:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                }
            }
        case actions.UNSTAKING_ON_POOL_FAILED:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
                    completed : false,
                    failed : true,
                    operationHash : null
                }
            }
        case actions.CLEAR_UNSTAKING_ON_POOL_RESPONSE:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
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
                    operationHash : null
                }
            }
        case actions.HARVESTING_ON_POOL_SUCCESSFULL:
            return {
                ...state,
                harvestOperation : {
                    isLoading : false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                }
            }
        case actions.HARVESTING_ON_POOL_FAILED:
            return {
                ...state,
                harvestOperation : {
                    isLoading : false,
                    completed : false,
                    failed : true,
                    operationHash : null
                }
            }
        case actions.CLEAR_HARVESTING_ON_POOL_RESPONSE:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    completed : false,
                    failed : false,
                    operationHash : null
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
                isStakeModalOpen : true,
                stakeModalIdentifier : action.data.identifier,
                stakeModalTitle : action.data.title,
                stakeModalPoolPosition : action.data.position,
                stakeModalContractAddress : action.data.contractAddress
            }
        case actions.CLOSE_POOLS_STAKE_MODAL:
            return {
                ...state,
                isStakeModalOpen : false,
                stakeModalIdentifier : '',
                stakeModalTitle : '',
                stakeModalPoolPosition : -1,
                stakeModalContractAddress : '',
                stakeInputValue : 0
            }
        case actions.HANDLE_STAKE_ON_POOLS_INPUT_VALUE:
            return {
                ...state,
                stakeInputValue : action.data.value
            }
        default:
            return {
                ...state
            }
    }
}

export default poolsReducer;