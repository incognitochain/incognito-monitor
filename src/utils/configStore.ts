import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import { createLogger } from 'redux-logger';

/**
 * Transform immutable object to json object
 * @param {Object} state
 */
export const stateTransformer = (state: any) => {
  const newState: any = {};
  const keys = Object.keys(state);
  keys.forEach((key) => {
    const value = state[key];
    if (value.toJS) {
      newState[key] = value.toJS();
    } else {
      newState[key] = value;
    }
  });

  return newState;
};


const middlewares = [thunk, promiseMiddleware];

if (!process.env.NODE_ENV
    || process.env.NODE_ENV === 'development'
    || process.env.NODE_ENV === 'test') {
  const logger = createLogger({ stateTransformer });
  middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

const configStore = (reducers: any) => createStoreWithMiddleware(
  combineReducers({ ...reducers })
);

export default configStore;
