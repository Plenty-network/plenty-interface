import numeral from 'numeral';

export const numberWithCommas = (x, { plain = false } = {}) => {
  const formatter = x < 999900 || plain ? '0,0' : '0,0.0a';

  return numeral(x).format(formatter);
};
