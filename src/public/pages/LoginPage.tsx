import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Button, Input, Alert } from '@shared/components/ui';
import { useAuthStore } from '@shared/stores';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGitHub, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const cliSession = useMemo(() => new URLSearchParams(location.search).get('cli_session'), [location.search]);
  const cliCallbackUrl = useMemo(() => {
    if (!cliSession) {
      return undefined;
    }

    return `${window.location.origin}/auth/cli/callback?cli_session=${encodeURIComponent(cliSession)}`;
  }, [cliSession]);

  const completeCliLogin = async (accessToken: string, refreshToken: string, expiresIn?: number) => {
    if (!cliSession) {
      return;
    }

    const response = await fetch(`${API_URL}/auth/cli/session/${cliSession}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: String(expiresIn ?? 3600),
        token_type: 'bearer',
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha ao confirmar login do CLI: ${response.status}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      if (cliSession && result.session?.access_token) {
        try {
          await completeCliLogin(
            result.session.access_token,
            result.session.refresh_token,
            result.session.expires_in
          );
        } catch (cliError) {
          setError(cliError instanceof Error ? cliError.message : 'Falha ao confirmar login do CLI.');
          return;
        }
      }

      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-primary/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-gradient-to-br from-brand-primary to-cyan-900 rounded-lg">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white">Code-in</span>
        </Link>

        {/* Card */}
        <div className="bg-brand-dark border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400">
              {cliSession
                ? 'Entre para concluir a autenticação iniciada pelo CLI'
                : 'Entre na sua conta para continuar'}
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={Mail}
              iconPosition="left"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              iconPosition="left"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="rounded border-white/20 bg-brand-black" />
                Lembrar de mim
              </label>
              <a href="#" className="text-brand-primary hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              icon={ArrowRight}
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-brand-dark text-gray-500">ou continue com</span>
            </div>
          </div>

          {/* GitHub OAuth */}
          <Button
            type="button"
            variant="outline"
            fullWidth
            size="lg"
            onClick={() => loginWithGitHub(cliCallbackUrl)}
            disabled={isLoading}
            className="flex items-center justify-center gap-3"
          >
            <Github className="w-5 h-5" />
            {cliSession ? 'Continuar com GitHub para autorizar o CLI' : 'Continuar com GitHub'}
          </Button>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-brand-primary font-medium hover:underline">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Ao continuar, você concorda com nossos{' '}
          <a href="#" className="text-gray-400 hover:underline">Termos de Serviço</a>
          {' '}e{' '}
          <a href="#" className="text-gray-400 hover:underline">Política de Privacidade</a>
        </p>
      </motion.div>
    </div>
  );
};
