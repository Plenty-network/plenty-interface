import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';

import AddLiquidity from './LiquidityTabs/AddLiquidity';
import RemoveLiquidity from './LiquidityTabs/RemoveLiquidity';

import React, { useEffect, useMemo } from 'react';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const LiquidityTab = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeKey = useMemo(() => {
    if (location.pathname === '/liquidity/remove') {
      return 'remove';
    }

    return 'add';
  }, [location.pathname]);

  const changeLiquidityType = (tab) => {
    const tokenAFromParam = searchParams.get('tokenA');
    const tokenBFromParam = searchParams.get('tokenB');
    navigate({
      pathname: `/liquidity/${tab}`,
      search: `?${createSearchParams({
        ...(tokenAFromParam ? { tokenA: tokenAFromParam } : {}),
        ...(tokenBFromParam ? { tokenB: tokenBFromParam } : {}),
      })}`,
    });
  };

  useEffect(() => {
    const tokenAFromParam = searchParams.get('tokenA');
    const tokenBFromParam = searchParams.get('tokenB');

    if (tokenAFromParam !== tokenBFromParam) {
      if (tokenAFromParam) {
        props.tokens.map((token) => {
          if (token.name === tokenAFromParam) {
            props.setTokenIn({
              name: tokenAFromParam,
              image: token.image,
            });
          }
        });
      }

      if (tokenBFromParam) {
        props.tokens.map((token) => {
          if (token.name === tokenBFromParam) {
            props.setTokenOut({
              name: tokenBFromParam,
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
          activeKey={activeKey}
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
