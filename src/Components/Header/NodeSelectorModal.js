import Button from "../Ui/Buttons/Button"
import React, { useEffect, useState } from "react"
import SimpleModal from "../Ui/Modals/SimpleModal"
import { RPC_NODE } from "../../constants/localStorage"
import { connect } from 'react-redux'
import { setRPCNodeName } from '../../redux/actions/home/home.actions'

const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm

function isValidURL(str){
	return urlRegex.test(str)
}

 function NodeSelectorModal(props) {
	
	 const [currentRPC, setCurrentRPC] = useState("")
	 const [customRPC, setCustomRPC] = useState("")
	
	 const LOCAL_RPC_NODES = {
		"PLENTY": "https://cres2hr8uxm6.midl.dev/",
		"GIGANODE": "https://mainnet-tezos.giganode.io/",
		"CRYPTONOMIC" : "https://tezos-prod.cryptonomic-infra.tech/",
	 }
	 console.log(Object.entries(LOCAL_RPC_NODES))
	 
	 useEffect(() => {
		 const RPCNodeInLS = localStorage.getItem(RPC_NODE)

		 if (!RPCNodeInLS) {
			setCurrentRPC("")
			return
		}
		 
		 if (!isValidURL(RPCNodeInLS)) {
			 // set default node
			localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES['PLENTY'])
			setCurrentRPC('PLENTY')
			return
		 }
		 

		const matchedNode = Object.entries(LOCAL_RPC_NODES).find(([_, nodeLink]) => {
			if (nodeLink === RPCNodeInLS) {
				return true
			}
			return false
		 })

		 if (!matchedNode) {
			setCurrentRPC("CUSTOM")
			setCustomRPC(RPCNodeInLS)
			return
		 }

		 const [nodeName] = matchedNode
		 setCurrentRPC(nodeName)
		 // eslint-disable-next-line
		}, [])

	const setRPCInLS = () => {
		if (currentRPC !== "CUSTOM") {
			localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES[currentRPC])
			// props.setRPCNodeName(currentRPC)
			window.location.reload()
		} else {
			if (!isValidURL(customRPC)) {
				// show toast
				return
			}
			localStorage.setItem(RPC_NODE, customRPC)
			// props.setRPCNodeName("CUSTOM")
			window.location.reload()
		}
		props.closeNodeSelectorModal(customRPC)
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
						<input type="radio" checked={currentRPC === 'PLENTY'} id="f-option" name="selector" />
						<label for="f-option">Plenty node</label>

						<div class="check"></div>
					</li>

					<li
						onClick={() => setCurrentRPC("GIGANODE")}>
						<input type="radio" checked={currentRPC === 'GIGANODE'} id="s-option" name="selector" />
						<label for="s-option">Giganode</label>

						<div class="check">
							<div class="inside"></div>
						</div>
					</li>

					<li
						onClick={() =>
							setCurrentRPC("CRYPTONOMIC")
						}>
						<input type="radio" id="t-option" checked={currentRPC === 'CRYPTONOMIC'} name="selector" />
						<label for="t-option">Cryptonomic</label>
						<div class="check">
							<div class="inside"></div>
						</div>
					</li>
					<li onClick={() => setCurrentRPC("CUSTOM")}>
						<input type="radio" id="w-option" checked={currentRPC === 'CUSTOM'} name="selector" />
						<label for="w-option">Custom</label>
						<input
							type="url"
							for="w-option"
							className="node-selector-modal-input"
							placeholder="https://custom.tezos.node"
							value={customRPC}
							onChange={e => {
								setCustomRPC(e.target.value)
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
