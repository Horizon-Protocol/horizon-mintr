import keyBy from 'lodash/keyBy';

export const CRYPTO_CURRENCIES = ['ETH', 'HZN', 'zUSD', 'zETH', 'zBNB', 'BNB'];
export const CRYPTO_CURRENCY_TO_KEY = keyBy(CRYPTO_CURRENCIES);
