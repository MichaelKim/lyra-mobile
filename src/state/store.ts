import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';
import { initialState } from './storage';
import { logger, loadSongs, saveToStorage } from './middleware';

import { Store } from '../types';

const store: Store = createStore(
  reducer,
  initialState,
  applyMiddleware(logger, loadSongs, saveToStorage)
);

store.dispatch({
  type: 'LOAD_STORAGE',
  state: initialState
});

export default store;
