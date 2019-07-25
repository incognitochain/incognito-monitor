import electron from 'utils/electron';
import {
  GET_CHAINS,
  GET_CHAINS_FAILED,
  GET_CHAINS_SUCCESS,
  SEARCH,
  SEARCH_FAILED,
  SEARCH_SUCCESS,
} from './events';
import TEST_NODE from './test_node.json';

export const getChains = (nodeId: string, background: false = false) => (dispatch: any) => {
  dispatch({
    type: GET_CHAINS,
    background,
  });

  electron.send('get-chains', nodeId, TEST_NODE)
    .then((payload) => {
      dispatch({
        type: GET_CHAINS_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_CHAINS_FAILED,
        error,
      });
    });
};

export const search = (nodeId: string, searchValue: string) => (dispatch: any) => {
  dispatch({
    type: SEARCH,
    payload: searchValue,
  });

  electron.send('search', { nodeId, searchValue }, null)
    .then((payload) => {
      dispatch({
        type: SEARCH_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: SEARCH_FAILED,
        error,
      });
    });
};
