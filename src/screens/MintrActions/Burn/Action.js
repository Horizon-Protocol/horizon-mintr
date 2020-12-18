import styled from 'styled-components';
import { SlidePage } from 'components/ScreenSlider';
import { withTranslation } from 'react-i18next';
import { Box, Chip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Big from 'big.js';

import { ButtonPrimary, ButtonMax } from 'components/Button';
// import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
import Input from 'components/Input';
import ErrorMessage from 'components/ErrorMessage';
import { formatCurrency, secondsToTime } from 'helpers/formatters';

import { Container, Intro, IntroTitle, IntroDesc, ActionImage, Body2 } from '../common';

const useStyles = makeStyles(({ palette }) => ({
  available: {
    backgroundColor: '#0A171F',
    border: '1px solid #11263B',
    fontWeight: 700,
    fontSize: 16,
    lineHeight: '16px',
    color: ({ color }) => color,
  },
  stats: {
    marginTop: 16,
    marginBottom: 24,
  },
}));

const Action = ({
  t,
  color,
  onBurn,
  maxBurnAmount,
  burnAmount,
  setBurnAmount,
  isFetchingGasLimit,
  gasEstimateError,
  waitingPeriod,
  onWaitingPeriodCheck,
  issuanceDelay,
  onIssuanceDelayCheck,
  sUSDBalance,
}) => {
  const classes = useStyles({ color });

  const renderSubmitButton = () => {
    if (issuanceDelay) {
      return (
        <RetryButtonWrapper>
          <ButtonPrimary
            onClick={() => {
              onIssuanceDelayCheck();
              if (waitingPeriod) {
                onWaitingPeriodCheck();
              }
            }}
            margin="auto"
          >
            Retry
          </ButtonPrimary>
          <Typography style={{ position: 'absolute', fontSize: '12px' }}>
            There is a waiting period after minting before you can burn. Please wait{' '}
            {secondsToTime(issuanceDelay)} before attempting to burn hUSD.
          </Typography>
        </RetryButtonWrapper>
      );
    } else if (waitingPeriod) {
      return (
        <RetryButtonWrapper>
          <ButtonPrimary onClick={onWaitingPeriodCheck} margin="auto">
            Retry
          </ButtonPrimary>
          <Typography style={{ position: 'absolute', fontSize: '12px' }}>
            There is a waiting period after completing a trade. Please wait{' '}
            {secondsToTime(waitingPeriod)} before attempting to burn hUSD.
          </Typography>
        </RetryButtonWrapper>
      );
    } else {
      return (
        <ButtonPrimary
          disabled={isFetchingGasLimit || gasEstimateError || sUSDBalance === 0}
          onClick={onBurn}
          margin="auto"
        >
          {t('mintrActions.burn.action.buttons.burn')}
        </ButtonPrimary>
      );
    }
  };

  return (
    <SlidePage>
      <Container>
        <Intro>
          <ActionImage src="/images/actions/burn.svg" big />
          <IntroTitle>{t('mintrActions.burn.action.title')}</IntroTitle>
          <IntroDesc>{t('mintrActions.burn.action.subtitle')}</IntroDesc>
        </Intro>
        <Box mb={2}>
          <Chip
            label={`${formatCurrency(maxBurnAmount)} hUSD Available`}
            className={classes.available}
          />
        </Box>
        <Box mb={1}>
          <Body2>{t('mintrActions.burn.action.instruction')}</Body2>
        </Box>
        <Box mb={4}>
          {/* <ButtonRow>
              <AmountButton
                onClick={() => {
                  setBurnAmount(maxBurnAmount);
                }}
                width="30%"
              >
                {t('button.burnMax')}
              </AmountButton>
              <AmountButton
                disabled={
                  maxBurnAmount === 0 ||
                  burnAmountToFixCRatio === 0 ||
                  burnAmountToFixCRatio > maxBurnAmount
                }
                onClick={() => {
                  setBurnAmount(burnAmountToFixCRatio);
                  onBurn({ burnToTarget: true });
                }}
                width="66%"
              >
                {t('button.fixCRatio')}
              </AmountButton>
            </ButtonRow> */}
          {/* <Typography>${formatCurrency(burnAmountToFixCRatio)}</Typography> */}
          <Input
            singleSynth={'hUSD'}
            onChange={e => setBurnAmount(e.target.value)}
            value={burnAmount}
            placeholder="0.00"
            rightComponent={
              <ButtonMax
                onClick={() => {
                  setBurnAmount(Big(maxBurnAmount).toFixed());
                }}
              />
            }
          />
          <ErrorMessage message={gasEstimateError} />
        </Box>
        {/* <TransactionPriceIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} /> */}
        {renderSubmitButton()}
      </Container>
    </SlidePage>
  );
};

const RetryButtonWrapper = styled.div`
  position: relative;
`;

export default withTranslation()(Action);
