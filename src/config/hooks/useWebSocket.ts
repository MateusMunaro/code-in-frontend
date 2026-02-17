import { useEffect, useCallback, useRef, useState } from 'react';
import { getWebSocketClient } from '@shared/lib/websocket';
import type { WSMessage, JobStatus } from '@shared/types';

interface JobUpdate {
  status: JobStatus;
  message?: string;
  progress?: number;
  success?: boolean;
  result?: Record<string, unknown>;
  error?: string;
}

export function useWebSocket(jobId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<JobUpdate | null>(null);
  const wsClient = useRef(getWebSocketClient());

  const handleMessage = useCallback(
    (message: WSMessage) => {
      if (message.type === 'status' && message.job_id === jobId) {
        setLastUpdate({
          status: message.data.status,
          message: message.data.message,
          progress: message.data.progress,
        });
      } else if (message.type === 'complete' && message.job_id === jobId) {
        setLastUpdate({
          status: message.data.success ? 'completed' : 'failed',
          success: message.data.success,
          result: message.data.result,
          error: message.data.error,
        });
      }
    },
    [jobId]
  );

  useEffect(() => {
    const client = wsClient.current;

    // Set up listeners
    const unsubscribeMessage = client.onMessage(handleMessage);
    const unsubscribeConnect = client.onConnect(() => setIsConnected(true));
    const unsubscribeDisconnect = client.onDisconnect(() => setIsConnected(false));

    // Connect and subscribe
    client.connect();
    if (jobId) {
      client.subscribe(jobId);
    }

    return () => {
      unsubscribeMessage();
      unsubscribeConnect();
      unsubscribeDisconnect();
      if (jobId) {
        client.unsubscribe(jobId);
      }
    };
  }, [jobId, handleMessage]);

  const subscribe = useCallback((id: string) => {
    wsClient.current.subscribe(id);
  }, []);

  const unsubscribe = useCallback((id: string) => {
    wsClient.current.unsubscribe(id);
  }, []);

  return {
    isConnected,
    lastUpdate,
    subscribe,
    unsubscribe,
  };
}

export function useJobUpdates(
  jobIds: string[],
  onUpdate: (jobId: string, update: JobUpdate) => void
) {
  const wsClient = useRef(getWebSocketClient());

  useEffect(() => {
    const client = wsClient.current;

    const handleMessage = (message: WSMessage) => {
      if (message.type === 'status') {
        onUpdate(message.job_id, {
          status: message.data.status,
          message: message.data.message,
          progress: message.data.progress,
        });
      } else if (message.type === 'complete') {
        onUpdate(message.job_id, {
          status: message.data.success ? 'completed' : 'failed',
          success: message.data.success,
          result: message.data.result,
          error: message.data.error,
        });
      }
    };

    const unsubscribe = client.onMessage(handleMessage);
    client.connect();

    // Subscribe to all jobs
    jobIds.forEach((id) => client.subscribe(id));

    return () => {
      unsubscribe();
      jobIds.forEach((id) => client.unsubscribe(id));
    };
  }, [jobIds, onUpdate]);
}
