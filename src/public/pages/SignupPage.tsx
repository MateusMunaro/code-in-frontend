import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Mail, Lock, User, ArrowRight, Check, Github } from 'lucide-react';
import { Button, Input, Alert } from '@shared/components/ui';
import { useAuthStore } from '@shared/stores';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGitHub, isLoading } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const result = await signup(email, password, fullName);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/app');
    }
  };

  const benefits = [
    'Análise ilimitada de repositórios',
    'Geração de .cursorrules automática',
    'Suporte a múltiplos modelos de IA',
    'Documentação arquitetural instantânea',
  ];

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-gradient-to-br from-brand-primary to-emerald-800 rounded-lg">
              <Terminal className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white">Code-in</span>
          </Link>

          {/* Card */}
          <div className="bg-brand-dark border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Criar sua conta</h1>
              <p className="text-gray-400">
                Comece a transformar suas IAs em Tech Leads
              </p>
            </div>

            {error && (
              <Alert variant="error" className="mb-6" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nome completo"
                type="text"
                placeholder="Seu nome"
                icon={User}
                iconPosition="left"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                hint="Opcional"
              />

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
                placeholder="Mínimo 6 caracteres"
                icon={Lock}
                iconPosition="left"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                icon={ArrowRight}
                isLoading={isLoading}
              >
                Criar conta grátis
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
              onClick={() => loginWithGitHub()}
              disabled={isLoading}
              className="flex items-center justify-center gap-3"
            >
              <Github className="w-5 h-5" />
              Continuar com GitHub
            </Button>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-400 text-sm">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-brand-primary font-medium hover:underline"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-brand-dark border-l border-white/5 p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Eleve o nível das suas IAs
          </h2>
          <p className="text-gray-400 mb-8">
            Junte-se a milhares de desenvolvedores que já transformaram seus
            assistentes de código em verdadeiros especialistas.
          </p>

          <ul className="space-y-4">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-300">
                <div className="p-1 rounded-full bg-brand-primary/20">
                  <Check className="w-4 h-4 text-brand-primary" />
                </div>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-300 italic">
              "O Code-in reduziu nosso tempo de onboarding de novas IAs de dias
              para minutos. Agora o Copilot realmente entende nossa arquitetura."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <span className="text-brand-primary font-bold">JM</span>
              </div>
              <div>
                <p className="text-white font-medium">João Mendes</p>
                <p className="text-gray-500 text-sm">Tech Lead @ StartupXYZ</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
