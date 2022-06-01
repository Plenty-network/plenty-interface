import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Col, Container } from 'react-bootstrap';
import FooterWA from '../../assets/images/footerWA.svg';
import FooterWADark from '../../assets/images/footerWAdark.svg';
import '../../assets/scss/animation.scss';
import SwapWA from './SwapWA';
import '../../assets/scss/partials/_wrappedAssets.scss';
import { WrappedAssetsGradientDiv } from '../../themes';
import useDivHeight from './hooks/useDivHeight';
import VideoModal from '../../Components/VideoPopup';

const WrappedAssets = (props) => {
  const divHeight = useDivHeight();
  const [showVideoModal,setShowVideoModal]=useState(false);
  return (
    
    <WrappedAssetsGradientDiv
      className={'flex flex-grow-1 wa-bg-img '}
      style={{ height: divHeight }}
    >
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString="moNyDWs0rQM"/>}
      <Container fluid className="removing-padding">
        <Col sm={8} md={6} className="wrapped-assets-margin-top">
          <SwapWA {...props} />

          <div className="bottom-footer mt-2 flex flex-row">
            <div className="footer-illustration">
              <img src={props.theme === 'light' ? FooterWA : FooterWADark} alt="graph"></img>
            </div>
            <div className="ml-3">
              <span className="bottom-label">Swap Wrapped Assets </span>
              <p className="bottom-desc">
                Swap wAssets of the deprecated Wrap Protocol for new tokens.
              </p>

              <>
                <span className="bottom-last">
                  <a
                    className="text-decoration-none"
                    target="_blank"
                    rel="noreferrer"
                    onClick={()=>setShowVideoModal(true)}
                  >
                    <span className="learn-more" style={{ cursor: 'pointer' }}>
                      Learn more
                      <span className="material-icons-round launch-icon-flash">launch</span>
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
