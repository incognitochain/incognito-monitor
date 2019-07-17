import electron from 'utils/electron';
import {
  GET_PENDING_TRANSACTIONS,
  GET_PENDING_TRANSACTIONS_FAILED,
  GET_PENDING_TRANSACTIONS_SUCCESS,
} from './events';
import TEST_NODE from './test_node.json';

export const getPendingTransactions = (nodeName, background = false) => (dispatch) => {
  dispatch({
    type: GET_PENDING_TRANSACTIONS,
    background,
  });

  electron.send('get-pending-transactions', nodeName, TEST_NODE)
    .then((payload) => {
      dispatch({
        type: GET_PENDING_TRANSACTIONS_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_PENDING_TRANSACTIONS_FAILED,
        error,
      });
    });
};
