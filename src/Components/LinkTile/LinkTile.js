import React from 'react';
import Label from "../Ui/Label/Label";
import PropTypes from 'prop-types'
import {Link} from "react-router-dom";
import clsx from "clsx";
import styles from "../LinkTile/linktile.module.scss";

const LinkTile = (props) => {

    const {color = 'default'} = props

    return (
        <div className={clsx(
            styles.tile,
            "px-4", "py-3", "d-flex", "flex-column"
        )}>
            <div className={clsx(
                styles.header,
                props.headerIcon && styles.headerIcon,
                props.headerClassName && props.headerClassName,
                "mb-2", "mt-4", "d-flex", "justify-content-center"
            )}>
                <Label text={props.headerText} subText={props.headerSubText} icon={props.headerIcon}/>
            </div>
            <hr className="w-100"/>
            <div className={clsx(
                styles.text,
                "text-center",
                "p-3", "flex-grow-1", "mb-5"
            )}>
                {props.text}
            </div>
            <div>
                <Link to={props.linkTo}>
                    <button className={clsx(
                        styles.btn,
                        styles[color],
                        "w-100"
                    )}>{props.linkText}
                    </button>
                </Link>
            </div>
        </div>
    )
}

LinkTile.propTypes = {
    headerIcon: PropTypes.string,
    headerText: PropTypes.string,
    headerSubText: PropTypes.string,
    headerClassName: PropTypes.string,
    text: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['default']),
}

export default LinkTile;
