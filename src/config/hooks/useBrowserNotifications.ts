import { useEffect, useRef } from 'react';
import { getWebSocketClient } from '@shared/lib/websocket';
import type { WSMessage } from '@shared/types';

const NOTIF_STORAGE_KEY = 'code-in:notification-prefs';

function isBrowserNotifEnabled(): boolean {
  try {
    const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (!stored) return false;
    return JSON.parse(stored)?.browser === true;
  } catch {
    return false;
  }
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
}

export function useBrowserNotifications() {
  const wsClient = useRef(getWebSocketClient());

  useEffect(() => {
    const client = wsClient.current;

    const handleMessage = (message: WSMessage) => {
      if (!isBrowserNotifEnabled()) return;
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      if (message.type === 'complete') {
        const success = message.data.success;
        const jobId = message.job_id;

        new Notification(success ? 'CODE-IN: Análise concluída' : 'CODE-IN: Análise falhou', {
          body: success
            ? `Job ${jobId} finalizado com sucesso. Clique para ver o resultado.`
            : `Job ${jobId} encontrou um erro. Clique para ver os detalhes.`,
          icon: '/favicon.ico',
          tag: `codein-job-${jobId}`,
        });
      }
    };

    const unsubscribe = client.onMessage(handleMessage);
    client.connect();

    return () => {
      unsubscribe();
    };
  }, []);
}
