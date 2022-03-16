import PropTypes from 'prop-types';
import React from 'react';
import { Col, Container } from 'react-bootstrap';
import FooterWA from '../../assets/images/footerWA.svg';
import FooterWADark from '../../assets/images/footerWAdark.svg';
import '../../assets/scss/animation.scss';
import SwapWA from './SwapWA';
import '../../assets/scss/partials/_wrappedAssets.scss';
import { WrappedAssetsGradientDiv } from '../../themes';

const WrappedAssets = (props) => {
  return (
    <WrappedAssetsGradientDiv className={'flex flex-grow-1 bg-img-light '}>
      <Container fluid className="removing-padding">
        <Col sm={8} md={6} className="swap-content-section wrapped-assets-margin-top">
          <SwapWA {...props} />

          <div className="bottom-footer mt-2 flex flex-row">
            <div className="footer-illustration">
              <img src={props.theme === 'light' ? FooterWA : FooterWADark} alt="graph"></img>
            </div>
            <div className="ml-3">
              <span className="bottom-label">Swap Wrapped Assets </span>
              <p className="bottom-desc">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>

              <>
                <span className="bottom-last">
                  <a
                    href="https://medium.com/plenty-defi/introducing-stable-swaps-on-plenty-trade-similarly-priced-assets-with-low-slippage-518efc56ca40"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="learn-more" style={{ cursor: 'pointer' }}>
                      Learn More
                    </span>
                  </a>
                </span>
              </>
            </div>
          </div>
        </Col>
      </Container>
    </WrappedAssetsGradientDiv>
  );
};

export default WrappedAssets;

WrappedAssets.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
};
