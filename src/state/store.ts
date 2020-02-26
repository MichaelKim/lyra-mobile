import AsyncStorage from '@react-native-community/async-storage';
import { applyMiddleware, createStore } from 'redux';
import { Store, StoreState } from '../types';
import { checkQueue, logger, queueSong, saveToStorage } from './middleware';
import reducer from './reducer';
import { initialState } from './storage';

const store: Store = createStore(
  reducer,
  initialState,
  applyMiddleware(logger, queueSong, saveToStorage, checkQueue)
);

function safeParse(state: string | null): StoreState {
  if (!state) return initialState;
  try {
    return JSON.parse(state);
  } catch {
    return initialState;
  }
}

AsyncStorage.getItem('state').then(state => {
  store.dispatch({
    type: 'LOAD_STORAGE',
    state: safeParse(state)
  });
});

export default store;
