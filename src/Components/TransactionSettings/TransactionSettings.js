import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const TransactionSettings = () => {
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
      <span className="material-icons-outlined">settings</span>
    </a>
  ));
  return (
    <Dropdown className="transaction-setting">
      <Dropdown.Toggle
        as={CustomToggle}
        id="transaction-setting"
      ></Dropdown.Toggle>

      <Dropdown.Menu className="menu-dropdown transaction-settings-dropdown">
        <p className="transaction-setting-menu-label">Transaction Settings</p>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TransactionSettings;
