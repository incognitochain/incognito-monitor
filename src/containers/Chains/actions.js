import electron from 'utils/electron';
import {
  GET_CHAINS,
  GET_CHAINS_FAILED,
  GET_CHAINS_SUCCESS,
} from './events';
import TEST_NODE from './test_node.json';

export const getChains = nodeName => (dispatch) => {
  dispatch({
    type: GET_CHAINS,
  });

  electron.send('get-chains', nodeName, TEST_NODE)
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
