export interface StateManagerOptions<T> {
  channelName: string;
  initialState: T;
  debounceTime?: number;
  onError?: (error: Error) => void;
  onBecomeLeader?: () => void;
  onResignLeader?: () => void;
}

export interface TabState<T> {
  data: T;
  version: number;
  isLeader: boolean;
  tabId: string;
  lastHeartbeat?: number;
}

export type BroadcastMessage<T> = {
  sourceTabId: string;
  timestamp: number;
} & (
  | {
      type: 'STATE_UPDATE';
      payload: Partial<T>;
      version: number;
    }
  | {
      type: 'HEARTBEAT';
      isLeader: boolean;
    }
  | {
      type: 'LEADER_ELECTION';
      tabId: string;
      lastHeartbeat: number;
    }
);

export const DEFAULT_CONFIG = {
  DEBOUNCE_TIME: 100,
  HEARTBEAT_INTERVAL: 1000,
  LEADER_TIMEOUT: 3000,
} as const;
