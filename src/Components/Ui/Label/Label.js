import React from 'react';
import PropTypes from 'prop-types'
import Image from "react-bootstrap/Image";
import clsx from "clsx";
import styles from "../../Ui/Label/label.module.scss";

const Label = props => {

    return (
        <div className="d-flex">
            {props.icon &&
            <div className="mr-2">
                <Image src={props.icon}/>
            </div>
            }
            <div>
                <div className="font-weight-bold">{props.text}</div>
                {props.subText &&
                <div className={styles.subText}>
                    {props.subText}
                </div>}
            </div>
        </div>
    )
}

Label.propTypes = {
    text: PropTypes.string.isRequired || PropTypes.number.isRequired,
    subText: PropTypes.string,
    icon: PropTypes.string,
}

export default Label;
