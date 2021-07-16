const SwapDetails = (props) => {
  return (
    <div className="swap-detail-wrapper">
      <div className="swap-detail-amt-wrapper">
        <p className="swap-detail-amt-details">
          Minimum received{' '}
          <span className="material-icons-outlined">help_outline</span>
        </p>
        <p className="swap-detail-amt-details">0.50 KALAM</p>
      </div>

      <div className="swap-detail-amt-wrapper">
        <p className="swap-detail-amt-details">
          Price Impace{' '}
          <span className="material-icons-outlined">help_outline</span>
        </p>
        <p className="swap-detail-amt-details">{'<0.03%'}</p>
      </div>

      <div className="swap-detail-amt-wrapper">
        <p className="swap-detail-amt-details">
          Liquidity Provider Fee{' '}
          <span className="material-icons-outlined">help_outline</span>
        </p>
        <p className="swap-detail-amt-details">
          {props.computedOutDetails.fees.length} {props.tokenIn.name}
        </p>
      </div>
    </div>
  );
};

export default SwapDetails;
