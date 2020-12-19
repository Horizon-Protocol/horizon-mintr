import { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { addSeconds, formatDistanceToNow } from 'date-fns';

import { SliderContext } from 'components/ScreenSlider';
import { TRANSACTION_EVENTS_MAP } from 'constants/transactionHistory';

import hznJSConnector from 'helpers/hznJSConnector';
import { bigNumberFormatter } from 'helpers/formatters';
import { addBufferToGasLimit } from 'helpers/networkHelper';
import errorMapper from 'helpers/errorMapper';
import { notifyHandler } from 'helpers/notifyHelper';
import { useNotifyContext } from 'contexts/NotifyContext';

import { setCurrentTab, getCurrentTheme } from 'ducks/ui';
import { fetchEscrowRequest } from 'ducks/escrow';
import { createTransaction } from 'ducks/transactions';
import { getCurrentGasPrice } from 'ducks/network';
import { getWalletDetails } from 'ducks/wallet';

import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

const FEE_PERIOD = 0;

const getFeePeriodCountdown = (recentFeePeriods, feePeriodDuration) => {
  if (!recentFeePeriods) return;
  const currentPeriodStart =
    recentFeePeriods && recentFeePeriods.startTime
      ? new Date(parseInt(recentFeePeriods.startTime * 1000))
      : null;
  const currentPeriodEnd =
    currentPeriodStart && feePeriodDuration
      ? addSeconds(currentPeriodStart, feePeriodDuration)
      : null;
  return formatDistanceToNow(currentPeriodEnd);
};

const useGetFeeData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getFeeData = async () => {
      try {
        setData({ ...data, dataIsLoading: true });
        const [
          feePeriodDuration,
          recentFeePeriods,
          feesAreClaimable,
          feesAvailable,
        ] = await Promise.all([
          hznJSConnector.hznJS.FeePool.feePeriodDuration(),
          hznJSConnector.hznJS.FeePool.recentFeePeriods(FEE_PERIOD),
          hznJSConnector.hznJS.FeePool.isFeesClaimable(walletAddress),
          hznJSConnector.hznJS.FeePool.feesAvailable(walletAddress),
        ]);

        const closeIn = getFeePeriodCountdown(recentFeePeriods, feePeriodDuration);

        setData({
          closeIn,
          feesAreClaimable,
          feesAvailable: feesAvailable.map(bigNumberFormatter),
          dataIsLoading: false,
        });
      } catch (e) {
        console.log(e);
      }
    };
    getFeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);
  return data;
};

const useGetGasEstimate = (setFetchingGasLimit, setGasLimit) => {
  const [error, setError] = useState(null);
  useEffect(() => {
    const getGasEstimate = async () => {
      setError(null);
      try {
        const gasEstimate = 150000;
        // const {
        //   hznJS: { FeePool },
        // } = hznJSConnector;
        // setFetchingGasLimit(true);
        // const gasEstimate = await FeePool.contract.estimate.claimFees();
        // setFetchingGasLimit(false);
        setGasLimit(addBufferToGasLimit(gasEstimate));
      } catch (e) {
        console.log(e);
        // setFetchingGasLimit(false);
        const errorMessage = (e && e.message) || 'Error while getting gas estimate';
        setError(errorMessage);
      }
    };
    getGasEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return error;
};

const Claim = ({
  onDestroy,
  walletDetails,
  currentGasPrice,
  setCurrentTab,
  currentTheme,
  fetchEscrowRequest,
  onSuccess,
  ...props
}) => {
  const { handleReset, handleNext, handlePrev } = useContext(SliderContext);
  const [transactionInfo, setTransactionInfo] = useState({});
  const { currentWallet, walletType, networkName, networkId } = walletDetails;
  const [isFetchingGasLimit, setFetchingGasLimit] = useState(false);
  const [gasLimit, setGasLimit] = useState(0);
  const { notify } = useNotifyContext();

  const { closeIn, feesAreClaimable, feesAvailable, dataIsLoading } = useGetFeeData(currentWallet);
  const gasEstimateError = useGetGasEstimate(setFetchingGasLimit, setGasLimit);

  const onClaim = async () => {
    try {
      const {
        hznJS: { FeePool },
      } = hznJSConnector;
      handleNext(1);
      const transaction = await FeePool.claimFees({
        gasPrice: currentGasPrice.formattedPrice,
        gasLimit,
      });

      if (notify && transaction) {
        const refetch = () => {
          onSuccess();
          fetchEscrowRequest();
        };
        const message = `Claimed rewards`;
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

  const onClaimHistory = () => {
    setCurrentTab({
      tab: 'transactionsHistory',
      params: {
        filters: [TRANSACTION_EVENTS_MAP.feesClaimed],
      },
    });
  };

  const commonProps = {
    onDestroy: onDestroy || handleReset,
    onClaim,
    onClaimHistory,
    goBack: handlePrev,
    closeIn,
    feesAreClaimable,
    feesAvailable,
    walletType,
    dataIsLoading,
    ...transactionInfo,
    gasEstimateError,
    isFetchingGasLimit,
    networkName,
    gasLimit,
    theme: currentTheme,
    ...props,
  };
  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...commonProps} />
  ));
};

const mapStateToProps = state => ({
  walletDetails: getWalletDetails(state),
  currentGasPrice: getCurrentGasPrice(state),
  currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
  createTransaction,
  setCurrentTab,
  fetchEscrowRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Claim);
