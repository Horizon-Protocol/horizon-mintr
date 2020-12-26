import { FC } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { getWalletBalances } from 'ducks/balances';
import { getRates } from 'ducks/rates';
import { getDebtStatusData } from 'ducks/debtStatus';

import LiquidationBanner from 'components/BannerLiquidation';
import Dashboard from 'screens/Dashboard';
import MintrHome from 'screens/MintrHome';

type MainProps = {
  wallet: string;
  walletBalances: object;
  rates: object;
  debtStatusData: object;
  loading: boolean;
  refresh: () => void;
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    background: 'radial-gradient(#11263B, #120C1C);',
  },
}));

const Main: FC<MainProps> = ({
  refresh,
  loading,
  wallet,
  walletBalances,
  rates,
  debtStatusData,
}) => {
  console.log('walletBalances', walletBalances);
  console.log('rates', rates);
  console.log('debtStatusData', debtStatusData);
  const classes = useStyles();

  const props = {
    currentWallet: wallet,
    walletBalances,
    rates,
    debtStatusData,
    loading,
    refresh,
    onSuccess: () => {
      console.log('onSuccess');
      refresh();
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
  rates: getRates(state),
  debtStatusData: getDebtStatusData(state),
});

export default connect(mapStateToProps, null)(Main);
