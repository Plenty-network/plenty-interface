import clsx from "clsx"
import PropTypes from "prop-types"
import React from "react"
import { Row, Col, Image } from "react-bootstrap"
import Label from "../Ui/Label/Label"
import greenBullet from "../../assets/images/stats/greenbullet.svg"
import dollar from "../../assets/images/stats/dollar.svg"
import plentyInWallet from "../../assets/images/stats/plentyinwallet.svg"
import plentyToHarvest from "../../assets/images/stats/plentytoharvest.svg"
import plentyMedium from "../../assets/images/frontpage/plentymedium.svg"
import styles from "./stats.module.scss"
import Button from "../Ui/Buttons/Button"

const Stats = props => {
	return (
		<div className={clsx("p-3", "bg-themed", styles.container)}>
			<Row className="p-1">
				<Col xs={7}>
					<span className="d-flex font-weight-bold m-0 py-3">
						Your Stats
						<Image className="ml-2" src={greenBullet} />
					</span>
					<hr />
					<Label
						text={props?.valueLocked === null ? null : `$${props?.valueLocked?.toLocaleString(undefined, {
							maximumFractionDigits: 3,
						})} `}
						subText={"Total value locked"}
						icon={dollar}
						iconClass={"mt-1"}
						className={"pt-1"}
					/>
				</Col>
				<Col xs={5} className="m-auto">
					<Image className="mw-100" src={plentyMedium} />
				</Col>
			</Row>

			<hr className="mt-0" />
			<Row className="p-1">
				<Col xs={6}>
					<Label
						text={`${props.plentyInWallet?.toLocaleString(undefined, {
							maximumFractionDigits: 3,
						})}`}
						subText={"PLENTY in wallet"}
						icon={plentyInWallet}
						iconClass={"mt-1"}
					/>
				</Col>
				<Col xs={6}>
					<Label
						text={`${props.plentyToHarvest?.toFixed(5)}`}
						subText={"PLENTY to harvest"}
						icon={plentyToHarvest}
						iconClass={"mt-1"}
					/>
				</Col>
			</Row>
			<Row className="p-1 mt-1">
				<Col>
					<Button
						onClick={props.harvestAll}
						color={"primary"} className={"w-100"}
						disabled={props.plentyToHarvest === 0}
						loading={props.harvestAllOperations.loading}
					>
						Harvest all
					</Button>
				</Col>
			</Row>
		</div>
	)
}

Stats.propTypes = {
	valueLocked: PropTypes.number,
	plentyEarned: PropTypes.number,
	plentyInWallet: PropTypes.number,
	plentyToHarvest: PropTypes.number,
}

export default Stats
