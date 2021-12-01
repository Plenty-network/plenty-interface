import PropTypes from 'prop-types';
import React from 'react';
import SwapTab from './SwapTab';
import LiquidityTab from './LiquidityTab';
import Tab from 'react-bootstrap/Tab';

const SwapTabContent = (props) => {
  return (
    <>
      <Tab>
        <SwapTab handleShow={props.handleShow} />
      </Tab>
      <Tab>
        <LiquidityTab />
      </Tab>
    </>
  );
};

SwapTabContent.propTypes = {
  handleShow: PropTypes.any,
};

export default SwapTabContent;
