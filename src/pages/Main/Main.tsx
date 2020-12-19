import { FC, useCallback } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { getWalletBalances, fetchBalancesRequest, getIsFetchingBalances } from 'ducks/balances';
import {
  getDebtStatusData,
  fetchDebtStatusRequest,
  getIsFetchingBDebtData,
} from 'ducks/debtStatus';

import LiquidationBanner from 'components/BannerLiquidation';
import Dashboard from 'screens/Dashboard';
import MintrHome from 'screens/MintrHome';

type MainProps = {
  wallet: string;
  walletBalances: object;
  debtStatusData: object;
  loading: boolean;
  fetchBalancesRequest: () => void;
  fetchDebtStatusRequest: () => void;
};

const useStyles = makeStyles(theme => ({
  root: {
    background: 'radial-gradient(#11263B, #120C1C);',
  },
}));

const Main: FC<MainProps> = ({
  wallet,
  walletBalances,
  debtStatusData,
  loading,
  fetchBalancesRequest,
  fetchDebtStatusRequest,
}) => {
  const classes = useStyles();

  const fetchData = useCallback(() => {
    fetchBalancesRequest();
    fetchDebtStatusRequest();
  }, [fetchBalancesRequest, fetchDebtStatusRequest]);

  const props = {
    currentWallet: wallet,
    walletBalances,
    debtStatusData,
    loading,
    refresh: fetchData,
    onSuccess: () => {
      console.log('onSuccess');
      fetchData();
    },
  };

  return (
    <div className={classes.root}>
      <LiquidationBanner />
      <Dashboard {...props} />
      <MintrHome {...props} />
    </div>
  );
};

const mapStateToProps = state => ({
  walletBalances: getWalletBalances(state),
  debtStatusData: getDebtStatusData(state),
  loading: getIsFetchingBalances(state) || getIsFetchingBDebtData(state),
});

const mapDispatchToProps = {
  fetchBalancesRequest,
  fetchDebtStatusRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
