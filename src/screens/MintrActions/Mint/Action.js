import { Box, Chip, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Big from 'big.js';

import { formatCurrency } from 'helpers/formatters';
import { SlidePage } from 'components/ScreenSlider';
// import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
import { ButtonPrimary, ButtonMax } from 'components/Button';
import Input from 'components/Input';
import ErrorMessage from 'components/ErrorMessage';
import { Container, Intro, IntroTitle, IntroDesc, ActionImage, Body2 } from '../common';
import { getStakingAmount, estimateCRatio } from './mint-helpers';

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
  onMint,
  issuableHassets,
  issuableAmount,
  mintAmount,
  setMintAmount,
  isFetchingGasLimit,
  gasEstimateError,
  issuanceRatio,
  hznPrice,
  debtBalance,
  walletBalances,
  // gasLimit,
}) => {
  const classes = useStyles({ color });

  const hznBalance = walletBalances?.crypto?.HZN;

  return (
    <SlidePage>
      <Container>
        <Intro>
          <ActionImage src="/images/actions/mint.svg" big />
          <IntroTitle>{t('mintrActions.mint.action.title')}</IntroTitle>
          <IntroDesc>{t('mintrActions.mint.action.subtitle')}</IntroDesc>
        </Intro>
        <Box mb={2}>
          <Chip
            label={`${formatCurrency(issuableAmount)} HZN Available`}
            className={classes.available}
          />
        </Box>
        <Box mb={1}>
          <Body2>{t('mintrActions.mint.action.instruction')}</Body2>
        </Box>
        <Box>
          <Input
            singleSynth={'hUSD'}
            onChange={e => setMintAmount(e.target.value)}
            value={mintAmount}
            placeholder="0.00"
            rightComponent={
              <ButtonMax
                onClick={() => {
                  setMintAmount(Big(issuableHassets).toFixed());
                }}
              />
            }
          />
          <ErrorMessage message={gasEstimateError} />
        </Box>
        <Grid container className={classes.stats}>
          <Grid item xs={6}>
            <Body2 align="left">
              {t('mintrActions.mint.action.staking')}:{' '}
              {getStakingAmount({
                issuanceRatio,
                mintAmount,
                hznPrice,
              })}
              {' HZN'}
            </Body2>
          </Grid>
          <Grid item xs={6}>
            <Body2 align="right">
              {t('mintrActions.mint.action.estimateCRatio')}:{' '}
              {estimateCRatio({ hznPrice, debtBalance, hznBalance, mintAmount })}%
            </Body2>
          </Grid>
        </Grid>
        {/* <TransactionPriceIndicator
          isFetchingGasLimit={isFetchingGasLimit}
          gasLimit={gasLimit}
          style={{ margin: '0' }}
        /> */}
        <ButtonPrimary
          disabled={!!(isFetchingGasLimit || gasEstimateError)}
          onClick={onMint}
          margin="auto"
        >
          {t('mintrActions.mint.action.buttons.mint')}
        </ButtonPrimary>
      </Container>
    </SlidePage>
  );
};

export default withTranslation()(Action);
