import { useEffect, useRef } from 'react';
import { useTabState } from '../context/TabStateContext';

export function useTabEffect<T>(
  effect: (state: T) => void | (() => void),
  deps: any[] = []
) {
  const { state, subscribe } = useTabState<T>();
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    let cleanup: void | (() => void);
    
    cleanup = effectRef.current(state);

    const unsubscribe = subscribe((newState) => {
      if (cleanup) cleanup();
      cleanup = effectRef.current(newState);
    });

    return () => {
      if (cleanup) cleanup();
      unsubscribe();
    };
  }, deps);
}
