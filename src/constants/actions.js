import keyBy from 'lodash/keyBy';

// export const ACTIONS = ['mint', 'burn', 'claim', 'trade', 'transfer', 'track'];
export const ACTIONS = ['mint', 'burn', 'claim'];
export const ACTIONS_MAP = keyBy(ACTIONS);
