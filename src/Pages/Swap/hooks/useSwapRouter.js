import { getBestRouteAPI } from '../../../apis/swap/swap-v2';

export const useSwapRouter = () => {
  const getBestRoute = async (tokenIn, tokenOut) => {
    return await getBestRouteAPI(tokenIn.name, tokenOut.name);
  };

  return { getBestRoute };
};
