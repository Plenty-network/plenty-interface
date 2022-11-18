import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ReactComponent as JoyImg } from '../../assets/images/StatusIcons/joy_icon.svg';
import '../../assets/scss/animation.scss';
import useMediaQuery from '../../hooks/mediaQuery';
import '../TwitterShareMessage/TwitterShareMessage.scss';

const TwitterShareMessage = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');
  const [render, setRender] = useState(props.show);

  useEffect(() => {
    if (props.duration && typeof props.duration === 'number' && props.show) {
      setTimeout(() => {
        props.onClose();
      }, props.duration);
    }
  }, [props.show, props.duration]);

  useEffect(() => {
    if (props.show) {
      setRender(true);
    }
  }, [props.show]);

  const animationEndHandler = () => {
    if (!props.show) {
      setRender(false);
    }
  };

  const handleShareClick = () => {
    props.tweetRef.current.click();
  };

  return (
    render && (
      <div
        className={clsx(
          'twitter-message-wrapper',
          isMobile
            ? props.show
              ? 'bottomToTopFadeInAnimation'
              : 'topToBottomFadeOutAnimation'
            : props.show
            ? 'rightToLeftFadeInAnimationTM'
            : 'leftToRightFadeOutAnimationTM',
        )}
        onAnimationEnd={animationEndHandler}
      >
        <div className="flex" style={{ height: '100%' }}>
          <div>
            <JoyImg />
          </div>
          <div className="floater-content">
            <span className="title-text">{props.title}</span>
            <div className="content-text">
              <p
                className={'linkTwitterText'}
                style={{ cursor: 'pointer'}}
                onClick={handleShareClick}
              >
                <span>Share on Twitter</span>
                <span className=" material-icons-round launch-icon-flash" style={{color: '#1C97E9'}}>launch</span>
              </p>
            </div>
          </div>
          <div className="ml-auto">
            {/* <span
              className=" material-icons-round "
              onClick={props.onClose}
              style={{ cursor: 'pointer' }}
            >
              close
            </span> */}
          </div>
        </div>
      </div>
    )
  );
};

export default TwitterShareMessage;

TwitterShareMessage.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.any,
  onClose: PropTypes.func,
  duration: PropTypes.number,
  tweetRef: PropTypes.any,
};