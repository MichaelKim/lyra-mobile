import React from 'react';
import {
  useSelector as _useSelector,
  useDispatch as _useDispatch
} from 'react-redux';
import { Dispatch } from 'redux';
import MusicControl from 'react-native-music-control';

import { StoreState, Action } from './types';

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

export function useMediaControls(actionHandlers: { [key: string]: Function }) {
  Object.entries(actionHandlers).forEach(([eventName, handler]) => {
    React.useEffect(() => {
      // @ts-ignore
      MusicControl.on(eventName, handler);

      return () => {
        // @ts-ignore
        MusicControl.off(eventName);
      };
    }, [eventName, handler]);
  });
}
