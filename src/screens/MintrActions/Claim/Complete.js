import { Grid } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

import { formatCurrency } from 'helpers/formatters';

import { SlidePage } from 'components/ScreenSlider';
import { ButtonPrimary } from 'components/Button';
import EtherScanBtn from 'components/EtherscanBtn';

import {
  Container,
  ActionImage,
  Intro,
  IntroTitle,
  IntroDesc,
  ErrorTitle,
  ErrorCode,
  ErrorDesc,
  AmountCard,
} from '../common';

const Success = ({ t, color, onDestroy, feesAvailable, networkName, transactionHash }) => {
  return (
    <>
      <Intro>
        <ActionImage src="/images/success.svg" big />
        <IntroTitle>{t('mintrActions.claim.complete.title')}</IntroTitle>
        <IntroDesc>{t('transactionProcessing.complete.subtitle')}</IntroDesc>
      </Intro>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <AmountCard
            label={t('mintrActions.claim.confirmation.actionDescription')}
            value={`${feesAvailable?.[0] ? formatCurrency(feesAvailable[0]) : 0} hUSD`}
            color={color}
            small
          />
        </Grid>
        <Grid item xs={6}>
          <AmountCard
            label={t('mintrActions.claim.confirmation.actionDescription')}
            value={`${feesAvailable?.[1] ? formatCurrency(feesAvailable[1]) : 0} HZN`}
            color={color}
            small
          />
        </Grid>
      </Grid>
      <EtherScanBtn networkName={networkName} transactionHash={transactionHash}>
        {t('button.navigation.bscscan')}
      </EtherScanBtn>
      <ButtonPrimary onClick={onDestroy}>{t('button.navigation.finish')}</ButtonPrimary>
    </>
  );
};

const Failure = ({ t, transactionError, onDestroy }) => {
  return (
    <>
      <Intro>
        <ActionImage src="/images/failure.svg" big />
        <ErrorTitle>{t('transactionProcessing.error.title')}</ErrorTitle>
        {transactionError.code ? (
          <ErrorCode>
            {t('transactionProcessing.error.subtitle')} {transactionError.code}
          </ErrorCode>
        ) : null}
        <ErrorDesc>{t(transactionError.message)}</ErrorDesc>
      </Intro>
      <ButtonPrimary onClick={onDestroy}>{t('button.navigation.ok')}</ButtonPrimary>
    </>
  );
};

const Complete = props => {
  return (
    <SlidePage>
      <Container>
        {props?.transactionError ? <Failure {...props} /> : <Success {...props} />}
      </Container>
    </SlidePage>
  );
};

export default withTranslation()(Complete);
