import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { SlidePage } from 'components/ScreenSlider';
import { ButtonPrimary } from 'components/Button';
import { formatCurrency } from 'helpers/formatters';
import EtherScanBtn from 'components/EtherscanBtn';

import { Container, ActionImage, Intro, IntroTitle, IntroDesc, ErrorDetail } from '../common';

const useStyles = makeStyles(({ palette }) => ({
  error: {
    marginTop: 12,
    color: 'red',
  },
}));

const Success = ({
  t,
  mintAmount,
  issuanceRatio,
  onDestroy,
  networkName,
  transactionHash,
  hznPrice,
}) => {
  const classes = useStyles();

  return (
    <>
      <Intro>
        <ActionImage src="/images/success.svg" big />
        <IntroTitle>{t('mintrActions.mint.complete.title')}</IntroTitle>
        <IntroDesc className={classes.error}>
          {t('transactionProcessing.complete.subtitle')}
        </IntroDesc>
      </Intro>
      <Details>
        <Box>
          <Typography>{t('mintrActions.mint.confirmation.actionDescription')}</Typography>
          <Amount>{formatCurrency(mintAmount)} hUSD</Amount>
        </Box>
        <Box>
          <Typography>{t('mintrActions.mint.confirmation.subActionDescription')}</Typography>
          <Amount>
            {issuanceRatio ? formatCurrency(mintAmount / issuanceRatio / hznPrice) : '--'} HZN
          </Amount>
        </Box>
      </Details>
      <EtherScanBtn networkName={networkName} transactionHash={transactionHash}>
        {t('button.navigation.etherscan')}
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
        <Typography variant="h6">{t('transactionProcessing.error.title')}</Typography>
        {transactionError.code ? (
          <ErrorDetail>
            {t('transactionProcessing.error.subtitle')} {transactionError.code}
          </ErrorDetail>
        ) : null}
        <ErrorDetail>{t(transactionError.message)}</ErrorDetail>
      </Intro>
      <ButtonPrimary onClick={onDestroy}>{t('button.navigation.ok')}</ButtonPrimary>
    </>
  );
};

const Complete = props => {
  return (
    <SlidePage>
      <Container>
        {props && props.transactionError ? <Failure {...props} /> : <Success {...props} />}
      </Container>
    </SlidePage>
  );
};

const Details = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
`;

const Box = styled.div`
  height: auto;
  width: auto;
  padding: 24px 40px;
  margin: 0px 16px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.hyperlink};
  font-family: 'Roboto';
  font-size: 24px;
  margin: 16px 0px 0px 0px;
`;

export default withTranslation()(Complete);
