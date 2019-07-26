import { Map } from 'immutable';
import {
  GET_TOKENS,
  GET_TOKENS_FAILED,
  GET_TOKENS_SUCCESS,
} from 'containers/Tokens/events';

const initialState: Map<any, any> = Map({
  node: [],
  gettingTokens: false,
});

const actions: any = {};

actions[GET_TOKENS] = (state: any, action: any) => state
  .set('gettingTokens', !action.background);

actions[GET_TOKENS_SUCCESS] = (state: any, action: any) => state
  .set('gettingTokens', false)
  .set('node', action.payload);

actions[GET_TOKENS_FAILED] = (state: any) => state
  .set('gettingTokens', false);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
