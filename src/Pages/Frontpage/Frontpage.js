import React from 'react';
import styles from './frontpage.module.scss';
import Button from '../../Components/Ui/Buttons/Button';
import Label from '../../Components/Ui/Label/Label';
import Container from 'react-bootstrap/Container';
import {Col, Row} from 'react-bootstrap';

import dollar from '../../assets/images/frontpage/dollar.png';
import marketCap from '../../assets/images/frontpage/marketcap.png';
import farms from '../../assets/images/frontpage/farms.png';
import totalBurned from '../../assets/images/frontpage/totalburned.png';
import LinkTile from "../../Components/LinkTile/LinkTile";

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

    const walletConnected = false;

    return (
        <Container fluid>
            <div className={styles.rec}>
                {
                    walletConnected ?
                        <div>
                            <Row className="pt-5">
                                <Col className="mt-5 col-lg-6 col-sm-12">
                                    <span className={styles.tvlValue}>$ 1,212,125,125</span>
                                    <h4 className={styles.tvlText}>Total Value Locked</h4>
                                    <h6 className={styles.info}>Trade tokens and earn interest by staking. There is plenty
                                        of DeFi
                                        to explore on Tezos.</h6>
                                    <Button className={styles.button} color={'secondary'} onClick={onClickButton()}>Enter
                                        App</Button>
                                </Col>
                                <Col className="col-lg-6 col-sm-12">
                                    Wallet
                                </Col>
                            </Row>
                        </div>
                        : <div>
                            <Row className="pt-5">
                                <Col className="mt-5">
                                    <span className={styles.tvlValue}>$ 1,212,125,125</span>
                                    <h4 className={styles.tvlText}>Total Value Locked</h4>
                                    <h6 className={styles.info}>Trade tokens and earn interest by staking. There is plenty
                                        of DeFi
                                        to explore on Tezos.</h6>
                                    <Button className={styles.button} color={'secondary'} onClick={onClickButton()}>Enter
                                        App</Button>
                                </Col>
                            </Row>
                        </div>
                }

                <Row>
                    <Col>

                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>
            </div>
            <Row>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">
                    <Label text={`$${dummyValues.currentPrice.toLocaleString()}`} icon={dollar}
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
                    <Label text={dummyValues.circulatingSupply.toLocaleString()}
                           subText={'Circulating Supply'}/>
                </Col>
                <Col sm={6} md={4} xl={2} className="px-5 py-4 m-sm-auto">
                    <Label text={dummyValues.plentyPerBlock} subText={'New PLENTY/Block'}/>
                </Col>
            </Row>
            <hr className="mt-0"/>
            <Row>
                <Col xs={12} className="text-center my-4">
                    <span className={styles.plentyOnTezos}>Plenty of DeFi on Tezos</span>
                </Col>
            </Row>
            <Row className="px-lg-5 mb-5">
                <Col xs={12} md={6} lg={3} className="mb-3">
                    <LinkTile
                        text={"The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click."}
                        linkTo={"farms"} linkText={"Enter farms"} icon={farms} iconText={"Farms"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3">
                    <LinkTile
                        text={"The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click."}
                        linkTo={"farms"} linkText={"Enter farms"} icon={farms} iconText={"Farms"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3">
                    <LinkTile
                        text={"The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click."}
                        linkTo={"farms"} linkText={"Enter farms"} icon={farms} iconText={"Farms"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3">
                    <LinkTile
                        text={"The most competitive rates for DeFi bluechips anywhere. Switch to other chains in one click."}
                        linkTo={"farms"} linkText={"Enter farms"} icon={farms} iconText={"Farms"}/>
                </Col>
            </Row>
            <Row>
                <Col lg={6} xs={12}>
                    <div className="px-lg-5">
                        <span className={styles.plentyOnTezos}>About Plenty</span>
                        <h6>we do a deep dive into the portfolio. We identify core strengths and look for
                            brand work in specific industries. Quality of work and documentation are
                            assessed as well.
                        </h6>
                    </div>
                </Col>
            </Row>
        </Container>
    )
};


export default Frontpage;
