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

export default SwapTabContent;
