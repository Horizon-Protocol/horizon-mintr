import keyBy from 'lodash/keyBy';

export const CRYPTO_CURRENCIES = ['ETH', 'HZN', 'hUSD', 'hETH', 'hBNB', 'BNB'];
export const CRYPTO_CURRENCY_TO_KEY = keyBy(CRYPTO_CURRENCIES);
