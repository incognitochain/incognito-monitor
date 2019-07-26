import { Map } from 'immutable';
import {
  GET_CHAIN,
  GET_CHAIN_FAILED,
  GET_CHAIN_SUCCESS,
} from 'containers/Chain/events';

const initialState: Map<any, any> = Map({
  chain: {},
  gettingChain: false,
});

const actions: any = {};

actions[GET_CHAIN] = (state: any, action: any) => state
  .set('gettingChain', !action.background);

actions[GET_CHAIN_SUCCESS] = (state: any, action: any) => state
  .set('gettingChain', false)
  .set('chain', action.payload);

actions[GET_CHAIN_FAILED] = (state: any, action: any) => state
  .set('gettingChain', false);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
