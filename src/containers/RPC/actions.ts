import electron from 'utils/electron';
import {
  CALL_RPC,
  CALL_RPC_SUCCESS,
  CHANGE_NODE,
} from './events';
import TEST_NODE from './test_node.json';

export const call = (nodeId: string, method: string, params: string) => (dispatch: any) => {
  dispatch({
    type: CALL_RPC,
    payload: method,
  });

  const payload = electron.sendSync('call-rpc', { nodeId, method, params }, TEST_NODE);
  dispatch({
    type: CALL_RPC_SUCCESS,
    payload,
  });
};

export const changeNode = (nodeId: string) => (dispatch: any) => {
  dispatch({
    type: CHANGE_NODE,
    payload: nodeId,
  });
};
