import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tabs, Tab, Container, Typography } from '@material-ui/core';

import { isMainNet } from 'helpers/networkHelper';
import { getWalletDetails } from 'ducks/wallet';

import MintrAction from '../MintrActions';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 48,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  tabs: {
    border: '1px solid black',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    overflow: 'hidden',
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 105,
    padding: '26px 20px 14px 20px',
    backgroundSize: '40%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px bottom 0',
    borderColor: 'black',
    borderStyle: 'solid',
    textTransform: 'none',
    '&:first-child': {
      borderRightWidth: 1,
    },
    '&:last-child': {
      borderLeftWidth: 1,
    },
  },
  tabSelected: {},
  tabWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
  },
  actionTitle: {
    display: 'block',
    lineHeight: '28px',
    fontSize: 24,
  },
  actionDesc: {
    display: 'block',
  },
  actionAmount: {
    display: 'block',
  },
  content: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: 640,
  },
}));

const tabs = [
  {
    key: 'mint',
    desc: 'home.actions.mint.description',
    title: 'home.actions.mint.title',
    color: '#10BA97',
  },
  {
    key: 'burn',
    desc: 'home.actions.burn.description',
    title: 'home.actions.burn.title',
    color: '#FFA539',
  },
  {
    key: 'claim',
    desc: 'home.actions.claim.description',
    title: 'home.actions.claim.title',
    color: '#92B2FF',
  },
];

const initialAction = tabs[0].key;

const ActionTab = ({ title, desc, amountLabel }) => {
  const classes = useStyles();
  return (
    <>
      <Typography
        component="span"
        variant="subtitle1"
        color="inherit"
        className={classes.actionTitle}
      >
        {title}
      </Typography>
      <span className={classes.actionDesc}>{desc}</span>
      <span className={classes.actionAmount}>{amountLabel}</span>
    </>
  );
};

const Home = ({ walletDetails: { networkId } }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [currentAction, setCurrentAction] = useState(initialAction);

  const handleChangeAction = (_, newValue) => {
    setCurrentAction(newValue);
  };

  const activeTab = useMemo(() => tabs.find(({ key }) => key === currentAction), [currentAction]);

  return (
    <Box className={classes.root}>
      <Container style={{ maxWidth: 768 }}>
        <Tabs
          variant="fullWidth"
          TabIndicatorProps={{ style: { height: 4, backgroundColor: activeTab.color } }}
          value={currentAction}
          onChange={handleChangeAction}
          className={classes.tabs}
        >
          {tabs.map(({ key, title, desc, color }) => (
            <Tab
              key={key}
              label={<ActionTab title={t(title)} desc={t(desc)} />}
              value={key}
              classes={{
                root: classes.tab,
                selected: classes.tabSelected,
                wrapper: classes.tabWrapper,
              }}
              style={{
                color,
                backgroundImage: `url(/images/actions/${key}.png)`,
              }}
            />
          ))}
        </Tabs>
        <Box width="full" className={classes.content}>
          <MintrAction action={currentAction} />
        </Box>
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
    </Box>
  );
};

const mapStateToProps = state => ({
  walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, null)(Home);
