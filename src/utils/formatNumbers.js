import numeral from 'numeral';

export const numberWithCommas = (x) => {
  const formatter = x < 999900 ? '0,0' : '0,0.0a';

  return numeral(x).format(formatter);
}
