import AsyncStorage from '@react-native-community/async-storage';

import { StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  songs: {},
  playlists: {},
  volume: {
    amount: 1,
    muted: false
  },
  sort: {
    column: 'TITLE',
    direction: false
  },
  shuffle: false,
  queue: {
    prev: [],
    curr: null,
    next: [],
    cache: {}
  },
  history: [],
  dlQueue: [],
  dlProgress: 0
};

export function save(state: StoreState) {
  AsyncStorage.setItem('state', JSON.stringify(state))
    .then(() => {
      console.log('Saved state:', state);
    })
    .catch(err => {
      console.log(err);
    });
}

export function clear() {
  AsyncStorage.removeItem('state');
}
