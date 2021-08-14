import * as actions from '../actions/index.action';

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
    isActiveOpen : true,
    stakeInputValues : {},
    farmsToRender : [],
    isStakeModalOpen : false
}

const farmsReducer = (state = initialState , action) => {
    switch(action.type) 
    {
        case actions.START_ACTIVE_FARMS_DATA_FETCH:
            return {
                ...state,
                active : {
                    isPresent : false,
                    loading : true,
                    data : {}
                }
            }
        case actions.ACTIVE_FARMS_DATA_FETCH_SUCCESSFULL:
            return {
                ...state,
                active : {
                    isPresent : true,
                    loading : false,
                    data : action.data
                }
            }
        case actions.ACTIVE_FARMS_DATA_FETCH_FAILED:
            return {
                ...state,
                active : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        case actions.CLEAR_ACTIVE_FARMS_DATA:
            return {
                ...state,
                active : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        //
        case actions.START_INACTIVE_FARMS_DATA_FETCH:
            return {
                ...state,
                inactive : {
                    isPresent : false,
                    loading : true,
                    data : {}
                }
            }
        case actions.INACTIVE_FARMS_DATA_FETCH_SUCCESSFULL:
            return {
                ...state,
                inactive : {
                    isPresent : true,
                    loading : false,
                    data : action.data
                }
            }
        case actions.INACTIVE_FARMS_DATA_FETCH_FAILED:
            return {
                ...state,
                inactive : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        case actions.CLEAR_INACTIVE_FARMS_DATA:
            return {
                ...state,
                inactive : {
                    isPresent : false,
                    loading : false,
                    data : {}
                }
            }
        case actions.INITIATE_STAKING_ON_FARM:
            return {
                ...state,
                stakeOperation : {
                    isLoading : true,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.STAKING_ON_FARM_SUCCESSFULL:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                }
            }
        case actions.STAKING_ON_FARM_FAILED:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    completed : false,
                    failed : true,
                    operationHash : null
                }
            }
        case actions.CLEAR_STAKING_ON_FARM_RESPONSE:
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
        case actions.INITIATE_UNSTAKING_ON_FARM:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : true,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.UNSTAKING_ON_FARM_SUCCESSFULL:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                }
            }
        case actions.UNSTAKING_ON_FARM_FAILED:
            return {
                ...state,
                unstakeOperation : {
                    isLoading : false,
                    completed : false,
                    failed : true,
                    operationHash : null
                }
            }
        case actions.CLEAR_UNSTAKING_ON_FARM_RESPONSE:
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
        case actions.INITIATE_HARVESTING_ON_FARM:
            return {
                ...state,
                harvestOperation : {
                    isLoading : true,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.HARVESTING_ON_FARM_SUCCESSFULL:
            return {
                ...state,
                harvestOperation : {
                    isLoading : false,
                    completed : true,
                    failed : false, 
                    operationHash : action.data
                }
            }
        case actions.HARVESTING_ON_FARM_FAILED:
            return {
                ...state,
                harvestOperation : {
                    isLoading : false,
                    completed : false,
                    failed : true,
                    operationHash : null
                }
            }
        case actions.CLEAR_HARVESTING_ON_FARM_RESPONSE:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.OPEN_ACTIVE_FARMS:
            return {
                ...state,
                isActiveOpen : true
            }
        case actions.OPEN_INACTIVE_FARMS:
            return {
                ...state,
                isActiveOpen : false
            }
        case actions.HANDLE_STAKE_ON_FARMS_INPUT_VALUE:
            let stakeInputValuesCopy = state.stakeInputValues
            stakeInputValuesCopy[action.data.address] = action.data.value
            return {
                ...state,
                stakeInputValues : stakeInputValuesCopy
            }
        case actions.SET_FARMS_TO_RENDER:
            return {
                ...state,
                farmsToRender : action.data
            }
        case actions.CLEAR_RENDERED_FARMS:
            return {
                ...state,
                farmsToRender : []
            }
        case actions.OPEN_FARMS_STAKE_MODAL:
            return {
                ...state,
                isStakeModalOpen : true
            }
        case actions.CLOSE_FARMS_STAKE_MODAL:
            return {
                ...state,
                isStakeModalOpen : false
            }
        default:
            return {
                ...state
            }
    }
}

export default farmsReducer;