import Button from "../Ui/Buttons/Button"
import React, { useEffect, useState } from "react"
import SimpleModal from "../Ui/Modals/SimpleModal"
import { RPC_NODE } from "../../constants/localStorage"
import { connect } from "react-redux"
import { setRPCNodeName } from "../../redux/actions/home/home.actions"
import axios from 'axios'

async function isValidURL(userInput) {
	try {
		// const response = await axios.get(userInput + "/chains/main/blocks")
		const response = await axios({
			method: "get",
			baseURL: userInput,
			url: "/chains/main/blocks"
		})
		return response.status === 200
	} catch (error) {
		return false
	}
}

function NodeSelectorModal(props) {
	const [currentRPC, setCurrentRPC] = useState("")
	const [customRPC, setCustomRPC] = useState("")

	const LOCAL_RPC_NODES = {
		PLENTY: "https://cres2hr8uxm6.midl.dev/",
		GIGANODE: "https://mainnet-tezos.giganode.io/",
		CRYPTONOMIC: "https://tezos-prod.cryptonomic-infra.tech/",
	}
	const nodeNames = {
		PLENTY: "Plenty node",
		GIGANODE: "Giganode",
		CRYPTONOMIC: "Cryptonomic",
	}

	const rpcNodeDetect = () => {
		const RPCNodeInLS = localStorage.getItem(RPC_NODE)
		if (!RPCNodeInLS) {
			setCurrentRPC("")
			return
		}
		isValidURL(RPCNodeInLS).then((res) => {
			if (!res) {
				localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES["PLENTY"])
				setCurrentRPC("PLENTY")
				return
		}});

		const matchedNode = Object.entries(LOCAL_RPC_NODES).find(
			([_, nodeLink]) => {
				if (nodeLink === RPCNodeInLS) {
					return true
				}
				return false
			}
		)

		if (!matchedNode) {
			setCurrentRPC("CUSTOM")
			setCustomRPC(RPCNodeInLS)
			return
		}

		const [nodeName] = matchedNode
		setCurrentRPC(nodeName)
	}

	useEffect(() => {
		rpcNodeDetect()
		// eslint-disable-next-line
	}, [props.nodeSelector])

	

	const setRPCInLS =  async() => {
		if (currentRPC !== "CUSTOM") {
			localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES[currentRPC])
			props.closeNodeSelectorModal()
			window.location.reload()
		} else {
			let _customRPC = customRPC
			if (!_customRPC.match(/\/$/)) {
				_customRPC += "/"
			}
			const response = await isValidURL(_customRPC)

				if (!response) {
					props.setLoaderMessage({ type: "error", message: "Invalid RPC URL" })
					setTimeout(() => {
						props.setLoaderMessage({});
					}, 5000)
					return
				} else {
					localStorage.setItem(RPC_NODE, _customRPC)
					props.closeNodeSelectorModal(_customRPC)
					window.location.reload()
				}
		}
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
			<div className="node-selector-radio-container node-selector-list">
				<ul>
					{Object.entries(nodeNames).map(([identifier, name]) => (
						<li>
							
							<label for={identifier} onClick={ () =>  setCurrentRPC(identifier)}><input
								defaultChecked={currentRPC === identifier}
								type="radio"
								checked={currentRPC === identifier}
								id={identifier}
								name="selector"
							/>{name}<div class="check"></div></label>		
						</li>
					))}
					<li>
						
						<label for="w-option" onClick={() =>  setCurrentRPC("CUSTOM")}><input
							defaultChecked={currentRPC === "CUSTOM"}
							type="radio"
							id="w-option"
							checked={currentRPC === "CUSTOM"}
							name="selector"
							
					/>Custom<div class="check">
				</div></label>
						<input
							disabled={ currentRPC !== "CUSTOM"}
							type="url"
							for="w-option"
							className="node-selector-modal-input"
							placeholder="https://custom.tezos.node"
							value={customRPC}
							onChange={e => {
								setCustomRPC(e.target.value)
							}}
						/>

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

const mapStateToProps = state => ({
	selectedNode: state.home.nodeState.rpcNode,
})

const mapDispatchToProps = dispatch => ({
	setRPCNodeName: () => dispatch(setRPCNodeName()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NodeSelectorModal)
