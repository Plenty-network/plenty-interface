import React from 'react';
import styles from './frontpage.module.scss';
import Button from '../../Components/Ui/Buttons/Button';
import Label from '../../Components/Ui/Label/Label';
import Container from 'react-bootstrap/Container';
import {Col, Row} from 'react-bootstrap';
import clsx from "clsx";
import dollar from '../../assets/images/frontpage/dollar.png';
import marketCap from '../../assets/images/frontpage/marketcap.png';
import farms from '../../assets/images/frontpage/farms.png';
import totalBurned from '../../assets/images/frontpage/totalburned.png';
import circulatingSupply from '../../assets/images/frontpage/circulatingsupply.png';
import plentyBlock from '../../assets/images/frontpage/plentyblock.png';
import plentyBig from '../../assets/images/frontpage/plentybig.png';
import LinkTile from "../../Components/LinkTile/LinkTile";
import Accordion from "../../Components/Ui/Accordion/Accordion";

const Frontpage = (props) => {

    const dummyValues = {
        currentPrice: 0.999715,
        marketCap: 100_000_000.00,
        totalMinted: 60_000_000.00,
        totalBurned: 1_234_567.89,
        circulatingSupply: 21_234_567,
        plentyPerBlock: 60
    }

    function onClickButton() {
        return function (e) {
            console.log(e);
        };
    }

    const walletConnected = true;

    return (
        <Container fluid>
            <div className={styles.rectangle}>
                <Row className={clsx(

                )}>
                    <Col className={clsx(
                        walletConnected ? ["col-lg-6", "col-sm-12"]
                            : "col-sm-12"
                    )}>
                        <div className="p-3 p-lg-5">
                            {
                                walletConnected ? (
                                        <div className="align-items-lg-start align-items-center d-flex flex-column">
                                            <h4 className={styles.tvlText}>Total Value Locked</h4>
                                            <span className={styles.tvlValue}>$ 1,212,125,125</span>
                                            <h6 className={styles.info}>Trade tokens and earn interest by staking. There is
                                                plenty of DeFi to explore on Tezos.</h6>
                                            <Button className={styles.button} color={'secondary'} onClick={onClickButton()}>Enter
                                                App</Button>
                                        </div>
                                    )
                                    : (
                                        <div className="align-items-center d-flex flex-column">
                                            <span className={styles.tvlValue}>$ 1,212,125,125</span>
                                            <h4 className={styles.tvlText}>Total Value Locked</h4>
                                            <h6 className={styles.info}>Trade tokens and earn interest by staking. There is
                                                plenty of DeFi to explore on Tezos.</h6>
                                            <Button className={styles.button} color={'secondary'} onClick={onClickButton()}>Enter
                                                App</Button>
                                        </div>
                                    )
                            }
                        </div>
                    </Col>
                    {
                        walletConnected && (
                            <Col className="col-lg-6 col-sm-12">
                                <div className="p-3 p-lg-5">

                                </div>
                            </Col>
                        )
                    }
                </Row>
            </div>
            <Row>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">
                    <Label text={`$${dummyValues.currentPrice.toLocaleString(undefined, {maximumFractionDigits: 20})}`}
                           icon={dollar}
                           subText={'Price'}/>
                </Col>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">

                    <Label text={`$${dummyValues.marketCap.toLocaleString()}`} icon={marketCap}
                           subText={'Market Cap'}/>

                </Col>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">
                    <Label text={dummyValues.totalMinted.toLocaleString()} icon={farms}
                           subText={'Total minted'}/>
                </Col>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">
                    <Label text={dummyValues.totalBurned.toLocaleString()} icon={totalBurned}
                           subText={'Total burned'}/>
                </Col>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">
                    <Label text={dummyValues.circulatingSupply.toLocaleString()} icon={circulatingSupply}
                           subText={'Circulating Supply'}/>
                </Col>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">
                    <Label text={dummyValues.plentyPerBlock.toLocaleString()} subText={'New PLENTY/Block'}
                           icon={plentyBlock}/>
                </Col>
            </Row>
            <hr className="mt-0"/>
            <Row>
                <Col xs={12} className="text-center my-4">
                    <span className={styles.plentyOnTezos}>Plenty of DeFi on Tezos</span>
                </Col>
            </Row>
            <Row className="px-lg-5 mb-5">
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"The first token-to-token AMM on Tezos. Swap tokens and add liquidity."}
                        linkTo={"/swap"} linkText={"Enter Exchange"} headerIcon={circulatingSupply}
                        headerText={"AMM"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click."}
                        linkTo={"/farms"} linkText={"Enter Farms"} headerIcon={farms} headerText={"Farms"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click."}
                        linkTo={"/pools"} linkText={"Enter Pools"} headerText={"Pools"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click."}
                        linkTo={"/ponds"} linkText={"Enter Ponds"} headerText={"Ponds"}/>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col lg={6} xs={12}>
                    <div className="px-lg-5">
                        <span className={styles.plentyOnTezos}>About Plenty</span>
                        <h6>we do a deep dive into the portfolio. We identify core strengths and look for
                            brand work in specific industries. Quality of work and documentation are
                            assessed as well.
                        </h6>
                        <span className="material-icons-round">
                            discord
                        </span>
                        <span className="material-icons-round">
                            telegram
                        </span>
                        <span className="material-icons-round">
                            twitter
                        </span>
                    </div>
                </Col>
                <Col lg={6} className="d-none d-lg-block">
                    <div className="px-lg-5">
                        <img src={plentyBig}/>
                    </div>
                </Col>
            </Row>
            <div className={clsx(
                styles.rectangle,
                "p-5"
            )}>
                <Row>
                    <Col sm={6}>
                        <h2 className="text-white p-lg-5">Frequently asked questions</h2>
                    </Col>
                    <Col sm={6}>
                        <h5 className={"text-white p-lg-5"}>Leverage agile frameworks to provide a robust synopsis for
                            high
                            level overviews. Iterative approaches to corporate strategy foster collaborative thinking to
                            further</h5>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <div className="p-lg-5">
                            <Accordion text={"What I will learn after completing this course?"}
                                       accordionText={"Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas. Dynamically innovate resource-leveling customer service for state of the art customer service."}/>
                        </div>

                    </Col>
                </Row>
            </div>
        </Container>
    )
};


export default Frontpage;
