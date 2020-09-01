import AsyncStorage from '@react-native-community/async-storage';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { StoreState } from '../types';
import middlewares from './middleware';
import reducer from './reducer';
import { initialState } from './storage';

let m = middlewares;

if (__DEV__) {
  console.log('DEV MODE!');
  m.push(require('redux-flipper').default());
}

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware().concat(m),
  preloadedState: initialState
});

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
