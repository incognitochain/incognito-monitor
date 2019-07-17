import { Map } from 'immutable';
import {
  GET_CHAINS,
  GET_CHAINS_FAILED,
  GET_CHAINS_SUCCESS,
  SEARCH,
  SEARCH_FAILED,
  SEARCH_SUCCESS,
} from './events';

const initialState = new Map({
  node: [],
  gettingChains: false,
  searching: false,
  searchResult: null,
});

const actions = {};

actions[GET_CHAINS] = (state, action) => state
  .set('gettingChains', !action.background);

actions[GET_CHAINS_SUCCESS] = (state, action) => state
  .set('gettingChains', false)
  .set('node', action.payload);

actions[GET_CHAINS_FAILED] = state => state
  .set('gettingChains', false);

actions[SEARCH] = state => state
  .set('searching', true);

actions[SEARCH_SUCCESS] = (state, action) => state
  .set('searching', false)
  .set('searchResult', action.payload);

actions[SEARCH_FAILED] = state => state
  .set('searching', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
