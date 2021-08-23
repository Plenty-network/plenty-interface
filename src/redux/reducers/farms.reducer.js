import * as actions from '../actions/index.action';
import { FARM_PAGE_MODAL } from "../../constants/farmsPage";

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
        tokenPair: null
    },
    modals: {
      open: FARM_PAGE_MODAL.NULL,
      contractAddress: null,
      transactionId: '',
      snackbar: false,
    },
    isActiveOpen : true,
    stakeInputValue : 0,
    farmsToRender : [],
    isStakeModalOpen : false,
    stakeModalIdentifier :'',
    stakeModalTitle : '',
    stakeModalFarmPosition : -1,
    stakeModalContractAddress : '',
    isUnstakeModalOpen : false,
    unstakeModalIdentifier : '',
    unstakeModalContractAddress : '',
    unstakeModalFarmPosition : -1,
    unstakeModalTitle : '',
    unstakeModalwithdrawalFeeStructure : []
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
                    processing: false,
                    completed : false,
                    failed : false,
                    operationHash : null
                }
            }
        case actions.PROCESSING_STAKING_ON_FARM:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    open: FARM_PAGE_MODAL.TRANSACTION_SUCCESS,
                    transactionId: action.payload.opHash
                },
                stakeOperation : {
                    isLoading : false,
                    processing: true,
                    completed : false,
                    failed : false,
                    operationHash : null
                },
                isStakeModalOpen: false,
                stakeInputValue: "",
            }
        case actions.STAKING_ON_FARM_SUCCESSFULL:
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
        case actions.STAKING_ON_FARM_FAILED:
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
        case actions.CLEAR_STAKING_ON_FARM_RESPONSE:
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
        case actions.INITIATE_UNSTAKING_ON_FARM:
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
        case actions.PROCESSING_UNSTAKING_ON_FARM:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    open: FARM_PAGE_MODAL.TRANSACTION_SUCCESS,
                    transactionId: action.payload.opHash
                },
                unstakeOperation : {
                    isLoading : false,
                    processing: true,
                    completed : false,
                    failed : false,
                    operationHash : null
                },
                isUnstakeModalOpen: false,
            }
        case actions.UNSTAKING_ON_FARM_SUCCESSFULL:
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
        case actions.UNSTAKING_ON_FARM_FAILED:
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
        case actions.CLEAR_UNSTAKING_ON_FARM_RESPONSE:
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
        case actions.INITIATE_HARVESTING_ON_FARM:
            return {
                ...state,
                harvestOperation : {
                    isLoading : true,
                    completed : false,
                    failed : false,
                    operationHash : null,
                    tokenPair: action.payload.tokenPair
                }
            }
        case actions.HARVESTING_ON_FARM_SUCCESSFULL:
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
        case actions.HARVESTING_ON_FARM_FAILED:
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
        case actions.CLEAR_HARVESTING_ON_FARM_RESPONSE:
            return {
                ...state,
                stakeOperation : {
                    isLoading : false,
                    processing: false,
                    completed : false,
                    failed : false,
                    operationHash : null,
                    tokenPair: null,
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
            // let stakeInputValuesCopy = state.stakeInputValues
            // stakeInputValuesCopy[action.data.address] = action.data.value
            return {
                ...state,
                stakeInputValues : action.data.value
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
                isStakeModalOpen : true,
                stakeModalIdentifier : action.data.identifier,
                stakeModalTitle : action.data.title,
                stakeModalFarmPosition : action.data.position,
                stakeModalContractAddress : action.data.contractAddress
            }
        case actions.CLOSE_FARMS_STAKE_MODAL:
            return {
                ...state,
                isStakeModalOpen : false,
                stakeModalIdentifier : '',
                stakeModalTitle : '',
                stakeModalFarmPosition : -1,
                stakeModalContractAddress : '',
                stakeInputValue : 0
            }
        case actions.OPEN_FARMS_UNSTAKE_MODAL:
            return {
                ...state,
                isUnstakeModalOpen : true,
                unstakeModalIdentifier : action.data.identifier,
                unstakeModalContractAddress : action.data.contractAddress,
                unstakeModalFarmPosition : action.data.position,
                unstakeModalTitle : action.data.title,
                unstakeModalwithdrawalFeeStructure : action.data.withdrawalFeeStructure
                
            }
        case actions.CLOSE_FARMS_UNSTAKE_MODAL:
            return {
                ...state,
                isUnstakeModalOpen : false,
                unstakeModalIdentifier : '',
                unstakeModalContractAddress : '',
                unstakeModalFarmPosition : -1,
                unstakeModalTitle : '',
                unstakeModalwithdrawalFeeStructure : []
            }

        case actions.OPEN_CLOSE_FARMS_MODAL:
            return {
                ...state,
                modals: { ...state.modals, ...action.payload }
            }

        case actions.DISMISS_FARMS_SNACKBAR:
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

export default farmsReducer;