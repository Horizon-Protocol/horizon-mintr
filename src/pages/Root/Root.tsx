import { useEffect, FC, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { setAppReady, getAppIsReady, fetchAppStatusRequest } from 'ducks/app';

import { getCurrentWallet } from 'ducks/wallet';
import { fetchBalancesRequest, getIsFetchingBalances } from 'ducks/balances';
import { fetchRatesRequest, getIsFetchingRates } from 'ducks/rates';
import { fetchDebtStatusRequest, getIsFetchingBDebtData } from 'ducks/debtStatus';
import { fetchEscrowRequest } from 'ducks/escrow';
import { fetchGasPricesRequest } from 'ducks/network';
import { RootState } from 'ducks/types';

import App from './App';

import hznJSConnector, { getProvider } from 'helpers/hznJSConnector';
import { getBscNetwork, onWalletChainChange } from 'helpers/networkHelper';
import useInterval from 'hooks/useInterval';
import { INTERVAL_TIMER } from 'constants/ui';

const mapStateToProps = (state: RootState) => ({
  appIsReady: getAppIsReady(state),
  currentWallet: getCurrentWallet(state),
  loading:
    getIsFetchingBalances(state) || getIsFetchingRates(state) || getIsFetchingBDebtData(state),
});

const mapDispatchToProps = {
  setAppReady,
  fetchDebtStatusRequest,
  fetchEscrowRequest,
  fetchBalancesRequest,
  fetchGasPricesRequest,
  fetchAppStatusRequest,
  fetchRatesRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Root: FC<PropsFromRedux> = ({
  setAppReady,
  appIsReady,
  fetchDebtStatusRequest,
  currentWallet,
  fetchEscrowRequest,
  fetchBalancesRequest,
  fetchGasPricesRequest,
  fetchAppStatusRequest,
  fetchRatesRequest,
  loading,
}) => {
  const fetchData = useCallback(() => {
    fetchBalancesRequest();
    fetchRatesRequest();
    fetchDebtStatusRequest();
    fetchEscrowRequest();
    fetchGasPricesRequest();
  }, [
    fetchBalancesRequest,
    fetchRatesRequest,
    fetchDebtStatusRequest,
    fetchEscrowRequest,
    fetchGasPricesRequest,
  ]);

  useEffect(() => {
    if (appIsReady && currentWallet) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appIsReady, currentWallet]);

  useInterval(() => {
    if (appIsReady && currentWallet) {
      fetchData();
    }
    if (appIsReady) {
      fetchAppStatusRequest();
    }
  }, INTERVAL_TIMER);

  useEffect(() => {
    const init = async () => {
      const { networkId, wallet } = await getBscNetwork();
      console.log('app ready', { networkId, wallet });
      const provider = getProvider({ networkId });
      hznJSConnector.setContractSettings({ networkId, provider });

      fetchAppStatusRequest();
      onWalletChainChange(wallet, fetchAppStatusRequest);

      setAppReady();
    };
    setTimeout(init, 1000); // binance wallet initiation has delay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <App appIsReady={appIsReady} refresh={fetchData} loading={loading} />;
};

export default connector(Root);
