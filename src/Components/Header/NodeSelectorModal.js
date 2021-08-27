import Button from "../Ui/Buttons/Button"
import React, { useEffect, useState } from "react"
import SimpleModal from "../Ui/Modals/SimpleModal"
import { RPC_NODE } from "../../constants/localStorage"
import { connect } from 'react-redux'
import { setRPCNodeName } from '../../redux/actions/home/home.actions'

 function NodeSelectorModal(props) {
	const [currentRPC, setCurrentRPC] = useState("")
	const [customeRPC, setCustomeRPC] = useState("")
	const LOCAL_RPC_NODES = {
		"PLENTY": "https://cres2hr8uxm6.midl.dev/",
		"GIGANODE": "https://mainnet-tezos.giganode.io/",
		"CRYPTONOMIC" : "https://tezos-prod.cryptonomic-infra.tech/",
	}
	useEffect(() => {
		console.log(currentRPC)
	}, [currentRPC])

	const setRPCInLS = () => {
		if (currentRPC !== "CUSTOM") {
			localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES[currentRPC])
			props.setRPCNodeName(currentRPC)
			// window.location.reload()
		} else {
			localStorage.setItem(RPC_NODE, customeRPC)
			props.setRPCNodeName("CUSTOM")
			// window.location.reload()
		}
		props.closeNodeSelectorModal(customeRPC)
	}
	return (
		<SimpleModal
			title={props.title}
			open={props.nodeSelector}
			onClose={props.closeNodeSelectorModal}
			className="node-selector-modal">
			<div className="node-selector-text">
				The Plenty node can be overloaded sometimes. When your data doesn’t load
				properly, try switching to a different node, or use a custom node.
			</div>
			<div className="node-selector-radio-container">
				<ul>
					<li onClick={() => setCurrentRPC("PLENTY")}>
						<input type="radio" id="f-option" name="selector" />
						<label for="f-option">Plenty node</label>

						<div class="check"></div>
					</li>

					<li
						onClick={() => setCurrentRPC("GIGANODE")}>
						<input type="radio" id="s-option" name="selector" />
						<label for="s-option">Giganode</label>

						<div class="check">
							<div class="inside"></div>
						</div>
					</li>

					<li
						onClick={() =>
							setCurrentRPC("CRYPTONOMIC")
						}>
						<input type="radio" id="t-option" name="selector" />
						<label for="t-option">Cryptonomic</label>
						<div class="check">
							<div class="inside"></div>
						</div>
					</li>
					<li onClick={() => setCurrentRPC("CUSTOM")}>
						<input type="radio" id="w-option" name="selector" />
						<label for="w-option">Custom</label>
						<input
							type="url"
							for="w-option"
							className="node-selector-modal-input"
							placeholder="https://custom.tezos.node"
							value={customeRPC}
							onChange={e => {
								setCustomeRPC(e.target.value)
							}}
						/>
						<div class="check">
							<div class="inside"></div>
						</div>
					</li>
				</ul>
			</div>
			<Button
				onClick={setRPCInLS}
				color={"primary"}
				className={"w-100"}
				style={{ marginTop: "15px" }}>
				Set Node
			</Button>
		</SimpleModal>
	)
}

const mapStateToProps = (state) => ({
	selectedNode : state.home.nodeState.rpcNode
})

const mapDispatchToProps = (dispatch) => ({
	setRPCNodeName : () => dispatch(setRPCNodeName())
})

export default connect(mapStateToProps, mapDispatchToProps)(NodeSelectorModal)
