import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Fade, Grid, Tabs, Tab, Container, Typography } from '@material-ui/core';

// import { isMainNet } from 'helpers/networkHelper';
import { formatCurrency } from 'helpers/formatters';
import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';

import MintrAction from '../MintrActions';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 48,
    paddingBottom: 56,
  },
  container: {
    maxWidth: 768,
  },
  body: {
    maxWidth: 768,
    borderRadius: 20,
    border: '1px solid #1E4267',
    overflow: 'hidden',
    backgroundColor: 'rgba(16,38,55,0.3)',
  },
  tabs: {
    borderBottom: '1px solid #1E4267',
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 106,
    padding: '26px 20px 14px 20px',
    backgroundSize: '40%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px bottom 0',
    borderColor: '#1E4267',
    borderStyle: 'solid',
    textTransform: 'none',
    color: theme.palette.text.primary,
    '&:first-child': {
      borderRightWidth: 1,
    },
    '&:last-child': {
      borderLeftWidth: 1,
    },
  },
  tabSelected: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  tabWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
  },
  actionTitle: {
    fontSize: 24,
    lineHeight: '28px',
  },
  actionDesc: {
    fontSize: 14,
    lineHeight: '22px',
  },
  actionAmount: {
    fontSize: 12,
    lineHeight: '14px',
    color: theme.palette.text.secondary,
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
    amountLabel: 'HZN Staked',
  },
  {
    key: 'burn',
    desc: 'home.actions.burn.description',
    title: 'home.actions.burn.title',
    color: '#FFA539',
    amountLabel: 'zUSD Debt',
  },
  {
    key: 'claim',
    desc: 'home.actions.claim.description',
    title: 'home.actions.claim.title',
    color: '#92B2FF',
    amountLabel: 'HZN Rewards',
  },
];

const initialAction = tabs[0].key;

const ActionTab = ({ color, title, desc, amount, amountLabel }) => {
  const classes = useStyles();
  return (
    <>
      <Typography component="span" className={classes.actionTitle} style={{ color }}>
        {title}
      </Typography>
      <Typography className={classes.actionDesc}>{desc}</Typography>
      <Typography className={classes.actionAmount}>
        {formatCurrency(amount)} {amountLabel}
      </Typography>
    </>
  );
};

const Home = ({ walletBalances, rates, debtStatusData, onSuccess }) => {
  console.log('walletBalances:', walletBalances);
  console.log('rates:', rates);
  console.log('debtStatusData:', debtStatusData);
  const classes = useStyles();
  const { t } = useTranslation();

  const [currentAction, setCurrentAction] = useState(initialAction);
  const [switched, setSwitched] = useState(false);

  const handleChangeAction = (_, newValue) => {
    setSwitched(false);
    setCurrentAction(newValue);
  };

  useEffect(() => {
    if (!switched) {
      setTimeout(() => {
        setSwitched(true);
      }, 50);
    }
  }, [switched]);

  const activeTab = useMemo(() => tabs.find(({ key }) => key === currentAction), [currentAction]);

  const actionAmounts = useMemo(() => {
    const hznPrice = rates?.[CRYPTO_CURRENCY_TO_KEY.HZN];
    const { debtBalance, targetCRatio } = debtStatusData || {};
    return {
      mint: debtBalance ? debtBalance / targetCRatio / hznPrice : 0,
      burn: debtStatusData?.debtBalance,
      claim: 0,
    };
  }, [rates, debtStatusData]);

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <Grid className={classes.body}>
          <Tabs
            variant="fullWidth"
            TabIndicatorProps={{ style: { height: 4, backgroundColor: activeTab.color } }}
            value={currentAction}
            onChange={handleChangeAction}
            className={classes.tabs}
          >
            {tabs.map(({ key, title, desc, color, amountLabel }) => (
              <Tab
                key={key}
                label={
                  <ActionTab
                    color={color}
                    title={t(title)}
                    desc={t(desc)}
                    amount={actionAmounts[key]}
                    amountLabel={amountLabel}
                  />
                }
                value={key}
                classes={{
                  root: classes.tab,
                  selected: classes.tabSelected,
                  wrapper: classes.tabWrapper,
                }}
                style={{
                  backgroundImage: `url(/images/actions/${key}.png)`,
                }}
              />
            ))}
          </Tabs>
          <Fade
            in={switched}
            timeout={{
              enter: 500,
              exit: 0,
            }}
          >
            <Box width="full" className={classes.content}>
              <MintrAction
                action={currentAction}
                color={activeTab.color}
                walletBalances={walletBalances}
                rates={rates}
                debtStatusData={debtStatusData}
                onSuccess={onSuccess}
              />
            </Box>
          </Fade>
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
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
