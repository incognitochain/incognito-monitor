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

export const getNodes = nodes => (dispatch) => {
  dispatch({
    type: GET_NODES,
  });

  electron.send('get-nodes', nodes, TEST_NODES)
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

export const addNode = node => (dispatch) => {
  dispatch({
    type: ADD_NODE,
  });

  electron.send('add-node', node, {})
    .then((payload) => {
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

export const deleteNode = node => (dispatch) => {
  dispatch({
    type: DELETE_NODE,
  });

  electron.send('delete-node', node, {})
    .then((payload) => {
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
