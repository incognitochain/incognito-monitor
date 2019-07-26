import { Map } from 'immutable';
import {
  CALL_RPC,
  CALL_RPC_FAILED,
  CALL_RPC_SUCCESS,
  CHANGE_NODE,
} from './events';

const initialState: Map<any, any> = Map({
  method: '',
  result: [],
  calling: false,
});

const actions: any = {};

actions[CALL_RPC] = (state: any, action: any) => state
  .set('calling', true)
  .set('method', action.payload);

actions[CALL_RPC_SUCCESS] = (state: any, action: any) => state
  .set('calling', false)
  .set('result', action.payload);

actions[CALL_RPC_FAILED] = (state: any) => state
  .set('calling', false);

actions[CHANGE_NODE] = (state: any, action: any) => state
  .set('node', action.payload);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
