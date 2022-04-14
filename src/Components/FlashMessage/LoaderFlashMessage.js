import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
//import { PuffLoader } from 'react-spinners';
import { ReactComponent as SuccessImg } from '../../assets/images/StatusIcons/success_large.svg';
import { ReactComponent as ErrorImg } from '../../assets/images/StatusIcons/error_large.svg';
import { ReactComponent as InfoImg } from '../../assets/images/StatusIcons/info_large.svg';
import { ReactComponent as QuestionImg } from '../../assets/images/StatusIcons/question_large.svg';
import { ReactComponent as WarnImg } from '../../assets/images/StatusIcons/warning_large.svg';
import '../../assets/scss/animation.scss';
import useMediaQuery from '../../hooks/mediaQuery';
import { PuffLoader } from 'react-spinners';
import '../FlashMessage/FlashMessage.scss';

const LoaderFlashMessage = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');
  
  const statusImages = useRef({
     success: <SuccessImg />,
     error: <ErrorImg />,
     info: <InfoImg />,
     question: <QuestionImg />,
     warning: <WarnImg /> 
  });

  useEffect(() => {
    if(props.duration && typeof props.duration === 'number' && props.show) {
      setTimeout(() => {
        props.onClose();
      },props.duration);
    }
  }, [props.show, props.duration]);

  if (props.loading) {
    return (
      <div className="flash-message-loading-wrapper">
        <PuffLoader color="var(--theme-primary-1)" size={36} />
      </div>
    );
  }

  if (props.show) {
    return (
      <div
        className={clsx(
          'flash-message-wrapper',
          props.type,
          isMobile
            ? 'bottomToTopFadeInAnimation-4-floater'
            : 'rightToLeftFadeInAnimation-4-floater',
        )}
      >
        <div className="d-flex ">
          <div>
            {statusImages.current[props.type]}
          </div>
          <div className="floater-text">
            <span className="status-text">{props.title}</span>
            <div className="content">
              {props.children}
            </div>
          </div>
          <div className="ml-auto">
            <span
              className=" material-icons-round "
              onClick={props.onClose}
              style={{ cursor: 'pointer' }}
            >
              close
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default LoaderFlashMessage;

LoaderFlashMessage.propTypes = {
    loading: PropTypes.bool,
    show: PropTypes.bool,
    type: PropTypes.string,
    title: PropTypes.any,
    onClose: PropTypes.func,
    duration: PropTypes.number,
    children: PropTypes.any
};