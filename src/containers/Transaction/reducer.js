import { Map } from 'immutable';
import {
  GET_TRANSACTION,
  GET_TRANSACTION_FAILED,
  GET_TRANSACTION_SUCCESS,
} from './events';

const initialState = new Map({
  transaction: {},
  gettingTransaction: false,
});

const actions = {};

actions[GET_TRANSACTION] = state => state
  .set('gettingTransaction', true);

actions[GET_TRANSACTION_SUCCESS] = (state, action) => state
  .set('gettingTransaction', false)
  .set('transaction', action.payload);

actions[GET_TRANSACTION_FAILED] = state => state
  .set('gettingTransaction', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
