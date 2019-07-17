import { Map } from 'immutable';
import {
  GET_COMITEES,
  GET_COMITEES_FAILED,
  GET_COMITEES_SUCCESS,
} from './events';

const initialState = new Map({
  node: [],
  gettingCommittees: false,
});

const actions = {};

actions[GET_COMITEES] = (state, action) => state
  .set('gettingCommittees', !action.background);

actions[GET_COMITEES_SUCCESS] = (state, action) => state
  .set('gettingCommittees', false)
  .set('node', action.payload);

actions[GET_COMITEES_FAILED] = state => state
  .set('gettingCommittees', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
