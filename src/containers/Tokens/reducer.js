import { Map } from 'immutable';
import {
  GET_TOKENS,
  GET_TOKENS_FAILED,
  GET_TOKENS_SUCCESS,
} from './events';

const initialState = new Map({
  node: [],
  gettingTokens: false,
});

const actions = {};

actions[GET_TOKENS] = (state, action) => state
  .set('gettingTokens', !action.background);

actions[GET_TOKENS_SUCCESS] = (state, action) => state
  .set('gettingTokens', false)
  .set('node', action.payload);

actions[GET_TOKENS_FAILED] = state => state
  .set('gettingTokens', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
