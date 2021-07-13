import { SAVE_USER_DETAILS } from "../../actions/user/user.constants";

const initialState = {
  loading: true,
  liquidity: 100,
  tvl: 100000,
  tvlUser: 10000,
  homePageData: {
    totalMinted: 100000,
    circulatingSupply: 100000,
  },
  homePageTokenBalance: 100000,
  homePageTokenPrice: 100000,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_USER_DETAILS:
      return {
        ...state,
        liquidity: action.payload.liquidity,
        tvl: action.payload.tvl,
        tvlUser: action.payload.tvlUser,
        homePageTokenBalance: action.payload.homePageTokenBalance,
        homePageTokenPrice: action.payload.homePageTokenPrice,
      };
    default:
      return state;
  }
}
