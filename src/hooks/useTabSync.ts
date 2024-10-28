import { useEffect, useRef } from 'react';
import { useTabState } from '../context/TabStateContext';

export function useTabSync<T, K extends keyof T>(
  key: K,
  onChange?: (value: T[K]) => void
) {
  const { state, subscribe } = useTabState<T>();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const unsubscribe = subscribe((newState) => {
      if (onChangeRef.current) {
        onChangeRef.current(newState[key]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [key, subscribe]);

  return state[key];
}
