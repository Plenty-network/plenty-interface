import { SAVE_USER_DETAILS } from "./user.constants";

export const saveUserDetails = (userData) => {
  return async (dispatch) => {
    dispatch({ type: SAVE_USER_DETAILS, payload: userData });
  };
};
