import { Map } from 'immutable';
import {
  GET_BLOCK,
  GET_BLOCK_FAILED,
  GET_BLOCK_SUCCESS,
} from './events';

const initialState = new Map({
  block: {},
  gettingBlock: false,
});

const actions = {};

actions[GET_BLOCK] = state => state
  .set('gettingBlock', true);

actions[GET_BLOCK_SUCCESS] = (state, action) => state
  .set('gettingBlock', false)
  .set('block', action.payload);

actions[GET_BLOCK_FAILED] = state => state
  .set('gettingBlock', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
