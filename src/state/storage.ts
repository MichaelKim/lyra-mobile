import AsyncStorage from '@react-native-community/async-storage';

import { StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  yt: {
    url: 'https://lyra.michael.kim',
    api: true
  },
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
  playback: {
    shuffle: false,
    repeat: false
  },
  queue: {
    prev: [],
    curr: null,
    next: [],
    cache: {}
  },
  history: [],
  download: {
    queue: [],
    progress: 0
  }
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
