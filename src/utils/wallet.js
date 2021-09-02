import { BeaconWallet } from '@taquito/beacon-wallet'
import CONFIG from "../config/config"

const network = {
	type: CONFIG.WALLET_NETWORK,
}
const options = {
	name: CONFIG.NAME,
}

const beaconWallet = new BeaconWallet(options)

const CheckIfWalletConnected = async wallet => {
	try {
		const activeAccount = await wallet.client.getActiveAccount()
		if (!activeAccount) {
			await wallet.client.requestPermissions({
				network,
			})
		}
		return {
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			error,
		}
	}
}

export { beaconWallet, CheckIfWalletConnected }
