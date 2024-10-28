import React from 'react';
import { useTabState } from '../context/TabStateContext';

interface WithTabStateProps<T> {
  tabState: T;
  setTabState: (update: Partial<T>) => void;
}

export function withTabState<T, P extends WithTabStateProps<T>>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithTabStateComponent(
    props: Omit<P, keyof WithTabStateProps<T>>
  ) {
    const { state, setState } = useTabState<T>();

    return (
      <WrappedComponent
        {...(props as P)}
        tabState={state}
        setTabState={setState}
      />
    );
  };
}
