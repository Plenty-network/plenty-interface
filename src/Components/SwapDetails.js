const SwapDetails = props => {
	return (
		<div className="swap-detail-wrapper">
			<div className="swap-detail-amt-wrapper">
				<p className="swap-detail-amt-details">
					Minimum received{" "}
					<span className="material-icons-round">help_outline</span>
				</p>
				<p className="swap-detail-amt-details">
					{props.computedOutDetails.minimum_Out
						? props.computedOutDetails.minimum_Out.toFixed(8)
						: "0.00"}{" "}
					{props.tokenOut.name}
				</p>
			</div>

			<div className="swap-detail-amt-wrapper">
				<p className="swap-detail-amt-details">
					Price Impact{" "}
					<span className="material-icons-round">help_outline</span>
				</p>
				<p className="swap-detail-amt-details">
					{props.computedOutDetails.priceImpact
						? props.computedOutDetails.priceImpact
						: "0.00"}{" "}
					%
				</p>
			</div>

			<div className="swap-detail-amt-wrapper">
				<p className="swap-detail-amt-details">
					Liquidity Provider Fee{" "}
					<span className="material-icons-round">help_outline</span>
				</p>
				<p className="swap-detail-amt-details">
					{props.computedOutDetails.fees} {props.tokenIn.name}
				</p>
			</div>
		</div>
	)
}

export default SwapDetails
