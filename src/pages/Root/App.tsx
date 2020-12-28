import React, { FC } from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';

import GlobalEventsGate from 'gates/GlobalEventsGate';
import { RootState } from 'ducks/types';
import { getAppIsOnMaintenance } from 'ducks/app';
import { /* isDarkTheme, lightTheme, */ darkTheme } from 'styles/themes';
import muiTheme from 'styles/muiThemes';
import { PAGES_BY_KEY } from 'constants/ui';
import { isMobileOrTablet } from 'helpers/browserHelper';
import { getCurrentTheme, getCurrentPage } from 'ducks/ui';
import { getCurrentWallet, getWalletDetails } from 'ducks/wallet';

import MaintenancePage from '../MaintenanceMessage';
import NotificationCenter from 'components/NotificationCenter';
import Landing from '../Landing';
import WalletSelection from '../WalletSelection';
import Main from '../Main';
import MobileLanding from '../MobileLanding';

import MainLayout from './components/MainLayout';
import { NotifyProvider } from 'contexts/NotifyContext';

const mapStateToProps = (state: RootState) => ({
  currentTheme: getCurrentTheme(state),
  currentPage: getCurrentPage(state),
  appIsOnMaintenance: getAppIsOnMaintenance(state),
  currentWallet: getCurrentWallet(state),
  walletDetails: getWalletDetails(state),
});

const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;

type CurrentPageProps = {
  isOnMaintenance: boolean;
  page: string;
  wallet: string;
  loading: boolean;
  refresh: () => void;
};

const CurrentPage: FC<CurrentPageProps> = ({ isOnMaintenance, page, wallet, refresh, loading }) => {
  if (isMobileOrTablet()) return <MobileLanding />;
  if (isOnMaintenance) return <MaintenancePage />;
  switch (page) {
    case PAGES_BY_KEY.WALLET_SELECTION:
      return <WalletSelection />;
    case PAGES_BY_KEY.MAIN:
      return <Main wallet={wallet} refresh={refresh} loading={loading} />;
    default:
      return <Landing />;
  }
};

type AppProps = {
  appIsReady: boolean;
  loading: boolean;
  refresh: () => void;
} & PropsFromRedux;

const App: FC<AppProps> = ({
  appIsReady,
  loading,
  refresh,
  currentTheme,
  currentPage,
  appIsOnMaintenance,
  currentWallet,
  walletDetails: { networkId },
}) => {
  // const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;
  const themeStyle = darkTheme;
  return (
    <StyledThemeProvider theme={themeStyle}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {appIsReady && (
          <NotifyProvider currentWallet={currentWallet} networkId={networkId ? networkId : 56}>
            <GlobalEventsGate />
            <MainLayout>
              <CurrentPage
                isOnMaintenance={appIsOnMaintenance}
                refresh={refresh}
                loading={loading}
                page={currentPage}
                wallet={currentWallet}
              />
              <NotificationCenter />
            </MainLayout>
          </NotifyProvider>
        )}
      </ThemeProvider>
    </StyledThemeProvider>
  );
};

export default connector(App) as any;
