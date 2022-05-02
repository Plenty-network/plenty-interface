import PropTypes from 'prop-types';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import filter from '../../assets/images/Filter_big.svg';
import filterDark from '../../assets/images/Filter_big_dark.svg';

const SettingsLiq = (props) => {
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <a
      href=""
      className="nav-menu-item-link"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <span className="slippage-settings">
        <img src={props.theme === 'light' ? filter : filterDark} className="settings-filter" />{' '}
        <span className="slippage-value"> {props.slippage} %</span>
      </span>
    </a>
  ));
  CustomToggle.displayName = 'CustomToggle';
  CustomToggle.propTypes = {
    onClick: PropTypes.func,
  };

  return (
    <Dropdown className="transaction-setting-liq">
      <Dropdown.Toggle as={CustomToggle} id="transaction-setting" />

      <Dropdown.Menu className="menu-dropdown transaction-settings-dropdown bg-themed bg-themed-transcation-settings">
        <p className="transaction-setting-menu-label">Transaction Settings</p>
        <p className="transaction-setting-sub-label">Slippage tolerance </p>

        <div className="slipping-tolerance-detail-wrapper flex justify-between align-center">
          <button className="slipping-tolerance-btn" onClick={() => props.setSlippage(0.5)}>
            Auto
          </button>
          <input
            type="text"
            className="slipping-tolerance-input bg-themed-light span-themed"
            placeholder="0.10"
            value={props.slippage}
            onChange={(e) => props.setSlippage(e.target.value)}
            style={{ textAlign: 'right', padding: '10px 26px' }}
          />
          <div className="percentage-icon">
            <span className="span-themed">%</span>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

SettingsLiq.propTypes = {
  setSlippage: PropTypes.any,
  slippage: PropTypes.any,
  theme: PropTypes.any,
};

export default SettingsLiq;
