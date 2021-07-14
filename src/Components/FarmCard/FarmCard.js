import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

const FarmCard = (props) => {
  console.log('props=', props);
  let badgeClass = 'badge-plenty';
  if (props.source != 'Plenty') {
    badgeClass = 'badge-other';
  }

  let swapContentButton = '';

  if (!props.walletAddress) {
    swapContentButton = (
      <div className="plenty-card-wallet-btn-wrapper">
        <button className="swap-content-btn" onClick={props.connecthWallet}>
          <span className="material-icons-outlined">add</span> Connect Wallet
        </button>
      </div>
    );
  }
  return (
    <Col sm={12} md={4}>
      <Card className="plenty-card">
        <div className="plenty-card-header flex justify-between align-center p-26 pb-20">
          <div className="plenty-card-header-img-wrapper farm">
            <Image src={props.image} fluid />
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="plenty-card-header-title">{props.title}</p>
            <p className={`plenty-card-header-title-badge ${badgeClass}`}>
              {props.source}
            </p>
          </div>
        </div>

        <div className="plenty-card-content">
          <div className="plenty-card-content-info flex justify-between">
            <p className="plenty-card-content-tag">APY:</p>
            <p className="plenty-card-content-tag">{props.apy}%</p>
          </div>
          <div className="plenty-card-content-info flex justify-between">
            <p className="plenty-card-content-tag">APR:</p>
            <p className="plenty-card-content-tag">{props.apr}%</p>
          </div>
          <div className="plenty-card-content-info flex justify-between">
            <p className="plenty-card-content-tag">Rewards:</p>
            <p className="plenty-card-content-tag">{props.rewards}</p>
          </div>
        </div>

        <div className="plenty-card-tvl-info-wrapper">
          <div className="plenty-card-tvl-info flex justify-between align-center">
            <p className="plenty-card-content-tag">TVL:</p>
            <p className="plenty-card-content-tag">${props.liquidity}</p>
          </div>
        </div>
        {swapContentButton}
      </Card>
    </Col>
  );
};

export default FarmCard;
