import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';

import GraphDark from '../../assets/images/SwapModal/graph-dark.svg';
import Graph from '../../assets/images/SwapModal/graph.svg';

import { useLocation } from 'react-router';
import NormalSwap from './NormalSwap';
import StableeSwap from './StableeSwap';
import { useLocationStateInSwap } from './hooks';
import '../../assets/scss/animation.scss';

const Swap = (props) => {
  const { setActiveTab } = useLocationStateInSwap();
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');
  const [isStableSwap, setStableSwap] = useState(false);
  const [animationLefttoRight, setanimationLefttoRight] = useState(false);

  useEffect(() => {
    splitLocation[1] === 'stableswap' && setStableSwap(true);
  }, [splitLocation[1]]);

  const redirect = (value) => {
    setanimationLefttoRight(true);
    setTimeout(() => {
      setStableSwap(value);
      //resetAllValues();
      value ? setActiveTab('stableswap') : setActiveTab('swap');
    }, 400);
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={8} md={6} className="swap-content-section">
          <p
            className="redirect-label"
            style={{ cursor: 'pointer' }}
            onClick={() => redirect(!isStableSwap)}
          >
            {isStableSwap ? 'Redirect to Swap' : 'Redirect to StableSwap'}
            <span className={clsx('material-icons', 'arrow-forward', 'mt-1')}>
              arrow_forward_ios_icon
            </span>
          </p>

          {isStableSwap ? (
            <StableeSwap redirect={redirect} {...props} isStableSwap={isStableSwap} />
          ) : (
            <NormalSwap {...props} redirect={redirect} isStableSwap={isStableSwap} />
          )}
          <div className="bottom-footer mt-2 flex flex-row">
            <div>
              <img src={props.theme === 'light' ? Graph : GraphDark} alt="graph"></img>
            </div>
            <div className="ml-3">
              <span className="bottom-label">Stable Swap</span>
              <p className="bottom-desc">Lorem Ipsum is simply dummy text of.</p>
              {isStableSwap ? (
                <>
                  <span className="bottom-last">Learn More</span>
                </>
              ) : (
                <>
                  <span
                    className="bottom-last"
                    onClick={() => redirect(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    Try it out
                  </span>
                  <span className="new">New</span>
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Swap;

Swap.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
};
