# Tab State Manager

A lightweight React library for synchronizing state across browser tabs in real-time.

[![NPM Version](https://img.shields.io/npm/v/tab-state-manager.svg)](https://www.npmjs.com/package/tab-state-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 Real-time state synchronization across browser tabs
- 🎯 Type-safe with full TypeScript support
- ⚡️ Optimized performance with automatic debouncing
- 🛡️ Built-in error boundary and error handling
- 📦 Lightweight (<10KB) with zero dependencies
- 🔌 Flexible hooks-based API

## Installation

```bash
npm install tab-state-manager
# or
yarn add tab-state-manager
```

## Quick Start

```tsx
import { TabStateProvider, useTabState } from 'tab-state-manager';

// Define your state type
interface AppState {
  count: number;
}

// Create your component
function Counter() {
  const { state, setState } = useTabState<AppState>();
  
  return (
    <button onClick={() => setState({ count: state.count + 1 })}>
      Count: {state.count}
    </button>
  );
}

// Wrap your app with the provider
function App() {
  return (
    <TabStateProvider
      options={{
        channelName: 'my-app',
        initialState: { count: 0 }
      }}
    >
      <Counter />
    </TabStateProvider>
  );
}
```

## Core Concepts

- **Tab Synchronization**: State changes are automatically synchronized across all open tabs
- **Leader Election**: One tab acts as the leader to manage state consistency
- **Error Handling**: Built-in error boundary and error reporting
- **Type Safety**: Full TypeScript support for type-safe state management

## API Reference

### TabStateProvider

```tsx
<TabStateProvider
  options={{
    channelName: string;          // Required: Unique channel identifier
    initialState: T;              // Required: Initial state
    debounceTime?: number;        // Optional: Debounce delay (default: 100ms)
    onError?: (error: Error) => void;    // Optional: Error handler
    onBecomeLeader?: () => void;         // Optional: Leader election callback
    onResignLeader?: () => void;         // Optional: Leader resignation callback
  }}
>
  {children}
</TabStateProvider>
```

### Hooks

#### useTabState
```tsx
const { state, setState, subscribe } = useTabState<T>();
```

#### useTabEffect
```tsx
useTabEffect<T>((state) => {
  // Effect logic
  return () => {
    // Cleanup logic
  };
}, [dependencies]);
```

#### useTabSync
```tsx
const value = useTabSync<T, K>(
  'propertyKey',
  (newValue) => {
    // Handle changes
  }
);
```

## Error Handling

```tsx
<TabStateErrorBoundary
  fallback={<ErrorComponent />}
  onError={(error, errorInfo) => {
    console.error(error);
  }}
>
  <YourComponent />
</TabStateErrorBoundary>
```

## Best Practices

1. **State Structure**
   - Keep state flat when possible
   - Use normalized data structures for complex state
   - Avoid storing derived state

2. **Performance**
   - Use appropriate debounce times for your use case
   - Implement selective synchronization with useTabSync
   - Monitor state size and update frequency

3. **Error Handling**
   - Always implement error boundaries
   - Provide fallback UI for error states
   - Log errors appropriately

## Browser Support

Supports all modern browsers that implement the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel).

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.
