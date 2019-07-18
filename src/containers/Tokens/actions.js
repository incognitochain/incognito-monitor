import electron from 'utils/electron';
import {
  GET_TOKENS,
  GET_TOKENS_FAILED,
  GET_TOKENS_SUCCESS,
} from './events';
import TEST_NODE from './test_node.json';

export const getTokens = (nodeName, background = false) => (dispatch) => {
  dispatch({
    type: GET_TOKENS,
    background,
  });

  electron.send('get-tokens', nodeName, TEST_NODE)
    .then((payload) => {
      dispatch({
        type: GET_TOKENS_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_TOKENS_FAILED,
        error,
      });
    });
};
