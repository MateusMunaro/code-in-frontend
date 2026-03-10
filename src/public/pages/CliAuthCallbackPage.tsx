import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

type CallbackState =
  | { status: 'loading'; message: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const parseParams = (raw: string): URLSearchParams => {
  const value = raw.startsWith('#') || raw.startsWith('?') ? raw.slice(1) : raw;
  return new URLSearchParams(value);
};

export const CliAuthCallbackPage: React.FC = () => {
  const [state, setState] = useState<CallbackState>({
    status: 'loading',
    message: 'Processando login do CLI...',
  });

  useEffect(() => {
    let cancelled = false;

    const forwardTokenToCli = async () => {
      const query = new URLSearchParams(window.location.search);
      const fragment = parseParams(window.location.hash);
      const cliSession = query.get('cli_session');
      const cliPort = query.get('cli_port');
      const accessToken = fragment.get('access_token') ?? query.get('access_token');

      if (!cliSession && !cliPort) {
        if (!cancelled) {
          setState({ status: 'error', message: 'Sessão do CLI não informada no callback.' });
        }
        return;
      }

      if (!accessToken) {
        if (!cancelled) {
          setState({ status: 'error', message: 'Token OAuth não encontrado no callback.' });
        }
        return;
      }

      const refreshToken = fragment.get('refresh_token') ?? query.get('refresh_token') ?? '';
      const expiresIn = fragment.get('expires_in') ?? query.get('expires_in') ?? '3600';
      const tokenType = fragment.get('token_type') ?? query.get('token_type') ?? 'bearer';

      try {
        const endpoint = cliSession
          ? `${API_URL}/auth/cli/session/${cliSession}/complete`
          : `http://127.0.0.1:${cliPort}/token`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
            token_type: tokenType,
          }),
        });

        if (!response.ok) {
          throw new Error(`CLI respondeu com status ${response.status}`);
        }

        if (!cancelled) {
          setState({ status: 'success', message: 'Login do CLI concluído. Redirecionando...' });
        }

        window.history.replaceState({}, document.title, '/auth/cli/callback');
        window.setTimeout(() => {
          window.location.replace('/app');
        }, 1200);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao repassar token ao CLI.';
        if (!cancelled) {
          setState({ status: 'error', message });
        }
      }
    };

    void forwardTokenToCli();

    return () => {
      cancelled = true;
    };
  }, []);

  const accentClass = state.status === 'error' ? 'text-red-400 border-red-500/40' : 'text-emerald-300 border-emerald-500/30';

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6 font-mono">
      <div className={`max-w-xl w-full border bg-brand-dark/90 p-8 shadow-retro ${accentClass}`}>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Code-in CLI OAuth</p>
        <h1 className="text-2xl font-display mb-4">
          {state.status === 'error' ? 'Falha no callback do CLI' : 'Autenticando CLI'}
        </h1>
        <p className="text-sm text-gray-300 leading-6">{state.message}</p>
        <p className="text-xs text-gray-500 mt-6">Esta página pode ser fechada após a conclusão.</p>
      </div>
    </div>
  );
};
