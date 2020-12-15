import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import hznJSConnector from '../../../helpers/hznJSConnector';
import { addBufferToGasLimit } from '../../../helpers/networkHelper';
import { SliderContext } from '../../../components/ScreenSlider';
import { bytesFormatter, bigNumberFormatter, formatCurrency } from '../../../helpers/formatters';

import errorMapper from '../../../helpers/errorMapper';
import { getCurrentGasPrice } from '../../../ducks/network';
import { getWalletDetails } from '../../../ducks/wallet';
import { fetchBalancesRequest } from 'ducks/balances';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { useNotifyContext } from 'contexts/NotifyContext';
import { notifyHandler } from 'helpers/notifyHelper';

const useGetIssuanceData = (walletAddress, hUSDBytes) => {
	const [data, setData] = useState({});
	const HZNBytes = bytesFormatter('HZN');
	useEffect(() => {
		const getIssuanceData = async () => {
			try {
				const results = await Promise.all([
					hznJSConnector.hznJS.Synthetix.maxIssuableSynths(walletAddress, hUSDBytes),
					hznJSConnector.hznJS.Synthetix.debtBalanceOf(walletAddress, hUSDBytes),
					hznJSConnector.hznJS.SystemSettings.issuanceRatio(),
					hznJSConnector.hznJS.ExchangeRates.rateForCurrency(HZNBytes),
					hznJSConnector.hznJS.Synthetix.collateral(walletAddress),
				]);
				const [maxIssuableHassets, debtBalance, issuanceRatio, HZNPrice, hznBalance] = results.map(
					bigNumberFormatter
				);
				const issuableHassets = Math.max(0, maxIssuableHassets - debtBalance);
				setData({ issuableHassets, debtBalance, issuanceRatio, HZNPrice, hznBalance });
			} catch (e) {
				console.log(e);
			}
		};
		getIssuanceData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);
	return data;
};

// TODO: replace it with BSC.
const useGetGasEstimate = (mintAmount, issuableHassets, setFetchingGasLimit, setGasLimit) => {
	console.log({ mintAmount, issuableHassets });
	const { t } = useTranslation();
	const [error, setError] = useState(null);
	useEffect(() => {
		if (!mintAmount) return;
		const getGasEstimate = async () => {
			setError(null);
			setFetchingGasLimit(true);
			let gasEstimate;
			try {
				const {
					hznJS: { Synthetix },
				} = hznJSConnector;
				if (!parseFloat(mintAmount)) throw new Error('input.error.invalidAmount');
				if (mintAmount <= 0 || mintAmount > issuableHassets)
					throw new Error('input.error.notEnoughToMint');
				if (mintAmount === issuableHassets) {
					gasEstimate = await Synthetix.contract.estimate.issueMaxSynths();
				} else {
					gasEstimate = await Synthetix.contract.estimate.issueSynths(
						hznJSConnector.utils.parseEther(mintAmount.toString())
					);
				}
				setFetchingGasLimit(false);
				setGasLimit(addBufferToGasLimit(gasEstimate));
			} catch (e) {
				console.log(e);
				setFetchingGasLimit(false);
				const errorMessage = (e && e.message) || 'input.error.gasEstimate';
				setError(t(errorMessage));
			}
		};
		getGasEstimate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mintAmount]);
	return error;
};

const Mint = ({
	onDestroy,
	walletDetails,
	currentGasPrice,
	fetchDebtStatusRequest,
	fetchBalancesRequest,
}) => {
	const { handleNext, handlePrev } = useContext(SliderContext);
	const [mintAmount, setMintAmount] = useState('');
	const { currentWallet, walletType, networkName, networkId } = walletDetails;
	const [transactionInfo, setTransactionInfo] = useState({});
	const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
	const [gasLimit, setGasLimit] = useState(0);
	const { notify } = useNotifyContext();

	const hUSDBytes = bytesFormatter('sUSD');
	const { issuableHassets, issuanceRatio, HZNPrice, debtBalance, hznBalance } = useGetIssuanceData(
		currentWallet,
		hUSDBytes
	);

	const gasEstimateError = useGetGasEstimate(
		mintAmount,
		issuableHassets,
		setFetchingGasLimit,
		setGasLimit
	);

	const onMint = async () => {
		const transactionSettings = {
			gasPrice: currentGasPrice.formattedPrice,
			gasLimit,
		};
		try {
			const {
				hznJS: { Synthetix },
			} = hznJSConnector;
			handleNext(1);
			let transaction;
			if (mintAmount === issuableHassets) {
				transaction = await Synthetix.issueMaxSynths(transactionSettings);
			} else {
				transaction = await Synthetix.issueSynths(
					hznJSConnector.utils.parseEther(mintAmount.toString()),
					transactionSettings
				);
			}
			if (notify && transaction) {
				const refetch = () => {
					fetchDebtStatusRequest();
					fetchBalancesRequest();
				};
				const message = `Minted ${formatCurrency(mintAmount)} hUSD`;
				setTransactionInfo({ transactionHash: transaction.hash });
				notifyHandler(notify, transaction.hash, networkId, refetch, message);

				handleNext(2);
			}
		} catch (e) {
			console.log(e);
			const errorMessage = errorMapper(e, walletType);
			console.log(errorMessage);
			setTransactionInfo({
				...transactionInfo,
				transactionError: errorMessage,
			});
			handleNext(2);
		}
	};

	const props = {
		onDestroy,
		onMint,
		issuableHassets,
		goBack: handlePrev,
		walletType,
		networkName,
		mintAmount,
		setMintAmount,
		issuanceRatio,
		HZNPrice,
		...transactionInfo,
		isFetchingGasLimit,
		gasLimit,
		gasEstimateError,
		debtBalance,
		hznBalance,
	};

	return [Action, Confirmation, Complete].map((SlideContent, i) => (
		<SlideContent key={i} {...props} />
	));
};

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
	fetchDebtStatusRequest,
	fetchBalancesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mint);
