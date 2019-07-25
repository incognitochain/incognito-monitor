import { Map } from 'immutable';
import {
  GET_TRANSACTION,
  GET_TRANSACTION_FAILED,
  GET_TRANSACTION_SUCCESS,
} from 'containers/Transaction/events';

const initialState: Map<any, any> = Map({
  transaction: {},
  gettingTransaction: false,
});

const actions: any = {};

actions[GET_TRANSACTION] = (state: any) => state
  .set('gettingTransaction', true);

actions[GET_TRANSACTION_SUCCESS] = (state: any, action: any) => state
  .set('gettingTransaction', false)
  .set('transaction', action.payload);

actions[GET_TRANSACTION_FAILED] = (state: any) => state
  .set('gettingTransaction', false);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
