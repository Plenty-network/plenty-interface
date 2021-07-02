import { WALLET_ADDRESS } from "../../actions/index.action";

export const walletAddress = (initialState = null, action) => {
  switch (action.type) {
    case WALLET_ADDRESS:
      return action.payload;
    default:
      return initialState;
  }
};
