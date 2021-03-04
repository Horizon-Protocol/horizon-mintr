import { Grid } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

import { SlidePage } from 'components/ScreenSlider';
import { ButtonPrimary } from 'components/Button';
import { formatCurrency } from 'helpers/formatters';
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

const Success = ({
  t,
  color,
  mintAmount,
  issuanceRatio,
  onDestroy,
  networkName,
  transactionHash,
  hznPrice,
}) => {
  return (
    <>
      <Intro>
        <ActionImage src="/images/success.svg" big />
        <IntroTitle>{t('mintrActions.mint.complete.title')}</IntroTitle>
        <IntroDesc>{t('transactionProcessing.complete.subtitle')}</IntroDesc>
      </Intro>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <AmountCard
            label={t('mintrActions.mint.confirmation.actionDescription')}
            value={`${formatCurrency(mintAmount)} zUSD`}
            color={color}
            small
          />
        </Grid>
        <Grid item xs={6}>
          <AmountCard
            label={t('mintrActions.mint.confirmation.subActionDescription')}
            value={`${
              issuanceRatio ? formatCurrency(mintAmount / issuanceRatio / hznPrice) : '--'
            } HZN`}
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
