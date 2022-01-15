import numeral from 'numeral';

export const numberWithCommas = (x: number, { plain = false, decimal = false } = {}) => {
  const formatter = (() => {
    if (x < 999900 || plain) {
      if (decimal && x < 999) {
        return '0,0.00';
      }

      return '0,0';
    }

    return '0,0.0a';
  })();

  return numeral(x).format(formatter);
};
