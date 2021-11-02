import Axios from 'axios';
import CONFIG from '../../../config/config';

export const fetchTokensData = async () => {
  try {
    const response = await Axios.get(
      CONFIG.TOKENS_PAGE[CONFIG.NETWORK].API_URL
    );

    return {
      success: true,
      tokensData: response.data,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      tokensData: {},
    };
  }
};
