import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Download,
  ExternalLink,
  Copy,
  Check,
  Monitor,
  Cpu,
  Shield,
  Zap,
  ChevronRight,
  Box,
  FileCode,
  GitBranch,
} from 'lucide-react';
import { Card, CardTitle, CardDescription, Badge } from '@shared/components/ui';
import { useTheme } from '@shared/contexts/ThemeContext';

const CLI_RELEASE_URL = 'https://github.com/MateusMunaro/code-in-cli/releases/tag/beta';

interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

const Step: React.FC<StepProps> = ({ number, title, children, delay = 0 }) => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0">
        <div
          className="w-8 h-8 flex items-center justify-center border font-mono text-sm font-bold"
          style={{
            borderColor: colors.brand.primary,
            color: colors.brand.primary,
            backgroundColor: `${colors.brand.primary}1A`,
          }}
        >
          {number}
        </div>
        <div
          className="w-px h-full mx-auto mt-1"
          style={{ backgroundColor: colors.border.subtle }}
        />
      </div>
      <div className="pb-6 flex-1">
        <h4
          className="font-mono font-bold text-sm uppercase tracking-wide mb-2"
          style={{ color: colors.text.primary }}
        >
          {title}
        </h4>
        {children}
      </div>
    </motion.div>
  );
};

interface CodeBlockProps {
  children: string;
  label?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, label }) => {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {label && (
        <div
          className="text-xs font-mono uppercase tracking-wider px-3 py-1 border border-b-0 inline-block"
          style={{
            color: colors.text.muted,
            borderColor: colors.border.default,
            backgroundColor: colors.background.elevated,
          }}
        >
          {label}
        </div>
      )}
      <div
        className="relative border p-4 font-mono text-sm overflow-x-auto"
        style={{
          backgroundColor: colors.background.content,
          borderColor: colors.border.default,
          color: colors.brand.primary,
        }}
      >
        <pre className="whitespace-pre-wrap break-all">{children}</pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 border transition-all duration-150 opacity-0 group-hover:opacity-100"
          style={{
            borderColor: colors.border.default,
            backgroundColor: colors.background.elevated,
            color: copied ? colors.status.success : colors.text.muted,
          }}
          title="Copiar comando"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export const CliDownload: React.FC = () => {
  const { colors } = useTheme();

  const features = [
    {
      icon: Zap,
      title: 'Análise Rápida',
      description: 'Analise repositórios inteiros em minutos diretamente do terminal.',
    },
    {
      icon: Shield,
      title: 'Seguro',
      description: 'Autenticação integrada com o CODE-IN. Seus dados ficam protegidos.',
    },
    {
      icon: GitBranch,
      title: 'Git Integrado',
      description: 'Suporte nativo a repositórios Git locais e remotos.',
    },
    {
      icon: Cpu,
      title: 'Leve & Nativo',
      description: 'Construído em C para máxima performance. Sem dependências pesadas.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border p-8"
        style={{
          borderColor: colors.border.subtle,
          backgroundColor: colors.background.surface,
        }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${colors.brand.primary} 0px, ${colors.brand.primary} 1px, transparent 1px, transparent 20px)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 border"
              style={{
                borderColor: colors.brand.primary,
                backgroundColor: `${colors.brand.primary}1A`,
                boxShadow: `0 0 20px ${colors.glow.primary}`,
              }}
            >
              <Terminal className="w-8 h-8" style={{ color: colors.brand.primary }} />
            </div>
            <div>
              <h1
                className="text-3xl font-display uppercase tracking-widest"
                style={{ color: colors.text.primary }}
              >
                CODE-IN{' '}
                <span style={{ color: colors.brand.primary }}>CLI</span>
              </h1>
              <p className="font-mono text-sm" style={{ color: colors.text.muted }}>
                v1.0.0-beta • Ferramenta de Linha de Comando
              </p>
            </div>
          </div>

          <p
            className="font-mono text-sm mb-6 max-w-2xl leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            A interface de linha de comando do CODE-IN permite que você analise repositórios de código
            diretamente do seu terminal. Rápido, leve e integrado com toda a inteligência da
            plataforma.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={CLI_RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider border transition-all duration-150"
              style={{
                backgroundColor: colors.brand.primary,
                borderColor: colors.brand.primary,
                color: colors.background.content,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.brand.primaryHover;
                e.currentTarget.style.boxShadow = `0 0 20px ${colors.glow.primary}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.brand.primary;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Download className="w-4 h-4" />
              Download Beta
            </a>
            <a
              href={CLI_RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-wider border transition-all duration-150"
              style={{
                borderColor: colors.border.default,
                color: colors.text.secondary,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.brand.primary;
                e.currentTarget.style.color = colors.brand.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border.default;
                e.currentTarget.style.color = colors.text.secondary;
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Ver no GitHub
            </a>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
          >
            <Card variant="bordered" padding="md" className="h-full">
              <div className="flex items-start gap-3">
                <div
                  className="p-2 border flex-shrink-0"
                  style={{
                    borderColor: colors.brand.primary,
                    backgroundColor: `${colors.brand.primary}0D`,
                  }}
                >
                  <feature.icon className="w-4 h-4" style={{ color: colors.brand.primary }} />
                </div>
                <div>
                  <h3
                    className="font-mono font-bold text-sm uppercase tracking-wide mb-1"
                    style={{ color: colors.text.primary }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: colors.text.muted }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* System Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5" style={{ color: colors.brand.primary }} />
            <CardTitle>Requisitos do Sistema</CardTitle>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Sistema Operacional',
                value: 'Windows 10+',
                detail: 'x86_64',
              },
              {
                label: 'Memória RAM',
                value: '512 MB',
                detail: 'mínimo',
              },
              {
                label: 'Disco',
                value: '~5 MB',
                detail: 'espaço livre',
              },
            ].map((req) => (
              <div
                key={req.label}
                className="p-4 border"
                style={{
                  borderColor: colors.border.default,
                  backgroundColor: colors.background.content,
                }}
              >
                <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: colors.text.muted }}>
                  {req.label}
                </p>
                <p className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                  {req.value}
                </p>
                <p className="text-xs font-mono" style={{ color: colors.text.muted }}>
                  {req.detail}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Installation Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <Box className="w-5 h-5" style={{ color: colors.brand.primary }} />
            <CardTitle>Guia de Instalação</CardTitle>
          </div>
          <CardDescription className="mb-8">
            Siga os passos abaixo para instalar e configurar o CODE-IN CLI no seu sistema.
          </CardDescription>

          <div className="space-y-2">
            <Step number={1} title="Baixar o executável" delay={0.45}>
              <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
                Acesse a página de releases no GitHub e baixe o arquivo{' '}
                <code
                  className="px-1.5 py-0.5 text-xs border"
                  style={{
                    backgroundColor: colors.background.elevated,
                    borderColor: colors.border.default,
                    color: colors.brand.primary,
                  }}
                >
                  code-in.exe
                </code>{' '}
                para Windows.
              </p>
              <a
                href={CLI_RELEASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-mono transition-colors duration-150"
                style={{ color: colors.brand.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.brand.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.brand.primary;
                }}
              >
                <Download className="w-4 h-4" />
                Ir para a página de download
                <ChevronRight className="w-3 h-3" />
              </a>
            </Step>

            <Step number={2} title="Mover para um diretório acessível" delay={0.5}>
              <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
                Mova o executável baixado para um diretório que esteja no seu{' '}
                <code
                  className="px-1.5 py-0.5 text-xs border"
                  style={{
                    backgroundColor: colors.background.elevated,
                    borderColor: colors.border.default,
                    color: colors.brand.primary,
                  }}
                >
                  PATH
                </code>{' '}
                do sistema, ou crie um diretório dedicado:
              </p>
              <CodeBlock label="PowerShell">{`# Criar diretório para o CLI
mkdir C:\\code-in

# Mover o executável
Move-Item .\\code-in.exe C:\\code-in\\`}</CodeBlock>
            </Step>

            <Step number={3} title="Adicionar ao PATH (opcional)" delay={0.55}>
              <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
                Para executar o{' '}
                <code
                  className="px-1.5 py-0.5 text-xs border"
                  style={{
                    backgroundColor: colors.background.elevated,
                    borderColor: colors.border.default,
                    color: colors.brand.primary,
                  }}
                >
                  code-in
                </code>{' '}
                de qualquer lugar, adicione o diretório ao PATH do sistema:
              </p>
              <CodeBlock label="PowerShell (Admin)">{`# Adicionar o diretório ao PATH do usuário
[Environment]::SetEnvironmentVariable(
  "Path",
  $env:Path + ";C:\\code-in",
  "User"
)`}</CodeBlock>
              <p className="text-xs font-mono mt-2" style={{ color: colors.text.muted }}>
                * Reinicie o terminal após alterar o PATH.
              </p>
            </Step>

            <Step number={4} title="Autenticar com sua conta" delay={0.6}>
              <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
                Faça login com a mesma conta que você usa no CODE-IN web:
              </p>
              <CodeBlock label="Terminal">{`code-in login`}</CodeBlock>
              <p className="text-xs font-mono mt-2" style={{ color: colors.text.muted }}>
                Isso vai abrir o navegador para autenticação OAuth.
              </p>
            </Step>

            <Step number={5} title="Verificar instalação" delay={0.65}>
              <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
                Verifique se tudo está configurado corretamente:
              </p>
              <CodeBlock label="Terminal">{`code-in --version`}</CodeBlock>
            </Step>
          </div>
        </Card>
      </motion.div>

      {/* Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5" style={{ color: colors.brand.primary }} />
            <CardTitle>Como Usar</CardTitle>
          </div>
          <CardDescription className="mb-8">
            Comandos essenciais para começar a analisar seu código.
          </CardDescription>

          <div className="space-y-6">
            {/* Analyze command */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <h4 className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                  Analisar um repositório local
                </h4>
              </div>
              <CodeBlock label="Terminal">{`# Navegar até o repositório
cd /caminho/do/seu/projeto

# Executar análise
code-in analyze .`}</CodeBlock>
            </div>

            {/* Analyze with wait */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <h4 className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                  Analisar e aguardar resultado
                </h4>
              </div>
              <CodeBlock label="Terminal">{`# Esperar a análise terminar e mostrar resultado no terminal
code-in analyze . --wait`}</CodeBlock>
              <p className="text-xs font-mono mt-2" style={{ color: colors.text.muted }}>
                A flag{' '}
                <code
                  className="px-1 py-0.5 border"
                  style={{
                    backgroundColor: colors.background.elevated,
                    borderColor: colors.border.default,
                    color: colors.brand.primary,
                  }}
                >
                  --wait
                </code>{' '}
                faz o CLI fazer polling até a análise finalizar.
              </p>
            </div>

            {/* Remote repo */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <h4 className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                  Analisar um repositório remoto
                </h4>
              </div>
              <CodeBlock label="Terminal">{`code-in analyze https://github.com/user/repo.git`}</CodeBlock>
            </div>

            {/* Help */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <h4 className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                  Ver todos os comandos
                </h4>
              </div>
              <CodeBlock label="Terminal">{`code-in --help`}</CodeBlock>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Support / Footer Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div
          className="flex items-start gap-3 p-5 border"
          style={{
            borderColor: colors.border.subtle,
            backgroundColor: `${colors.status.info}0D`,
          }}
        >
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.status.info }} />
          <div>
            <p className="text-sm font-mono" style={{ color: colors.text.secondary }}>
              <strong style={{ color: colors.text.primary }}>Versão Beta:</strong> O CODE-IN CLI está
              em fase beta. Se encontrar algum problema, abra uma{' '}
              <a
                href="https://github.com/MateusMunaro/code-in-cli/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors duration-150"
                style={{ color: colors.brand.primary }}
              >
                issue no GitHub
              </a>
              .
            </p>
            <div className="mt-2">
              <Badge variant="primary" size="sm">
                BETA
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
