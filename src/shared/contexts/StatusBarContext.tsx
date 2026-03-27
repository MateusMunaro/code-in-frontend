import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface StatusBarState {
  agentStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  speed: string;
  tokenUsage: string;
  branch: string;
  encoding: string;
  alerts: number;
}

interface StatusBarContextType {
  statusBar: StatusBarState;
  isNetworkOnline: boolean;
  currentTime: string;
  setStatusBar: (value: Partial<StatusBarState>) => void;
  resetStatusBar: () => void;
}

const defaultStatusBarState: StatusBarState = {
  agentStatus: 'ONLINE',
  speed: '12.4 FILE/S',
  tokenUsage: '1.2K TOKENS',
  branch: 'main',
  encoding: 'UTF-8',
  alerts: 2,
};

const StatusBarContext = createContext<StatusBarContextType | undefined>(undefined);

const formatCurrentTime = () =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

interface StatusBarProviderProps {
  children: React.ReactNode;
}

export const StatusBarProvider: React.FC<StatusBarProviderProps> = ({ children }) => {
  const [statusBar, setStatusBarState] = useState<StatusBarState>(defaultStatusBarState);
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(navigator.onLine);
  const [currentTime, setCurrentTime] = useState<string>(formatCurrentTime);

  useEffect(() => {
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const setStatusBar = useCallback((value: Partial<StatusBarState>) => {
    setStatusBarState((prev) => ({ ...prev, ...value }));
  }, []);

  const resetStatusBar = useCallback(() => {
    setStatusBarState(defaultStatusBarState);
  }, []);

  const value = useMemo(
    () => ({ statusBar, isNetworkOnline, currentTime, setStatusBar, resetStatusBar }),
    [statusBar, isNetworkOnline, currentTime, setStatusBar, resetStatusBar]
  );

  return <StatusBarContext.Provider value={value}>{children}</StatusBarContext.Provider>;
};

export function useStatusBar(): StatusBarContextType {
  const context = useContext(StatusBarContext);
  if (!context) {
    throw new Error('useStatusBar must be used within a StatusBarProvider');
  }
  return context;
}
