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
  Workflow,
  Globe,
  Key,
} from 'lucide-react';
import { Card, CardTitle, CardDescription, Badge } from '@shared/components/ui';
import { useTheme } from '@shared/contexts/ThemeContext';

const CLI_RELEASE_URL = 'https://github.com/MateusMunaro/code-in-cli/releases/tag/beta';

// ─── Step ───────────────────────────────────────────────────────────────────
interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
  delay?: number;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, children, delay = 0, isLast = false }) => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className="w-8 h-8 flex items-center justify-center border font-mono text-sm font-bold flex-shrink-0"
          style={{
            borderColor: colors.brand.primary,
            color: colors.brand.primary,
            backgroundColor: `${colors.brand.primary}1A`,
          }}
        >
          {number}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1 min-h-[16px]"
            style={{ backgroundColor: colors.border.subtle }}
          />
        )}
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

// ─── CodeBlock ───────────────────────────────────────────────────────────────
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

// ─── OS Tab ───────────────────────────────────────────────────────────────────
type OS = 'windows' | 'macos' | 'linux';

const OS_LABELS: Record<OS, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export const CliDownload: React.FC = () => {
  const { colors } = useTheme();
  const [activeOs, setActiveOs] = useState<OS>('windows');

  const features = [
    {
      icon: Zap,
      title: 'Análise Rápida',
      description: 'Indexação local em segundos. A análise pesada roda na nuvem, sem travar sua máquina.',
    },
    {
      icon: Shield,
      title: 'Seguro',
      description: 'Autenticação OAuth integrada com o CODE-IN. Token armazenado em keychain nativo.',
    },
    {
      icon: GitBranch,
      title: 'Git Integrado',
      description: 'Detecta automaticamente o repositório Git atual. Suporte a repos locais e remotos.',
    },
    {
      icon: Cpu,
      title: 'Leve & Nativo',
      description: 'Binário único sem dependências. Menos de 10 MB. Funciona offline para indexação.',
    },
    {
      icon: Workflow,
      title: 'CI/CD Ready',
      description: 'Flags headless para pipelines automatizados. Saída em JSON para integração fácil.',
    },
    {
      icon: Globe,
      title: 'Multi-plataforma',
      description: 'Binários nativos para Windows, macOS (Intel + Apple Silicon) e Linux x86_64.',
    },
  ];

  const commands = [
    { cmd: 'code-in login', desc: 'Autenticar via OAuth no navegador' },
    { cmd: 'code-in logout', desc: 'Remover credenciais locais' },
    { cmd: 'code-in analyze .', desc: 'Analisar repositório no diretório atual' },
    { cmd: 'code-in analyze <url>', desc: 'Analisar repositório remoto por URL' },
    { cmd: 'code-in analyze . --wait', desc: 'Aguardar análise e exibir resultado no terminal' },
    { cmd: 'code-in analyze . --model <id>', desc: 'Especificar modelo de IA para a análise' },
    { cmd: 'code-in analyze . --output json', desc: 'Saída em JSON (útil para CI/CD)' },
    { cmd: 'code-in jobs', desc: 'Listar análises recentes' },
    { cmd: 'code-in jobs <id>', desc: 'Ver status de uma análise específica' },
    { cmd: 'code-in --version', desc: 'Exibir versão instalada' },
    { cmd: 'code-in --help', desc: 'Exibir ajuda geral' },
  ];

  const installSteps: Record<OS, React.ReactNode> = {
    windows: (
      <>
        <Step number={1} title="Baixar o executável" delay={0.45}>
          <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
            Acesse a página de releases no GitHub e baixe o arquivo{' '}
            <code className="px-1.5 py-0.5 text-xs border" style={{ backgroundColor: colors.background.elevated, borderColor: colors.border.default, color: colors.brand.primary }}>
              code-in.exe
            </code>{' '}
            para Windows.
          </p>
          <a href={CLI_RELEASE_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono transition-colors duration-150"
            style={{ color: colors.brand.primary }}>
            <Download className="w-4 h-4" />
            Ir para a página de download
            <ChevronRight className="w-3 h-3" />
          </a>
        </Step>
        <Step number={2} title="Mover para um diretório acessível" delay={0.5}>
          <CodeBlock label="PowerShell">{`mkdir C:\\code-in
Move-Item .\\code-in.exe C:\\code-in\\`}</CodeBlock>
        </Step>
        <Step number={3} title="Adicionar ao PATH" delay={0.55}>
          <CodeBlock label="PowerShell (Admin)">{`[Environment]::SetEnvironmentVariable(
  "Path",
  $env:Path + ";C:\\code-in",
  "User"
)`}</CodeBlock>
          <p className="text-xs font-mono mt-2" style={{ color: colors.text.muted }}>
            * Reinicie o terminal após alterar o PATH.
          </p>
        </Step>
        <Step number={4} title="Autenticar" delay={0.6}>
          <CodeBlock label="Terminal">{`code-in login`}</CodeBlock>
          <p className="text-xs font-mono mt-2" style={{ color: colors.text.muted }}>
            Abre o navegador para autenticação OAuth.
          </p>
        </Step>
        <Step number={5} title="Verificar instalação" delay={0.65} isLast>
          <CodeBlock label="Terminal">{`code-in --version`}</CodeBlock>
        </Step>
      </>
    ),
    macos: (
      <>
        <Step number={1} title="Baixar o binário" delay={0.45}>
          <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
            Baixe o binário correto para sua arquitetura: <code className="px-1.5 py-0.5 text-xs border" style={{ backgroundColor: colors.background.elevated, borderColor: colors.border.default, color: colors.brand.primary }}>code-in-darwin-arm64</code> para Apple Silicon ou <code className="px-1.5 py-0.5 text-xs border" style={{ backgroundColor: colors.background.elevated, borderColor: colors.border.default, color: colors.brand.primary }}>code-in-darwin-x64</code> para Intel.
          </p>
          <CodeBlock label="Terminal">{`# Apple Silicon (M1/M2/M3)
curl -L ${CLI_RELEASE_URL.replace('/tag/beta', '/download/beta')}/code-in-darwin-arm64 -o code-in

# Intel
curl -L ${CLI_RELEASE_URL.replace('/tag/beta', '/download/beta')}/code-in-darwin-x64 -o code-in`}</CodeBlock>
        </Step>
        <Step number={2} title="Tornar executável e mover para PATH" delay={0.5}>
          <CodeBlock label="Terminal">{`chmod +x ./code-in
sudo mv ./code-in /usr/local/bin/code-in`}</CodeBlock>
        </Step>
        <Step number={3} title="Remover quarentena do Gatekeeper" delay={0.55}>
          <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
            Como o binário não é assinado pela Apple Store, é necessário remover a quarentena:
          </p>
          <CodeBlock label="Terminal">{`xattr -d com.apple.quarantine /usr/local/bin/code-in`}</CodeBlock>
        </Step>
        <Step number={4} title="Autenticar" delay={0.6}>
          <CodeBlock label="Terminal">{`code-in login`}</CodeBlock>
        </Step>
        <Step number={5} title="Verificar instalação" delay={0.65} isLast>
          <CodeBlock label="Terminal">{`code-in --version`}</CodeBlock>
        </Step>
      </>
    ),
    linux: (
      <>
        <Step number={1} title="Baixar o binário" delay={0.45}>
          <CodeBlock label="Bash">{`curl -L ${CLI_RELEASE_URL.replace('/tag/beta', '/download/beta')}/code-in-linux-x64 -o code-in`}</CodeBlock>
        </Step>
        <Step number={2} title="Tornar executável e instalar" delay={0.5}>
          <CodeBlock label="Bash">{`chmod +x ./code-in
sudo mv ./code-in /usr/local/bin/code-in`}</CodeBlock>
        </Step>
        <Step number={3} title="Verificar dependências" delay={0.55}>
          <p className="text-sm font-mono mb-3" style={{ color: colors.text.secondary }}>
            O binário é estático e não requer dependências externas. Para distros minimalistas:
          </p>
          <CodeBlock label="Bash">{`# Verificar se o binário funciona
file /usr/local/bin/code-in
ldd /usr/local/bin/code-in`}</CodeBlock>
        </Step>
        <Step number={4} title="Autenticar" delay={0.6}>
          <CodeBlock label="Bash">{`code-in login`}</CodeBlock>
          <p className="text-xs font-mono mt-2" style={{ color: colors.text.muted }}>
            Em ambientes sem GUI (servers), use: <code className="px-1 py-0.5 border" style={{ backgroundColor: colors.background.elevated, borderColor: colors.border.default, color: colors.brand.primary }}>code-in login --headless</code>
          </p>
        </Step>
        <Step number={5} title="Verificar instalação" delay={0.65} isLast>
          <CodeBlock label="Bash">{`code-in --version`}</CodeBlock>
        </Step>
      </>
    ),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border p-8"
        style={{ borderColor: colors.border.subtle, backgroundColor: colors.background.surface }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `repeating-linear-gradient(0deg, ${colors.brand.primary} 0px, ${colors.brand.primary} 1px, transparent 1px, transparent 20px)` }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 border"
              style={{ borderColor: colors.brand.primary, backgroundColor: `${colors.brand.primary}1A`, boxShadow: `0 0 20px ${colors.glow.primary}` }}
            >
              <Terminal className="w-8 h-8" style={{ color: colors.brand.primary }} />
            </div>
            <div>
              <h1 className="text-3xl font-display uppercase tracking-widest" style={{ color: colors.text.primary }}>
                CODE-IN <span style={{ color: colors.brand.primary }}>CLI</span>
              </h1>
              <p className="font-mono text-sm" style={{ color: colors.text.muted }}>
                v1.0.0-beta • Windows / macOS / Linux
              </p>
            </div>
          </div>
          <p className="font-mono text-sm mb-6 max-w-2xl leading-relaxed" style={{ color: colors.text.secondary }}>
            Interface de linha de comando do CODE-IN. Analise repositórios inteiros diretamente
            do terminal — local ou remoto — com toda a inteligência da plataforma.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={CLI_RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider border transition-all duration-150"
              style={{ backgroundColor: colors.brand.primary, borderColor: colors.brand.primary, color: colors.background.content }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.brand.primaryHover; e.currentTarget.style.boxShadow = `0 0 20px ${colors.glow.primary}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.brand.primary; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <Download className="w-4 h-4" />
              Download Beta
            </a>
            <a
              href={CLI_RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm uppercase tracking-wider border transition-all duration-150"
              style={{ borderColor: colors.border.default, color: colors.text.secondary, backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.brand.primary; e.currentTarget.style.color = colors.brand.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border.default; e.currentTarget.style.color = colors.text.secondary; }}
            >
              <ExternalLink className="w-4 h-4" />
              Ver no GitHub
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Features ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.07 }}
          >
            <Card variant="bordered" padding="md" className="h-full">
              <div className="flex items-start gap-3">
                <div
                  className="p-2 border flex-shrink-0"
                  style={{ borderColor: colors.brand.primary, backgroundColor: `${colors.brand.primary}0D` }}
                >
                  <feature.icon className="w-4 h-4" style={{ color: colors.brand.primary }} />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm uppercase tracking-wide mb-1" style={{ color: colors.text.primary }}>
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

      {/* ── System Requirements ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5" style={{ color: colors.brand.primary }} />
            <CardTitle>Requisitos do Sistema</CardTitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                os: 'Windows',
                version: 'Windows 10+',
                arch: 'x86_64',
                ram: '512 MB',
                disk: '~8 MB',
              },
              {
                os: 'macOS',
                version: 'macOS 11+',
                arch: 'Intel & Apple Silicon',
                ram: '512 MB',
                disk: '~8 MB',
              },
              {
                os: 'Linux',
                version: 'Kernel 3.17+',
                arch: 'x86_64 (glibc 2.17+)',
                ram: '512 MB',
                disk: '~8 MB',
              },
            ].map((req) => (
              <div
                key={req.os}
                className="p-4 border"
                style={{ borderColor: colors.border.default, backgroundColor: colors.background.content }}
              >
                <p
                  className="text-xs font-mono font-bold uppercase tracking-widest mb-3 pb-2"
                  style={{ color: colors.brand.primary, borderBottom: `1px solid ${colors.border.subtle}` }}
                >
                  {req.os}
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: colors.text.muted }}>Versão:</span>
                    <span style={{ color: colors.text.primary }}>{req.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.text.muted }}>Arq.:</span>
                    <span style={{ color: colors.text.primary }}>{req.arch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.text.muted }}>RAM:</span>
                    <span style={{ color: colors.text.primary }}>{req.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.text.muted }}>Disco:</span>
                    <span style={{ color: colors.text.primary }}>{req.disk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-4 p-3 font-mono text-xs"
            style={{ backgroundColor: `${colors.status.info}0D`, border: `1px solid ${colors.status.info}30`, color: colors.status.info }}
          >
            &gt; INFO: Conexão com a internet é necessária para enviar a análise ao servidor. A indexação local funciona offline.
          </div>
        </Card>
      </motion.div>

      {/* ── Installation Guide ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <Box className="w-5 h-5" style={{ color: colors.brand.primary }} />
            <CardTitle>Guia de Instalação</CardTitle>
          </div>
          <CardDescription className="mb-6">
            Siga os passos abaixo para instalar e configurar o CODE-IN CLI no seu sistema.
          </CardDescription>

          {/* OS Tabs */}
          <div
            className="flex mb-8 border-b"
            style={{ borderColor: colors.border.default }}
          >
            {(['windows', 'macos', 'linux'] as OS[]).map((os) => (
              <button
                key={os}
                onClick={() => setActiveOs(os)}
                className="px-5 py-2.5 font-mono text-xs uppercase tracking-widest font-bold transition-all relative"
                style={{
                  color: activeOs === os ? colors.brand.primary : colors.text.muted,
                  borderBottom: activeOs === os ? `2px solid ${colors.brand.primary}` : '2px solid transparent',
                  marginBottom: '-1px',
                  backgroundColor: 'transparent',
                }}
              >
                {OS_LABELS[os]}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {installSteps[activeOs]}
          </div>
        </Card>
      </motion.div>

      {/* ── Command Reference ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5" style={{ color: colors.brand.primary }} />
            <CardTitle>Referência de Comandos</CardTitle>
          </div>
          <CardDescription className="mb-6">
            Lista completa de comandos e flags disponíveis.
          </CardDescription>

          <div className="border overflow-hidden" style={{ borderColor: colors.border.default }}>
            <div
              className="grid grid-cols-2 text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-2"
              style={{ backgroundColor: colors.background.elevated, color: colors.text.muted, borderBottom: `1px solid ${colors.border.default}` }}
            >
              <span>Comando</span>
              <span>Descrição</span>
            </div>
            {commands.map((c, i) => (
              <div
                key={c.cmd}
                className="grid grid-cols-2 items-center px-4 py-2.5 font-mono text-xs"
                style={{
                  backgroundColor: i % 2 === 0 ? colors.background.content : colors.background.surface,
                  borderBottom: i < commands.length - 1 ? `1px solid ${colors.border.default}` : 'none',
                }}
              >
                <code style={{ color: colors.brand.primary }}>{c.cmd}</code>
                <span style={{ color: colors.text.secondary }}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* Quick examples */}
          <div className="mt-8 space-y-4">
            <h4 className="font-mono font-bold text-sm uppercase tracking-wide" style={{ color: colors.text.primary }}>
              Exemplos Rápidos
            </h4>
            <CodeBlock label="Analisar repositório local">{`cd /caminho/do/projeto
code-in analyze .`}</CodeBlock>
            <CodeBlock label="Repositório remoto + aguardar resultado">{`code-in analyze https://github.com/user/repo.git --wait`}</CodeBlock>
            <CodeBlock label="Especificar modelo e saída JSON">{`code-in analyze . --model gemini-2.5-pro --output json`}</CodeBlock>
          </div>
        </Card>
      </motion.div>

      {/* ── CI/CD Integration ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <Workflow className="w-5 h-5" style={{ color: colors.brand.primary }} />
            <CardTitle>Integração CI/CD</CardTitle>
          </div>
          <CardDescription className="mb-6">
            Use o CLI em pipelines automatizados para análise contínua de código.
          </CardDescription>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <h4 className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                  GitHub Actions
                </h4>
              </div>
              <CodeBlock label=".github/workflows/code-in.yml">{`name: Code-In Analysis

on:
  push:
    branches: [main]
  pull_request:

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Code-In CLI
        run: |
          curl -L https://github.com/MateusMunaro/code-in-cli/releases/download/beta/code-in-linux-x64 -o code-in
          chmod +x code-in
          sudo mv code-in /usr/local/bin/

      - name: Analyze repository
        env:
          CODE_IN_TOKEN: \${{ secrets.CODE_IN_TOKEN }}
        run: code-in analyze . --wait --output json > analysis.json

      - name: Upload analysis artifact
        uses: actions/upload-artifact@v4
        with:
          name: code-analysis
          path: analysis.json`}</CodeBlock>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <h4 className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                  Autenticação via Token (headless)
                </h4>
              </div>
              <p className="text-xs font-mono mb-3" style={{ color: colors.text.secondary }}>
                Em ambientes sem GUI, use a variável de ambiente <code className="px-1 py-0.5 border" style={{ backgroundColor: colors.background.elevated, borderColor: colors.border.default, color: colors.brand.primary }}>CODE_IN_TOKEN</code> ou a flag <code className="px-1 py-0.5 border" style={{ backgroundColor: colors.background.elevated, borderColor: colors.border.default, color: colors.brand.primary }}>--token</code>:
              </p>
              <CodeBlock label="Bash">{`# Via variável de ambiente
export CODE_IN_TOKEN="seu-token-aqui"
code-in analyze .

# Via flag
code-in analyze . --token "seu-token-aqui"`}</CodeBlock>
              <div
                className="mt-3 p-3 font-mono text-xs"
                style={{ backgroundColor: `${colors.status.warning}0D`, border: `1px solid ${colors.status.warning}30`, color: colors.status.warning }}
              >
                &gt; WARNING: Nunca exponha seu token em código-fonte. Use secrets do CI/CD.
              </div>
            </div>
          </div>

          {/* Token help */}
          <div
            className="mt-6 p-4 border flex items-start gap-3"
            style={{ borderColor: colors.border.subtle, backgroundColor: colors.background.content }}
          >
            <Key className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.brand.primary }} />
            <p className="text-xs font-mono" style={{ color: colors.text.secondary }}>
              Para gerar um token de API para CI/CD, acesse{' '}
              <strong style={{ color: colors.text.primary }}>Configurações → API Keys</strong>{' '}
              no painel do CODE-IN.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* ── Beta notice ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <div
          className="flex items-start gap-3 p-5 border"
          style={{ borderColor: colors.border.subtle, backgroundColor: `${colors.status.info}0D` }}
        >
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.status.info }} />
          <div>
            <p className="text-sm font-mono" style={{ color: colors.text.secondary }}>
              <strong style={{ color: colors.text.primary }}>Versão Beta:</strong> O CODE-IN CLI está
              em fase beta. Bugs e mudanças de API são esperados. Se encontrar algum problema, abra uma{' '}
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
            <div className="mt-2 flex gap-2">
              <Badge variant="primary" size="sm">BETA</Badge>
              <Badge variant="default" size="sm">v1.0.0</Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
