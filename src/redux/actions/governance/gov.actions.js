import * as actions from '../index.action';
import * as govApis from './api.gov';

export const getVoteData = (voteNumber) => {
  return (dispatch) => {
    dispatch({ type: actions.FETCH_VOTE });
    govApis.submitVote(voteNumber).then((voteRes) => {
      console.log(voteRes);
      govApis
        .getVoteDataApi(voteRes.success)
        .then((res) => {
          console.log(res);
          if (res.success) {
            dispatch({
              type: actions.FETCH_VOTE_SUCCESS,
              data: res.data,
            });
          } else {
            throw 'Error in gov api';
          }
        })
        .catch(() => {
          dispatch({ type: actions.FETCH_VOTE_FAILED });
        });
    });
  };
};

export const getVoteResults = () => {
  return (dispatch) => {
    govApis
      .getVoteDataApi(true)
      .then((res) => {
        console.log(res);
        if (res.success) {
          dispatch({
            type: actions.FETCH_VOTE_RESULTS,
            data: res.data,
          });
        } else {
          throw 'Error in gov api';
        }
      })
      .catch(() => {
        dispatch({ type: actions.FETCH_VOTE_FAILED });
      });
  };
};
