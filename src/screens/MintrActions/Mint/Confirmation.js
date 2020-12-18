import styled from 'styled-components';
import { withTranslation, Trans } from 'react-i18next';
import { Button, Grid, Typography } from '@material-ui/core';

import { formatCurrency } from 'helpers/formatters';
import { SlidePage } from 'components/ScreenSlider';
// import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
import Spinner from 'components/Spinner';
import {
  Container,
  Intro,
  IntroTitle,
  IntroDesc,
  ActionImage,
  Navigation,
  AmountCard,
} from '../common';
import { getStakingAmount } from './mint-helpers';

const Confirmation = ({
  t,
  color,
  goBack,
  walletType,
  mintAmount,
  issuanceRatio,
  hznPrice,
  // isFetchingGasLimit,
  // gasLimit,
}) => {
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <Button variant="outlined" color="primary" onClick={() => goBack(1)}>
            {t('button.navigation.back')}
          </Button>
        </Navigation>
        <Intro>
          <ActionImage src={`/images/wallets/${walletType.toLowerCase()}.svg`} big />
          <IntroTitle>{t('transactionProcessing.confirmation.title')}</IntroTitle>
          <IntroDesc>
            <Trans i18nKey="transactionProcessing.confirmation.subtitle">
              To continue, follow the prompts on your ${walletType} Wallet.
            </Trans>
          </IntroDesc>
        </Intro>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <AmountCard
              label={t('mintrActions.mint.confirmation.actionDescription')}
              value={`${formatCurrency(mintAmount)} hUSD`}
              color={color}
              small
            />
          </Grid>
          <Grid item xs={6}>
            <AmountCard
              label={t('mintrActions.mint.confirmation.subActionDescription')}
              value={`${getStakingAmount({
                issuanceRatio,
                mintAmount,
                hznPrice,
              })} HZN`}
              color={color}
              small
            />
          </Grid>
        </Grid>
        <Loading>
          <Spinner margin="auto" />
          <Typography variant="caption" color="textSecondary">
            {t('transactionProcessing.confirmation.loading')}
          </Typography>
        </Loading>
        {/* <TransactionPriceIndicator
            isFetchingGasLimit={isFetchingGasLimit}
            gasLimit={gasLimit}
            style={{ margin: '0' }}
            canEdit={false}
          /> */}
      </Container>
    </SlidePage>
  );
};

const Loading = styled.div`
  align-items: center;
`;

export default withTranslation()(Confirmation);
