import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { formatCurrency } from 'helpers/formatters';

import { SlidePage } from 'components/ScreenSlider';
import { ButtonPrimary } from 'components/Button';
// import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
// import Tooltip from 'components/Tooltip';
// import { Info } from 'components/Icons';

import { Container, Intro, IntroTitle, IntroDesc, ActionImage, Body2 } from '../common';

const useStyles = makeStyles(({ shape }) => ({
  available: {
    padding: 12,
    backgroundColor: '#0A171F',
    border: '1px solid #11263B',
    lineHeight: '16px',
    borderRadius: shape.borderRadius,
  },
  amount: {
    marginTop: 8,
    fontSize: 24,
    lineHeight: '28px',
    color: ({ color }) => color,
  },
  timeLeft: {
    marginBottom: 10,
    fontSize: 12,
    textTransform: 'uppercase',
    color: ({ color }) => color,
  },
}));

const useStatuStyles = makeStyles(() => ({
  root: {
    fontWeight: 900,
  },
  textPrimary: {
    color: ({ color }) => color,
  },
}));

const Action = ({
  t,
  color,
  onClaim,
  // onClaimHistory,
  closeIn,
  feesAreClaimable,
  feesAvailable,
  isFetchingGasLimit,
  gasEstimateError,
  // gasLimit,
  theme,
}) => {
  const classes = useStyles({ color });
  const statusClasses = useStatuStyles({ color });
  const anyFeesAvailable = feesAvailable?.some(v => !!v);

  return (
    <SlidePage>
      <Container>
        {/* <Navigation>
          <ButtonTertiary onClick={onClaimHistory}>
            {t('mintrActions.claim.action.buttons.history')} ↗
          </ButtonTertiary>
        </Navigation> */}
        <Intro>
          <ActionImage src="/images/actions/claim.svg" big />
          <IntroTitle>{t('mintrActions.claim.action.title')}</IntroTitle>
          <IntroDesc>{t('mintrActions.claim.action.subtitle')}</IntroDesc>
        </Intro>
        <Box mb={3} className={classes.available}>
          <Body2>{t('mintrActions.claim.action.tradingRewards')}</Body2>
          <Typography classes={{ root: classes.amount }}>
            {feesAvailable?.[0] ? formatCurrency(feesAvailable[0]) : 0} hUSD
          </Typography>
        </Box>
        {/* <Box mb={3} className={classes.available}>
          <Body2>{t('mintrActions.claim.action.stakingRewards')}</Body2>
          <Typography classes={{ root: classes.amount }}>
            {feesAvailable?.[1] ? formatCurrency(feesAvailable[1]) : 0} HZN
          </Typography>
        </Box> */}
        <Box mb={3}>
          <Body2 className={classes.timeLeft}>{t('mintrActions.claim.action.timeLeft')}</Body2>
          <Typography variant="h5">{closeIn}</Typography>
        </Box>
        <Box mb={1}>
          <Body2 noWrap>
            {t('mintrActions.claim.action.table.status')}:
            <Button
              size="small"
              color={feesAreClaimable ? 'primary' : 'secondary'}
              classes={statusClasses}
            >
              {feesAreClaimable
                ? t('mintrActions.claim.action.table.open')
                : t('mintrActions.claim.action.table.blocked')}
              {/* <Tooltip mode={theme} title={t(`tooltip.claim`)} placement="top">
                <IconContainer>
                  <Info />
                </IconContainer>
              </Tooltip> */}
            </Button>
          </Body2>
        </Box>
        <Box mb={2}>
          {/* <TransactionPriceIndicator
            isFetchingGasLimit={isFetchingGasLimit}
            gasLimit={gasLimit}
            style={{ margin: '0' }}
          /> */}
          <ButtonPrimary
            disabled={
              !feesAreClaimable || !anyFeesAvailable || isFetchingGasLimit || gasEstimateError
            }
            onClick={onClaim}
            margin="auto"
          >
            {t('mintrActions.claim.action.buttons.claim')}
          </ButtonPrimary>
          <Note>
            <Body2>{t('mintrActions.claim.action.note')}</Body2>
          </Note>
        </Box>
      </Container>
    </SlidePage>
  );
};

const Note = styled.div`
  margin-top: 16px;
  max-width: 420px;
`;

export default withTranslation()(Action);
