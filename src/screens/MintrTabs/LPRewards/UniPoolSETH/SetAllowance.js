import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { createTransaction } from '../../../../ducks/transactions';
import { getCurrentGasPrice } from '../../../../ducks/network';

import { TOKEN_ALLOWANCE_LIMIT } from '../../../../constants/network';

import hznJSConnector from '../../../../helpers/hznJSConnector';

import { PageTitle, PLarge } from '../../../../components/Typography';
import { ButtonPrimary, ButtonTertiary } from '../../../../components/Button';

const SetAllowance = ({ createTransaction, goBack, currentGasPrice }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const onUnlock = async () => {
    const { parseEther } = hznJSConnector.utils;
    const { uniswapV1Contract, unipoolSETHContract } = hznJSConnector;
    try {
      setError(null);

      const gasEstimate = await uniswapV1Contract.estimate.approve(
        unipoolSETHContract.address,
        parseEther(TOKEN_ALLOWANCE_LIMIT.toString())
      );
      const transaction = await uniswapV1Contract.approve(
        unipoolSETHContract.address,
        parseEther(TOKEN_ALLOWANCE_LIMIT.toString()),
        {
          gasLimit: Number(gasEstimate) + 10000,
          gasPrice: currentGasPrice.formattedPrice,
        }
      );
      if (transaction) {
        createTransaction({
          hash: transaction.hash,
          status: 'pending',
          info: t('unipoolSETH.locked.transaction'),
          hasNotification: true,
        });
      }
    } catch (e) {
      setError(e.message);
      console.log(e);
    }
  };
  return (
    <>
      <Navigation>
        <ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
      </Navigation>
      <TitleContainer>
        <Logo src="/images/pools/unipool-sETH.svg" />
        <PageTitle>{t('unipoolSETH.title')}</PageTitle>
        <PLarge>{t('unipoolSETH.locked.subtitle')}</PLarge>
      </TitleContainer>
      <ButtonRow>
        <ButtonPrimary onClick={onUnlock}>{t('lpRewards.shared.buttons.unlock')}</ButtonPrimary>
      </ButtonRow>
      {error ? <Error>{`Error: ${error}`}</Error> : null}
    </>
  );
};

const Logo = styled.img`
  width: 64px;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const TitleContainer = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 64px;
`;

const Error = styled.div`
  color: ${props => props.theme.colorStyles.brandRed};
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const mapStateToProps = state => ({
  currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
  createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetAllowance);
