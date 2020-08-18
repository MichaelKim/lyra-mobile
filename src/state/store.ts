import AsyncStorage from '@react-native-community/async-storage';
import { compose, createStore } from 'redux';
import { Store, StoreState } from '../types';
import middlewares from './middleware';
import reducer from './reducer';
import { initialState } from './storage';

const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    // @ts-ignore
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose)) ||
  compose;

const store: Store = createStore(
  reducer,
  initialState,
  composeEnhancers(middlewares)
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
