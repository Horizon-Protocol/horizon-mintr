import React from 'react';
import styled from 'styled-components';
import { withTranslation, Trans } from 'react-i18next';
import { Button, Grid, Paper } from '@material-ui/core';

import { formatCurrency } from 'helpers/formatters';
import { SlidePage } from 'components/ScreenSlider';
// import TransactionPriceIndicator from 'components/TransactionPriceIndicator';
import { DataHeaderLarge, Subtext } from 'components/Typography';
import Spinner from 'components/Spinner';

import { Container, Intro, IntroTitle, IntroDesc, ActionImage, Navigation } from '../common';
import { getStakingAmount } from './mint-helpers';

const Confirmation = ({
  t,
  goBack,
  walletType,
  mintAmount,
  issuanceRatio,
  hznPrice,
  isFetchingGasLimit,
  gasLimit,
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
        <Grid container spacing={4}>
          <Grid item>
            <Paper variant="outlined">
              <DataHeaderLarge>
                {t('mintrActions.mint.confirmation.actionDescription')}
              </DataHeaderLarge>
              <Amount>{formatCurrency(mintAmount)} sUSD</Amount>
            </Paper>
          </Grid>
          <Grid item>
            <DataHeaderLarge>
              {t('mintrActions.mint.confirmation.subActionDescription')}
            </DataHeaderLarge>
            <Amount>
              {getStakingAmount({
                issuanceRatio,
                mintAmount,
                hznPrice,
              })}
              {' HZN'}
            </Amount>
          </Grid>
        </Grid>
        <Loading>
          <Spinner margin="auto" />
          <Subtext>{t('transactionProcessing.confirmation.loading')}</Subtext>
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

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.hyperlink};
  font-family: 'Roboto';
  font-size: 24px;
  margin: 16px 0px 0px 0px;
`;

const Loading = styled.div`
  align-items: center;
`;

export default withTranslation()(Confirmation);
