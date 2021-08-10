import React from 'react';
import Label from "../Ui/Label/Label";
import PropTypes from 'prop-types'
import Button from "../Ui/Buttons/Button";
import {Link} from "react-router-dom";
import clsx from "clsx";
import styles from "../LinkTile/linktile.module.scss";

const LinkTile = (props) => {

    const { color = 'default' } = props

    return (
        <div className={clsx(
            styles.tile,
            "px-4", "py-3"
        )}>
            <div className={clsx(
                styles.iconText,
                "my-3", "d-flex", "justify-content-center"
            )}>
                <Label text={props.iconText} subText={props.iconSubText} icon={props.icon}/>
            </div>
            <hr/>
            <div className="mb-5 text-center">
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
    icon: PropTypes.string,
    iconText: PropTypes.string,
    iconSubText: PropTypes.string,
    text: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['default']),
}

export default LinkTile;
