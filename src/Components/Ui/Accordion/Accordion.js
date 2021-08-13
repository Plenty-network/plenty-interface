import React, {useState} from 'react';
import PropTypes from 'prop-types'
import {Collapse} from "react-bootstrap";

const Accordion = props => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <span role="button" onClick={toggle} className="d-flex flex-row mb-3 ">
                <div className="text-light font-weight-bold">{props.text}</div>
                <div className="ml-auto align-self-center">
                    {isOpen ? <span className="material-icons-round text-white">expand_less</span>
                        : <span className="material-icons-round text-white">expand_more</span>
                    }
                </div>
            </span>

            <Collapse in={isOpen}>
                <p className="text-white">{props.accordionText}</p>
            </Collapse>
        </div>
    )
}

Accordion.propTypes = {
    text: PropTypes.string,
    accordionText: PropTypes.string,
}

export default Accordion;
