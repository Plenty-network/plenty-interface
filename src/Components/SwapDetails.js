const SwapDetails = (props) => {
  return (
    <div className="swap-detail-wrapper">
      <div className="swap-detail-amt-wrapper">
        <p className="swap-detail-amt-details">Minimum received </p>
        <p className="swap-detail-amt-details">
          {props.computedOutDetails.minimum_Out
            ? props.computedOutDetails.minimum_Out.toFixed(8)
            : '0.00'}{' '}
          {props.tokenOut.name}
        </p>
      </div>

      <div className="swap-detail-amt-wrapper">
        <p className="swap-detail-amt-details">Price Impact </p>
        <p className="swap-detail-amt-details">
          {props.computedOutDetails.priceImpact
            ? props.computedOutDetails.priceImpact
            : '0.00'}{' '}
          %
        </p>
      </div>

      <div className="swap-detail-amt-wrapper">
        <p className="swap-detail-amt-details">Fee </p>
        <p className="swap-detail-amt-details">
          {props.firstTokenAmount / 400} {props.tokenIn.name}
        </p>
      </div>
    </div>
  );
};

export default SwapDetails;
