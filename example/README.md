# Tab State Manager Example

This is a demo project showcasing the [tab-state-manager](https://github.com/SujalShah3234/tab-state-manager) library. It demonstrates real-time state synchronization across multiple browser tabs using a simple counter example.

## Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm/yarn

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm start
```

3. Build the project:

```bash
pnpm run build
```

4. Pack the library:

```bash
pnpm pack
```

5. Install the packed library in the example project:

```bash
cd example
pnpm install ../tab-state-manager-0.1.0.tgz
pnpm install
```

6. Start the example project:

```bash
pnpm start
```

The build output will be in the `dist` directory.

## Project Structure

- `index.html` - Main HTML entry point
- `index.tsx` - React application entry point
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration

## Features Demonstrated

- Real-time state synchronization across tabs
- TypeScript integration
- React hooks usage with tab-state-manager
- Error handling
- Basic styling

## Technology Stack

- React
- TypeScript
- Parcel (bundler)
- tab-state-manager

## Notes

- The example uses the BroadcastChannel API, which is supported in all modern browsers
- Make sure to open the browser console to see additional logging information
- The state is only synced between tabs from the same origin (domain)