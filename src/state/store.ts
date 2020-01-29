import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';

import reducer from './reducer';
import { initialState } from './storage';
import { logger, queueSong, saveToStorage } from './middleware';

import { Store } from '../types';

const store: Store = createStore(
  reducer,
  initialState,
  applyMiddleware(logger, queueSong, saveToStorage)
);

AsyncStorage.getItem('state').then(state => {
  try {
    state = JSON.parse(state);
  } finally {
    if (!state) state = initialState;
  }

  store.dispatch({
    type: 'LOAD_STORAGE',
    state
  });
});

export default store;
