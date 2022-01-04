import CONFIG from './config';

const getFarmsFromConfig = () => {
  return CONFIG.FARMS[CONFIG.NETWORK];
};

export const getAllFarms = () => {
  const farmsFromConfig = getFarmsFromConfig();

  return (
    Object.entries(farmsFromConfig)
      // ? Converting Object to Array with key set as `identifier`
      .map(([key, value]) => ({ identifier: key, ...value }))
      // ? Combining active and inactive farms
      .reduce(
        (acc, cur) => ({
          active: [...acc.active, ...cur.active],
          inactive: [...acc.inactive, ...cur.inactive],
        }),
        { active: [], inactive: [] },
      )
  );
};

const isActive = (type) => {
  if (type === 'FARM') {
    const allFarms = getAllFarms();

    return (contract) => !!allFarms.active.find((farm) => farm.CONTRACT === contract);
  }
};

export const isActiveFarm = isActive('FARM');
