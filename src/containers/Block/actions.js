import electron from 'utils/electron';
import {
  GET_BLOCK,
  GET_BLOCK_FAILED,
  GET_BLOCK_SUCCESS,
} from './events';
import TEST_BLOCK from './test_block.json';

export const getBlock = (nodeName, blockHash) => (dispatch) => {
  dispatch({
    type: GET_BLOCK,
  });

  electron.send('get-block', { nodeName, blockHash }, TEST_BLOCK)
    .then((payload) => {
      dispatch({
        type: GET_BLOCK_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_BLOCK_FAILED,
        error,
      });
    });
};
