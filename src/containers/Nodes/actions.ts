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
import electron from 'utils/electron';

import TEST_NODES from './test_nodes.json';

export const getNodes = (background = false) => (dispatch: any) => {
  dispatch({
    type: GET_NODES,
    background,
  });

  return electron.send('get-nodes', '', TEST_NODES)
    .then((payload) => {
      dispatch({
        type: GET_NODES_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_NODES_FAILED,
        error,
      });
    });
};

export const addNode = (node: any) => (dispatch: any) => {
  dispatch({
    type: ADD_NODE,
  });

  return electron.send('add-node', node, {})
    .then((payload) => {
      electron.removeListener('get-nodes');
      dispatch({
        type: ADD_NODE_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: ADD_NODE_FAILED,
        error,
      });
    });
};

export const deleteNode = (nodeId: string) => (dispatch: any) => {
  dispatch({
    type: DELETE_NODE,
  });

  return electron.send('delete-node', nodeId, {})
    .then((payload) => {
      electron.removeListener('get-nodes');
      dispatch({
        type: DELETE_NODE_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: DELETE_NODE_FAILED,
        error,
      });
    });
};
