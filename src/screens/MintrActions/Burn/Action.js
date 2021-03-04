import { SlidePage } from 'components/ScreenSlider';
import { withTranslation } from 'react-i18next';
import { Box, Chip } from '@material-ui/core';
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
  transferableAmount,
  setTransferableAmount,
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
        <>
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
          <Body2>
            There is a waiting period after minting before you can burn. Please wait{' '}
            {secondsToTime(issuanceDelay)} before attempting to burn zUSD.
          </Body2>
        </>
      );
    } else if (waitingPeriod) {
      return (
        <>
          <ButtonPrimary onClick={onWaitingPeriodCheck} margin="auto">
            Retry
          </ButtonPrimary>
          <Body2>
            There is a waiting period after completing a trade. Please wait{' '}
            {secondsToTime(waitingPeriod)} before attempting to burn zUSD.
          </Body2>
        </>
      );
    } else {
      return (
        <ButtonPrimary
          disabled={!burnAmount || isFetchingGasLimit || gasEstimateError || sUSDBalance === 0}
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
            label={`${formatCurrency(maxBurnAmount)} zUSD Available`}
            className={classes.available}
          />
        </Box>
        <Box mb={1}>
          <Body2>{t('mintrActions.burn.action.instruction')}</Body2>
        </Box>
        <Box mb={2}>
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
            singleSynth={'zUSD'}
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
        <Box mb={1}>
          <Body2>{t('mintrActions.burn.action.transferrable.title')}</Body2>
        </Box>
        <Box mb={2}>
          <Input
            singleSynth={'HZN'}
            onChange={e => setTransferableAmount(e.target.value)}
            value={transferableAmount}
            placeholder="0.00"
          />
        </Box>
        {/* <TransactionPriceIndicator isFetchingGasLimit={isFetchingGasLimit} gasLimit={gasLimit} /> */}
        {renderSubmitButton()}
      </Container>
    </SlidePage>
  );
};

export default withTranslation()(Action);
