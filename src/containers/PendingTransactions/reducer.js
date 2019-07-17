import { Map } from 'immutable';
import {
  GET_PENDING_TRANSACTIONS,
  GET_PENDING_TRANSACTIONS_FAILED,
  GET_PENDING_TRANSACTIONS_SUCCESS,
} from './events';

const initialState = new Map({
  node: [],
  gettingPendingTransactions: false,
});

const actions = {};

actions[GET_PENDING_TRANSACTIONS] = (state, action) => state
  .set('gettingPendingTransactions', !action.background);

actions[GET_PENDING_TRANSACTIONS_SUCCESS] = (state, action) => state
  .set('gettingPendingTransactions', false)
  .set('node', action.payload);

actions[GET_PENDING_TRANSACTIONS_FAILED] = state => state
  .set('gettingPendingTransactions', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
