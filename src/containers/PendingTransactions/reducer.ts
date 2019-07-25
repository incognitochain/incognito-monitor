import { Map } from 'immutable';
import {
  GET_PENDING_TRANSACTIONS,
  GET_PENDING_TRANSACTIONS_FAILED,
  GET_PENDING_TRANSACTIONS_SUCCESS,
} from 'containers/PendingTransactions/events';

const initialState: Map<any, any> = Map({
  node: [],
  gettingPendingTransactions: false,
});

const actions: any = {};

actions[GET_PENDING_TRANSACTIONS] = (state: any, action: any) => state
  .set('gettingPendingTransactions', !action.background);

actions[GET_PENDING_TRANSACTIONS_SUCCESS] = (state: any, action: any) => state
  .set('gettingPendingTransactions', false)
  .set('node.ts.tsx', action.payload);

actions[GET_PENDING_TRANSACTIONS_FAILED] = (state: any) => state
  .set('gettingPendingTransactions', false);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
