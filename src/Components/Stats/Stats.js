import clsx from "clsx";
import styles from "../LinkTile/linktile.module.scss";
import React from "react";

const Stats = (props) => {

    return (
        <div>
            <button className={clsx(
                styles.btn,
                styles[color],
                "w-100"
            )}>{props.linkText}
            </button>
        </div>
    )
}

export default Stats;
