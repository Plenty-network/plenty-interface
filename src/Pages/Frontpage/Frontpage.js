import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import styles from './frontpage.module.scss';
import Button from '../../Components/Ui/Buttons/Button';
import Label from '../../Components/Ui/Label/Label';
import Container from 'react-bootstrap/Container';
import { Col, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import dollar from '../../assets/images/frontpage/dollar.svg';
import dollarDark from '../../assets/images/frontpage/dollarDark.svg';

import marketCap from '../../assets/images/frontpage/marketcap.svg';
import farms from '../../assets/images/frontpage/farms.svg';
import xplenty from '../../assets/images/frontpage/plentystake.svg';
import liquidity from '../../assets/images/frontpage/liquidity.svg';
import totalBurned from '../../assets/images/frontpage/totalburned.svg';
import circulatingSupply from '../../assets/images/frontpage/circulatingsupply.svg';
import plentyBlock from '../../assets/images/frontpage/plentyblock.svg';
import marketCapDark from '../../assets/images/frontpage/marketcapDark.svg';
import farmsDark from '../../assets/images/frontpage/farmsDark.svg';
import farms2Dark from '../../assets/images/frontpage/farms2Dark.svg';
import farms2 from '../../assets/images/frontpage/farms2.svg';
import xplentyDark from '../../assets/images/frontpage/plentystakeDark.svg';
import liquidityDark from '../../assets/images/frontpage/liquidityDark.svg';
import totalBurnedDark from '../../assets/images/frontpage/totalburnedDark.svg';
import circulatingSupplyDark from '../../assets/images/frontpage/circulatingsupplyDark.svg';
import plentyBlockDark from '../../assets/images/frontpage/plentyblockDark.svg';
import amm from '../../assets/images/frontpage/trade.svg';
import ammDark from '../../assets/images/frontpage/tradeDark.svg';
import plentyBig from '../../assets/images/frontpage/plentybig.svg';
import { ReactComponent as Medium } from '../../assets/images/frontpage/medium.svg';
import { ReactComponent as Twitter } from '../../assets/images/frontpage/twitter.svg';
import { ReactComponent as Discord } from '../../assets/images/frontpage/discord.svg';
import { ReactComponent as Telegram } from '../../assets/images/frontpage/telegram.svg';
import plentyMedium from '../../assets/images/frontpage/plentymedium.svg';
import LinkTile from '../../Components/LinkTile/LinkTile';
import Accordion from '../../Components/Ui/Accordion/Accordion';
import Stats from '../../Components/Stats/Stats';
import Loader from '../../Components/loader';
import { connect } from 'react-redux';
import {
  getHomeStatsData,
  getPlentyBalanceOfUser,
  getPlentyToHarvest,
  getTVL,
  getTVLOfUser,
  harvestAll,
  onModalOpenClose,
} from '../../redux/actions/home/home.actions';
import { currencyOptions, currencyOptionsWithSymbol } from '../../constants/global';
import { FrontPageBottomGradientDiv, FrontPageGradientDiv } from '../../themes';
import Footer from '../../Components/Footer/Footer';
import InfoModal from '../../Components/Ui/Modals/InfoModal';
import { HOME_PAGE_MODAL } from '../../constants/homePage';
import NumericLabel from 'react-pretty-numbers';

const Frontpage = ({
  homeStats,
  tvl,
  getTVL,
  getHomeStats,
  wallet,
  plentyToHarvest,
  plentyBalance,
  getPlentyToHarvest,
  getPlentyBalanceOfUser,
  getTVLOfUser,
  userTVL,
  harvestAll,
  openCloseModal,
  modalData,
  harvestAllOperations,
  rpcNode,
  xplentyBalance,
  theme,
}) => {
  useEffect(() => {
    const getAllData = () => {
      getHomeStats();
      getTVL();
      if (wallet) {
        getPlentyToHarvest(wallet);
        getPlentyBalanceOfUser(wallet);
        getTVLOfUser(wallet);
      }
    };
    getAllData();
    const intervalId = setInterval(getAllData(), 60 * 1000);
    return () => clearInterval(intervalId);
  }, [wallet, rpcNode]);

  const walletConnected = !!wallet;

  const onHarvestAll = () => {
    !!wallet && harvestAll(wallet);
  };

  const loaderMessage = useMemo(() => {
    if (harvestAllOperations.completed || harvestAllOperations.failed) {
      return {
        message: harvestAllOperations.completed ? 'Transaction confirmed' : 'Transaction failed',
        type: harvestAllOperations.completed ? 'success' : 'error',
      };
    }
    return {};
  }, [harvestAllOperations]);

  return (
    <>
      <Container fluid>
        <div className={`d-flex flex-column ${styles.fullScreen}`}>
          <FrontPageGradientDiv className={`row flex-grow-1 ${styles.homePageBanner}`}>
            <div
              className={clsx(
                `${styles.centerAlign}`,
                'py-5',
                walletConnected ? ['col-lg-6', 'col-sm-12', 'col-md-12'] : 'col-sm-12 col-md-12',
              )}
            >
              <div
                className={clsx(
                  walletConnected
                    ? [
                        'd-flex',
                        'flex-column',
                        'col-10',
                        'col-xl-9',
                        'm-auto',
                        'py-lg-5',
                        'text-center',
                        'align-items-center',
                        'ml-lg-auto',
                        'mr-lg-0',
                        'align-items-lg-start',
                        'text-lg-left',
                      ]
                    : [
                        'col-10',
                        'col-lg-7',
                        'm-auto',
                        'd-flex',
                        'align-items-center',
                        'text-center',
                        'flex-column',
                        'py-lg-5',
                      ],
                )}
              >
                <h5 className={`mb-3  text-white font-weight-light ${styles.textMulish}`}>
                  Total Value Locked
                </h5>
                <h1 className="mb-3 text-white font-weight-bold">
                  <NumericLabel params={currencyOptionsWithSymbol}>{tvl}</NumericLabel>
                </h1>
                <h5
                  className={`mb-4 text-white text-mulish font-weight-light ${styles.textMulish}`}
                >
                  Trade tokens and earn interest by staking. There is plenty of DeFi to explore on
                  Tezos.
                </h5>
                <Link to={'swap'} className="text-decoration-none">
                  <Button
                    className={`px-lg-3 btn-frontPage ${styles.button}`}
                    color={'tertiary'}
                    onClick={null}
                  >
                    Enter App
                  </Button>
                </Link>
              </div>
            </div>
            {walletConnected && (
              <div className={`py-3 pb-lg-5 col-lg-6 col-sm-12 ${styles.centerAlign}`}>
                <div
                  className="col-lg-9 col-xl-7 m-auto py-lg-5 px-0 text-center
                                    align-items-center align-items-lg-start text-lg-left"
                >
                  <Stats
                    wallet={wallet}
                    harvestAll={onHarvestAll}
                    valueLocked={userTVL}
                    plentyEarned={251_532}
                    plentyInWallet={plentyBalance}
                    plentyToHarvest={plentyToHarvest}
                    harvestAllOperations={harvestAllOperations}
                    xplentyBalance={xplentyBalance}
                  />
                </div>
              </div>
            )}
          </FrontPageGradientDiv>
          <Row className="row bg-themed border-bottom-themed-dark-none">
            <Col sm={6} md={4} xl={2} className="px-5 pb-2 pt-3 m-sm-auto">
              <Label
                text={
                  homeStats.price ? (
                    <NumericLabel params={currencyOptions}>{homeStats.price}</NumericLabel>
                  ) : (
                    '0'
                  )
                }
                icon={theme === 'light' ? dollar : dollarDark}
                subText={'Price'}
              />
            </Col>
            <Col sm={6} md={4} xl={2} className="px-5 pb-2 pt-3 m-sm-auto">
              <Label
                text={
                  homeStats.marketcap && (
                    <NumericLabel params={currencyOptions}>
                      {homeStats.marketcap.toFixed(0)}
                    </NumericLabel>
                  )
                }
                icon={theme === 'light' ? marketCap : marketCapDark}
                subText={'Market Cap'}
              />
            </Col>
            <Col sm={6} md={4} xl={2} className="px-5 pb-2 pt-3 m-sm-auto">
              <Label
                text={
                  homeStats.total_minted && (
                    <NumericLabel params={currencyOptions}>
                      {homeStats.total_minted.toFixed(0)}
                    </NumericLabel>
                  )
                }
                icon={theme === 'light' ? farms : farmsDark}
                subText={'Total minted'}
              />
            </Col>
            <Col sm={6} md={4} xl={2} className="px-5 pb-2 pt-3 m-sm-auto">
              <Label
                text={
                  homeStats.total_burned && (
                    <NumericLabel params={currencyOptions}>
                      {homeStats.total_burned.toFixed(0)}
                    </NumericLabel>
                  )
                }
                icon={theme === 'light' ? totalBurned : totalBurnedDark}
                subText={'Total burned'}
              />
            </Col>
            <Col sm={6} md={4} xl={2} className="px-5 pb-2 pt-3 m-sm-auto">
              <Label
                text={
                  homeStats.circulating_supply && (
                    <NumericLabel params={currencyOptions}>
                      {homeStats.circulating_supply.toFixed(0)}
                    </NumericLabel>
                  )
                }
                icon={theme === 'light' ? circulatingSupply : circulatingSupplyDark}
                subText={'Circulating Supply'}
              />
            </Col>
            <Col sm={6} md={4} xl={2} className="px-5 pb-2 pt-3 m-sm-auto">
              <Label
                text={
                  homeStats.plenty_per_block && (
                    <NumericLabel params={currencyOptions}>
                      {homeStats.plenty_per_block}
                    </NumericLabel>
                  )
                }
                subText={'New PLENTY/Block'}
                icon={theme === 'light' ? plentyBlock : plentyBlockDark}
              />
            </Col>
          </Row>
        </div>
        <Row>
          <Col xs={12} className="text-center my-5">
            <h2 className="font-weight-bold">
              <p>Plenty of DeFi on Tezos</p>
            </h2>
          </Col>
        </Row>
        <Row className="mb-4 mx-lg-5">
          <div
            className="col-xl-11 row m-auto"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Col xs={12} md={6} xl={3} className="mb-3 d-flex">
              <LinkTile
                text={'Swap tokens instantly with high liquidity and audited smart contracts.'}
                linkTo={'/swap'}
                linkText={'Enter Exchange'}
                headerIcon={theme === 'light' ? amm : ammDark}
                headerText={'Swap'}
              />
            </Col>
            <Col xs={12} md={6} xl={3} className="mb-3 d-flex">
              <LinkTile
                text={'Add liquidity for any trading pair and start earning trading fees.'}
                linkTo={'/liquidity'}
                linkText={'Add Liquidity'}
                headerIcon={theme === 'light' ? liquidity : liquidityDark}
                headerText={'Pool'}
              />
            </Col>
            <Col xs={12} md={6} xl={3} className="mb-3 d-flex">
              <LinkTile
                text={
                  'Earn PLENTY and other tokens by staking Plenty Liquidity Provider tokens in a farm.'
                }
                linkTo={'/farms'}
                linkText={'Enter Farms'}
                headerIcon={theme === 'light' ? farms2 : farms2Dark}
                headerText={'Farm'}
              />
            </Col>
            <Col xs={12} md={6} xl={3} className="mb-3 d-flex">
              <LinkTile
                text={'Stake PLENTY, receive xPLENTY. Rewards are compounding.'}
                linkTo={'/stake'}
                linkText={'Enter Staking'}
                headerIcon={theme === 'light' ? xplenty : xplentyDark}
                headerText={'Stake'}
              />
            </Col>
          </div>
        </Row>
        <Row className="py-5 bg-themed-alt">
          <Col lg={6} xs={12}>
            <div
              className="col-10 col-lg-9 col-xl-7 m-auto py-lg-5 px-0 text-center
                                    align-items-center align-items-lg-start text-lg-left"
            >
              <h2 className={`mb-1 font-weight-bold ${styles.about}`}>
                <p>About Plenty</p>
              </h2>
              <div className={`mb-3 ${styles.aboutSubtext}`}>
                <span>
                  <p>
                    Plenty is expanding DeFi use cases on Tezos towards a full scale decentralized
                    financial ecosystem. Empowering traders, liquidity providers & developers to
                    participate in an open financial marketplace.
                  </p>
                </span>
              </div>
              <a href={'https://plentydefi.medium.com/'} target="_blank" rel="noreferrer">
                <Medium className="mr-2 icon-themed" />
              </a>
              <a href={'https://discord.gg/9wZ4CuvkuJ'} target="_blank" rel="noreferrer">
                <Discord className="mr-2 icon-themed" />
              </a>
              <a href={'https://t.me/PlentyDeFi'} target="_blank" rel="noreferrer">
                <Telegram className="mr-2 icon-themed" />
              </a>
              <a href={'https://twitter.com/PlentyDeFi'} target="_blank" rel="noreferrer">
                <Twitter className="mr-2 icon-themed" />
              </a>
            </div>
          </Col>
          <Col lg={6} className="d-none d-lg-block">
            <div className="p-lg-5">
              <Image src={plentyBig} />
            </div>
          </Col>
        </Row>
        <FrontPageBottomGradientDiv className="row">
          <Col className="pt-5">
            <Row>
              <Col xs={12} md={6}>
                <div
                  className="col-10 col-xl-8 m-auto pb-5 py-lg-3 px-0
                                    align-items-start text-left"
                >
                  <h2 className="text-white font-weight-bold">Frequently asked questions</h2>
                </div>
              </Col>
            </Row>
            <Row className="border-bottom-themed">
              <Col xs={12} md={6}>
                <div
                  className="col-10 col-xl-8 m-auto py-lg-5 px-0
                                    align-items-start text-left"
                >
                  <Accordion isOpen={true} text={'What is Plenty?'} className={styles.divider}>
                    <div>
                      <p className="text-white">
                        The Plenty protocol enables swapping of fungible tokens on Tezos.
                      </p>
                      <p className="text-white">
                        You can only swap tokens on Plenty if there is enough liquidity for those
                        tokens. Providing liquidity will get you Plenty Liquidity Provider (PLP)
                        tokens, which will generate rewards in the form of trading fees for making
                        sure there&apos;s always liquidity for the exchange to use.
                      </p>
                      <p className="text-white">
                        Yield farming lets users that are providing liquidity earn PLENTY rewards by
                        locking their PLP tokens into a farm.
                      </p>
                    </div>
                  </Accordion>
                  <Accordion text={'How does Plenty work?'} className={styles.divider}>
                    <div>
                      <p className="text-white">
                        Plenty is a collection of smart contracts to make liquidity pools and
                        corresponding markets that are compatible with each other. The architecture
                        is based on&nbsp;
                        <a
                          href={
                            'https://docs.uniswap.org/protocol/V2/concepts/protocol-overview/how-uniswap-works'
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Uniswap V2
                        </a>
                        .
                      </p>
                      <p className="text-white">
                        Each pool is defined by a smart contract that includes a few functions to
                        enable swapping tokens, adding liquidity and more. At its core each pool
                        uses the function x*y=k to maintain a curve along which trades can happen.
                        The pools keep track of reserves (liquidity) and update those reserves every
                        single time someone trades. Because the reserves are automatically
                        rebalanced, a liquidity pool can always be used to buy or sell a token
                        without requiring a counterparty on the other side of a trade.
                      </p>
                    </div>
                  </Accordion>
                  <Accordion text={'Why can’t I trade native tez?'} className={styles.divider}>
                    <div>
                      <p className="text-white">
                        Plenty is the first token-to-token Automated Market Maker (AMM) on Tezos.
                        This means that native tez trading is not supported. However, trading with a
                        collateralized version of tez, called&nbsp;
                        <a href={'https://ctez.app/'} target="_blank" rel="noreferrer">
                          ctez
                        </a>
                        &nbsp;is supported.
                      </p>

                      <p className="text-white">
                        Ctez solves the issue of using tez inside DeFi contracts without worrying
                        about the governance matter of &quot;who should be the baker&quot; and
                        without the opportunity cost of not delegating.
                      </p>
                    </div>
                  </Accordion>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div
                  className="col-10 col-xl-8 m-auto py-lg-5 px-0
                                    align-items-start text-left"
                >
                  <Accordion text={'How do I use Plenty?'} className={styles.divider}>
                    <div>
                      <p className="text-white">
                        First you’ll need a Tezos wallet and some tez. Tez is available at all big
                        crypto exchanges like&nbsp;
                        <a href={'https://www.coinbase.com/'} target="_blank" rel="noreferrer">
                          Coinbase
                        </a>
                        ,&nbsp;
                        <a href={'https://www.kraken.com/'} target="_blank" rel="noreferrer">
                          Kraken
                        </a>
                        &nbsp; and&nbsp;
                        <a href={'https://www.binance.com/'} target="_blank" rel="noreferrer">
                          Binance
                        </a>
                        . Do you have some tez? Go to&nbsp;
                        <a href={'https://ctez.app/'} target="_blank" rel="noreferrer">
                          ctez.app
                        </a>
                        &nbsp;to swap it for ctez!
                      </p>
                      <p className="text-white">
                        Each transaction on Tezos comes with a small gas fee, paid in tez, which is
                        a fee for the bakers to keep the Proof of Stake network running. So make
                        sure you to keep some tez for these fees.
                      </p>
                      <p className="text-white">
                        If you are a DeFi user from another blockchain, you can wrap your assets
                        using the&nbsp;
                        <a href={'https://www.benderlabs.io/wrap'} target="_blank" rel="noreferrer">
                          Wrap Protocol
                        </a>
                        .&nbsp;Wrap tokens like USDC, BUSD, LINK, MATIC, or WBTC on the Ethereum
                        blockchain, and use them on Plenty to trade and earn.
                      </p>
                    </div>
                  </Accordion>
                  <Accordion text={'How are prices determined?'} className={styles.divider} s>
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
                  <Accordion text={'Are there risks?'} className={styles.divider}>
                    <div>
                      <p className="text-white">
                        Using smart contracts always brings risk. To reduce this risk, the Plenty
                        smart contracts are audited. Both the AMM and staking smart contracts&nbsp;
                        <a
                          href={
                            'https://plenty-defi.notion.site/Audits-70fdccf107ec42feb0bcf720cb6c5ba5'
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          were audited
                        </a>
                        &nbsp;successfully.
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
                  <Image className={'mt-4'} src={plentyMedium} />
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center mb-5 mt-4">
              <Footer />
            </Row>
          </Col>
        </FrontPageBottomGradientDiv>
      </Container>
      <InfoModal
        open={modalData.open === HOME_PAGE_MODAL.TRANSACTION_SUCCESS}
        onClose={() => openCloseModal({ open: HOME_PAGE_MODAL.NULL, transactionId: '' })}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          !modalData.transactionId
            ? undefined
            : () => window.open(`https://tzkt.io/${modalData.transactionId}`, '_blank')
        }
      />
      {modalData.snackbar && (
        <Loader loading={harvestAllOperations.processing} loaderMessage={loaderMessage} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  homeStats: state.home.homeStats.data,
  tvl: state.home.tvl.data,
  wallet: state.wallet.address,
  plentyToHarvest: state.home.plentyToHarvest.data,
  plentyBalance: state.home.plentyBalance.data ? state.home.plentyBalance.data.PLENTY : 0,
  xplentyBalance: state.home.plentyBalance.data ? state.home.plentyBalance.data.xPLENTY : 0,
  userTVL: state.home.userTVL.data,
  modalData: state.home.modals,
  harvestAllOperations: state.home.harvestAllOperation,
  rpcNode: state.settings.rpcNode,
});

const mapDispatchToProps = (dispatch) => ({
  getHomeStats: () => dispatch(getHomeStatsData()),
  getTVL: () => dispatch(getTVL()),
  getPlentyToHarvest: (wallet) => dispatch(getPlentyToHarvest(wallet)),
  getPlentyBalanceOfUser: (wallet) => dispatch(getPlentyBalanceOfUser(wallet)),
  getTVLOfUser: (wallet) => dispatch(getTVLOfUser(wallet)),
  harvestAll: (wallet) => dispatch(harvestAll(wallet)),
  openCloseModal: (payload) => dispatch(onModalOpenClose(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Frontpage);

Frontpage.propTypes = {
  connecthWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  getHomeStats: PropTypes.any,
  getPlentyBalanceOfUser: PropTypes.any,
  getPlentyToHarvest: PropTypes.any,
  getTVL: PropTypes.any,
  getTVLOfUser: PropTypes.any,
  harvestAll: PropTypes.any,
  harvestAllOperations: PropTypes.any,
  homeStats: PropTypes.any,
  modalData: PropTypes.any,
  openCloseModal: PropTypes.any,
  plentyBalance: PropTypes.any,
  plentyToHarvest: PropTypes.any,
  rpcNode: PropTypes.any,
  theme: PropTypes.any,
  toggleTheme: PropTypes.any,
  tvl: PropTypes.any,
  userTVL: PropTypes.any,
  wallet: PropTypes.any,
  walletAddress: PropTypes.any,
  xplentyBalance: PropTypes.any,
};
