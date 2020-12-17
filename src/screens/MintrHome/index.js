import { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Tabs, Tab, Typography } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { isMainNet } from 'helpers/networkHelper';
import { getWalletDetails } from 'ducks/wallet';
import { getRedirectToTrade } from 'ducks/ui';
import Slider from 'components/ScreenSlider';

import MintrAction from '../MintrActions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    color: theme.palette.primary.contrastText,
    background: ({ action }) => `url(/images/actions/${action}.svg)`,
  },
  content: {
    position: 'relative',
    maxWidth: 720,
    overflow: 'hidden',
    width: '100%',
    height: 640,
  },
}));

const tabs = [
  {
    key: 'mint',
    description: 'home.actions.mint.description',
    title: 'home.actions.mint.title',
  },
  {
    key: 'burn',
    description: 'home.actions.burn.description',
    title: 'home.actions.burn.title',
  },
  {
    key: 'claim',
    description: 'home.actions.claim.description',
    title: 'home.actions.claim.title',
  },
];

const initialAction = tabs[0].key;

const Home = ({ walletDetails: { networkId } }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [currentAction, setCurrentAction] = useState(initialAction);

  const handleChangeAction = (event, newValue) => {
    setCurrentAction(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Tabs variant="fullWidth" value={currentAction} onChange={handleChangeAction}>
        {tabs.map(({ key, title }) => (
          <Tab key={key} label={t(title)} value={key} className={classes.tab} />
        ))}
      </Tabs>
      <Grid className={classes.content}>
        <MintrAction action={currentAction} />
      </Grid>
      {/* <Tab>
        {ACTIONS.map(action => {
          return (
            <Button key={action} onClick={() => setCurrentScenario(action)} big>
              <img src={`/images/actions/${action}.svg`} />
              <H2 style={{ marginBottom: 0 }}>{t(actionLabelMapper[action].title)}</H2>
              <PLarge>{t(actionLabelMapper[action].description)}</PLarge>
            </Button>
          );
        })}
      </Tab> */}
    </Container>
  );
};

const mapStateToProps = state => ({
  walletDetails: getWalletDetails(state),
  redirectToTrade: getRedirectToTrade(state),
});

export default connect(mapStateToProps, null)(Home);
