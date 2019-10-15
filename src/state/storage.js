// @flow strict

// import fs from 'fs';

import type { StoreState } from '../types';

export const initialState: StoreState = {
  loaded: false,
  songs: {},
  playlists: {},
  volume: 100,
  sort: {
    column: 'TITLE',
    direction: false
  },
  shuffle: false,
  nextSong: null,
  dlQueue: [],
  dlProgress: 0,
  currScreen: null
};

export function save(state: StoreState) {
  // fs.writeFile('state.json', JSON.stringify(state), err => {
  //   if (err) console.log(err);
  //   else console.log('Stored state:', state);
  // });
}

export function clear() {
  // fs.writeFile('state.json', JSON.stringify(initialState), err => {
  //   if (err) console.log(err);
  //   else console.log('Cleared state');
  // });
}
