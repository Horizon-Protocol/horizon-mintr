import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import hznJSConnector from '../../../../helpers/hznJSConnector';
import { getWalletDetails } from '../../../../ducks/wallet';

import { bigNumberFormatter } from '../../../../helpers/formatters';

import PageContainer from '../../../../components/PageContainer';
import Spinner from '../../../../components/Spinner';

import SetAllowance from './SetAllowance';
import Stake from './Stake';

const UniPool = ({ goBack, walletDetails }) => {
  const [hasAllowance, setAllowance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentWallet } = walletDetails;

  const fetchAllowance = useCallback(async () => {
    if (!hznJSConnector.initialized) return;
    const { uniswapV1Contract, unipoolSETHContract } = hznJSConnector;
    try {
      setIsLoading(true);
      const allowance = await uniswapV1Contract.allowance(
        currentWallet,
        unipoolSETHContract.address
      );
      setAllowance(!!bigNumberFormatter(allowance));
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setAllowance(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWallet, hznJSConnector.initialized]);

  useEffect(() => {
    fetchAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAllowance]);

  useEffect(() => {
    if (!currentWallet) return;
    const { uniswapV1Contract, unipoolSETHContract } = hznJSConnector;

    uniswapV1Contract.on('Approval', (owner, spender) => {
      if (owner === currentWallet && spender === unipoolSETHContract.address) {
        setAllowance(true);
      }
    });

    return () => {
      if (hznJSConnector.initialized) {
        uniswapV1Contract.removeAllListeners('Approval');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWallet]);

  return (
    <PageContainer>
      {isLoading ? (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      ) : !hasAllowance ? (
        <SetAllowance goBack={goBack} />
      ) : (
        <Stake goBack={goBack} />
      )}
    </PageContainer>
  );
};

const SpinnerContainer = styled.div`
  margin: 100px;
`;

const mapStateToProps = state => ({
  walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, {})(UniPool);
