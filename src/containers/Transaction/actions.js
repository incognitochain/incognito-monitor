import electron from 'utils/electron';
import {
  GET_TRANSACTION,
  GET_TRANSACTION_FAILED,
  GET_TRANSACTION_SUCCESS,
} from './events';
import TEST_TRANSACTION from './test_transaction.json';

export const getTransaction = (nodeName, transactionHash) => (dispatch) => {
  dispatch({
    type: GET_TRANSACTION,
  });

  electron.send('get-transaction', { nodeName, transactionHash }, TEST_TRANSACTION)
    .then((payload) => {
      dispatch({
        type: GET_TRANSACTION_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_TRANSACTION_FAILED,
        error,
      });
    });
};
