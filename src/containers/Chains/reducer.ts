import { Map } from 'immutable';
import {
  GET_CHAINS,
  GET_CHAINS_SUCCESS,
  SEARCH,
  SEARCH_FAILED,
  SEARCH_SUCCESS,
} from 'containers/Chains/events';

const initialState: Map<any, any> = Map({
  node: [],
  gettingChains: false,
  searching: false,
  searchResult: null,
});

const actions: any = {};

actions[GET_CHAINS] = (state: any, action: any) => state
  .set('gettingChains', !action.background);

actions[GET_CHAINS_SUCCESS] = (state: any, action: any) => state
  .set('gettingChains', false)
  .set('node', action.payload);

actions[SEARCH] = (state: any) => state
  .set('searching', true);

actions[SEARCH_SUCCESS] = (state: any, action: any) => state
  .set('searching', false)
  .set('searchResult', action.payload);

actions[SEARCH_FAILED] = (state: any) => state
  .set('searching', false);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
