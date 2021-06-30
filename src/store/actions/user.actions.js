import { SAVE_USER_DETAILS } from "../constants/index";

export const saveUserDetails = (userData) => {
  return async (dispatch) => {
    dispatch({ type: SAVE_USER_DETAILS, payload: userData });
  };
};
