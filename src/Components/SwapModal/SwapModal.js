import { Modal } from "react-bootstrap"

const SwapModal = props => {
	console.log(props.tokenIn, props.tokenOut, "Token values in swap modal")
	return (
		<Modal
			show={!!props.show}
			onHide={props.onHide}
			animation={false}
			className="swap-modal">
			<Modal.Header closeButton>
				<Modal.Title>Select a token</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="coin-selection-table">
					{props.show === "tokenIn" &&
						props.tokens.map((token, index) => {
							return (
								<button
									disabled={props.tokenIn.name === token.name}
									className="token-select-btn"
									key={index}
									onClick={() => {
										if (token.name === props.tokenOut.name) {
											props.handleStateSwap()
										} else {
											props.selectToken(token)
										}
										console.log(token, "tokenTop")
									}}>
									<img
										src={token.image}
										className="select-token-img"
										alt={token.name}
									/>
									{token.name}
								</button>
							)
						})}
					{props.show === "tokenOut" &&
						props.tokens.map((token, index) => {
							return (
								<button
									disabled={props.tokenOut.name === token.name}
									className="token-select-btn"
									key={index}
									onClick={() => {
										if (token.name === props.tokenIn.name) {
											props.handleStateSwap()
										} else {
											props.selectToken(token)
										}
										console.log(token, "tokenBottom")
									}}>
									<img
										src={token.image}
										className="select-token-img"
										alt={token.name}
									/>
									{token.name}
								</button>
							)
						})}
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default SwapModal
