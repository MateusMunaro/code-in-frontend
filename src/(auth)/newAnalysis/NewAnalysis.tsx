import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, ArrowRight, ArrowLeft, AlertCircle, Terminal, GitFork, Check, Loader2 } from 'lucide-react';
import { Card, CardTitle, CardDescription, Button, Alert } from '@shared/components/ui';
import { ModelSelector } from '@components/models';
import { useModels, useCreateJob, useCreateConflictAnalysis, useFetchBranches } from '@config/hooks';
import { useTheme } from '@shared/contexts';
import type { ServiceSelection } from '@shared/types';
import type { ThemeColors } from '@/styles/colors';

// ─── Step Labels ────────────────────────────────────────────────────────────
const STEP_LABELS = ['Repositório', 'Serviços', 'Branches', 'Modelo'];

// ─── Step Indicator ─────────────────────────────────────────────────────────
const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  labels: string[];
  colors: ThemeColors;
}> = ({ currentStep, totalSteps, labels, colors }) => (
  <div
    className="flex items-center gap-2 text-[12px] font-mono tracking-widest uppercase mb-8"
    style={{ color: colors.text.muted }}
  >
    {labels.slice(0, totalSteps).map((label, idx) => (
      <React.Fragment key={label}>
        <span
          style={{
            color:
              idx + 1 === currentStep
                ? colors.brand.primary
                : idx + 1 < currentStep
                  ? colors.text.primary
                  : colors.text.muted,
            fontWeight: idx + 1 === currentStep ? 'bold' : 'normal',
          }}
        >
          Step {String(idx + 1).padStart(2, '0')}: {label}
        </span>
        {idx < totalSteps - 1 && (
          <span
            style={{
              color: idx + 1 < currentStep ? colors.brand.primary : colors.border.default,
            }}
          >
            &gt;&gt;
          </span>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Service Card ───────────────────────────────────────────────────────────
interface ServiceCardProps {
  title: string;
  modeLabel: string;
  icon: React.ReactNode;
  features: string[];
  statLabel: string;
  statValue: string;
  statProgress: number;
  isSelected: boolean;
  onToggle: () => void;
  colors: ThemeColors;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  modeLabel,
  icon,
  features,
  statLabel,
  statValue,
  statProgress,
  isSelected,
  onToggle,
  colors,
}) => (
  <div
    onClick={onToggle}
    className="group relative p-8 transition-all duration-100 cursor-pointer"
    style={{
      backgroundColor: colors.background.surface,
      border: `2px solid ${isSelected ? colors.brand.primary : colors.border.default}`,
      boxShadow: isSelected ? `4px 4px 0px 0px ${colors.brand.primary}` : 'none',
    }}
  >
    {/* Mode Label */}
    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100">
      <span
        className="text-[10px] font-bold font-mono"
        style={{ color: colors.brand.primary }}
      >
        {modeLabel}
      </span>
    </div>

    {/* Header */}
    <div className="flex items-center gap-4 mb-8">
      <div
        className="w-12 h-12 flex items-center justify-center"
        style={{
          backgroundColor: colors.background.content,
          border: `1px solid ${isSelected ? colors.brand.primary : colors.border.default}`,
          color: isSelected ? colors.brand.primary : colors.text.muted,
        }}
      >
        {icon}
      </div>
      <div
        className="font-display text-2xl tracking-tight uppercase"
        style={{ color: colors.text.primary }}
      >
        {title}
      </div>
    </div>

    {/* Features */}
    <div className="font-mono text-sm space-y-4 mb-10" style={{ color: colors.text.secondary }}>
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <span className="font-bold" style={{ color: colors.brand.primary }}>
            &gt;
          </span>
          <span>{feature}</span>
        </div>
      ))}
    </div>

    {/* Stats Bar */}
    <div
      className="p-4 font-mono text-[11px] mb-8"
      style={{
        backgroundColor: colors.background.content,
        border: `1px solid ${colors.border.subtle}`,
        color: colors.text.muted,
      }}
    >
      <div className="flex justify-between mb-1">
        <span>{statLabel}</span>
        <span style={{ color: colors.brand.primary }}>{statValue}</span>
      </div>
      <div className="w-full h-1.5" style={{ backgroundColor: colors.border.default }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${statProgress}%`, backgroundColor: colors.brand.primary }}
        />
      </div>
    </div>

    {/* Selection Button */}
    <button
      className="w-full py-4 font-mono font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3"
      style={{
        backgroundColor: isSelected ? colors.brand.primary : 'transparent',
        border: `2px solid ${isSelected ? colors.brand.primary : colors.border.emphasis}`,
        color: isSelected ? colors.background.content : colors.brand.primary,
        opacity: isSelected ? 1 : 0.7,
      }}
    >
      <span>{isSelected ? '[✓]' : '[ ]'}</span>
      {isSelected ? 'SELECIONADO' : 'SELECIONAR'}
    </button>
  </div>
);

// ─── Branch Item ────────────────────────────────────────────────────────────
interface BranchItemProps {
  name: string;
  isSelected: boolean;
  onToggle: () => void;
  colors: ThemeColors;
}

const BranchItem: React.FC<BranchItemProps> = ({ name, isSelected, onToggle, colors }) => (
  <div
    onClick={onToggle}
    className="flex items-center p-4 cursor-pointer transition-colors"
    style={{
      backgroundColor: colors.background.content,
      border: `1px solid ${isSelected ? colors.brand.primary : colors.border.default}`,
    }}
  >
    <div
      className="w-5 h-5 flex items-center justify-center transition-all"
      style={{
        backgroundColor: isSelected ? colors.brand.primary : 'transparent',
        border: `2px solid ${colors.brand.primary}`,
        color: isSelected ? colors.background.content : 'transparent',
      }}
    >
      {isSelected && <Check className="w-3 h-3" />}
    </div>
    <div className="ml-4 flex-1">
      <div
        className="text-sm font-bold uppercase tracking-tight font-mono"
        style={{ color: colors.text.primary }}
      >
        {name}
      </div>
    </div>
    {name === 'main' || name === 'master' ? (
      <div
        className="text-[10px] px-2 py-0.5 font-bold font-mono"
        style={{
          border: `1px solid ${colors.brand.primary}`,
          color: colors.brand.primary,
        }}
      >
        STABLE
      </div>
    ) : (
      <div
        className="text-[10px] px-2 py-0.5 font-mono"
        style={{
          border: `1px solid ${colors.border.default}`,
          color: colors.text.muted,
        }}
      >
        BRANCH
      </div>
    )}
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────
export const NewAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { models, isLoading: isLoadingModels } = useModels();
  const { createJob, isLoading: isCreatingJob, error: jobError } = useCreateJob();
  const {
    createConflictAnalysis,
    isLoading: isCreatingConflict,
    error: conflictError,
  } = useCreateConflictAnalysis();
  const {
    branches: remoteBranches,
    fetchBranches,
    isLoading: isLoadingBranches,
    error: branchError,
  } = useFetchBranches();

  // ─── State ──────────────────────────────────────────────────────────────
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceSelection | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [step, setStep] = useState(1);

  // Determine total steps based on services selected
  const needsBranchStep = selectedServices === 'conflict' || selectedServices === 'both';
  const totalSteps = needsBranchStep ? 4 : 3;

  // Actual step labels for current flow
  const activeLabels = needsBranchStep
    ? STEP_LABELS
    : [STEP_LABELS[0], STEP_LABELS[1], STEP_LABELS[3]];

  // ─── Validation ─────────────────────────────────────────────────────────
  const isValidGitUrl = (url: string) => {
    return /^https?:\/\/(github|gitlab|bitbucket)\.(com|org)\/[\w.-]+\/[\w.-]+/.test(url);
  };

  // Fetch branches when entering the branch step
  useEffect(() => {
    if (needsBranchStep && step === 3 && repoUrl && remoteBranches.length === 0) {
      fetchBranches(repoUrl);
    }
  }, [step, needsBranchStep, repoUrl, fetchBranches, remoteBranches.length]);

  // ─── Navigation ─────────────────────────────────────────────────────────
  const goNext = () => {
    if (step === 2 && !needsBranchStep) {
      setStep(3);
    } else {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  };

  const goBack = () => {
    if (step === 3 && !needsBranchStep) {
      setStep(2);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  // ─── Service Toggle ─────────────────────────────────────────────────────
  const toggleService = (service: 'codebase' | 'conflict') => {
    setSelectedServices((prev) => {
      if (prev === null) return service;
      if (prev === service) return null;
      if (prev === 'both') return service === 'codebase' ? 'conflict' : 'codebase';
      return 'both';
    });
    setSelectedBranches([]);
  };

  // ─── Branch Toggle ──────────────────────────────────────────────────────
  const toggleBranch = (branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
  };

  // ─── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!repoUrl || !selectedServices || !selectedModel) return;

    const results: { jobId: string | null }[] = [];

    if (selectedServices === 'codebase' || selectedServices === 'both') {
      const result = await createJob(repoUrl, selectedModel);
      results.push(result);
    }

    if (selectedServices === 'conflict' || selectedServices === 'both') {
      if (selectedBranches.length < 2) return;
      const result = await createConflictAnalysis(repoUrl, selectedBranches, selectedModel);
      results.push(result);
    }

    const successResult = results.find((r) => r.jobId);
    if (successResult?.jobId) {
      navigate(`/app/jobs/${successResult.jobId}`);
    }
  };

  // ─── Computed ───────────────────────────────────────────────────────────
  const isCreating = isCreatingJob || isCreatingConflict;
  const error = jobError || conflictError;
  const isModelStep = needsBranchStep ? step === 4 : step === 3;
  const isBranchStep = needsBranchStep && step === 3;

  const canProceedFromStep2 = selectedServices !== null;
  const canProceedFromBranches = selectedBranches.length >= 2;
  const canSubmit =
    selectedModel &&
    selectedServices &&
    (!needsBranchStep || selectedBranches.length >= 2);

  // ─── Animation Variants ─────────────────────────────────────────────────
  const slideVariants = {
    enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -40 : 40 }),
  };

  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    goNext();
  };

  const handleBack = () => {
    setDirection(-1);
    goBack();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <section
        className="pl-6"
        style={{ borderLeft: `4px solid ${colors.brand.primary}` }}
      >
        <h1
          className="font-display text-5xl md:text-6xl font-normal tracking-wider uppercase mb-4"
          style={{ color: colors.text.primary }}
        >
          Nova Análise{' '}
          <span className="animate-blink" style={{ color: colors.brand.primary }}>
            _
          </span>
        </h1>
        <p
          className="font-mono text-sm max-w-2xl leading-relaxed"
          style={{ color: colors.text.secondary }}
        >
          // Selecione o modo operacional do compilador. A análise irá indexar assets, mapear
          dependências e estabelecer um link neural com a branch selecionada.
        </p>
      </section>

      {/* Step Indicator */}
      <StepIndicator
        currentStep={step}
        totalSteps={totalSteps}
        labels={activeLabels}
        colors={colors}
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => {}}>
          {error}
        </Alert>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {/* ═══════════════════════════════════════════════════════════════════
            STEP 1 — Repository URL
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <motion.div
            key="step-1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {/* Repo URL Block */}
            <div
              className="p-6 mb-8"
              style={{
                backgroundColor: colors.background.content,
                border: `1px solid ${colors.border.subtle}`,
              }}
            >
              <label
                className="block text-[10px] uppercase tracking-widest mb-3 font-bold font-mono"
                style={{ color: colors.brand.primary }}
              >
                &gt; repo_url
              </label>
              <div
                className="flex items-center gap-4 p-4 font-mono text-sm"
                style={{
                  backgroundColor: colors.background.surface,
                  border: `1px solid ${colors.border.default}`,
                }}
              >
                <span style={{ color: colors.brand.primary }}>$ git remote get-url origin</span>
                <input
                  className="bg-transparent border-none w-full focus:ring-0 focus:outline-none p-0 font-mono"
                  style={{ color: colors.text.primary }}
                  type="text"
                  placeholder="https://github.com/seu-usuario/seu-repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <span
                  className="w-2 h-5 animate-blink flex-shrink-0"
                  style={{ backgroundColor: colors.brand.primary }}
                />
              </div>
              {repoUrl && !isValidGitUrl(repoUrl) && (
                <p className="mt-2 text-sm font-mono" style={{ color: colors.status.error }}>
                  &gt; ERROR: Insira uma URL válida do GitHub, GitLab ou Bitbucket
                </p>
              )}
              <p className="mt-2 text-[11px] font-mono" style={{ color: colors.text.muted }}>
                // Suportamos repositórios públicos e privados (com token)
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={!repoUrl || !isValidGitUrl(repoUrl)}
                icon={ArrowRight}
              >
                Próximo: Selecionar Serviços
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 2 — Service Selection
        ═══════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <motion.div
            key="step-2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Codebase Analysis Card */}
              <ServiceCard
                title="ANALYSIS_MODE: CODEBASE"
                modeLabel="MODE_01"
                icon={<Terminal className="w-7 h-7" />}
                features={[
                  'Deep indexing de repositórios locais e remotos.',
                  'Geração automática de documentação via parsing neural.',
                  'Integração completa com MCP (Model Context Protocol).',
                ]}
                statLabel="INDEXING_CAPACITY"
                statValue="UNLIMITED"
                statProgress={85}
                isSelected={selectedServices === 'codebase' || selectedServices === 'both'}
                onToggle={() => toggleService('codebase')}
                colors={colors}
              />

              {/* Multi-Branch Conflicts Card */}
              <ServiceCard
                title="ANALYSIS_MODE: MULTI-BRANCH"
                modeLabel="MODE_02"
                icon={<GitFork className="w-7 h-7" />}
                features={[
                  'Cross-referencing lógico entre múltiplas branches git.',
                  'Detecção preditiva de conflitos antes de operações de merge.',
                  'Análise heurística de drift lógico entre versões.',
                ]}
                statLabel="CONFLICT_RESOLUTION_ENGINE"
                statValue="v2.4_STABLE"
                statProgress={100}
                isSelected={selectedServices === 'conflict' || selectedServices === 'both'}
                onToggle={() => toggleService('conflict')}
                colors={colors}
              />
            </div>

            {/* Terminal Status */}
            <div className="max-w-2xl mx-auto mb-8">
              <div
                className="p-6 font-mono"
                style={{
                  backgroundColor: colors.background.content,
                  border: `1px solid ${colors.border.subtle}`,
                  boxShadow: `4px 4px 0px 0px ${colors.border.default}`,
                }}
              >
                <div
                  className="flex items-center gap-2 text-sm mb-4 pb-2"
                  style={{
                    color: colors.brand.primary,
                    borderBottom: `1px solid ${colors.border.subtle}`,
                  }}
                >
                  <Terminal className="w-4 h-4" />
                  <span className="font-bold">SYSTEM_TERMINAL</span>
                  <span className="text-[10px] opacity-50 ml-auto">SSH: SECURE_LINK_ACTIVE</span>
                </div>
                <div className="text-xs space-y-1" style={{ color: colors.text.muted }}>
                  <p style={{ color: colors.text.muted }}>
                    C:\USER\CODE-IN\PROJECTS&gt;
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2" style={{ color: colors.brand.primary }}>
                      root@compiler:~$
                    </span>
                    <span>run select --mode=analysis --target=all</span>
                  </p>
                  <p className="italic mt-2" style={{ color: colors.text.muted }}>
                    --{' '}
                    {selectedServices
                      ? `Serviço${selectedServices === 'both' ? 's' : ''} selecionado${selectedServices === 'both' ? 's' : ''}: ${
                          selectedServices === 'both'
                            ? 'CODEBASE + MULTI-BRANCH'
                            : selectedServices === 'codebase'
                              ? 'CODEBASE'
                              : 'MULTI-BRANCH'
                        }`
                      : 'Aguardando seleção de serviço via interface'}{' '}
                    --
                  </p>
                  <div
                    className="flex items-center font-bold mt-4"
                    style={{ color: colors.brand.primary }}
                  >
                    COMMAND:{' '}
                    <span className="ml-2">
                      {selectedServices ? 'READY_TO_PROCEED' : 'WAITING_FOR_SELECTION'}
                    </span>
                    <span
                      className="w-2 h-4 animate-blink ml-1 inline-block"
                      style={{ backgroundColor: colors.brand.primary }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack} icon={ArrowLeft} iconPosition="left">
                Voltar
              </Button>
              <Button onClick={handleNext} disabled={!canProceedFromStep2} icon={ArrowRight}>
                {needsBranchStep ? 'Próximo: Configurar Branches' : 'Próximo: Escolher Modelo'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 3 — Branch Selection (only if conflict/both selected)
        ═══════════════════════════════════════════════════════════════════ */}
        {isBranchStep && (
          <motion.div
            key="step-3"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-12 gap-8">
              {/* Repo URL Block (readonly) */}
              <div
                className="col-span-12 p-6"
                style={{
                  backgroundColor: colors.background.content,
                  border: `1px solid ${colors.border.subtle}`,
                }}
              >
                <label
                  className="block text-[10px] uppercase tracking-widest mb-3 font-bold font-mono"
                  style={{ color: colors.brand.primary }}
                >
                  &gt; repo_url
                </label>
                <div
                  className="flex items-center gap-4 p-4 font-mono text-sm"
                  style={{
                    backgroundColor: colors.background.surface,
                    border: `1px solid ${colors.border.default}`,
                  }}
                >
                  <span style={{ color: colors.brand.primary }}>$ git remote get-url origin</span>
                  <span className="truncate" style={{ color: colors.text.primary }}>
                    {repoUrl}
                  </span>
                  <span
                    className="w-2 h-5 animate-blink flex-shrink-0"
                    style={{ backgroundColor: colors.brand.primary }}
                  />
                </div>
              </div>

              {/* Branch Selection Panel */}
              <div
                className="col-span-12 lg:col-span-7 p-6"
                style={{
                  backgroundColor: colors.background.surface,
                  border: `1px solid ${colors.border.default}`,
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-xs font-bold tracking-widest uppercase flex items-center gap-2 font-mono"
                    style={{ color: colors.text.primary }}
                  >
                    <GitBranch className="w-4 h-4" style={{ color: colors.brand.primary }} />
                    Selecionar Branches para Comparar
                  </h2>
                  <span className="text-[10px] font-mono" style={{ color: colors.text.muted }}>
                    TOTAL: {String(remoteBranches.length).padStart(2, '0')} DETECTED
                  </span>
                </div>

                {isLoadingBranches ? (
                  <div
                    className="flex items-center justify-center py-12 gap-3 font-mono text-sm"
                    style={{ color: colors.brand.primary }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    SCANNING_REMOTE_BRANCHES...
                  </div>
                ) : branchError ? (
                  <div
                    className="p-4 font-mono text-sm"
                    style={{
                      backgroundColor: `${colors.status.error}15`,
                      border: `1px solid ${colors.status.error}50`,
                      color: colors.status.error,
                    }}
                  >
                    &gt; ERROR: {branchError}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {remoteBranches.map((branch) => (
                      <BranchItem
                        key={branch}
                        name={branch}
                        isSelected={selectedBranches.includes(branch)}
                        onToggle={() => toggleBranch(branch)}
                        colors={colors}
                      />
                    ))}
                  </div>
                )}

                {selectedBranches.length > 0 && selectedBranches.length < 2 && (
                  <p
                    className="mt-4 text-[11px] font-mono"
                    style={{ color: colors.status.warning }}
                  >
                    &gt; WARNING: Selecione pelo menos 2 branches para análise de conflitos
                  </p>
                )}
              </div>

              {/* Right Panel - Summary & Status */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                {/* Selected Branches Summary */}
                <div
                  className="p-6"
                  style={{
                    backgroundColor: colors.background.surface,
                    border: `1px solid ${colors.border.default}`,
                  }}
                >
                  <h2
                    className="text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 font-mono"
                    style={{ color: colors.text.primary }}
                  >
                    <GitFork className="w-4 h-4" style={{ color: colors.brand.primary }} />
                    Branches Selecionadas
                  </h2>
                  {selectedBranches.length === 0 ? (
                    <p className="text-xs font-mono" style={{ color: colors.text.muted }}>
                      // Nenhuma branch selecionada
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedBranches.map((branch) => (
                        <div
                          key={branch}
                          className="p-3 flex justify-between items-center"
                          style={{
                            backgroundColor: colors.background.content,
                            borderLeft: `4px solid ${colors.brand.primary}`,
                          }}
                        >
                          <span
                            className="text-xs font-bold font-mono"
                            style={{ color: colors.text.primary }}
                          >
                            {branch}
                          </span>
                          <button
                            onClick={() => toggleBranch(branch)}
                            className="text-[10px] font-mono transition-opacity hover:opacity-80"
                            style={{ color: colors.status.error }}
                          >
                            REMOVE
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* System Status */}
                <div
                  className="p-6 font-mono text-[10px] leading-relaxed"
                  style={{
                    backgroundColor: colors.background.content,
                    border: `1px solid ${colors.border.subtle}`,
                    boxShadow: `4px 4px 0px 0px ${colors.border.default}`,
                  }}
                >
                  <div className="mb-3 font-bold" style={{ color: colors.brand.primary }}>
                    [ SYSTEM STATUS ]
                  </div>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="uppercase" style={{ color: colors.text.muted }}>
                      Connection:
                    </span>
                    <span style={{ color: colors.text.primary }}>ENCRYPTED_TLS</span>
                    <span className="uppercase" style={{ color: colors.text.muted }}>
                      Branches:
                    </span>
                    <span style={{ color: colors.text.primary }}>
                      {selectedBranches.length} SELECTED
                    </span>
                    <span className="uppercase" style={{ color: colors.text.muted }}>
                      Pairs:
                    </span>
                    <span style={{ color: colors.text.primary }}>
                      {selectedBranches.length >= 2
                        ? `${(selectedBranches.length * (selectedBranches.length - 1)) / 2} COMBINATIONS`
                        : 'N/A'}
                    </span>
                  </div>
                  <div
                    className="mt-4 pt-4"
                    style={{ borderTop: `1px solid ${colors.border.default}` }}
                  >
                    <div
                      className="flex justify-between items-center font-bold"
                      style={{ color: colors.brand.primary }}
                    >
                      <span>
                        {selectedBranches.length >= 2
                          ? 'READY TO COMPILE'
                          : 'AWAITING BRANCH SELECTION'}
                      </span>
                      <span className={selectedBranches.length >= 2 ? 'animate-blink' : ''}>
                        ●
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={handleBack} icon={ArrowLeft} iconPosition="left">
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceedFromBranches}
                icon={ArrowRight}
              >
                Próximo: Escolher Modelo
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STEP 3 or 4 — Model Selection
        ═══════════════════════════════════════════════════════════════════ */}
        {isModelStep && (
          <motion.div
            key="step-model"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <Card variant="elevated" padding="lg">
              <CardTitle>Escolha o Modelo de IA</CardTitle>
              <CardDescription>
                Selecione qual modelo será usado para analisar seu repositório
              </CardDescription>

              <div className="mt-6">
                <ModelSelector
                  models={models}
                  selectedModel={selectedModel}
                  onSelect={setSelectedModel}
                  isLoading={isLoadingModels}
                />

                <div
                  className="flex justify-between mt-8 pt-6"
                  style={{ borderTop: `1px solid ${colors.border.subtle}` }}
                >
                  <Button variant="ghost" onClick={handleBack} icon={ArrowLeft} iconPosition="left">
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    isLoading={isCreating}
                    size="lg"
                    fullWidth={false}
                  >
                    EXECUTAR ANÁLISE
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Summary */}
            <Card variant="bordered" padding="md" className="mt-4">
              <div className="flex items-start gap-4 text-sm">
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: colors.brand.primary }}
                />
                <div className="font-mono text-xs space-y-1" style={{ color: colors.text.secondary }}>
                  <div>
                    <strong style={{ color: colors.text.primary }}>Repositório:</strong>{' '}
                    <span style={{ color: colors.brand.primary }}>{repoUrl}</span>
                  </div>
                  <div>
                    <strong style={{ color: colors.text.primary }}>Serviço(s):</strong>{' '}
                    <span style={{ color: colors.brand.primary }}>
                      {selectedServices === 'both'
                        ? 'Codebase + Multi-Branch Conflicts'
                        : selectedServices === 'codebase'
                          ? 'Codebase Analysis'
                          : 'Multi-Branch Conflict Analysis'}
                    </span>
                  </div>
                  {needsBranchStep && selectedBranches.length > 0 && (
                    <div>
                      <strong style={{ color: colors.text.primary }}>Branches:</strong>{' '}
                      <span style={{ color: colors.brand.primary }}>
                        {selectedBranches.join(', ')}
                      </span>
                    </div>
                  )}
                  <div>
                    <strong style={{ color: colors.text.primary }}>Modelo:</strong>{' '}
                    <span style={{ color: colors.brand.primary }}>{selectedModel}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
