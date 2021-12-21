import * as actions from '../actions/index.action';
import { GOV_PAGE_MODAL } from '../../constants/govPage';

const initialState = {
  gov: {
    isPresent: false,
    loading: false,
    alreadyVoted: false,
    data: {},
  },
  modals: {
    open: GOV_PAGE_MODAL.NULL,
    transactionId: '',
  },
};
const govReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_VOTE:
      return {
        ...state,
        gov: {
          isPresent: false,
          loading: true,
          data: { ...state.gov.data },
        },
      };
    case actions.FETCH_VOTE_PROCESSING: // INITIATION
      return {
        ...state,
        gov: { ...state.gov },
        modals: {
          ...state.modals,
          open: GOV_PAGE_MODAL.TRANSACTION_SUCCESS,
          transactionId: action.payload,
        },
      };
    case actions.FETCH_VOTE_SUCCESS:
      return {
        ...state,
        gov: { isPresent: true, loading: false, data: action.data },
      };
    case actions.FETCH_VOTE_RESULTS:
      return {
        ...state,
        gov: {
          isPresent: true,
          loading: false,
          alreadyVoted: state.gov.alreadyVoted,
          data: action.data,
        },
      };
    case actions.FETCH_ALREADY_VOTED:
      return {
        ...state,
        gov: {
          isPresent: true,
          loading: false,
          alreadyVoted: action.data,
          data: { ...state.gov.data },
        },
      };
    case actions.FETCH_VOTE_FAILED:
      return {
        ...state,
        gov: { isPresent: false, loading: false, data: { ...state.gov.data } },
        modals: {
          ...state.modals,
          open: GOV_PAGE_MODAL.TRANSACTION_FAILED,
        },
      };
    default:
      return {
        ...state,
      };
  }
};
export default govReducer;
