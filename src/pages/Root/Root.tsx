import { useEffect, FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { setAppReady, getAppIsReady, fetchAppStatusRequest } from 'ducks/app';
import { fetchDebtStatusRequest } from 'ducks/debtStatus';
import { fetchEscrowRequest } from 'ducks/escrow';
import { getCurrentWallet } from 'ducks/wallet';
import { fetchBalancesRequest } from 'ducks/balances';
import { fetchGasPricesRequest } from 'ducks/network';
import { fetchRatesRequest } from 'ducks/rates';
import { RootState } from 'ducks/types';

import App from './App';

import hznJSConnector, { getProvider } from 'helpers/hznJSConnector';
import { getBscNetwork, onWalletChainChange } from 'helpers/networkHelper';
import useInterval from 'hooks/useInterval';
import { INTERVAL_TIMER } from 'constants/ui';

const mapStateToProps = (state: RootState) => ({
  appIsReady: getAppIsReady(state),
  currentWallet: getCurrentWallet(state),
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
}) => {
  useEffect(() => {
    if (appIsReady && currentWallet) {
      fetchDebtStatusRequest();
      fetchEscrowRequest();
      fetchBalancesRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appIsReady, currentWallet]);

  useInterval(() => {
    if (appIsReady && currentWallet) {
      fetchGasPricesRequest();
      fetchRatesRequest();
      fetchDebtStatusRequest();
      fetchBalancesRequest();
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

  return <App appIsReady={appIsReady} />;
};

export default connector(Root);
