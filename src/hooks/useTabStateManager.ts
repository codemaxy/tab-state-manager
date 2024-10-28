import { useRef, useCallback, useEffect } from 'react';
import { generateTabId } from '../utils';
import { debounce } from '../debounce';
import type { StateManagerOptions, BroadcastMessage, TabState } from '../types';
import { DEFAULT_CONFIG } from '../types';

export function useTabStateManager<T extends Record<string, any>>(
  options: StateManagerOptions<T>
) {
  // Refs for persistent values
  const channelRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef<TabState<T>>({
    data: options.initialState,
    version: 0,
    isLeader: false,
    tabId: generateTabId(),
  });
  const subscribersRef = useRef(new Set<(state: T) => void>());
  const cleanupRef = useRef(new Set<() => void>());
  const lastLeaderHeartbeatRef = useRef<number>(0);

  // Error handling
  const handleError = useCallback((error: Error) => {
    options.onError?.(error);
  }, [options]);

  // Notify subscribers
  const notifySubscribers = useCallback(() => {
    subscribersRef.current.forEach(callback => callback(stateRef.current.data));
  }, []);

  // Leader election
  const initiateLeaderElection = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'LEADER_ELECTION',
        tabId: stateRef.current.tabId,
        timestamp: Date.now(),
        lastHeartbeat: Date.now(),
      });
    }
  }, []);

  const becomeLeader = useCallback(() => {
    if (!stateRef.current.isLeader) {
      stateRef.current = {
        ...stateRef.current,
        isLeader: true as const
      };
      options.onBecomeLeader?.();
    }
  }, [options]);

  // Message handling
  const handleMessage = useCallback((event: MessageEvent<BroadcastMessage<T>>) => {
    const message = event.data;
    if (message.sourceTabId === stateRef.current.tabId) return;

    try {
      switch (message.type) {
        case 'STATE_UPDATE':
          if (message.version > stateRef.current.version) {
            stateRef.current = {
              ...stateRef.current,
              version: message.version,
              data: { ...stateRef.current.data, ...message.payload },
            };
            notifySubscribers();
          }
          break;

        case 'HEARTBEAT':
          if (message.isLeader) {
            lastLeaderHeartbeatRef.current = message.timestamp;
            if (stateRef.current.isLeader) {
              stateRef.current.isLeader = false;
              options.onResignLeader?.();
            }
          }
          break;

        case 'LEADER_ELECTION':
          if (stateRef.current.isLeader) {
            channelRef.current?.postMessage({
              type: 'HEARTBEAT',
              timestamp: Date.now(),
              sourceTabId: stateRef.current.tabId,
              isLeader: true,
            });
          } else if (message.tabId < stateRef.current.tabId) {
            // Let tab with lower ID become leader
            return;
          } else {
            becomeLeader();
          }
          break;
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError, notifySubscribers, options, becomeLeader]);

  // State updates
  const setState = useCallback((update: Partial<T>) => {
    try {
      stateRef.current = {
        ...stateRef.current,
        version: stateRef.current.version + 1,
        data: { ...stateRef.current.data, ...update },
      };

      channelRef.current?.postMessage({
        type: 'STATE_UPDATE',
        payload: update,
        version: stateRef.current.version,
        timestamp: Date.now(),
        sourceTabId: stateRef.current.tabId,
      });

      notifySubscribers();
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError, notifySubscribers]);

  const debouncedSetState = useCallback(
    debounce(setState, options.debounceTime ?? DEFAULT_CONFIG.DEBOUNCE_TIME),
    [setState, options.debounceTime]
  );

  // Subscription management
  const subscribe = useCallback((callback: (state: T) => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  // Initialize channel and cleanup
  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel(options.channelName);
      channelRef.current.addEventListener('message', handleMessage);

      // Initial leader election
      initiateLeaderElection();

      // Heartbeat interval
      const heartbeatInterval = setInterval(() => {
        if (stateRef.current.isLeader) {
          channelRef.current?.postMessage({
            type: 'HEARTBEAT',
            timestamp: Date.now(),
            sourceTabId: stateRef.current.tabId,
            isLeader: true,
          });
        }
      }, DEFAULT_CONFIG.HEARTBEAT_INTERVAL);

      cleanupRef.current.add(() => clearInterval(heartbeatInterval));

      // Leader check interval
      const leaderCheckInterval = setInterval(() => {
        const now = Date.now();
        if (!stateRef.current.isLeader && 
            now - lastLeaderHeartbeatRef.current > DEFAULT_CONFIG.LEADER_TIMEOUT) {
          initiateLeaderElection();
        }
      }, DEFAULT_CONFIG.LEADER_TIMEOUT);

      cleanupRef.current.add(() => clearInterval(leaderCheckInterval));

      return () => {
        cleanupRef.current.forEach(cleanup => cleanup());
        cleanupRef.current.clear();
        channelRef.current?.close();
      };
    } catch (error) {
      handleError(error as Error);
      return undefined;
    }
  }, [options.channelName, handleMessage, handleError, initiateLeaderElection]);

  return {
    getState: useCallback(() => stateRef.current.data, []),
    setState: debouncedSetState,
    subscribe,
  };
}
