import {
  ADD_NODE,
  ADD_NODE_FAILED,
  ADD_NODE_SUCCESS,
  GET_NODES,
  GET_NODES_FAILED,
  GET_NODES_SUCCESS,
  DELETE_NODE,
  DELETE_NODE_FAILED,
  DELETE_NODE_SUCCESS,
} from 'containers/Nodes/events';
import { Map } from 'immutable';

const initialState = new Map({
  nodes: [],
  gettingNodes: false,
  addingNode: false,
});

const actions = {};

actions[GET_NODES] = (state, action) => state
  .set('gettingNodes', !action.background);

actions[GET_NODES_SUCCESS] = (state, action) => state
  .set('gettingNodes', false)
  .set('nodes', action.payload);

actions[GET_NODES_FAILED] = state => state
  .set('gettingNodes', false);

actions[ADD_NODE] = state => state
  .set('addingNode', true);

actions[ADD_NODE_SUCCESS] = (state, action) => {
  const newNode = action.payload;
  const nodes = state.get('nodes');

  return state
    .set('addingNode', false)
    .set('nodes', [...nodes, newNode]);
};

actions[ADD_NODE_FAILED] = state => state
  .set('addingNode', false);

actions[DELETE_NODE] = state => state
  .set('deletingNode', true);

actions[DELETE_NODE_SUCCESS] = (state, action) => {
  const deletedNodeName = action.payload;
  const nodes = state.get('nodes');

  return state
    .set('deletingNode', false)
    .set('nodes', nodes.filter(node => node.name !== deletedNodeName));
};

actions[DELETE_NODE_FAILED] = state => state
  .set('deletingNode', false);

export default function (state = initialState, action) {
  const fn = actions[action.type];

  return fn ? fn(state, action) : state;
}
