import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

const Accordion = (props) => {
  const [isOpen, setIsOpen] = useState(props.isOpen ? props.isOpen : false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={props.className && props.className}>
      <div role="button" onClick={toggle} className="d-flex flex-row py-3">
        <h6 className="text-white font-weight-bold">{props.text}</h6>
        <div className="ml-auto">
          {isOpen ? (
            <span className="material-icons-round text-white">expand_less</span>
          ) : (
            <span className="material-icons-round text-white">expand_more</span>
          )}
        </div>
      </div>

      <Collapse in={isOpen}>{props.children}</Collapse>
    </div>
  );
};

Accordion.propTypes = {
  text: PropTypes.string,
  accordionText: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
};

export default Accordion;
