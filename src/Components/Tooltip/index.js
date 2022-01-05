import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip as BSTooltip } from 'react-bootstrap';

const Tooltip = (props) => {
  return (
    <OverlayTrigger
      key="top"
      placement="top"
      overlay={
        <BSTooltip id={props.id} arrowProps={{ styles: { display: 'none' } }}>
          {props.message}
        </BSTooltip>
      }
    >
      <span style={{ cursor: 'pointer' }} className="material-icons-round plenty-tooltip-default">
        help_outline
      </span>
    </OverlayTrigger>
  );
};

Tooltip.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Tooltip;
