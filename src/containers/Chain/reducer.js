import { Map } from 'immutable';
import {
  GET_CHAIN,
  GET_CHAIN_FAILED,
  GET_CHAIN_SUCCESS,
} from './events';

const initialState = new Map({
  chain: {},
  gettingChain: false,
});

const actions = {};

actions[GET_CHAIN] = (state, action) => state
  .set('gettingChain', !action.background);

actions[GET_CHAIN_SUCCESS] = (state, action) => state
  .set('gettingChain', false)
  .set('chain', action.payload);

actions[GET_CHAIN_FAILED] = state => state
  .set('gettingChain', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
