import hznJSConnector from 'helpers/hznJSConnector';

import { CRYPTO_CURRENCY_TO_KEY } from 'constants/currency';
import { bigNumberFormatter, bytesFormatter, parseBytes32String } from 'helpers/formatters';

const DEFAULT_SUSD_RATE = 1;

export const getDebtStatus = async (walletAddress: string) => {
  const {
    hznJS: { SystemSettings, Synthetix, Liquidations },
  } = hznJSConnector as any;
  const debtBalanceBN = await Synthetix.debtBalanceOf(walletAddress, bytesFormatter('sUSD'));

  const result = await Promise.all([
    SystemSettings.issuanceRatio(),
    Synthetix.collateralisationRatio(walletAddress),
    Synthetix.transferableSynthetix(walletAddress),
    Synthetix.debtBalanceOf(walletAddress, bytesFormatter('sUSD')),
    Liquidations.liquidationRatio(),
    Liquidations.liquidationDelay(),
    Liquidations.getLiquidationDeadlineForAccount(walletAddress),
  ]);
  const [targetCRatio, currentCRatio, transferable, debtBalance, liquidationRatio] = result.map(
    bigNumberFormatter
  );

  return {
    targetCRatio,
    currentCRatio,
    transferable,
    debtBalance,
    debtBalanceBN,
    liquidationRatio: 100 / liquidationRatio,
    liquidationDelay: Number(result[5]),
    liquidationDeadline: Number(result[6]),
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

const fetchCurveSUSDRate = async () => {
  const { curveSUSDSwapContract, utils } = hznJSConnector as any;
  const usdcContractNumber = 1;
  const susdContractNumber = 3;
  const susdAmount = 10000;

  try {
    const unformattedExchangeAmount = await curveSUSDSwapContract.get_dy_underlying(
      susdContractNumber,
      usdcContractNumber,
      utils.parseEther(susdAmount.toString())
    );
    return unformattedExchangeAmount
      ? unformattedExchangeAmount / 1e6 / susdAmount
      : DEFAULT_SUSD_RATE;
  } catch (e) {
    // if we can't get the sUSD rate from Curve, then default it to 1:1
    return DEFAULT_SUSD_RATE;
  }
};

export const getExchangeRates = async () => {
  const {
    synthSummaryUtilContract,
    hznJS: { ExchangeRates },
  } = hznJSConnector as any;

  const [synthsRates, snxRate, curveSUSDRate] = await Promise.all([
    synthSummaryUtilContract.synthsRates(),
    ExchangeRates.rateForCurrency(bytesFormatter(CRYPTO_CURRENCY_TO_KEY.HZN)),
    fetchCurveSUSDRate(),
  ]);

  let exchangeRates = {
    [CRYPTO_CURRENCY_TO_KEY.HZN]: snxRate / 1e18,
  };
  const [keys, rates] = synthsRates;
  keys.forEach((key: string, i: number) => {
    const synthName = parseBytes32String(key);
    const rate = rates[i] / 1e18;
    if (synthName === CRYPTO_CURRENCY_TO_KEY.sUSD) {
      exchangeRates[CRYPTO_CURRENCY_TO_KEY.sUSD] = curveSUSDRate;
    } else if (synthName === CRYPTO_CURRENCY_TO_KEY.sETH) {
      exchangeRates[CRYPTO_CURRENCY_TO_KEY.sETH] = rate;
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
    snxBalanceResults,
    ethBalanceResults,
  ] = await Promise.all([
    synthSummaryUtilContract.synthsBalances(walletAddress),
    synthSummaryUtilContract.totalSynthsInKey(
      walletAddress,
      bytesFormatter(CRYPTO_CURRENCY_TO_KEY.sUSD)
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

  const sUSDBalance = synths.find((synth: any) => synth.name === CRYPTO_CURRENCY_TO_KEY.sUSD);
  const cryptoToArray = [
    {
      name: CRYPTO_CURRENCY_TO_KEY.HZN,
      balance: bigNumberFormatter(snxBalanceResults),
      balanceBN: snxBalanceResults,
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
      [CRYPTO_CURRENCY_TO_KEY.HZN]: bigNumberFormatter(snxBalanceResults),
      [CRYPTO_CURRENCY_TO_KEY.ETH]: bigNumberFormatter(ethBalanceResults),
      [CRYPTO_CURRENCY_TO_KEY.sUSD]: sUSDBalance ? sUSDBalance.balance : 0,
    },
    synths,
    totalSynths: bigNumberFormatter(totalSynthsBalanceResults),
    all,
  };
};
