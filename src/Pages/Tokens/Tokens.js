import React, { useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import TokensHeader from "../../Components/TokensPage/TokensHeader";
import { tokenFetchingThunk } from "../../redux/slices/tokens/tokens.thunk";
import styles from "./tokens.module.scss";
import { connect } from "react-redux";
import Table from "../../Components/Table/Table";
import Button from "../../Components/Ui/Buttons/Button";
import { PuffLoader } from "react-spinners";
import { BsStar } from "react-icons/bs";

const Tokens = (props) => {
  const columns = useMemo(
    () => [
      {
        Header: (
          <div>
            &nbsp;&nbsp;
            <BsStar string={{ margin: "5px 0" }} />
          </div>
        ),
        id: "1",
        accessor: (x) => (
          <div>
            &nbsp;&nbsp;
            <BsStar />
          </div>
        ),
      },
      {
        Header: "Token",
        accessor: "symbol_token",
      },
      {
        Header: "Price",
        accessor: "token_price",
      },
      {
        Header: "24H Change",
        accessor: "price_change_percentage",
      },
      {
        Header: "24H Volume",
        accessor: "volume_change_percentage",
      },
      {
        Header: "Liquidity",
        accessor: "liquidity",
      },
      {
        Header: "",
        id: "trade",
        accessor: (x) => (
          <div>
            <Button className={styles.tradeBtn}>Trade</Button>
          </div>
        ),
      },
    ],
    []
  );
  useEffect(() => {
    props.fetchTokensData();
  }, []);

  return (
    <Container fluid className={styles.tokens}>
      <TokensHeader
        toggleTheme={props.toggleTheme}
        theme={props.theme}
        connecthWallet={props.connectWallet}
        disconnectWallet={props.disconnectWallet}
        walletAddress={props.walletAddress}
      />

      <div className="w-100 d-flex align-center flex-column">
        <input className={styles.searchBar} />

        {props.tokens.data.length > 0 ? (
          <Table data={props.tokens.data} columns={columns} />
        ) : (
          <PuffLoader color={"#813CE1"} size={56} />
        )}
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    // tokens: state.tokens.tokensData,
    tokens: {
      isLoading: false,
      isPresent: true,
      data: [
        {
          id: 132728,
          symbol_token: "hDAO",
          token_price: 8.563753281234638,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 511599.6269879277,
          liquidity_change: 72.27597415395448,
          price_change_percentage: 0.891100958386735,
          volume_change_percentage: 1.1186338135196745,
          volume_token: 300287.1154528778,
        },
        {
          id: 132739,
          symbol_token: "kUSD",
          token_price: 0.921652898369858,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 414650.4680593797,
          liquidity_change: -26.589336873205514,
          price_change_percentage: -2.1900236335533028,
          volume_change_percentage: 2.969884486022247,
          volume_token: 581611.8392011282,
        },
        {
          id: 132735,
          symbol_token: "wWBTC",
          token_price: 61060.81681481774,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 1119509.621676719,
          liquidity_change: 79.9921352243936,
          price_change_percentage: 0.660361690547147,
          volume_change_percentage: 6.09513497607861,
          volume_token: 659887.3015797924,
        },
        {
          id: 132730,
          symbol_token: "ETHtz",
          token_price: 4261.351825297234,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 510294.42409147444,
          liquidity_change: 7.29222195715952,
          price_change_percentage: 4.1446547830233476,
          volume_change_percentage: -1.597972329799705,
          volume_token: 468011.614667166,
        },
        {
          id: 132737,
          symbol_token: "wLINK",
          token_price: 30.9178561376213,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 552024.2494386501,
          liquidity_change: 81.5060656084421,
          price_change_percentage: 2.8707736405089674,
          volume_change_percentage: -9.724290539146237,
          volume_token: 274560.41532615083,
        },
        {
          id: 132719,
          symbol_token: "tzBTC",
          token_price: 60666.356362962404,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 500009.5714698495,
          liquidity_change: 40.13944349643655,
          price_change_percentage: 1.254409596537929,
          volume_change_percentage: 4.3304473958593785,
          volume_token: 372245.10810183,
        },
        {
          id: 132734,
          symbol_token: "wUSDC",
          token_price: 0.9969232144964035,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 930513.099242186,
          liquidity_change: -1.6649724301336513,
          price_change_percentage: -0.348797258695027,
          volume_change_percentage: -2.058595048553215,
          volume_token: 926788.373560514,
        },
        {
          id: 132746,
          symbol_token: "wUSDT",
          token_price: 0.9706747681591259,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 487857.8006727799,
          liquidity_change: -22.202994804735365,
          price_change_percentage: 0.5001202618447855,
          volume_change_percentage: 5.958157939690091,
          volume_token: 664453.7764153251,
        },
        {
          id: 132731,
          symbol_token: "GIF",
          token_price: 0.04275551891749871,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 14937.06833185698,
          liquidity_change: -66.89546973002525,
          price_change_percentage: -1.3142673821769681,
          volume_change_percentage: -6.891979532130186,
          volume_token: 42011.19461990696,
        },
        {
          id: 132720,
          symbol_token: "WRAP",
          token_price: 0.16979183758030203,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 132227.4082390274,
          liquidity_change: 195.17749244436368,
          price_change_percentage: -3.7007224902693436,
          volume_change_percentage: 8.431042908539702,
          volume_token: 48572.65930990108,
        },
        {
          id: 132727,
          symbol_token: "ctez",
          token_price: 6.184703904866285,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 2289664.1638423055,
          liquidity_change: 18.127929462863595,
          price_change_percentage: 1.6753244554586053,
          volume_change_percentage: 17.965517956674802,
          volume_token: 2286516.1546694785,
        },
        {
          id: 132711,
          symbol_token: "wBUSD",
          token_price: 1.0030958359499411,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 953547.2991706347,
          liquidity_change: -8.202778113066888,
          price_change_percentage: 0.3509568968804449,
          volume_change_percentage: 0.8230552592201472,
          volume_token: 1047303.5028769866,
        },
        {
          id: 132718,
          symbol_token: "QUIPU",
          token_price: 3.2959763041671306,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 191631.04389080955,
          liquidity_change: 112.4136920560616,
          price_change_percentage: 0.5699579688934024,
          volume_change_percentage: 5.939809545772596,
          volume_token: 95574.61242890071,
        },
        {
          id: 132726,
          symbol_token: "YOU",
          token_price: 2.2538075775306363,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 93571.01259900162,
          liquidity_change: -18.92870915755488,
          price_change_percentage: -7.478968788654871,
          volume_change_percentage: -11.757819001498646,
          volume_token: 101847.52387896138,
        },
        {
          id: 132747,
          symbol_token: "wDAI",
          token_price: 0.9823942486458698,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 534587.9844012508,
          liquidity_change: -27.959131497983943,
          price_change_percentage: 0.36302968715074196,
          volume_change_percentage: 6.653944196550096,
          volume_token: 791438.5020897079,
        },
        {
          id: 132736,
          symbol_token: "wMATIC",
          token_price: 2.004201401848302,
          timestamp: "2021-10-29T11:32:15.973771+00:00",
          level: 1818288,
          liquidity: 586724.4185102277,
          liquidity_change: 12.309966372403785,
          price_change_percentage: 5.736291300601447,
          volume_change_percentage: 16.112571692120476,
          volume_token: 606589.8095088922,
        },
        {
          id: 132723,
          symbol_token: "uUSD",
          token_price: 0.9341346893437678,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 499959.16083443846,
          liquidity_change: 16.384246283526696,
          price_change_percentage: -0.9207944841651948,
          volume_change_percentage: 1.4034186356051073,
          volume_token: 435605.072900457,
        },
        {
          id: 132716,
          symbol_token: "wWETH",
          token_price: 4244.45505433102,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 585944.3156082261,
          liquidity_change: 30.23638160128715,
          price_change_percentage: 4.721822495315029,
          volume_change_percentage: 19.241394864321457,
          volume_token: 536476.9555702595,
        },
        {
          id: 132721,
          symbol_token: "UNO",
          token_price: 146.974795143117,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 87160.09623107073,
          liquidity_change: -23.738819496746412,
          price_change_percentage: -5.105568026822727,
          volume_change_percentage: -6.66477704732458,
          volume_token: 106674.28645372932,
        },
        {
          id: 132707,
          symbol_token: "USDtz",
          token_price: 0.9885192103943072,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 462320.4094766707,
          liquidity_change: 56.67114188477625,
          price_change_percentage: -0.43807533634569984,
          volume_change_percentage: -1.777389336518138,
          volume_token: 289844.8114663359,
        },
        {
          id: 132710,
          symbol_token: "SMAK",
          token_price: 0.035697456137518006,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 103661.78818923574,
          liquidity_change: -72.56067698657391,
          price_change_percentage: 2.2585916374052553,
          volume_change_percentage: 7.4511626055872116,
          volume_token: 405934.9297086298,
        },
        {
          id: 132722,
          symbol_token: "KALAM",
          token_price: 0.6358656524828925,
          timestamp: "2021-10-29T11:31:35.973253+00:00",
          level: 1818288,
          liquidity: 169081.66648350167,
          liquidity_change: 145.39304337686738,
          price_change_percentage: -1.2937133380235621,
          volume_change_percentage: 3.6689106250070935,
          volume_token: 71430.3548698633,
        },
        {
          id: 7993,
          symbol_token: "PLENTY",
          token_price: 1.2105979498208408,
          timestamp: "2021-10-29T11:05:45.972243+00:00",
          level: 1818239,
          liquidity: 12216831.486932434,
          liquidity_change: -20.72855401785278,
          price_change_percentage: 1.2181903658460622,
          volume_change_percentage: -35.63440937384433,
          volume_token: 949520.1714079013,
        },
      ],
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTokensData: () => dispatch(tokenFetchingThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
