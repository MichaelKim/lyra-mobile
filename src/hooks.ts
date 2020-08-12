import React from 'react';
import {
  useDispatch as _useDispatch,
  useSelector as _useSelector
} from 'react-redux';
import { Dispatch } from 'redux';
import { Action, StoreState } from './types';

// Type wrappers for built-in hooks
export function useSelector<Selected>(
  selector: (state: StoreState) => Selected
): Selected {
  return _useSelector<StoreState, Selected>(selector);
}

export function useDispatch() {
  return _useDispatch<Dispatch<Action>>();
}

export function useToggle(defaultValue: boolean): [boolean, () => void] {
  const [value, setValue] = React.useState(defaultValue);

  return [value, () => setValue(!value)];
}

export function useCurrSong() {
  return useSelector(state => {
    const {
      songs,
      queue: { cache, curr }
    } = state;

    return curr != null ? songs[curr] ?? cache[curr]?.song : null;
  });
}
