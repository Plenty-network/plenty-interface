import CONFIG from '../config/config';
import { FARMS_CARD_TYPE_LIST } from '../constants/farmsPage';

const getFarmsFromConfig = () => {
  return CONFIG.FARMS[CONFIG.NETWORK];
};

const getWithdrawalFeeFor = (type) => {
  return CONFIG.withdrawalFeeDistribution[type];
};

export const populateFarmsWithoutData = () => {
  const farmsFromConfig = getFarmsFromConfig();

  return (
    Object.entries(farmsFromConfig)
      // ? Converting Object to Array with key set as `identifier`
      .map(([key, value]) => ({ identifier: key, ...value }))
      // ? Combining data from CONFIG and FARMS_CARD_TYPE_LIST
      .reduce(
        (acc, cur) => {
          const formatEachFarm = (farmData, idx) => {
            const properties = FARMS_CARD_TYPE_LIST[farmData.CARD_TYPE];

            return {
              farmData: {
                ...farmData,
                withdrawalFeeType: getWithdrawalFeeFor(farmData.withdrawalFeeType),
              },
              properties,
              identifier: cur.identifier,
              position: idx,
            };
          };

          return {
            active: [...acc.active, ...cur.active.map(formatEachFarm)],
            inactive: [...acc.inactive, ...cur.inactive.map(formatEachFarm)],
          };
        },
        { active: [], inactive: [] },
      )
  );
};
