import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import AddLiquidity from './LiquidityTabs/AddLiquidity';
import RemoveLiquidity from './LiquidityTabs/RemoveLiquidity';

import { useState, useEffect } from 'react';

const LiquidityTab = (props) => {
  let defaultKey = 'add';

  const changeLiquidityType = () => {
    if (window.location.pathname.replace('/liquidity/', '') === 'add') {
      window.history.pushState(
        {
          path: `/liquidity/remove?tokenA=${props.tokenIn.name}&tokenB=${props.tokenOut.name}`,
        },
        '',
        `/liquidity/remove?tokenA=${props.tokenIn.name}&tokenB=${props.tokenOut.name}`,
      );
      defaultKey = 'remove';
    } else {
      window.history.pushState(
        {
          path: `/liquidity/add?tokenA=${props.tokenIn.name}&tokenB=${props.tokenOut.name}`,
        },
        '',
        `/liquidity/add?tokenA=${props.tokenIn.name}&tokenB=${props.tokenOut.name}`,
      );
      defaultKey = 'add';
    }
  };

  if (window.location.pathname.replace('/liquidity/', '') === 'remove') {
    defaultKey = 'remove';
  } else {
    defaultKey = 'add';
  }

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params.tokenA !== params.tokenB) {
      if (params.tokenA) {
        props.tokens.map((token) => {
          if (token.name == params.tokenA) {
            props.setTokenIn({
              name: params.tokenA,
              image: token.image,
            });
          }
        });
      }

      if (params.tokenB) {
        props.tokens.map((token) => {
          if (token.name == params.tokenB) {
            props.setTokenOut({
              name: params.tokenB,
              image: token.image,
            });
          }
        });
      }
    } else {
      return;
    }
  }, []);

  return (
    <>
      <div className="swap-content-box-wrapper">
        <Tabs
          defaultActiveKey={defaultKey}
          className={
            !props.tokenOut.name
              ? 'liquidity-container-tab content-hide'
              : 'liquidity-container-tab'
          }
          onSelect={(e) => changeLiquidityType(e)}
        >
          <Tab eventKey="add" title="Add">
            <AddLiquidity {...props} />
          </Tab>
          <Tab eventKey="remove" title="Remove">
            <RemoveLiquidity {...props} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default LiquidityTab;
