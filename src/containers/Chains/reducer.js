import { Map } from 'immutable';
import {
  GET_CHAINS,
  GET_CHAINS_FAILED,
  GET_CHAINS_SUCCESS,
} from './events';

const initialState = new Map({
  node: [],
  gettingChains: false,
});

const actions = {};

actions[GET_CHAINS] = state => state
  .set('gettingChains', true);

actions[GET_CHAINS_SUCCESS] = (state, action) => state
  .set('gettingChains', false)
  .set('node', action.payload);

actions[GET_CHAINS_FAILED] = state => state
  .set('gettingChains', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
