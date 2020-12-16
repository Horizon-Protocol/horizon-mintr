import { HorizonJs } from '@phoenix-global/horizon-js';
import { getBscNetwork, BSC_JSON_RPC_URLS, SUPPORTED_WALLETS_MAP } from './networkHelper';
import { ethers, providers } from 'ethers';
import {
	uniswapV1,
	uniswapV2,
	unipoolSETH,
	curvepool,
	curveLPToken,
	synthSummary,
	oldCurvepool,
	iEthRewards,
	iEth4Rewards,
	balancerpool,
	balancerSNXRewards,
	curveSBTC,
	sBTCRewards,
	// curveSUSDSwapContract,
	iBtcRewards,
	iBtc2Rewards,
} from './contracts';

let hznJSConnector = {
	initialized: false,
	signers: HorizonJs.signers,
	setContractSettings: function (contractSettings) {
		this.initialized = true;
		this.hznJS = new HorizonJs(contractSettings);
		this.synths = this.hznJS.contractSettings.synths;
		this.signer = this.hznJS.contractSettings.signer;
		this.provider = this.hznJS.contractSettings.provider;
		this.utils = this.hznJS.utils;
		this.ethersUtils = this.hznJS.ethers.utils;
		if (this.signer) {
			this.uniswapV1Contract = new ethers.Contract(uniswapV1.address, uniswapV1.abi, this.signer);
			this.uniswapV2Contract = new ethers.Contract(uniswapV2.address, uniswapV2.abi, this.signer);
			this.unipoolSETHContract = new ethers.Contract(
				unipoolSETH.address,
				unipoolSETH.abi,
				this.signer
			);
			this.curveLPTokenContract = new ethers.Contract(
				curveLPToken.address,
				curveLPToken.abi,
				this.signer
			);
			this.curvepoolContract = new ethers.Contract(curvepool.address, curvepool.abi, this.signer);
			this.oldCurvepoolContract = new ethers.Contract(
				oldCurvepool.address,
				curvepool.abi,
				this.signer
			);
			this.iEthRewardsContract = new ethers.Contract(
				iEthRewards.address,
				iEthRewards.abi,
				this.signer
			);
			this.iEth4RewardsContract = new ethers.Contract(
				iEth4Rewards.address,
				iEth4Rewards.abi,
				this.signer
			);
			this.iBtcRewardsContract = new ethers.Contract(
				iBtcRewards.address,
				iBtcRewards.abi,
				this.signer
			);
			this.iBtc2RewardsContract = new ethers.Contract(
				iBtc2Rewards.address,
				iBtc2Rewards.abi,
				this.signer
			);
			this.balancerpoolContract = new ethers.Contract(
				balancerpool.address,
				balancerpool.abi,
				this.signer
			);
			this.balancerSNXRewardsContract = new ethers.Contract(
				balancerSNXRewards.address,
				balancerSNXRewards.abi,
				this.signer
			);
			this.curveSBTCContract = new ethers.Contract(curveSBTC.address, curveSBTC.abi, this.signer);
			this.sBTCRewardsContract = new ethers.Contract(
				sBTCRewards.address,
				sBTCRewards.abi,
				this.signer
			);
		}
		this.synthSummaryUtilContract = new ethers.Contract(
			synthSummary.addresses[contractSettings.networkId],
			synthSummary.abi,
			this.provider
		);
		// this.curveSUSDSwapContract = new ethers.Contract(
		// 	curveSUSDSwapContract.address,
		// 	curveSUSDSwapContract.abi,
		// 	this.provider
		// );
	},
};

const connectToBinance = async (networkId, networkName) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.BINANCE,
		unlocked: false,
	};
	try {
		const accounts = await hznJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockReason: 'Please connect to Binance Wallet',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockReason: 'ErrorWhileConnectingToBinanceWallet',
			unlockMessage: e,
		};
	}
};

const connectToMetamask = async (networkId, networkName) => {
	const walletState = {
		walletType: SUPPORTED_WALLETS_MAP.METAMASK,
		unlocked: false,
	};
	try {
		const accounts = await hznJSConnector.signer.getNextAddresses();
		if (accounts && accounts.length > 0) {
			return {
				...walletState,
				currentWallet: accounts[0],
				unlocked: true,
				networkId,
				networkName: networkName.toLowerCase(),
			};
		} else {
			return {
				...walletState,
				unlockReason: 'Please connect to Metamask',
			};
		}
		// We updateWalletStatus with all the infos
	} catch (e) {
		console.log(e);
		return {
			...walletState,
			unlockReason: 'ErrorWhileConnectingToMetamask',
			unlockMessage: e,
		};
	}
};

const connectToHardwareWallet = (networkId, networkName, walletType) => {
	return {
		walletType,
		unlocked: true,
		networkId,
		networkName: networkName.toLowerCase(),
	};
};

const getSignerConfig = ({ type, networkId, derivationPath, networkName }) => {
	const customProvider = getProvider({ networkId });
	if (type === SUPPORTED_WALLETS_MAP.LEDGER) {
		const DEFAULT_LEDGER_DERIVATION_PATH = "44'/60'/0'/";
		return {
			derivationPath: derivationPath || DEFAULT_LEDGER_DERIVATION_PATH,
			provider: customProvider,
		};
	}

	// if (type === SUPPORTED_WALLETS_MAP.TREZOR) {
	// 	return {
	// 		provider: customProvider,
	// 	};
	// }

	return {};
};

export const setSigner = ({ type, networkId, derivationPath, networkName }) => {
	const signer = new hznJSConnector.signers[type](
		getSignerConfig({ type, networkId, derivationPath, networkName })
	);

	hznJSConnector.setContractSettings({
		networkId,
		signer,
		provider: signer.provider,
	});
};

export const connectToWallet = async ({ wallet, derivationPath }) => {
	const { name, networkId } = await getBscNetwork(wallet);
	console.log('connectToWallet', name, networkId);
	if (!name) {
		return {
			walletType: '',
			unlocked: false,
			unlockReason: 'NetworkNotSupported',
		};
	}
	setSigner({ type: wallet, networkId, derivationPath, networkName: name });

	switch (wallet) {
		case SUPPORTED_WALLETS_MAP.BINANCE:
			return connectToBinance(networkId, name);
		case SUPPORTED_WALLETS_MAP.METAMASK:
			return connectToMetamask(networkId, name);
		// case SUPPORTED_WALLETS_MAP.LEDGER:
		// 	return connectToHardwareWallet(networkId, name, wallet);
		default:
			return {};
	}
};

export const getProvider = ({ networkId }) => {
	return new providers.JsonRpcProvider(BSC_JSON_RPC_URLS[networkId]);
};

export default hznJSConnector;
