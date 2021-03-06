import { useContext, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { addSeconds, differenceInSeconds } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { SliderContext } from 'components/ScreenSlider';
import hznJSConnector from 'helpers/hznJSConnector';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import { bytesFormatter, bigNumberFormatter, formatCurrency } from 'helpers/formatters';
import errorMapper from 'helpers/errorMapper';
import { getCurrentGasPrice } from 'ducks/network';
import { getWalletDetails } from 'ducks/wallet';
import { notifyHandler } from 'helpers/notifyHelper';
import { useNotifyContext } from 'contexts/NotifyContext';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const useGetDebtData = (walletAddress, rates, debtStatusData) => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getDebtData = async () => {
      try {
        const results = await Promise.all([
          hznJSConnector.hznJS.zUSD.balanceOf(walletAddress),
          hznJSConnector.hznJS.RewardEscrow.totalEscrowedAccountBalance(walletAddress),
          hznJSConnector.hznJS.SynthetixEscrow.balanceOf(walletAddress),
        ]);
        const [zUSDBalance, totalRewardEscrow, totalTokenSaleEscrow] = results.map(
          bigNumberFormatter
        );

        const hznPrice = rates?.[CRYPTO_CURRENCY_TO_KEY.HZN];
        const { debtBalance, debtBalanceBN, targetCRatio: issuanceRatio, issuableZassets } =
          debtStatusData || {};

        let maxBurnAmount, maxBurnAmountBN;
        if (debtBalance > zUSDBalance) {
          maxBurnAmount = zUSDBalance;
          maxBurnAmountBN = results[0];
        } else {
          maxBurnAmount = debtBalance;
          maxBurnAmountBN = debtBalanceBN;
        }

        const escrowBalance = totalRewardEscrow + totalTokenSaleEscrow;

        setData({
          issuanceRatio,
          zUSDBalance,
          maxBurnAmount,
          maxBurnAmountBN,
          hznPrice,
          burnAmountToFixCRatio: Math.max(-issuableZassets, 0),
          debtEscrow: Math.max(escrowBalance * hznPrice * issuanceRatio - issuableZassets, 0),
        });
      } catch (e) {
        console.log(e);
      }
    };
    getDebtData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, rates, debtStatusData]);
  return data;
};

const useGetGasEstimate = (
  burnAmount,
  maxBurnAmount,
  zUSDBalance,
  waitingPeriod,
  issuanceDelay,
  setFetchingGasLimit,
  setGasLimit
) => {
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (!burnAmount) return;
    const getGasEstimate = async () => {
      setError(null);

      let gasEstimate = 5000000;

      try {
        if (!parseFloat(burnAmount)) throw new Error('input.error.invalidAmount');
        if (waitingPeriod) throw new Error('Waiting period for zUSD is still ongoing');
        if (issuanceDelay) throw new Error('Waiting period to burn is still ongoing');
        if (burnAmount > zUSDBalance || maxBurnAmount === 0) {
          throw new Error('input.error.notEnoughToBurn');
        }
        // setFetchingGasLimit(true);

        // let amountToBurn;
        // if (burnAmount && maxBurnAmount) {
        //   amountToBurn =
        //     burnAmount === maxBurnAmount
        //       ? maxBurnAmountBN
        //       : hznJSConnector.utils.parseEther(burnAmount.toString());
        // } else {
        //   amountToBurn = 0;
        // }

        // gasEstimate = await hznJSConnector.hznJS.Synthetix.contract.estimate.burnSynths(
        //   amountToBurn
        // );

        setGasLimit(addBufferToGasLimit(gasEstimate));
      } catch (e) {
        console.log(e);
        const errorMessage = (e && e.message) || 'input.error.gasEstimate';
        setError(t(errorMessage));
      }
      setFetchingGasLimit(false);
    };
    getGasEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burnAmount, maxBurnAmount, waitingPeriod, issuanceDelay]);
  return error;
};

const Burn = ({ onDestroy, walletDetails, currentGasPrice, onSuccess, ...props }) => {
  const { handleReset, handleNext, handlePrev } = useContext(SliderContext);
  const [burnAmount, setBurnAmount] = useState('');
  const [transferableAmount, setTransferableAmount] = useState('');
  const [waitingPeriod, setWaitingPeriod] = useState(0);
  const [issuanceDelay, setIssuanceDelay] = useState(0);
  const { currentWallet, walletType, networkName, networkId } = walletDetails;
  const [transactionInfo, setTransactionInfo] = useState({});
  const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
  const [gasLimit, setGasLimit] = useState(0);
  const { notify } = useNotifyContext();

  const {
    maxBurnAmount,
    maxBurnAmountBN,
    zUSDBalance,
    issuanceRatio,
    hznPrice,
    burnAmountToFixCRatio,
    debtEscrow,
  } = useGetDebtData(currentWallet, props.rates, props.debtStatusData);

  const getMaxSecsLeftInWaitingPeriod = useCallback(async () => {
    const {
      hznJS: { Exchanger },
    } = hznJSConnector;
    try {
      const maxSecsLeftInWaitingPeriod = await Exchanger.maxSecsLeftInWaitingPeriod(
        currentWallet,
        bytesFormatter('zUSD')
      );
      setWaitingPeriod(Number(maxSecsLeftInWaitingPeriod));
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIssuanceDelay = useCallback(async () => {
    const {
      hznJS: { Issuer },
    } = hznJSConnector;
    try {
      const [canBurnSynths, lastIssueEvent, minimumStakeTime] = await Promise.all([
        Issuer.canBurnSynths(currentWallet),
        Issuer.lastIssueEvent(currentWallet),
        Issuer.minimumStakeTime(),
      ]);

      if (Number(lastIssueEvent) && Number(minimumStakeTime)) {
        const burnUnlockDate = addSeconds(Number(lastIssueEvent) * 1000, Number(minimumStakeTime));
        const issuanceDelayInSeconds = differenceInSeconds(burnUnlockDate, new Date());
        setIssuanceDelay(
          issuanceDelayInSeconds > 0 ? issuanceDelayInSeconds : canBurnSynths ? 0 : 1
        );
      }
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getMaxSecsLeftInWaitingPeriod();
    getIssuanceDelay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMaxSecsLeftInWaitingPeriod, getIssuanceDelay]);

  const gasEstimateError = useGetGasEstimate(
    burnAmount,
    maxBurnAmount,
    zUSDBalance,
    waitingPeriod,
    issuanceDelay,
    setFetchingGasLimit,
    setGasLimit
  );

  const onBurn = async ({ burnToTarget = false }) => {
    const {
      hznJS: { Synthetix, Issuer },
    } = hznJSConnector;
    try {
      if (await Synthetix.isWaitingPeriod(bytesFormatter('zUSD')))
        throw new Error('Waiting period for zUSD is still ongoing');

      if (!burnToTarget && !(await Issuer.canBurnSynths(currentWallet)))
        throw new Error('Waiting period to burn is still ongoing');

      handleNext(1);
      let transaction;

      if (burnToTarget) {
        const burnToTargetGasLimit = await Synthetix.contract.estimate.burnSynthsToTarget();
        setGasLimit(addBufferToGasLimit(burnToTargetGasLimit));
        transaction = await Synthetix.burnSynthsToTarget({
          gasLimit: addBufferToGasLimit(burnToTargetGasLimit),
          gasPrice: currentGasPrice.formattedPrice,
        });
      } else {
        const amountToBurn =
          burnAmount === maxBurnAmount
            ? maxBurnAmountBN
            : hznJSConnector.utils.parseEther(burnAmount.toString());
        transaction = await Synthetix.burnSynths(amountToBurn, {
          gasPrice: currentGasPrice.formattedPrice,
          gasLimit,
        });
      }

      if (notify && transaction) {
        const message = `Burnt ${formatCurrency(
          burnToTarget ? burnAmountToFixCRatio : burnAmount
        )} zUSD`;
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
    onBurn,
    goBack: handlePrev,
    maxBurnAmount,
    issuanceRatio,
    burnAmount,
    setBurnAmount: amount => {
      const amountNB = Number(amount);
      setBurnAmount(amount);
      console.log(amountNB, debtEscrow, issuanceRatio, hznPrice);
      console.log((amountNB - debtEscrow) / issuanceRatio / hznPrice);
      setTransferableAmount(
        amountNB ? Math.max((amountNB - debtEscrow) / issuanceRatio / hznPrice, 0) : 0
      );
    },
    transferableAmount,
    setTransferableAmount: amount => {
      const amountNB = Number(amount);
      setBurnAmount(amountNB > 0 ? debtEscrow + amountNB * issuanceRatio * hznPrice : '');
      setTransferableAmount(amount);
    },
    walletType,
    networkName,
    hznPrice,
    ...transactionInfo,
    isFetchingGasLimit,
    gasLimit,
    gasEstimateError,
    burnAmountToFixCRatio,
    waitingPeriod,
    issuanceDelay,
    zUSDBalance,
    onWaitingPeriodCheck: getMaxSecsLeftInWaitingPeriod,
    onIssuanceDelayCheck: getIssuanceDelay,
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

export default connect(mapStateToProps, null)(Burn);
