import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Terminal,
  Clock,
  FileText,
  RefreshCw,
  ExternalLink,
  Brain,
  History,
  Maximize2,
  Cpu,
  Lightbulb,
  GitPullRequest,
  Copy,
  Download,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import {
  Card,
  CardTitle,
  Button,
  Badge,
  StatusBadge,
  Skeleton,
  Alert,
  EmptyState,
} from '@shared/components/ui';
import { JobProgress } from '@components/jobs';
import { DocumentationViewer } from '@components/docs';
import { useJob, useRetryJob, useWebSocket } from '@config/hooks';
import { formatDate, extractRepoName } from '@shared/lib/utils';
import { useTheme } from '@shared/contexts';
import type {
  AgentReasoning,
  AnalysisReasoningStep,
  AnalysisResult,
  DependencyGraphStats,
} from '@shared/types';

// =============================================
// Confidence Gauge Component
// =============================================

interface ConfidenceGaugeProps {
  score: number; // 0 to 1
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ score }) => {
  const { colors } = useTheme();
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 50; // r=50
  const offset = circumference - (score * circumference);

  const getLabel = () => {
    if (percentage >= 90) return 'HIGH';
    if (percentage >= 70) return 'GOOD';
    if (percentage >= 50) return 'FAIR';
    return 'LOW';
  };

  const getStability = () => {
    if (percentage >= 85) return 'STABLE';
    if (percentage >= 60) return 'MODERATE';
    return 'VOLATILE';
  };

  return (
    <div
      className="border p-4 mb-4"
      style={{
        backgroundColor: `${colors.background.content}80`,
        borderColor: colors.border.subtle,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-mono uppercase"
          style={{ color: colors.text.muted }}
        >
          Confiança da Análise
        </span>
        <span
          className="font-mono font-bold text-sm"
          style={{ color: colors.brand.primary }}
        >
          {percentage}%
        </span>
      </div>

      <div className="flex justify-center py-2 relative">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle
            cx="56" cy="56" r="50"
            fill="transparent"
            stroke={colors.border.default}
            strokeWidth="4"
          />
          <circle
            cx="56" cy="56" r="50"
            fill="transparent"
            stroke={colors.brand.primary}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-lg font-mono font-bold"
            style={{ color: colors.text.primary }}
          >
            {getLabel()}
          </span>
          <span
            className="text-[9px] font-mono"
            style={{ color: colors.text.muted }}
          >
            {getStability()}
          </span>
        </div>
      </div>

      <p
        className="text-[9px] text-center font-mono mt-1"
        style={{ color: colors.text.muted }}
      >
        Baseado na complexidade do código e qualidade dos padrões detectados.
      </p>
    </div>
  );
};

// =============================================
// Activity Timeline Component
// =============================================

interface TimelineEvent {
  title: string;
  description: string;
  time: string;
  isActive: boolean;
}

const ActivityTimeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  const { colors } = useTheme();

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="pl-3 relative"
          style={{
            borderLeft: `1px solid ${event.isActive ? colors.border.subtle : colors.border.default}`,
          }}
        >
          <div
            className="absolute -left-[4.5px] top-1 w-2 h-2"
            style={{
              backgroundColor: event.isActive ? colors.brand.primary : colors.border.default,
              boxShadow: event.isActive ? `0 0 8px ${colors.brand.primary}` : 'none',
            }}
          />
          <p
            className="text-[11px] font-bold font-mono"
            style={{ color: colors.text.primary }}
          >
            {event.title}
          </p>
          <p
            className="text-[10px] font-mono"
            style={{ color: colors.text.muted }}
          >
            {event.description}
          </p>
          <p
            className="text-[9px] font-mono mt-1"
            style={{ color: event.isActive ? `${colors.brand.primary}99` : colors.text.muted }}
          >
            {event.time}
          </p>
        </div>
      ))}
    </div>
  );
};

interface InsightStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  detail: string;
}

const InsightStatCard: React.FC<InsightStatCardProps> = ({ icon: Icon, label, value, detail }) => {
  const { colors } = useTheme();

  return (
    <div
      className="border p-4"
      style={{
        backgroundColor: `${colors.background.surface}80`,
        borderColor: colors.border.default,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: colors.text.muted }}
          >
            {label}
          </p>
          <p
            className="mt-2 text-2xl font-mono font-bold"
            style={{ color: colors.text.primary }}
          >
            {value}
          </p>
        </div>
        <div
          className="border p-2"
          style={{
            borderColor: colors.border.default,
            backgroundColor: colors.background.content,
          }}
        >
          <Icon className="w-4 h-4" style={{ color: colors.brand.primary }} />
        </div>
      </div>
      <p
        className="mt-3 text-[10px] font-mono leading-relaxed"
        style={{ color: colors.text.muted }}
      >
        {detail}
      </p>
    </div>
  );
};

interface NormalizedReasoningStep {
  id: string;
  title: string;
  action: string;
  observation: string;
  confidenceDelta?: number;
}

const EMPTY_GRAPH_STATS: DependencyGraphStats = {
  total_nodes: 0,
  total_edges: 0,
  file_count: 0,
  function_count: 0,
  class_count: 0,
};

function normalizeReasoningSteps(analysis?: AnalysisResult): NormalizedReasoningStep[] {
  const rawSteps = (analysis?.reasoning_steps ?? analysis?.agent_reasoning ?? []) as Array<AnalysisReasoningStep | AgentReasoning>;

  return rawSteps
    .map((step, index) => {
      const reasoningStep = step as AnalysisReasoningStep;
      const agentStep = step as AgentReasoning;
      const title = typeof reasoningStep.node === 'string' && reasoningStep.node.length > 0
        ? reasoningStep.node
        : typeof agentStep.step === 'number'
          ? `Etapa ${agentStep.step}`
          : `Etapa ${index + 1}`;

      return {
        id: `${title}-${index}`,
        title,
        action: step.action,
        observation: step.observation,
        confidenceDelta: reasoningStep.confidence_delta,
      };
    })
    .filter((step) => step.action || step.observation);
}

function extractDependencyStats(analysis?: AnalysisResult): DependencyGraphStats {
  const rawStats = analysis?.dependencies_graph?.stats;
  const rawNodes = analysis?.dependencies_graph?.nodes;
  const rawEdges = analysis?.dependencies_graph?.edges;

  return {
    total_nodes: Number(rawStats?.total_nodes ?? rawNodes?.length ?? 0),
    total_edges: Number(rawStats?.total_edges ?? rawEdges?.length ?? 0),
    file_count: Number(rawStats?.file_count ?? 0),
    function_count: Number(rawStats?.function_count ?? 0),
    class_count: Number(rawStats?.class_count ?? 0),
  };
}

function formatConfidenceDelta(delta?: number): string | null {
  if (typeof delta !== 'number' || Number.isNaN(delta)) return null;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(2)}`;
}

function truncateMiddle(value: string, start = 26, end = 12): string {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

// =============================================
// Main JobDetail Component
// =============================================

export const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { job, isLoading, error, refresh } = useJob(jobId!);
  const { retryJob, isLoading: isRetrying } = useRetryJob();
  const { lastUpdate } = useWebSocket(jobId);
  const { colors } = useTheme();

  // Update job status from WebSocket
  useEffect(() => {
    if (lastUpdate && job) {
      if (lastUpdate.status !== job.status) {
        refresh();
      }
    }
  }, [lastUpdate, job, refresh]);

  const handleRetry = async () => {
    const result = await retryJob(jobId!);
    if (result.job) {
      refresh();
    }
  };

  const handleCopyDocumentation = () => {
    if (job?.analysis?.documentation) {
      navigator.clipboard.writeText(job.analysis.documentation);
    }
  };

  const handleDownloadDocumentation = () => {
    if (!job?.analysis?.documentation) return;

    const fileName = `${extractRepoName(job.repo_url) || 'analysis'}-documentation.md`;
    const blob = new Blob([job.analysis.documentation], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Build activity timeline from job data
  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    if (!job) return [];
    const events: TimelineEvent[] = [];

    if (job.status === 'completed' && job.analysis) {
      events.push({
        title: 'Relatório Gerado',
        description: `Documentação gerada com ${job.analysis.patterns.length} padrões identificados.`,
        time: formatDate(job.analysis.created_at),
        isActive: true,
      });

      if (job.analysis.pr_url) {
        events.push({
          title: 'Pull Request Criado',
          description: `PR #${job.analysis.pr_number} criado na branch ${job.analysis.pr_branch}.`,
          time: job.analysis.pr_created_at ? formatDate(job.analysis.pr_created_at) : '',
          isActive: true,
        });
      }
    }

    events.push({
      title: 'Job Criado',
      description: `Análise solicitada para o repositório.`,
      time: formatDate(job.created_at),
      isActive: false,
    });

    return events;
  }, [job]);

  const analysis = job?.analysis;
  const reasoningSteps = useMemo(() => normalizeReasoningSteps(analysis), [analysis]);
  const dependencyStats = useMemo(() => extractDependencyStats(analysis), [analysis]);
  const documentationCount = analysis?.documentation_files?.length ?? (analysis?.storage_path ? 1 : 0);
  const graphCoverage = dependencyStats.total_nodes > 0
    ? `${dependencyStats.total_nodes} nós / ${dependencyStats.total_edges} conexões`
    : 'Grafo ainda não disponível';

  // ===== Loading State =====
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" width={200} height={32} />
        <Card padding="lg">
          <div className="space-y-4">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" height={100} />
          </div>
        </Card>
      </div>
    );
  }

  // ===== Error State =====
  if (error || !job) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="Job não encontrado"
        description={error || 'O job solicitado não existe ou foi removido'}
        action={
          <Link to="/app">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        }
      />
    );
  }

  const repoName = extractRepoName(job.repo_url);
  const isCompleted = job.status === 'completed' && job.analysis;
  const hasMultiFile = !!job.analysis?.storage_path;
  const analysisStats = isCompleted ? [
    {
      label: 'Documentação',
      value: documentationCount || (hasMultiFile ? 'multi' : 1),
      detail: hasMultiFile
        ? 'Pacote multi-arquivo pronto para navegação detalhada.'
        : 'Saída consolidada em um único documento.',
      icon: FileText,
    },
    {
      label: 'Raciocínio',
      value: reasoningSteps.length,
      detail: reasoningSteps.length > 0
        ? 'Etapas do agente disponíveis para auditoria da análise.'
        : 'Nenhuma trilha de raciocínio registrada.',
      icon: Brain,
    },
    {
      label: 'Cobertura',
      value: dependencyStats.total_nodes,
      detail: graphCoverage,
      icon: Cpu,
    },
    {
      label: 'Sugestões',
      value: analysis?.suggested_improvements.length ?? 0,
      detail: analysis?.suggested_improvements.length
        ? 'Recomendações priorizadas a partir do resultado do code-in.'
        : 'Nenhuma melhoria adicional foi sugerida.',
      icon: Lightbulb,
    },
  ] : [];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-6 lg:-m-8">
      {/* ===== Top Header Bar ===== */}
      <div className="px-6 py-4 shrink-0" style={{ borderBottom: `1px solid ${colors.border.default}` }}>
        {/* Back link */}
        <button
          onClick={() => navigate('/app')}
          className="text-[10px] font-mono flex items-center gap-1 mb-2 transition-colors"
          style={{ color: colors.text.muted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand.primary; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Voltar ao Dashboard</span>
        </button>

        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5" style={{ color: colors.brand.primary }} />
              <h1
                className="text-xl font-mono font-bold"
                style={{ color: colors.text.primary }}
              >
                {repoName}
              </h1>
              <StatusBadge status={job.status} size="sm" />
            </div>
            <a
              href={job.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono mt-1 flex items-center gap-1 transition-colors"
              style={{ color: colors.text.muted }}
              onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
            >
              {job.repo_url}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            {job.status === 'failed' && (
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                iconPosition="left"
                onClick={handleRetry}
                isLoading={isRetrying}
              >
                Retry
              </Button>
            )}
            <button
              onClick={refresh}
              className="flex items-center gap-2 border px-3 py-1.5 text-xs font-mono transition-colors"
              style={{
                borderColor: colors.border.default,
                color: colors.text.muted,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.brand.primary;
                e.currentTarget.style.color = colors.brand.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border.default;
                e.currentTarget.style.color = colors.text.muted;
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ATUALIZAR
            </button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div
          className="mt-3 border p-2 flex flex-wrap items-center justify-between text-[10px] font-mono gap-2"
          style={{
            backgroundColor: `${colors.background.surface}80`,
            borderColor: colors.border.default,
            color: colors.text.muted,
          }}
        >
          <div className="flex gap-6 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Criado em {formatDate(job.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              Modelo: <span style={{ color: colors.brand.primary }}>{job.selected_model || 'N/A'}</span>
            </span>
          </div>
          <span>
            ID: <code
              className="px-1 py-0.5 text-[10px]"
              style={{
                backgroundColor: colors.background.content,
                color: colors.text.secondary,
              }}
            >
              {job.id}
            </code>
          </span>
        </div>
      </div>

      {/* ===== Main 3-Panel Layout ===== */}
      <div className="flex-1 flex overflow-hidden">

        {/* ===== Center Panel — Content ===== */}
        <div
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
        >
          {/* Progress (for pending/processing) */}
          {(job.status === 'pending' || job.status === 'processing') && (
            <div className="p-6">
              <Card variant="elevated" padding="lg">
                <CardTitle className="mb-6">Progresso da Análise</CardTitle>
                <JobProgress
                  status={job.status}
                  progress={lastUpdate?.progress}
                  message={lastUpdate?.message}
                />
              </Card>
            </div>
          )}

          {/* Error Message */}
          {job.status === 'failed' && job.error_message && (
            <div className="p-6">
              <Alert variant="error" title="Erro na Análise">
                {job.error_message}
              </Alert>
            </div>
          )}

          {/* ===== Completed: Documentation Viewer ===== */}
          {isCompleted && (
            <div className="flex-1 p-6 pt-4 flex flex-col overflow-hidden gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 shrink-0">
                {analysisStats.map((item) => (
                  <InsightStatCard
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    detail={item.detail}
                  />
                ))}
              </div>

              <div
                className="flex-1 border flex flex-col overflow-hidden"
                style={{
                  backgroundColor: colors.background.surface,
                  borderColor: colors.border.default,
                }}
              >
                {/* Tab Bar */}
                <div
                  className="h-10 border-b flex items-center px-4 justify-between shrink-0"
                  style={{
                    backgroundColor: `${colors.background.content}50`,
                    borderColor: colors.border.default,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" style={{ color: colors.brand.primary }} />
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      {hasMultiFile ? 'Documentation' : 'AGENTS.md'}
                    </span>
                    {hasMultiFile && (
                      <span
                        className="text-[10px] uppercase tracking-tighter border px-1 ml-2 font-mono"
                        style={{
                          color: colors.text.muted,
                          borderColor: colors.border.default,
                        }}
                      >
                        MULTI-ARQUIVO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!hasMultiFile && (
                      <>
                        <button
                          onClick={handleCopyDocumentation}
                          className="p-1 transition-colors"
                          style={{ color: colors.text.muted }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand.primary; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
                          title="Copiar conteúdo"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleDownloadDocumentation}
                          className="p-1 transition-colors"
                          style={{ color: colors.text.muted }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand.primary; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
                          title="Exportar"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      className="p-1 transition-colors"
                      style={{ color: colors.text.muted }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand.primary; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
                      title="Expandir"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Document Content */}
                <div className="flex-1 overflow-auto">
                  {hasMultiFile ? (
                    <DocumentationViewer
                      jobId={jobId!}
                      className="h-full border-0"
                    />
                  ) : (
                    <div className="p-6 font-mono text-sm leading-relaxed overflow-auto">
                      <pre
                        className="whitespace-pre-wrap"
                        style={{ color: colors.text.secondary }}
                      >
                        {job.analysis!.documentation}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty state for no results yet */}
          {!isCompleted && job.status !== 'pending' && job.status !== 'processing' && job.status !== 'failed' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: colors.text.muted }} />
                <p className="font-mono text-sm" style={{ color: colors.text.muted }}>
                  Nenhum resultado disponível
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ===== Right Panel — Intelligence Hub ===== */}
        {isCompleted && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-80 border-l flex flex-col shrink-0 overflow-hidden hidden lg:flex"
            style={{
              backgroundColor: colors.background.surface,
              borderColor: colors.border.default,
            }}
          >
            {/* Intelligence Hub Header + Gauge */}
            <div className="p-4 border-b" style={{ borderColor: colors.border.default }}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4" style={{ color: colors.brand.primary }} />
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest"
                  style={{ color: colors.text.primary }}
                >
                  Intelligence Hub
                </span>
              </div>

              {/* Confidence Gauge */}
              <ConfidenceGauge score={job.analysis!.confidence_score} />

              {/* Patterns */}
              <div className="space-y-2">
                <span
                  className="text-[10px] font-mono uppercase"
                  style={{ color: colors.text.muted }}
                >
                  Padrões Identificados
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.analysis!.patterns.length > 0 ? (
                    job.analysis!.patterns.map((pattern, idx) => {
                      const patternColors = [
                        colors.brand.primary,
                        colors.status.warning,
                        colors.status.info,
                        colors.status.error,
                      ];
                      const dotColor = patternColors[idx % patternColors.length];
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 border px-2 py-1"
                          style={{
                            backgroundColor: colors.background.content,
                            borderColor: colors.border.default,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5"
                            style={{ backgroundColor: dotColor }}
                          />
                          <span
                            className="text-[10px] font-mono"
                            style={{ color: colors.text.secondary }}
                          >
                            {pattern}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p
                      className="text-[10px] font-mono"
                      style={{ color: colors.text.muted }}
                    >
                      Nenhum padrão identificado
                    </p>
                  )}
                </div>
              </div>

              {/* Architecture Type */}
              {job.analysis!.architecture_type && (
                <div className="mt-4 pt-3 border-t" style={{ borderColor: colors.border.default }}>
                  <span
                    className="text-[10px] font-mono uppercase block mb-1"
                    style={{ color: colors.text.muted }}
                  >
                    Tipo de Arquitetura
                  </span>
                  <span
                    className="text-sm font-mono font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {job.analysis!.architecture_type}
                  </span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t" style={{ borderColor: colors.border.default }}>
                <span
                  className="text-[10px] font-mono uppercase block mb-2"
                  style={{ color: colors.text.muted }}
                >
                  Pacote Gerado
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="border p-2"
                    style={{
                      backgroundColor: colors.background.content,
                      borderColor: colors.border.default,
                    }}
                  >
                    <p className="text-[9px] font-mono uppercase" style={{ color: colors.text.muted }}>
                      Arquivos
                    </p>
                    <p className="text-lg font-mono font-bold" style={{ color: colors.text.primary }}>
                      {documentationCount || (hasMultiFile ? 'multi' : 1)}
                    </p>
                  </div>
                  <div
                    className="border p-2"
                    style={{
                      backgroundColor: colors.background.content,
                      borderColor: colors.border.default,
                    }}
                  >
                    <p className="text-[9px] font-mono uppercase" style={{ color: colors.text.muted }}>
                      PR
                    </p>
                    <p className="text-lg font-mono font-bold" style={{ color: colors.text.primary }}>
                      {job.analysis!.pr_status === 'created' ? 'aberta' : job.analysis!.pr_status || 'none'}
                    </p>
                  </div>
                </div>

                {job.analysis!.storage_path && (
                  <p
                    className="mt-2 text-[10px] font-mono break-all"
                    style={{ color: colors.text.muted }}
                    title={job.analysis!.storage_path}
                  >
                    {truncateMiddle(job.analysis!.storage_path)}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t" style={{ borderColor: colors.border.default }}>
                <span
                  className="text-[10px] font-mono uppercase block mb-2"
                  style={{ color: colors.text.muted }}
                >
                  Snapshot Técnico
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Arquivos', value: dependencyStats.file_count || EMPTY_GRAPH_STATS.file_count },
                    { label: 'Funções', value: dependencyStats.function_count || EMPTY_GRAPH_STATS.function_count },
                    { label: 'Classes', value: dependencyStats.class_count || EMPTY_GRAPH_STATS.class_count },
                    { label: 'Arestas', value: dependencyStats.total_edges || EMPTY_GRAPH_STATS.total_edges },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="border p-2"
                      style={{
                        backgroundColor: colors.background.content,
                        borderColor: colors.border.default,
                      }}
                    >
                      <p className="text-[9px] font-mono uppercase" style={{ color: colors.text.muted }}>
                        {item.label}
                      </p>
                      <p className="text-lg font-mono font-bold" style={{ color: colors.text.primary }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="flex-1 overflow-auto p-4">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4" style={{ color: colors.text.muted }} />
                <span
                  className="text-xs font-mono"
                  style={{ color: colors.text.muted }}
                >
                  Atividades Recentes
                </span>
              </div>
              <ActivityTimeline events={timelineEvents} />

              {/* Suggested Improvements */}
              {job.analysis!.suggested_improvements.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4" style={{ color: colors.status.warning }} />
                    <span
                      className="text-xs font-mono"
                      style={{ color: colors.text.muted }}
                    >
                      Sugestões de Melhoria
                    </span>
                  </div>
                  <div className="space-y-3">
                    {job.analysis!.suggested_improvements.slice(0, 3).map((imp, idx) => (
                      <div
                        key={idx}
                        className="border p-3"
                        style={{
                          backgroundColor: `${colors.background.content}80`,
                          borderColor: colors.border.default,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              imp.priority === 'high' ? 'error'
                                : imp.priority === 'medium' ? 'warning'
                                  : 'default'
                            }
                            size="sm"
                          >
                            {imp.priority}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {imp.category}
                          </Badge>
                        </div>
                        <p
                          className="text-[11px] font-mono font-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {imp.title}
                        </p>
                        <p
                          className="text-[10px] font-mono mt-1"
                          style={{ color: colors.text.muted }}
                        >
                          {imp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reasoningSteps.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4" style={{ color: colors.brand.primary }} />
                    <span
                      className="text-xs font-mono"
                      style={{ color: colors.text.muted }}
                    >
                      Rastro do Agente
                    </span>
                  </div>

                  <div className="space-y-3">
                    {reasoningSteps.slice(0, 4).map((step) => {
                      const confidenceLabel = formatConfidenceDelta(step.confidenceDelta);

                      return (
                        <div
                          key={step.id}
                          className="border p-3"
                          style={{
                            backgroundColor: `${colors.background.content}80`,
                            borderColor: colors.border.default,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p
                                className="text-[10px] font-mono uppercase tracking-wider"
                                style={{ color: colors.text.muted }}
                              >
                                {step.title}
                              </p>
                              <p
                                className="text-[11px] font-mono font-bold mt-1"
                                style={{ color: colors.text.primary }}
                              >
                                {step.action}
                              </p>
                            </div>
                            {confidenceLabel && (
                              <Badge variant="outline" size="sm">
                                Δ {confidenceLabel}
                              </Badge>
                            )}
                          </div>

                          <p
                            className="text-[10px] font-mono mt-2 leading-relaxed"
                            style={{ color: colors.text.muted }}
                          >
                            {step.observation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pull Request Info */}
              {job.analysis!.pr_url && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <GitPullRequest className="w-4 h-4" style={{ color: colors.status.info }} />
                    <span
                      className="text-xs font-mono"
                      style={{ color: colors.text.muted }}
                    >
                      Pull Request
                    </span>
                  </div>
                  <a
                    href={job.analysis!.pr_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border p-3 transition-colors"
                    style={{
                      backgroundColor: `${colors.status.info}10`,
                      borderColor: `${colors.status.info}30`,
                      color: colors.status.info,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.status.info;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${colors.status.info}30`;
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold">
                        PR #{job.analysis!.pr_number}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                    <p className="text-[10px] font-mono mt-1 opacity-70">
                      Branch: {job.analysis!.pr_branch}
                    </p>
                  </a>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
};
