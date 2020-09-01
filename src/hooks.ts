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

export function useSelect<T>(
  initialValue: T[]
): [(value: T) => boolean, Set<T>, Set<T>, (value: T) => void] {
  const current = new Set<T>(initialValue);

  const [[added, removed], setSet] = React.useState<[Set<T>, Set<T>]>([
    new Set(),
    new Set()
  ]);

  // TODO: possible bug here with infinite rerenders
  // React.useEffect(() => {
  // setSet([new Set(), new Set()]);
  // }, [initialValue]);

  const has = (value: T) =>
    !removed.has(value) && (current.has(value) || added.has(value));

  const toggle = (value: T) => {
    setSet(([a, r]) => {
      if (has(value)) {
        if (current.has(value)) {
          r.add(value);
        }
        a.delete(value);
      } else {
        if (!current.has(value)) {
          a.add(value);
        }
        r.delete(value);
      }
      return [a, r];
    });
  };

  return [has, added, removed, toggle];
}
