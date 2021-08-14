import clsx from "clsx";
import PropTypes from 'prop-types'
import React from "react";
import {Row, Col, Image} from "react-bootstrap";
import Label from "../Ui/Label/Label";
import greenBullet from '../../assets/images/stats/greenbullet.png';
import dollar from '../../assets/images/stats/dollar.png';
import plentyEarned from '../../assets/images/stats/plentyearned.png';
import plentyInWallet from '../../assets/images/stats/plentyinwallet.svg';
import plentyToHarvest from '../../assets/images/stats/plentytoharvest.svg';
import { StyledDiv } from '../../themes';
import styles from "./stats.module.scss";
import Button from "../Ui/Buttons/Button";

const Stats = (props) => {

    function harvestAll() {
        return function (e) {
            console.log(e);
        };
    }

    return (
        <StyledDiv className={clsx("p-3", styles.container)}>
            <Row className="p-3">
                <Col>
                    <p className="font-weight-bold m-0">Your Stats<Image className="ml-2" src={greenBullet}/></p>
                </Col>
            </Row>
            <hr/>
            <Row className="p-3">
                <Col>
                    <Label text={`$${props.valueLocked.toLocaleString(undefined, {maximumFractionDigits: 20})}`} subText={"Total value locked"} icon={dollar} iconClass={"mt-1"}/>
                </Col>
                <Col>
                    <Label text={props.plentyEarned.toLocaleString(undefined, {maximumFractionDigits: 20})} subText={"Total PLENTY earned"} icon={plentyEarned} iconClass={"mt-1"}/>
                </Col>
            </Row>
            <hr/>
            <Row className="p-3">
                <Col sm={6}>
                    <Label text={`$${props.plentyInWallet.toLocaleString(undefined, {maximumFractionDigits: 20})}`} subText={"PLENTY in wallet"} icon={plentyInWallet} iconClass={"mt-1"}/>
                </Col>
                <Col sm={6}>
                    <Label text={`$${props.plentyToHarvest.toLocaleString(undefined, {maximumFractionDigits: 20})}`} subText={"PLENTY to harvest"} icon={plentyToHarvest} iconClass={"mt-1"}/>
                </Col>
            </Row>
            <Row className="p-3 mt-1">
                <Col>
                    <Button onClick={harvestAll} color={"primary"} className={"w-100"}>Havest all</Button>
                </Col>
            </Row>
        </StyledDiv>
    )
}

Stats.propTypes = {
    valueLocked: PropTypes.number,
    plentyEarned: PropTypes.number,
    plentyInWallet: PropTypes.number,
    plentyToHarvest: PropTypes.number,
}

export default Stats;
