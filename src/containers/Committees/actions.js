import electron from 'utils/electron';
import {
  GET_COMITEES,
  GET_COMITEES_FAILED,
  GET_COMITEES_SUCCESS,
} from './events';
import TEST_NODE from './test_node.json';

export const getCommittees = (nodeName, background = false) => (dispatch) => {
  dispatch({
    type: GET_COMITEES,
    background,
  });

  electron.send('get-committees', nodeName, TEST_NODE)
    .then((payload) => {
      dispatch({
        type: GET_COMITEES_SUCCESS,
        payload,
      });
    })
    .catch((error) => {
      dispatch({
        type: GET_COMITEES_FAILED,
        error,
      });
    });
};
