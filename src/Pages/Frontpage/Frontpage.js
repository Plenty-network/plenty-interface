import React from 'react';
import styles from './frontpage.module.scss';
import Button from '../../Components/Ui/Buttons/Button';
import Label from '../../Components/Ui/Label/Label';
import Container from 'react-bootstrap/Container';
import {Col, Image, Row} from 'react-bootstrap';
import {Link, Route} from 'react-router-dom';
import clsx from "clsx";
import dollar from '../../assets/images/frontpage/dollar.png';
import marketCap from '../../assets/images/frontpage/marketcap.png';
import farms from '../../assets/images/frontpage/farms.png';
import totalBurned from '../../assets/images/frontpage/totalburned.png';
import circulatingSupply from '../../assets/images/frontpage/circulatingsupply.png';
import plentyBlock from '../../assets/images/frontpage/plentyblock.png';
import plentyBig from '../../assets/images/frontpage/plentybig.png';
import discord from '../../assets/images/frontpage/discord.svg';
import telegram from '../../assets/images/frontpage/telegram.svg';
import twitter from '../../assets/images/frontpage/twitter.svg';
import plentyMedium from '../../assets/images/frontpage/plentymedium.png';
import LinkTile from "../../Components/LinkTile/LinkTile";
import Accordion from "../../Components/Ui/Accordion/Accordion";
import Stats from "../../Components/Stats/Stats";
import Header from "../../Components/Header/Header";
import {FrontPageGradientDiv} from "../../themes";

const Frontpage = (props) => {

    const dummyValues = {
        currentPrice: 0.999715,
        marketCap: 100_000_000.00,
        totalMinted: 60_000_000.00,
        totalBurned: 1_234_567.89,
        circulatingSupply: 21_234_567,
        plentyPerBlock: 60
    }

    const walletConnected = true;

    return (
        <Container fluid>
            <div>
                <FrontPageGradientDiv className={`row ${styles.rectangle}`}>
                    <Header
                        toggleTheme={props.toggleTheme}
                        theme={props.theme}
                        connecthWallet={props.connecthWallet}
                        disconnectWallet={props.disconnectWallet}
                        walletAddress={props.walletAddress}
                        isFrontPage={true}
                    />
                    <Col className={clsx(
                        "py-5",
                        walletConnected ? ["col-lg-6", "col-sm-12"]
                            : "col-sm-12"
                    )}>
                        <div className={clsx(
                            walletConnected ? ["d-flex", "flex-column", "col-10", "col-xl-9", "m-auto", "py-lg-5", "text-center",
                                    "align-items-center", "ml-lg-auto", "mr-lg-0", "align-items-lg-start", "text-lg-left"]
                                : ["col-10", "col-lg-7", "m-auto", "d-flex", "align-items-center", "text-center", "flex-column", "py-lg-5"]
                        )}>
                            <h6 className="mb-3 text-white">Total Value Locked</h6>
                            <h1 className="mb-3 text-white">$ 1,212,125,125</h1>
                            <h6 className="mb-4 text-white">Trade tokens and earn interest by staking. There is
                                plenty of DeFi to explore on Tezos.</h6>
                            <Link to={"swap"} className="text-decoration-none">
                                <Button className={`px-lg-3 btn-frontPage ${styles.button}`} color={'tertiary'} onClick={null}>Enter
                                    App</Button>
                            </Link>
                        </div>
                    </Col>
                    {
                        walletConnected && (
                            <Col className="py-3 pb-lg-5 col-lg-6 col   -sm-12">
                                <div className="col-lg-9 col-xl-7 m-auto py-lg-5 px-0 text-center
                                    align-items-center align-items-lg-start text-lg-left">
                                    <Stats valueLocked={15021} plentyEarned={251_532} plentyInWallet={12.48192}
                                           plentyToHarvest={0.999715}/>
                                </div>
                            </Col>
                        )
                    }
                </FrontPageGradientDiv>
            </div>
            <Row className="row bg-themed border-bottom-themed-dark-none">
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
            <Row>
                <Col xs={12} className="text-center my-5">
                    <h2 className={`${styles.plentyOnTezos} mb-3`}><p>Trade tokens and earn interest by staking.</p>
                    </h2>
                    <h2 className={styles.plentyOnTezos}><p>There is plenty of DeFi to explore on Tezos.</p></h2>
                </Col>
            </Row>
            <Row className="px-lg-5 mb-5">
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"Swap tokens and add liquidity on the first token-to-token Automated Market Maker on Tezos."}
                        linkTo={"/swap"} linkText={"Enter Exchange"} headerIcon={circulatingSupply}
                        headerText={"AMM"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"Earn extra rewards besides trading fees by locking Plenty Liquidity Provider (PLP) tokens into a farm."}
                        linkTo={"/farms"} linkText={"Enter Farms"} headerIcon={farms} headerText={"Farms"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"Pools are made for single asset staking and yield PLENTY. Pools are being phased out, except for PLENTY staking."}
                        linkTo={"/pools"} linkText={"Enter Pools"} headerText={"Pools"}/>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3 d-flex">
                    <LinkTile
                        text={"Earn different Tezos tokens in Ponds by staking PLENTY."}
                        linkTo={"/ponds"} linkText={"Enter Ponds"} headerText={"Ponds"}/>
                </Col>
            </Row>
            <Row className="mb-5 bg-themed-alt">
                <Col lg={6} xs={12}>
                    <div className="col-10 col-lg-9 col-xl-7 m-auto py-lg-5 px-0 text-center
                                    align-items-center align-items-lg-start text-lg-left">

                        <h2 className={`mb-1 ${styles.plentyOnTezos}`}><p>About Plenty</p></h2>
                        <div className={"mb-3"}><span><p>Plenty is expanding DeFi use cases on Tezos towards a full scale decentralized financial
                            ecosystem. Empowering traders, liquidity providers & developers to participate in an open
                            financial marketplace.</p></span>
                        </div>
                        <a href={"https://discord.gg/9wZ4CuvkuJ"} target="_blank" rel="noreferrer">
                            <Image src={discord} className="mr-2"/>
                        </a>
                        <a href={"https://t.me/PlentyDeFi"} target="_blank" rel="noreferrer">
                            <Image src={telegram} className="mr-2"/>
                        </a>
                        <a href={"https://twitter.com/PlentyDeFi"} target="_blank" rel="noreferrer">
                            <Image src={twitter}/>
                        </a>
                    </div>
                </Col>
                <Col lg={6} className="d-none d-lg-block">
                    <div className="p-lg-5">
                        <Image src={plentyBig}/>
                    </div>
                </Col>
            </Row>
            <FrontPageGradientDiv className={clsx(
                styles.rectangle
            )}>
                <Col className="py-5">
                    <Row>
                        <Col xs={12} md={6}>
                            <div className="col-10 col-lg-9 col-xl-7 m-auto pb-5 py-lg-3 px-0
                                    align-items-start text-left">
                                <h2 className="text-white">Frequently asked questions</h2>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={6}>
                            <div className="col-10 col-lg-9 col-xl-7 m-auto py-lg-5 px-0
                                    align-items-start text-left">
                                <Accordion text={"What is Plenty?"} className={styles.divider}>
                                    <div>
                                        <p className="text-white">Plenty is a platform for creating liquidity and
                                            trading FA 1.2 and FA 2
                                            tokens on
                                            Tezos.</p>
                                        <p className="text-white">You can only swap tokens on Plenty if there is enough
                                            liquidity for those
                                            tokens.
                                            Providing liquidity will get you Plenty Liquidity Provider (PLP) tokens,
                                            which
                                            will
                                            generate rewards in the form of trading fees for making sure there's always
                                            liquidity for the exchange to use.</p>
                                        <p className="text-white">Yield farming lets users that are providing liquidity
                                            earn PLENTY rewards by
                                            locking
                                            their PLP tokens into a farm.</p>
                                    </div>
                                </Accordion>
                                <Accordion text={"How does Plenty work?"} className={styles.divider}>
                                    <div>
                                        <p className="text-white">
                                            Plenty is a collection of smart contracts to make liquidity pools and
                                            corresponding markets that are compatible with each other. The architecture
                                            is based on&nbsp;
                                            <a href={"https://docs.uniswap.org/protocol/V2/concepts/protocol-overview/how-uniswap-works"}
                                               target="_blank" rel="noreferrer">Uniswap V2</a>.
                                        </p>
                                        <p className="text-white">
                                            Each pool is defined by a smart contract that includes a few functions to
                                            enable
                                            swapping tokens, adding liquidity and more. At its core each pool uses the
                                            function x*y=k to maintain a curve along which trades can happen. The pools
                                            keep
                                            track of reserves (liquidity) and update those reserves every single time
                                            someone trades. Because the reserves are automatically rebalanced, a Plenty
                                            liquidity pool can always be used to buy or sell a token without requiring a
                                            counterparty on the other side of a trade.
                                        </p>
                                    </div>
                                </Accordion>
                                <Accordion text={"Why can’t I trade XTZ?"} className={styles.divider}>
                                    <div>
                                        <p className="text-white">
                                            Plenty is the first token-to-token Automated Market Maker (AMM) on Tezos.
                                            This means that XTZ trading is not supported. However, trading with a
                                            tokenized version of XTZ called&nbsp;
                                            <a href={"https://forum.tezosagora.org/t/ctez-a-synthetic-tez-backed-by-tez-for-better-composability-as-an-alternative-to-the-virtual-baker/2612"}
                                               target="_blank" rel="noreferrer">CTEZ</a>&nbsp;will be supported in the
                                            near future.
                                            CTEZ solves the issue of using XTZ inside DeFi contracts without worrying
                                            about the governance matter of "who should be the baker" and without the
                                            opportunity cost of not delegating.
                                        </p>
                                    </div>
                                </Accordion>
                            </div>
                        </Col>
                        <Col xs={12} md={6}>
                            <div className="col-10 col-lg-9 col-xl-7 m-auto py-lg-5 px-0
                                    align-items-start text-left">
                                <Accordion text={"How do I use Plenty?"} className={styles.divider}>
                                    <div>
                                        <p className="text-white">
                                            First you’ll need a Tezos wallet and some XTZ. XTZ is available at all big
                                            crypto exchanges like&nbsp;
                                            <a href={"https://www.coinbase.com/"} target="_blank"
                                               rel="noreferrer">Coinbase</a>,&nbsp;
                                            <a href={"https://www.kraken.com/"} target="_blank"
                                               rel="noreferrer">Kraken</a>&nbsp;
                                            and&nbsp;
                                            <a href={"https://www.binance.com/"} target="_blank"
                                               rel="noreferrer">Binance</a>.
                                            Do you hold XTZ? Go to&nbsp;
                                            <a href={"https://quipuswap.com/swap?from=tez&to=KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b"}
                                               target="_blank" rel="noreferrer">Quipuswap</a>&nbsp;to swap it for
                                            PLENTY! Each transaction on Tezos comes with a
                                            small gas fee, paid in XTZ, which is a fee for the bakers to keep the Proof
                                            of Stake network running.
                                        </p>
                                        <p className="text-white">
                                            If you are a DeFi user from another blockchain, you can wrap your assets
                                            using the&nbsp;
                                            <a href={"https://www.benderlabs.io/wrap"}
                                               target="_blank" rel="noreferrer">Wrap Protocol</a>.&nbsp;Wrap tokens like
                                            USDC, BUSD, LINK, MATIC, or WBTC, and use them on Plenty to trade and earn
                                            yield.
                                        </p>
                                    </div>
                                </Accordion>
                                <Accordion text={"How are prices determined?"} className={styles.divider} s>
                                    <div>
                                        <p className="text-white">
                                            Prices are determined by the amount of each token in a pool. The smart
                                            contract maintains a constant using the following function: x*y=k. For
                                            example, x = tokenABC, y = tokenXYZ, and k = constant. During each trade, a
                                            certain amount of one token is removed from the pool for an amount of the
                                            other token. To maintain k, the balances held by the smart contract are
                                            adjusted during the execution of the trade, thereby changing the price.
                                        </p>
                                    </div>
                                </Accordion>
                                <Accordion text={"Are there risks?"} className={styles.divider}>
                                    <div>
                                        <p className="text-white">
                                            Using smart contracts always brings risk. To reduce this risk, external
                                            audits are underway. The first audit of the AMM smart contracts is due next
                                            week. The staking smart contracts&nbsp;
                                            <a href={"https://github.com/Plenty-DeFi/security-audit/blob/main/PLENTYDEFI_SECURITY_AUDIT_APRIORIT.pdf"}
                                               target="_blank" rel="noreferrer">were audited</a>
                                            &nbsp;successfully before.
                                        </p>
                                        <p className="text-white">
                                            For liquidity providers there is the risk of Impermanent loss. This is a
                                            price difference that can occur when holding tokens in an AMM liquidity pool
                                            instead of holding them in your wallet. It occurs when the price of tokens
                                            inside an AMM diverge in any direction. The more divergence, the greater the
                                            impermanent loss.
                                        </p>
                                    </div>
                                </Accordion>
                                <Image className={"mt-4"} src={plentyMedium}/>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </FrontPageGradientDiv>
        </Container>
    )
};


export default Frontpage;
