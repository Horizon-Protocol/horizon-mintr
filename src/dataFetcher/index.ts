import hznJSConnector from 'helpers/hznJSConnector';

import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { bigNumberFormatter, bytesFormatter, parseBytes32String } from 'helpers/formatters';

// const DEFAULT_ZUSD_RATE = 1;

export const getDebtStatus = async (walletAddress: string) => {
  const {
    hznJS: { SystemSettings, Synthetix, Liquidations },
  } = hznJSConnector as any;

  const zUSDBytes = bytesFormatter('zUSD');

  const result = await Promise.all([
    Synthetix.maxIssuableSynths(walletAddress),
    SystemSettings.issuanceRatio(),
    Synthetix.collateralisationRatio(walletAddress),
    Synthetix.transferableSynthetix(walletAddress),
    Synthetix.debtBalanceOf(walletAddress, zUSDBytes),
    Liquidations.liquidationRatio(),
    Liquidations.liquidationDelay(),
    Liquidations.getLiquidationDeadlineForAccount(walletAddress),
  ]);

  const [
    maxIssuableSynths,
    targetCRatio,
    currentCRatio,
    transferable,
    debtBalance,
    liquidationRatio,
  ] = result.map(bigNumberFormatter);

  return {
    issuableHassets: maxIssuableSynths - debtBalance,
    targetCRatio,
    currentCRatio,
    transferable,
    debtBalance,
    debtBalanceBN: result[4],
    liquidationRatio: 100 / liquidationRatio,
    liquidationDelay: Number(result[6]),
    liquidationDeadline: Number(result[7]),
  };
};

export const getEscrowData = async (walletAddress: string) => {
  const {
    hznJS: { RewardEscrow, SynthetixEscrow },
  } = hznJSConnector as any;
  const results = await Promise.all([
    RewardEscrow.totalEscrowedAccountBalance(walletAddress),
    SynthetixEscrow.balanceOf(walletAddress),
  ]);
  const [stakingRewards, tokenSale] = results.map(bigNumberFormatter);
  return {
    stakingRewards,
    tokenSale,
  };
};

// const fetchCurveSUSDRate = async () => {
//   const { curveSUSDSwapContract, utils } = hznJSConnector as any;
//   const usdcContractNumber = 1;
//   const susdContractNumber = 3;
//   const susdAmount = 10000;

//   try {
//     const unformattedExchangeAmount = await curveSUSDSwapContract.get_dy_underlying(
//       susdContractNumber,
//       usdcContractNumber,
//       utils.parseEther(susdAmount.toString())
//     );
//     return unformattedExchangeAmount
//       ? unformattedExchangeAmount / 1e6 / susdAmount
//       : DEFAULT_ZUSD_RATE;
//   } catch (e) {
//     // if we can't get the sUSD rate from Curve, then default it to 1:1
//     return DEFAULT_ZUSD_RATE;
//   }
// };

export const getExchangeRates = async () => {
  const {
    synthSummaryUtilContract,
    hznJS: { ExchangeRates },
  } = hznJSConnector as any;

  const [synthsRates, hznRate /* curveSUSDRate */] = await Promise.all([
    synthSummaryUtilContract.synthsRates(),
    ExchangeRates.rateForCurrency(bytesFormatter(CRYPTO_CURRENCY_TO_KEY.HZN)),
    // fetchCurveSUSDRate(),
  ]);

  let exchangeRates = {
    [CRYPTO_CURRENCY_TO_KEY.HZN]: hznRate / 1e18,
  };
  console.log('=====synthsRates', synthsRates);
  console.log('=====exchangeRates', exchangeRates);

  const [keys, rates] = synthsRates;
  keys.forEach((key: string, i: number) => {
    const synthName = parseBytes32String(key);
    const rate = rates[i] / 1e18;
    // if (synthName === CRYPTO_CURRENCY_TO_KEY.zUSD) {
    //   exchangeRates[CRYPTO_CURRENCY_TO_KEY.zUSD] = curveSUSDRate;
    // } else
    if (synthName === CRYPTO_CURRENCY_TO_KEY.zBNB) {
      exchangeRates[CRYPTO_CURRENCY_TO_KEY.zBNB] = rate;
      exchangeRates[CRYPTO_CURRENCY_TO_KEY.BNB] = rate;
    } else if (synthName === CRYPTO_CURRENCY_TO_KEY.zETH) {
      exchangeRates[CRYPTO_CURRENCY_TO_KEY.zETH] = rate;
      exchangeRates[CRYPTO_CURRENCY_TO_KEY.ETH] = rate;
    } else {
      exchangeRates[synthName] = rate;
    }
  });
  return exchangeRates;
};

export const getBalances = async (walletAddress: string) => {
  const {
    synthSummaryUtilContract,
    hznJS: { Synthetix },
    provider,
  } = hznJSConnector as any;
  const [
    synthBalanceResults,
    totalSynthsBalanceResults,
    hznBalanceResults,
    ethBalanceResults,
  ] = await Promise.all([
    synthSummaryUtilContract.synthsBalances(walletAddress),
    synthSummaryUtilContract.totalSynthsInKey(
      walletAddress,
      bytesFormatter(CRYPTO_CURRENCY_TO_KEY.zUSD)
    ),
    Synthetix.collateral(walletAddress),
    provider.getBalance(walletAddress),
  ]);

  const [synthsKeys, synthsBalances] = synthBalanceResults;

  const synths = synthsKeys
    .map((key: string, i: number) => {
      return {
        name: parseBytes32String(key),
        balance: bigNumberFormatter(synthsBalances[i]),
        balanceBN: synthsBalances[i],
      };
    })
    .filter((synth: any) => synth.balance);

  const zUSDBalance = synths.find((synth: any) => synth.name === CRYPTO_CURRENCY_TO_KEY.zUSD);
  const cryptoToArray = [
    {
      name: CRYPTO_CURRENCY_TO_KEY.HZN,
      balance: bigNumberFormatter(hznBalanceResults),
      balanceBN: hznBalanceResults,
    },
    {
      name: CRYPTO_CURRENCY_TO_KEY.ETH,
      balance: bigNumberFormatter(ethBalanceResults),
      balanceBN: ethBalanceResults,
    },
  ];
  const all = synths.concat(cryptoToArray);
  return {
    crypto: {
      [CRYPTO_CURRENCY_TO_KEY.HZN]: bigNumberFormatter(hznBalanceResults),
      [CRYPTO_CURRENCY_TO_KEY.ETH]: bigNumberFormatter(ethBalanceResults),
      [CRYPTO_CURRENCY_TO_KEY.zUSD]: zUSDBalance ? zUSDBalance.balance : 0,
    },
    synths,
    totalSynths: bigNumberFormatter(totalSynthsBalanceResults),
    all,
  };
};
