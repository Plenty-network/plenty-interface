import React, { useEffect, useRef } from 'react';
import './videostyle.css';
import PropTypes from 'prop-types';

const VideoModal=(props)=>{
    const {closefn,linkString}=props;
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (ref.current && !ref.current.contains(event.target)) {
            closefn && closefn(false);
          }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
          document.removeEventListener('click', handleClickOutside, true);
        };
      }, [ closefn ]);
    return (
        <div className="modal-video" tabIndex={-1} role="dialog" aria-label="You just opened the modal video">
            <div className="modal-video-body">
                <div className="modal-video-inner" ref={ref}>
                    <div className="modal-video-movie-wrap" style={{ paddingBottom: '56.25%' }} onClick={()=>closefn(false)}>
                        <button className="modal-video-close-btn" aria-label="Close the modal by clicking here" />
                        <iframe width={460} height={230} src={`//www.youtube.com/embed/${linkString}?autoplay=1`} frameBorder={0} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="true" tabIndex={-1} />
                    </div>
                </div>
            </div>
        </div>
    );
};
VideoModal.propTypes = {
    closefn: PropTypes.func,
    linkString:PropTypes.string,
};
export default VideoModal;

