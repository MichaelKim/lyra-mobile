import React from 'react';
import {
  useSelector as _useSelector,
  useDispatch as _useDispatch
} from 'react-redux';
import { Dispatch } from 'redux';
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
