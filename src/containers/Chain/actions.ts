import electron from 'utils/electron';
import {
  GET_CHAIN,
  GET_CHAIN_FAILED,
  GET_CHAIN_SUCCESS,
} from './events';
import TEST_CHAIN from './test_chain.json';

export const getChain = (nodeId: string, shardId: string, background: boolean = false) => (dispatch: any) => {
  dispatch({
    type: GET_CHAIN,
    background,
  });

  electron.send('get-blocks', { nodeId, shardId }, TEST_CHAIN)
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
