import { Map } from 'immutable';
import {
  GET_COMITEES,
  GET_COMITEES_FAILED,
  GET_COMITEES_SUCCESS,
} from 'containers/Committees/events';

const initialState: Map<any, any> = Map({
  node: [],
  gettingCommittees: false,
});

const actions: any = {};

actions[GET_COMITEES] = (state: any, action: any) => state
  .set('gettingCommittees', !action.background);

actions[GET_COMITEES_SUCCESS] = (state: any, action: any) => state
  .set('gettingCommittees', false)
  .set('node', action.payload);

actions[GET_COMITEES_FAILED] = (state: any) => state
  .set('gettingCommittees', false);

export default function (state = initialState, action: any) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
