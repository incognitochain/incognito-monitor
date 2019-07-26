import electron from 'utils/electron';
import {
  GET_COMITEES,
  GET_COMITEES_FAILED,
  GET_COMITEES_SUCCESS,
} from './events';
import TEST_NODE from './test_node.json';

export const getCommittees = (nodeId: string, background: boolean = false) => (dispatch: any) => {
  dispatch({
    type: GET_COMITEES,
    background,
  });

  return electron.send('get-committees', nodeId, TEST_NODE)
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
