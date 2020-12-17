import { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Box, Tab, Typography } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getWalletDetails } from 'ducks/wallet';

import { PLarge, H2 } from 'components/Typography';

import { ACTIONS } from 'constants/actions';
import { isMainNet } from 'helpers/networkHelper';
import { getRedirectToTrade } from 'ducks/ui';

import MintrAction from '../MintrActions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const initialScenario = null;
const tabs = [
  { key: 'mint', description: 'home.actions.mint.description', title: 'home.actions.mint.title' },
  { key: 'burn', description: 'home.actions.burn.description', title: 'home.actions.burn.title' },
  {
    key: 'claim',
    description: 'home.actions.claim.description',
    title: 'home.actions.claim.title',
  },
];

const Home = ({ walletDetails: { networkId }, redirectToTrade }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [currentScenario, setCurrentScenario] = useState(
    redirectToTrade ? 'trade' : initialScenario
  );

  return (
    <Container maxWidth="sm">
      <MintrAction action={currentScenario} onDestroy={() => setCurrentScenario(null)} />
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="simple tabs example">
          {tabs.map(({ key, title }) => (
            <Tab key={key} label={title} value={key} />
          ))}
        </TabList>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
      <Tab>
        {ACTIONS.map(action => {
          return (
            <Button key={action} onClick={() => setCurrentScenario(action)} big>
              <img src={`/images/actions/${action}.svg`} />
              <H2 style={{ marginBottom: 0 }}>{t(actionLabelMapper[action].title)}</H2>
              <PLarge>{t(actionLabelMapper[action].description)}</PLarge>
            </Button>
          );
        })}
      </Tab>
    </Container>
  );
};

const mapStateToProps = state => ({
  walletDetails: getWalletDetails(state),
  redirectToTrade: getRedirectToTrade(state),
});

export default connect(mapStateToProps, null)(Home);
