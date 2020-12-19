import { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import hznJSConnector from 'helpers/hznJSConnector';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import { SliderContext } from 'components/ScreenSlider';
import { bytesFormatter, bigNumberFormatter, formatCurrency } from 'helpers/formatters';
import errorMapper from 'helpers/errorMapper';
import { getCurrentGasPrice } from 'ducks/network';
import { getWalletDetails } from 'ducks/wallet';
import { useNotifyContext } from 'contexts/NotifyContext';
import { notifyHandler } from 'helpers/notifyHelper';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

// TODO: replace it with BSC.
const useGetGasEstimate = (mintAmount, issuableHassets, setFetchingGasLimit, setGasLimit) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!mintAmount) return;
    const getGasEstimate = async () => {
      setError(null);
      setFetchingGasLimit(true);
      let gasEstimate = 1500000;
      try {
        // const {
        // 	hznJS: { Synthetix },
        // } = hznJSConnector;
        if (!parseFloat(mintAmount)) throw new Error('input.error.invalidAmount');
        if (mintAmount <= 0 || mintAmount > issuableHassets)
          throw new Error('input.error.notEnoughToMint');
        // if (mintAmount === issuableHassets) {
        // 	gasEstimate = await Synthetix.contract.estimate.issueMaxSynths();
        // } else {
        // 	gasEstimate = await Synthetix.contract.estimate.issueSynths(
        // 		hznJSConnector.utils.parseEther(mintAmount.toString())
        // 	);
        // }
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

const Mint = ({ onDestroy, walletDetails, currentGasPrice, onSuccess, ...props }) => {
  const { handleReset, handleNext, handlePrev } = useContext(SliderContext);
  const [mintAmount, setMintAmount] = useState('');
  const { currentWallet, walletType, networkName, networkId } = walletDetails;
  const [transactionInfo, setTransactionInfo] = useState({});
  const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
  const [gasLimit, setGasLimit] = useState(0);
  const { notify } = useNotifyContext();

  const {
    issuableHassets,
    transferable: issuableAmount,
    targetCRatio: issuanceRatio,
    hznPrice,
    debtBalance,
  } = props.debtStatusData || {};

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
        const message = `Minted ${formatCurrency(mintAmount)} hUSD`;
        setTransactionInfo({ transactionHash: transaction.hash });
        notifyHandler(notify, transaction.hash, networkId, onSuccess, message);

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

  const commonProps = {
    onDestroy: onDestroy || handleReset,
    onMint,
    issuableHassets,
    goBack: handlePrev,
    walletType,
    networkName,
    mintAmount,
    setMintAmount,
    issuanceRatio,
    hznPrice,
    isFetchingGasLimit,
    gasLimit,
    gasEstimateError,
    debtBalance,
    issuableAmount,
    ...transactionInfo,
    ...props,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...commonProps} />
  ));
};

const mapStateToProps = state => ({
  walletDetails: getWalletDetails(state),
  currentGasPrice: getCurrentGasPrice(state),
});

export default connect(mapStateToProps, null)(Mint);
