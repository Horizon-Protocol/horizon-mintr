import { createSlice } from '@reduxjs/toolkit';
import hznData from '@phoenix-global/horizon-data';
import flatten from 'lodash/flatten';
import orderBy from 'lodash/orderBy';

import { TRANSACTION_EVENTS } from '../constants/transactionHistory';

export const transactionHistorySlice = createSlice({
  name: 'transactionHistory',
  initialState: {
    transactions: [],
    isFetching: false,
    isFetched: false,
    isRefreshing: false,
    fetchError: null,
  },
  reducers: {
    fetchTransactionHistoryRequest: state => {
      state.fetchError = null;
      state.isFetching = true;
      if (state.isFetched) {
        state.isRefreshing = true;
      }
    },
    fetchTransactionHistoryFailure: (state, action) => {
      state.fetchError = action.payload.error;
      state.isFetching = false;
      state.isRefreshing = false;
    },
    fetchTransactionHistorySuccess: (state, action) => {
      state.transactions = action.payload;
      state.isFetching = false;
      state.isRefreshing = false;
      state.isFetched = true;
    },
  },
});

const {
  fetchTransactionHistoryRequest,
  fetchTransactionHistoryFailure,
  fetchTransactionHistorySuccess,
} = transactionHistorySlice.actions;

const getTransactionHistoryState = state => state.transactionHistory;
export const getIsFetchingTransactionHistory = state =>
  getTransactionHistoryState(state).isFetching;
export const getIsRefreshingTransactionHistory = state =>
  getTransactionHistoryState(state).isRefreshing;
export const getIsFetchedTransactionHistory = state => getTransactionHistoryState(state).isFetched;
export const getTransactionHistoryFetchError = state =>
  getTransactionHistoryState(state).fetchError;
export const getTransactionHistory = state => getTransactionHistoryState(state).transactions;

export const fetchTransactionHistory = walletAddress => async dispatch => {
  dispatch(fetchTransactionHistoryRequest());

  try {
    const [
      issued,
      burned,
      feesClaimed,
      exchanges,
      depotActions,
      clearedDeposits,
      depotExchanges,
    ] = await Promise.all([
      hznData.hzn.issued({ account: walletAddress }),
      hznData.hzn.burned({ account: walletAddress }),
      hznData.hzn.feesClaimed({ account: walletAddress }),
      hznData.exchanges.since({ fromAddress: walletAddress, minTimestamp: 0, max: 100 }),
      hznData.depot.userActions({ user: walletAddress }),
      hznData.depot.clearedDeposits({ toAddress: walletAddress }),
      hznData.depot.exchanges({ from: walletAddress }),
    ]);

    const mergedArray = flatten(
      [issued, burned, feesClaimed, exchanges, clearedDeposits, depotExchanges]
        .map((eventType, i) => {
          return eventType.map(event => {
            return event.type ? event : { type: TRANSACTION_EVENTS[i], ...event };
          });
        })
        .concat(depotActions)
    );

    dispatch(fetchTransactionHistorySuccess(orderBy(mergedArray, 'timestamp', ['desc'])));
  } catch (e) {
    dispatch(fetchTransactionHistoryFailure({ error: e.message }));
  }
};

export default transactionHistorySlice.reducer;
