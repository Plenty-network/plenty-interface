import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';

import AddLiquidity from './LiquidityTabs/AddLiquidity';
import RemoveLiquidity from './LiquidityTabs/RemoveLiquidity';

import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const LiquidityTab = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultKey = useMemo(() => {
    if (location.pathname === '/liquidity/remove') {
      return 'remove';
    }

    return 'add';
  }, [location.pathname]);

  const changeLiquidityType = (tab) => {
    navigate(`/liquidity/${tab}`, {
      state: { searchParams },
    });
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params.tokenA !== params.tokenB) {
      if (params.tokenA) {
        props.tokens.map((token) => {
          if (token.name === params.tokenA) {
            props.setTokenIn({
              name: params.tokenA,
              image: token.image,
            });
          }
        });
      }

      if (params.tokenB) {
        props.tokens.map((token) => {
          if (token.name === params.tokenB) {
            props.setTokenOut({
              name: params.tokenB,
              image: token.image,
            });
          }
        });
      }
    }
  }, []);

  return (
    <>
      <div className="swap-content-box-wrapper">
        <Tabs
          ativeKey={defaultKey}
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

LiquidityTab.propTypes = {
  setTokenIn: PropTypes.any,
  setTokenOut: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  tokens: PropTypes.any,
};

export default LiquidityTab;
