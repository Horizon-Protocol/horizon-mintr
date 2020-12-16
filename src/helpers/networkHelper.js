import throttle from 'lodash/throttle';
import invert from 'lodash/invert';
import some from 'lodash/some';

import { NETWORK_SPEEDS_TO_KEY } from '../constants/network';
import { GWEI_UNIT, GAS_LIMIT_BUFFER_PERCENTAGE } from '../constants/network';

export const SUPPORTED_NETWORKS = {
	56: 'MAINNET', // BSC
	97: 'TESTNET', // BSC testnet
};

export const BSC_JSON_RPC_URLS = {
	56: `https://bsc-dataseed.binance.org/`,
	97: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
};

export const SUPPORTED_NETWORKS_MAP = invert(SUPPORTED_NETWORKS);

export const DEFAULT_GAS_LIMIT = {
	mint: 2200000,
	burn: 2200000,
	claim: 1400000,
	exchange: 220000,
	sendSNX: 120000,
	sendEth: 21000,
	sendSynth: 150000,
};

export const SUPPORTED_WALLETS_MAP = {
	BINANCE: 'Binance',
	METAMASK: 'Metamask',
	// LEDGER: 'Ledger',
};

export const SUPPORTED_WALLETS = Object.values(SUPPORTED_WALLETS_MAP);

const WALLET_INJECT_MAP = {
	Binance: 'BinanceChain',
	Metamask: 'ethereum',
};

export const hasWalletInstalled = wallet => {
	const injectName = WALLET_INJECT_MAP[wallet];
	return injectName ? !!window[injectName] : false;
};

export const hasAnyWalletInstalled = () => some(SUPPORTED_WALLETS, hasWalletInstalled);

// add REACT_APP_BLOCKNATIVE_NOTIFY_KEY=xxx to .env
export const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_NOTIFY_KEY;

const defaultNetwork = { name: 'TESTNET', networkId: 97 };

export async function getBscNetwork(wallet) {
	if (!hasAnyWalletInstalled()) {
		return defaultNetwork;
	}
	let networkId = 56;

	try {
		let chainId = window.BinanceChain?.chainId || window.ethereum?.chainId;
		if (wallet === SUPPORTED_WALLETS_MAP.BINANCE) {
			chainId = window.BinanceChain?.chainId;
		} else if (wallet === SUPPORTED_WALLETS_MAP.METAMASK) {
			chainId = window.ethereum?.chainId;
		}
		if (chainId) {
			console.log('chainId', chainId);
			networkId = parseInt(chainId);
			return { name: SUPPORTED_NETWORKS[networkId], networkId };
		} else if (window.web3?.eth?.net) {
			console.log('web3.net');
			networkId = await window.web3.eth.net.getId();
			return { name: SUPPORTED_NETWORKS[networkId], networkId: Number(networkId) };
		} else if (window.web3?.version?.network) {
			console.log('web3.network');
			networkId = Number(window.web3.version.network);
			return { name: SUPPORTED_NETWORKS[networkId], networkId };
		}
		return defaultNetwork;
	} catch (e) {
		console.log(e);
		return defaultNetwork;
	}
}

const handleBasGasSpeedsRequest = async () => {
	return {
		[NETWORK_SPEEDS_TO_KEY.AVERAGE]: {
			price: 18,
		},
		[NETWORK_SPEEDS_TO_KEY.FAST]: {
			price: 22,
		},
		[NETWORK_SPEEDS_TO_KEY.FASTEST]: {
			price: 26,
		},
	};
};

export const getNetworkSpeeds = async () => {
	try {
		return await handleBasGasSpeedsRequest();
	} catch (e) {
		console.log(e);
	}
};

export const formatGasPrice = gasPrice => gasPrice * GWEI_UNIT;

export const getTransactionPrice = (gasPrice, gasLimit, ethPrice) => {
	if (!gasPrice || !gasLimit) return 0;
	return (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
};

export function onWalletAccountChange(cb) {
	const listener = throttle(cb, 1000);
	if (window.BinanceChain) {
		window.BinanceChain.on('accountsChanged', listener);
	}
	if (window.ethereum) {
		window.ethereum.on('accountsChanged', listener);
	}
}

export function onWalletNetworkChange() {
	console.log('bind onWalletNetworkChange');
	if (window.BinanceChain) {
		window.BinanceChain.on('chainChanged', () => {
			document.location.reload();
		});
	}
	if (window.ethereum) {
		window.ethereum.on('chainChanged', () => {
			document.location.reload();
		});
	}
}

export const addBufferToGasLimit = gasLimit =>
	Math.round(Number(gasLimit) * (1 + GAS_LIMIT_BUFFER_PERCENTAGE));

export const isMainNet = networkId => networkId === Number(SUPPORTED_NETWORKS_MAP.MAINNET);
