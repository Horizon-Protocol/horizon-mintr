import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Chip, Grid, CircularProgress, Tooltip } from '@material-ui/core';

import { getWalletDetails } from 'ducks/wallet';
// import { showModal } from 'ducks/modal';
import { getCurrentTheme } from 'ducks/ui';

// import { getRates } from 'ducks/rates';
// import { getTotalEscrowedBalance, fetchEscrowRequest, getIsFetchingEscrowData } from 'ducks/escrow';

// import { MODAL_TYPES_TO_KEY } from 'constants/modal';
// import { MicroSpinner } from 'components/Spinner';

import BalanceCard from './BalanceCard';
import RatiosCard from './RatiosCard';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    minWidth: 1080,
    position: 'relative',
    padding: '42px 0',
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
  title: {
    padding: '0 24px',
    height: 140,
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
      {/* <PricesContainer>
          {['HZN', 'ETH'].map(asset => {
            return (
              <Asset key={asset}>
                <CurrencyIcon src={`/images/currencies/${asset}.svg`} />
                {isEmpty(rates) ? (
                  <Skeleton height="22px" />
                ) : (
                  <CurrencyPrice>
                    1 {asset} = ${formatCurrency(rates[asset])} USD
                  </CurrencyPrice>
                )}
              </Asset>
            );
          })}
        </PricesContainer> */}
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
