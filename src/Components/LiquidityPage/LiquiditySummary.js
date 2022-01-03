import React from 'react';
import { Container } from 'react-bootstrap';
import clsx from 'clsx';
import styles from '../../assets/scss/tokens.module.scss';
import { ReactComponent as IncreaseArrow } from '../../assets/images/icons/increase-arrow.svg';
import { ReactComponent as DecreaseArrow } from '../../assets/images/icons/decrease-arrow.svg';
import { numberWithCommas } from '../../utils/formatNumbers';
import { SUMMARY_NAMES } from '../../constants/liquidityPage';
import * as PropTypes from 'prop-types';

const CHANGE = {
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
  NULL: 'NULL',
};

const LiquiditySummary = (props) => {
  return (
    <Container fluid className={clsx(styles.tokens, styles.summary)}>
      {props.data.map((datum) => {
        const change = (() => {
          // IIFE
          if (datum.percentage_change) {
            if (datum.percentage_change >= 0) {
              return CHANGE.POSITIVE;
            }

            return CHANGE.NEGATIVE;
          }

          return CHANGE.NULL;
        })();

        const isCurrency = ['plenty_price', '24h_volume', 'total_liquidity'].includes(datum.name);
        return (
          <div key={datum.name} className="d-flex align-center">
            <div className="mr-2">
              {change === CHANGE.POSITIVE && <IncreaseArrow />}
              {change === CHANGE.NEGATIVE && <DecreaseArrow />}
            </div>

            <div>
              <div>
                <span
                  className={clsx(styles.summaryName, 'mr-2 text-uppercase font-weight-bolder')}
                  title={datum.value}
                >
                  {isCurrency && '$'}
                  {typeof datum.value === 'string'
                    ? datum.value
                    : numberWithCommas(datum.value, { decimal: true })}
                </span>

                {change !== CHANGE.NULL && (
                  <span
                    className={clsx(
                      {
                        [styles.greenText]: change === CHANGE.POSITIVE,
                        [styles.redText]: change === CHANGE.NEGATIVE,
                      },
                      styles.summaryChange,
                    )}
                  >
                    {Math.abs(datum.percentage_change).toFixed(2)}%
                  </span>
                )}
              </div>

              <div>
                <span>{SUMMARY_NAMES[datum.name]}</span>
              </div>
            </div>
          </div>
        );
      })}
    </Container>
  );
};

LiquiditySummary.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      percentage_change: PropTypes.number,
    }),
  ),
};

export default LiquiditySummary;
