import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { TabStateProvider, useTabState } from 'tab-state-manager';

interface AppState {
  count: number;
}

function Counter() {
  const { state, setState } = useTabState<AppState>();
  
  const incrementCount = () => {
    console.info('incrementCount', state);
    setState({ count: (state.count || 0) + 1 } as AppState);
  };
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Tab State Manager Demo</h1>
      <p>Open multiple tabs to see the state sync!</p>
      <button 
        onClick={incrementCount}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Count: {state.count}
      </button>
    </div>
  );
}

const App = () => {
  return (
    <TabStateProvider
      options={{
        channelName: 'example-app',
        initialState: { count: 0 },
        onError: (error) => console.error('Tab State Error:', error),
      }}
    >
      <Counter />
    </TabStateProvider>
  );
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
