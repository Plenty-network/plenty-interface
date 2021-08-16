import clsx from "clsx";
import PropTypes from 'prop-types'
import React from "react";
import {Row, Col, Image} from "react-bootstrap";
import Label from "../Ui/Label/Label";
import greenBullet from '../../assets/images/stats/greenbullet.png';
import dollar from '../../assets/images/stats/dollar.png';
import plentyInWallet from '../../assets/images/stats/plentyinwallet.svg';
import plentyToHarvest from '../../assets/images/stats/plentytoharvest.svg';
import plentyMedium from '../../assets/images/stats/plentymedium.png';
import styles from "./stats.module.scss";
import Button from "../Ui/Buttons/Button";

const Stats = (props) => {

    function harvestAll() {
        return function (e) {
            console.log(e);
        };
    }

    return (
        <div className={clsx("p-3", "bg-themed", styles.container)}>
            <Row className="p-3">
                <Col xs={7}>
                    <p className="font-weight-bold m-0 p-3">Your Stats<Image className="ml-2" src={greenBullet}/></p>
                    <hr className="pb-3"/>
                    <Label text={`$${props.valueLocked.toLocaleString(undefined, {maximumFractionDigits: 20})}`} subText={"Total value locked"} icon={dollar} iconClass={"mt-1"}/>

                </Col>
                <Col xs={5} md={3} lg={5} className="m-auto">
                    <Image className="w-100" src={plentyMedium}/>
                </Col>
            </Row>

            <hr/>
            <Row className="p-3">
                <Col>
                    <Label text={`$${props.plentyInWallet.toLocaleString(undefined, {maximumFractionDigits: 20})}`} subText={"PLENTY in wallet"} icon={plentyInWallet} iconClass={"mt-1"}/>
                </Col>
                <Col>
                    <Label text={`$${props.plentyToHarvest.toLocaleString(undefined, {maximumFractionDigits: 20})}`} subText={"PLENTY to harvest"} icon={plentyToHarvest} iconClass={"mt-1"}/>
                </Col>
            </Row>
            <Row className="p-3 mt-1">
                <Col>
                    <Button onClick={harvestAll} color={"primary"} className={"w-100"}>Harvest all</Button>
                </Col>
            </Row>
        </div>
    )
}

Stats.propTypes = {
    valueLocked: PropTypes.number,
    plentyEarned: PropTypes.number,
    plentyInWallet: PropTypes.number,
    plentyToHarvest: PropTypes.number,
}

export default Stats;
