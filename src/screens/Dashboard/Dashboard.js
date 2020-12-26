import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { formatCurrency } from 'helpers/formatters';
import { getWalletDetails } from 'ducks/wallet';
// import { showModal } from 'ducks/modal';
import { getCurrentTheme } from 'ducks/ui';
// import { getTotalEscrowedBalance, fetchEscrowRequest, getIsFetchingEscrowData } from 'ducks/escrow';
// import { MODAL_TYPES_TO_KEY } from 'constants/modal';

import BalanceCard from './BalanceCard';
import RatiosCard from './RatiosCard';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    minWidth: 1080,
    position: 'relative',
    padding: '24px 0',
    borderBottom: '1px solid #11263B',
  },
  logo: {
    width: 277,
    height: 39,
  },
  stats: {
    position: 'absolute',
    right: 16,
    top: 16,
    display: 'flex',
  },
  prices: {
    padding: '8px 24px',
  },
  network: {
    zIndex: 1,
    position: 'absolute',
    bottom: -16,
    color: palette.text.secondary,
    backgroundColor: '#0A171F',
    borderColor: '#11263B',
    textTransform: 'capitalize',
  },
}));

const networkIcon = {
  width: 16,
  height: 16,
  marginLeft: 8,
};

const Dashboard = ({
  walletDetails,
  rates,
  debtStatusData,
  loading,
  // totalEscrowedBalances,
  // fetchEscrowRequest,
  // isFetchingEscrowData,
  // showModal,
  // rates,
  refresh,
  currentTheme,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { walletType, currentWallet, networkName } = walletDetails;

  return (
    <Grid
      direction="column"
      container
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      <img className={classes.logo} src="/images/logo.png" alt="Horizon Mintr" />
      <Box className={classes.stats}>
        <RatiosCard loading={loading} currentTheme={currentTheme} debtStatusData={debtStatusData} />
        <BalanceCard
          loading={loading}
          currentTheme={currentTheme}
          currentWallet={currentWallet}
          debtData={debtStatusData}
        />
      </Box>
      <Grid container justify="center" className={classes.prices}>
        <Typography variant="subtitle2">
          1 {CRYPTO_CURRENCY_TO_KEY.HZN} = ${formatCurrency(rates?.[CRYPTO_CURRENCY_TO_KEY.HZN])}{' '}
          USD
        </Typography>
        <Divider variant="middle" orientation="vertical" flexItem />
        <Typography variant="subtitle2">
          1 {CRYPTO_CURRENCY_TO_KEY.BNB} = ${formatCurrency(rates?.[CRYPTO_CURRENCY_TO_KEY.BNB])}{' '}
          USD
        </Typography>
      </Grid>
      {/* <BarCharts debtData={debtStatusData} totalEscrow={totalEscrowedBalances} />
          <BalanceTable debtData={debtStatusData} />
          <Row margin="18px 0 0 0 ">
            <StyledExternalLink href="https://kwenta.io">
              <ButtonTertiaryLabel>{t('dashboard.buttons.exchange')}</ButtonTertiaryLabel>
            </StyledExternalLink>
            <StyledExternalLink href="https://dashboard.synthetix.io" style={{ marginLeft: '5px' }}>
              <ButtonTertiaryLabel>{t('dashboard.buttons.synthetixDashboard')}</ButtonTertiaryLabel>
            </StyledExternalLink>
          </Row> */}
      <Tooltip title={t('dashboard.buttons.refresh')} placement="top">
        <Chip
          variant="outlined"
          avatar={
            loading ? (
              <CircularProgress color="secondary" size={16} style={networkIcon} />
            ) : (
              <Avatar
                variant="square"
                alt={walletType}
                src={`images/wallets/${walletType.toLowerCase()}.svg`}
                style={networkIcon}
              />
            )
          }
          label={networkName}
          classes={{
            root: classes.network,
          }}
          onClick={refresh}
        />
      </Tooltip>
    </Grid>
  );
};

const mapStateToProps = state => ({
  walletDetails: getWalletDetails(state),
  // walletBalances: getWalletBalances(state),
  // rates: getRates(state),
  // debtStatusData: getDebtStatusData(state),
  // totalEscrowedBalances: getTotalEscrowedBalance(state),
  // isFetchingEscrowData: getIsFetchingEscrowData(state),
  currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
  // showModal,
  // fetchBalancesRequest,
  // fetchDebtStatusRequest,
  // fetchEscrowRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
