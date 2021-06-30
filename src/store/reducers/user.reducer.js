import { SAVE_USER_DETAILS } from "../constants/index";

const initialState = {
  name: "Arhan",
  lastName: "Choudhury",
  mobileNumber: "9022936501",
  address: "Mumbai",
};

export default function userReducer(state = initialState, action) {
  console.log(action.payload);
  switch (action.type) {
    case SAVE_USER_DETAILS:
      return {
        ...state,
        name: action.payload.name,
        lastName: action.payload.lastName,
        mobileNumber: action.payload.mobileNumber,
        address: action.payload.address,
      };
    default:
      return state;
  }
}
