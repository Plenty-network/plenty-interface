import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import logo from "../assets/images/logo_small.png";
import kalam from "../assets/images/kalam.png";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

//Images
import dai from "../assets//images/SwapModal/daiLogo.svg";
import dash from "../assets/images/SwapModal/dashLogo.svg";
import mkr from "../assets/images/SwapModal/mkrLogo.svg";
import oxt from "../assets/images/SwapModal/oxtLogo.svg";
import cross from "../assets/images/SwapModal/ModalCross.svg";
import search from "../assets/images/SwapModal/SearchIcon.svg";

import editpen from "../assets/images/SwapModal/Edit.svg";

function SwapModal(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState([]);
  let optionData = [
    {
      name: "DAI",
      image: dai,
    },
    {
      name: "MKR",
      image: mkr,
    },
    {
      name: "DASH",
      image: dash,
    },
    {
      name: "OXT",
      image: oxt,
    },
    {
      name: "DAI",
      image: dai,
    },
    {
      name: "MKR",
      image: mkr,
    },
    {
      name: "DASH",
      image: dash,
    },
    {
      name: "OXT",
      image: oxt,
    },
    {
      name: "DAI",
      image: dai,
    },
    {
      name: "MKR",
      image: mkr,
    },
    {
      name: "DASH",
      image: dash,
    },
    {
      name: "OXT",
      image: oxt,
    },
  ];
  useEffect(() => {
    setResult(
      optionData.filter((val) => {
        console.log(val);
        if (searchTerm == "") {
          return val;
        } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return val;
        }
      })
    );
  }, [searchTerm]);
  return (
    <Modal {...props} aria-labelledby='contained-modal-title-vcenter' centered>
      <div className='swap-coin-modal-container-header'>
        <Row>
          <Col xs={6}>
            <div className='swap-coin-modal-container-header-text'>
              {" "}
              <text>Select a token</text>
            </div>
          </Col>
          <Col xs={4}></Col>
          <Col xs={2}>
            <img src={cross} onClick={props.onHide} />
          </Col>
        </Row>
      </div>

      <div className='search-box'>
        <i className='search-button'>
          <img src={search} />
        </i>
        <input
          className='search-txt'
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      <Modal.Body className='swap-coin-selection-modal-body'>
        <div className='swap-coin-option-container'>
          {result.map((option, index) => {
            return (
              <div className='swap-coin-modal-option' key={index}>
                <Row>
                  <Col xs={1}>
                    <img
                      src={option.image}
                      className='swap-coin-modal-option-image'
                      key={index}
                    />
                  </Col>
                  <Col xs={4}>{option.name}</Col>
                </Row>
              </div>
            );
          })}
        </div>
        <hr className='swap-coin-selector-modal-divider' />
        <Row className='swap-coin-modal-footer'>
          <img src={editpen} />
          <text>Manage</text>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

const Swap = () => {
  const [modalShow, setModalShow] = useState(false);
  const [topCoin, setTopCoin] = useState({
    name: "Plenty",
    icon: logo,
  });
  const [bottomCoin, setBottomCoin] = useState({
    name: "Kalam",
    icon: kalam,
  });
  return (
    <Container fluid>
      <Row>
        <Col sm={12} md={12}>
          <div className='swap-content-container'>
            <Tabs defaultActiveKey='swap' className='swap-container-tab'>
              <Tab eventKey='swap' title='Swap'>
                <div className='swap-content-box'>
                  <div className='swap-token-select-box'>
                    <button
                      className='token-selector'
                      onClick={() => setModalShow(true)}
                    >
                      <img src={topCoin.icon} className='button-logo' />
                      {topCoin.name}
                    </button>
                    <SwapModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      setCoin={setTopCoin}
                    />
                  </div>
                </div>

                <div className='swap-content-box'>
                  <div className='swap-token-select-box'>
                    <button
                      className='token-selector'
                      onClick={() => setModalShow(true)}
                    >
                      <img src={bottomCoin.icon} className='button-logo' />
                      {bottomCoin.name}
                    </button>
                    <SwapModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      setCoin={setBottomCoin}
                    />
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey='liquidity'
                title='Liquidity'
                className='swap-container-tab'
              >
                Liquidity
              </Tab>
              <Tab
                eventKey='auto'
                title='Auto LP'
                className='swap-container-tab'
              >
                Auto LP
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Swap;
