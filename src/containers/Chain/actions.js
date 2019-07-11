import electron from 'utils/electron';
import {
  GET_CHAIN,
  GET_CHAIN_FAILED,
  GET_CHAIN_SUCCESS,
} from './events';
import TEST_CHAIN from './test_chain.json';

export const getChain = (nodeName, shardId, background) => (dispatch) => {
  dispatch({
    type: GET_CHAIN,
    background,
  });

  electron.send('get-blocks', { nodeName, shardId }, TEST_CHAIN)
    .then((payload) => {
      dispatch({
        type: GET_CHAIN_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_CHAIN_FAILED,
        error,
      });
    });
};
