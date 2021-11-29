import Button from '../../Components/Ui/Buttons/Button';
import React, { useState } from 'react';

import styles from './first-time-disclaimer.module.scss';
import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import PlentyLogo from '../../assets/images/plenty-beta-logo.svg';
import { FIRST_TIME_DISCLAIMER } from '../../constants/localStorage';

const FirstTimeDisclaimer = () => {
  const [checked, setChecked] = useState([false, false]);

  const onAccept = () => {
    localStorage.setItem(FIRST_TIME_DISCLAIMER, 'true');
    window.location.reload(); // ? Try moving this to redux later
  };

  return (
    <div className="d-flex justify-content-center align-center vh-100 vw-100">
      <div className={clsx(styles.card, 'p-4')}>
        <div className="d-flex justify-content-center p-2">
          <Image src={PlentyLogo} alt={'Plenty'} className={styles.logo} />
        </div>

        <hr />

        <div>
          <div className={clsx('d-flex', styles.checkbox)}>
            <input
              value={checked[0]}
              type="checkbox"
              onChange={(ev) => setChecked([ev.target.checked, checked[1]])}
              id="d-01"
            />

            <label className={clsx(styles.disclaimerItem, 'ml-3 mb-2 p-3')} htmlFor="d-01">
              I understand that I am using this product in beta at my own risk. Any losses incurred
              due to my actions are my own responsibility.
            </label>
          </div>

          <div className={clsx('d-flex', styles.checkbox)}>
            <input
              value={checked[1]}
              type="checkbox"
              onChange={(ev) => setChecked([checked[0], ev.target.checked])}
              id="d-02"
            />

            <label className={clsx(styles.disclaimerItem, 'ml-3 mb-2 p-3')} htmlFor="d-02">
              I understand that this product is still in beta. I am participating at my own risk.
            </label>
          </div>
        </div>

        <Button
          onClick={onAccept}
          color={'primary'}
          disabled={!checked.every((x) => x)}
          className="w-100"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default FirstTimeDisclaimer;
