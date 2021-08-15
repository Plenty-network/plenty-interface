import React, { useState, useEffect } from "react"
import {
	loadSwapData,
	computeTokenOutput,
	fetchAllWalletBalance,
	getTokenPrices,
} from "../apis/swap/swap"

import TransactionSettings from "../Components/TransactionSettings/TransactionSettings"
import SwapModal from "../Components/SwapModal/SwapModal"
import SwapTab from "../Components/SwapTabsContent/SwapTab"
import LiquidityTab from "../Components/SwapTabsContent/LiquidityTab"
import Loader from "../Components/loader"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import plenty from "../assets/images/logo_small.png"
import kalam from "../assets/images/kalam.png"
import wrap from "../assets/images/wrap.png"
import wdai from "../assets/images/wdai.png"

const Swap = props => {
	const tokens = [
		{
			name: "PLENTY",
			image: plenty,
		},
		{
			name: "WRAP",
			image: wrap,
		},
		{
			name: "wDAI",
			image: wdai,
		},
	]

	const [show, setShow] = useState(null)
	const [showConfirmSwap, setShowConfirmSwap] = useState(false)
	const [showConfirmAddSupply, setShowConfirmAddSupply] = useState(false)
	const [showConfirmRemoveSupply, setShowConfirmRemoveSupply] = useState(false)
	const [hideContent, setHideContent] = useState("")

	const handleClose = () => {
		setShow(null)
		setShowConfirmSwap(false)
		setShowConfirmAddSupply(false)
		setShowConfirmRemoveSupply(false)
		setHideContent("")
		setLoading(false)
	}
	const [slippage, setSlippage] = useState(0.05)
	const [recepient, setRecepient] = useState("")
	const [tokenType, setTokenType] = useState("tokenIn")
	const [inputType, setInputType] = useState("tokenIn")
	const [tokenOut, setTokenOut] = useState({})
	const [firstTokenAmount, setFirstTokenAmount] = useState(0)
	const [secondTokenAmount, setSecondTokenAmount] = useState(0)
	const [swapData, setSwapData] = useState({})
	const [computedOutDetails, setComputedOutDetails] = useState({})
	const [computedInDetails, setComputedInDetails] = useState({})
	const [getTokenPrice, setGetTokenPrice] = useState({})
	const [userBalances, setUserBalances] = useState({})
	const [loading, setLoading] = useState(false)
	const [loaderMessage, setLoaderMessage] = useState({})
	const [tokenContractInstances, setTokenContractInstances] = useState({})
	const [tokenIn, setTokenIn] = useState({
		name: "PLENTY",
		image: plenty,
	})

	const [tokenInputType, setTokenInputType] = useState({
		top: "top-token",
		bottom: "bottom-token",
	})

	useEffect(() => {
		// console.log(slippage, "slippage")
		// console.log(recepient, "recepient")
		// console.log(tokenType, "tokenType")
		// console.log(tokenOut, "tokenOut")
		// console.log(firstTokenAmount, "firstTokenAmount")
		console.log(swapData, "swapData")
		// console.log(computedOutDetails, "computedOutDetails")
		// console.log(getTokenPrice, "getTokenPrice")
		// console.log(userBalances, "userBalances")
		// console.log(loading, "loading")
		// console.log(loaderMessage, "loaderMessage")
		// console.log(tokenContractInstances, "tokenContractInstances")
		// console.log(tokenIn, "tokenIn")
	}, [
		// slippage,
		// recepient,
		// tokenType,
		// tokenOut,
		// firstTokenAmount,
		swapData,
		// computedOutDetails,
		// getTokenPrice,
		// userBalances,
		// loading,
		// loaderMessage,
		// tokenContractInstances,
		// tokenIn,
	])

	// useEffect(() => { }, [firstTokenAmount])
	// useEffect(() => { }, [secondTokenAmount])

	const selectToken = token => {
		setLoading(true)
		if (tokenType === "tokenIn") {
			if (tokenOut.name === token.name) {
				return
			}
			setTokenIn({
				name: token.name,
				image: token.image,
			})
			loadSwapData(token.name, tokenOut.name).then(data => {
				console.log(data, "TOP")
				if (data.success) {
					setSwapData(data)
					setLoading(false)
				}
			})
		} else {
			setTokenOut({
				name: token.name,
				image: token.image,
			})
			loadSwapData(tokenIn.name, token.name).then(data => {
				if (data.success) {
					console.log(data, "BOTTOM")
					setSwapData(data)
					setLoading(false)
				}
			})
		}
		setFirstTokenAmount(0)
		setSecondTokenAmount(0)
		setComputedInDetails({ tokenOut_amount: 0, fees: 0 })
		setComputedOutDetails({ tokenOut_amount: 0, fees: 0 })
		handleClose()
	}

	const handleTokenSelectionOnSwitch = async ({
		tokenThatWillBeTakeFromUser,
		tokenThatWillBeGiveToUser,
	}) => {
		setLoading(true)
		setTokenIn({
			name: tokenThatWillBeTakeFromUser.name,
			image: tokenThatWillBeTakeFromUser.image,
		})
		setTokenOut({
			name: tokenThatWillBeGiveToUser.name,
			image: tokenThatWillBeGiveToUser.image,
		})
		try {
			const res = await loadSwapData(
				tokenThatWillBeTakeFromUser.name,
				tokenThatWillBeGiveToUser.name
			)
			if (res.success) {
				setSwapData(res)
				setLoading(false)
			}
		} catch (err) {
			console.log(err)
		}

		handleClose()
	}

	const handleTokenType = type => {
		console.log("Clicked on handleTokenType", type)
		setHideContent("content-hide")
		if (type === "tokenIn") {
			setShow(type)
		} else {
			setShow(type)
		}
		// setShow(true)
		setTokenType(type)
		setLoading(false)
	}

	const handleTokenInput = ({ input, type }) => {
		const lengthOfInput = input.length
		if (input.charAt(lengthOfInput - 1) == ".") {
			return
		}
		const parsedString = parseFloat(input)
		if (type === "top-token") {
			setFirstTokenAmount(parsedString)
			if (input === "" || isNaN(input)) {
				setFirstTokenAmount(0)
				setComputedOutDetails({
					tokenOut_amount: 0,
					fees: 0,
				})
				return
			} else {
				const conputedData = computeTokenOutput(
					parseFloat(input),
					swapData.tokenIn_supply,
					swapData.tokenOut_supply,
					swapData.exchangeFee,
					slippage
				)
				console.log(conputedData, "TOP")
				setComputedOutDetails(conputedData)
				setSecondTokenAmount(conputedData.tokenOut_amount)
				setLoading(false)
			}
		} else {
			setSecondTokenAmount(parsedString)
			if (input === "" || isNaN(input)) {
				setSecondTokenAmount(0)
				setComputedOutDetails({
					tokenOut_amount: 0,
					fees: 0,
				})
				return
			} else {
				const computedData = computeTokenOutput(
					parseFloat(input), //tokenOut_amount,
					swapData.tokenOut_supply,
					swapData.tokenIn_supply,
					swapData.exchangeFee,
					slippage
				)
				setFirstTokenAmount(computedData.tokenOut_amount)
				console.log(computedData, "BOTTOM")
				const computedData2 = computeTokenOutput(
					parseFloat(computedData.tokenOut_amount),
					swapData.tokenIn_supply,
					swapData.tokenOut_supply,
					swapData.exchangeFee,
					slippage
				)
				// setComputedInDetails(computedData)
				setComputedOutDetails(computedData2)

				setLoading(false)
			}
			// console.log(input, type)
		}
	}

	useEffect(() => {
		setLoading(true)
		if (!props.walletAddress) {
			return
		}
		fetchAllWalletBalance(props.walletAddress).then(resp => {
			setUserBalances(resp.userBalances)
			setTokenContractInstances(resp.contractInstances)
			setLoading(false)
		})
	}, [props.walletAddress])

	useEffect(() => {
		setLoading(true)
		getTokenPrices().then(tokenPrice => {
			setGetTokenPrice(tokenPrice)
			setLoading(false)
		})
	}, [])

	const handleLoaderMessage = (type, message) => {
		setLoaderMessage({
			type: type,
			message: message,
		})
		setLoading(false)
	}

	const handleStateSwap = async () => {
		// console.log("Switching")
		// console.log(tokenIn, "Token In line 278")
		// console.log(tokenOut, "Token Out line 279")
		// console.log(firstTokenAmount, "firstTokenAmount line 282")
		// console.log(secondTokenAmount, "secondTokenAmount line 283")
		setLoading(true)
		// const tokenDetailsOne = computedOutDetails
		// const tokenDetailsTwo = computedInDetails
		// setComputedInDetails(tokenDetailsOne)
		// setComputedOutDetails(tokenDetailsTwo)
		// selectTokenOut(tokenOne)
		// selectTokenIn(tokenTwo)
		setFirstTokenAmount(0)
		setSecondTokenAmount(0)
		setComputedInDetails({ tokenOut_amount: 0, fees: 0 })
		setComputedOutDetails({ tokenOut_amount: 0, fees: 0 })
		await handleTokenSelectionOnSwitch({
			tokenThatWillBeGiveToUser: tokenIn,
			tokenThatWillBeTakeFromUser: tokenOut,
		})

		// setTimeout(() => {
		// 	setLoading(false)
		// }, 2000)
		// setTokenInputType({ bottom: tokenOneInputType, top: tokenTwoInputType })
		console.log("Swapping Mechanism")
	}

	const resetAllValues = () => {
		setSlippage(0.05)
		setRecepient("")
		setTokenType("tokenIn")
		setTokenOut({})
		setFirstTokenAmount(0)
		setSwapData({})
		setComputedOutDetails({})
		setGetTokenPrice({})
		setUserBalances({})
		setTokenContractInstances({})
		setLoading(false)
		setLoaderMessage({})
		setTokenIn({
			name: "PLENTY",
			image: plenty,
		})
	}

	return (
		<Container fluid>
			<Row>
				<Col sm={8} md={6} className="swap-content-section">
					<div className={`swap-content-container ${hideContent}`}>
						<Tabs defaultActiveKey="swap" className="swap-container-tab">
							<Tab eventKey="swap" title="Swap">
								<SwapTab
									walletAddress={props.walletAddress}
									setFirstTokenAmount={setFirstTokenAmount}
									handleTokenInput={handleTokenInput}
									firstTokenAmount={firstTokenAmount}
									connecthWallet={props.connecthWallet}
									tokenIn={tokenIn}
									tokenOut={tokenOut}
									handleTokenType={handleTokenType}
									swapData={swapData}
									computedOutDetails={computedOutDetails}
									computedInDetails={computedInDetails}
									userBalances={userBalances}
									tokenContractInstances={tokenContractInstances}
									getTokenPrice={getTokenPrice}
									setSlippage={setSlippage}
									setRecepient={setRecepient}
									recepient={recepient}
									slippage={slippage}
									loading={loading}
									setLoading={setLoading}
									handleLoaderMessage={handleLoaderMessage}
									loaderMessage={loaderMessage}
									setShowConfirmSwap={setShowConfirmSwap}
									showConfirmSwap={showConfirmSwap}
									handleClose={handleClose}
									setHideContent={setHideContent}
									setLoaderMessage={setLoaderMessage}
									resetAllValues={resetAllValues}
									handleStateSwap={handleStateSwap}
									inputType={inputType}
									setInputType={setInputType}
									setComputedInDetails={setComputedInDetails}
									secondTokenAmount={secondTokenAmount}
									setSecondTokenAmount={setSecondTokenAmount}
									tokenInputType={tokenInputType}
								/>
							</Tab>
							<Tab eventKey="liquidity" title="Liquidity">
								<LiquidityTab
									walletAddress={props.walletAddress}
									setFirstTokenAmount={handleTokenInput}
									firstTokenAmount={firstTokenAmount}
									connecthWallet={props.connecthWallet}
									tokenIn={tokenIn}
									tokenOut={tokenOut}
									handleTokenType={handleTokenType}
									swapData={swapData}
									computedOutDetails={computedOutDetails}
									userBalances={userBalances}
									tokenContractInstances={tokenContractInstances}
									getTokenPrice={getTokenPrice}
									setSlippage={setSlippage}
									setRecepient={setRecepient}
									recepient={recepient}
									slippage={slippage}
									loading={loading}
									setLoading={setLoading}
									handleLoaderMessage={handleLoaderMessage}
									loaderMessage={loaderMessage}
									handleClose={handleClose}
									showConfirmAddSupply={showConfirmAddSupply}
									setShowConfirmAddSupply={setShowConfirmAddSupply}
									showConfirmRemoveSupply={showConfirmRemoveSupply}
									setShowConfirmRemoveSupply={setShowConfirmRemoveSupply}
									setHideContent={setHideContent}
									setLoaderMessage={setLoaderMessage}
									resetAllValues={resetAllValues}
								/>
							</Tab>
						</Tabs>

						<TransactionSettings
							recepient={recepient}
							slippage={slippage}
							setSlippage={setSlippage}
							setRecepient={setRecepient}
							walletAddress={props.walletAddress}
						/>
					</div>
				</Col>
			</Row>
			<SwapModal
				show={show}
				handleStateSwap={handleStateSwap}
				onHide={handleClose}
				selectToken={selectToken}
				tokens={tokens}
				tokenIn={tokenIn}
				tokenOut={tokenOut}></SwapModal>

			<Loader loading={loading} loaderMessage={loaderMessage} />
		</Container>
	)
}

export default Swap
