import { Map } from 'immutable';
import {
  GET_BLOCK,
  GET_BLOCK_FAILED,
  GET_BLOCK_SUCCESS,
} from 'containers/Block/events';

const initialState: Map<any, any> = Map({
  block: {},
  gettingBlock: false,
});

const actions: any = {};

actions[GET_BLOCK] = (state: any) => state
  .set('gettingBlock', true);

actions[GET_BLOCK_SUCCESS] = (state: any, action: any) => state
  .set('gettingBlock', false)
  .set('block', action.payload);

actions[GET_BLOCK_FAILED] = (state: any) => state
  .set('gettingBlock', false);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
