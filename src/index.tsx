import React, { createContext, useContext, ReactNode } from 'react';
import { useTabStateManager } from './hooks/useTabStateManager';
import type { StateManagerOptions } from './types';

interface TabStateContextValue<T> {
  state: T;
  setState: (update: Partial<T>) => void;
  subscribe: (callback: (state: T) => void) => () => void;
}

const TabStateContext = createContext<TabStateContextValue<any> | null>(null);

interface TabStateProviderProps<T extends Record<string, any>> {
  children: ReactNode;
  options: StateManagerOptions<T>;
}

export function TabStateProvider<T extends Record<string, any>>({ 
  children, 
  options 
}: TabStateProviderProps<T>) {
  const { getState, setState, subscribe } = useTabStateManager<T>(options);

  const value = {
    state: getState(),
    setState,
    subscribe,
  };

  return (
    <TabStateContext.Provider value={value}>
      {children}
    </TabStateContext.Provider>
  );
}

export function useTabState<T>() {
  const context = useContext(TabStateContext);
  if (!context) {
    throw new Error('useTabState must be used within a TabStateProvider');
  }
  return context as TabStateContextValue<T>;
}
