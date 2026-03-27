import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Terminal,
  FileText,
  RefreshCw,
  ExternalLink,
  Brain,
  History,
  Cpu,
  Lightbulb,
  GitPullRequest,
  Copy,
  Download,
  BookOpen,
  GitBranch,
  AlertTriangle,
  Shield,
  GitMerge,
  ChevronRight,
  X,
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
  ConflictAnalysisData,
  ConflictRisk,
} from '@shared/types';
import type { ThemeColors } from '@/styles/colors';

// =============================================
// Screen Switcher Tab Types
// =============================================
type AnalysisView = 'codebase' | 'conflicts';

// =============================================
// Screen Switcher Component
// =============================================
interface ScreenSwitcherProps {
  activeView: AnalysisView;
  onSwitch: (view: AnalysisView) => void;
  hasCodebase: boolean;
  hasConflicts: boolean;
  colors: ThemeColors;
}

const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({
  activeView,
  onSwitch,
  hasCodebase,
  hasConflicts,
  colors,
}) => {
  const tabs: { id: AnalysisView; label: string; icon: LucideIcon; available: boolean }[] = [
    { id: 'codebase', label: 'CODEBASE ANALYSIS', icon: Terminal, available: hasCodebase },
    { id: 'conflicts', label: 'CONFLICT ANALYSIS', icon: GitBranch, available: hasConflicts },
  ];

  return (
    <div
      className="flex items-stretch shrink-0"
      style={{
        backgroundColor: colors.background.content,
        borderBottom: `1px solid ${colors.border.default}`,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => tab.available && onSwitch(tab.id)}
            disabled={!tab.available}
            className="flex items-center gap-2 px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all relative"
            style={{
              color: !tab.available
                ? colors.text.muted
                : isActive
                  ? colors.brand.primary
                  : colors.text.secondary,
              opacity: tab.available ? 1 : 0.4,
              cursor: tab.available ? 'pointer' : 'not-allowed',
              borderBottom: isActive ? `2px solid ${colors.brand.primary}` : '2px solid transparent',
              backgroundColor: isActive ? `${colors.brand.primary}08` : 'transparent',
            }}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {!tab.available && (
              <span
                className="text-[9px] px-1.5 py-0.5 font-mono ml-1"
                style={{
                  border: `1px solid ${colors.border.default}`,
                  color: colors.text.muted,
                }}
              >
                N/A
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// =============================================
// Confidence Gauge Component (larger, standalone)
// =============================================

interface ConfidenceGaugeProps {
  score: number;
  colors: ThemeColors;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ score, colors }) => {
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score * circumference);

  const getLabel = () => {
    if (percentage >= 90) return 'HIGH';
    if (percentage >= 70) return 'GOOD';
    if (percentage >= 50) return 'FAIR';
    return 'LOW';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64" cy="64" r="54"
            fill="transparent"
            stroke={colors.border.default}
            strokeWidth="5"
          />
          <circle
            cx="64" cy="64" r="54"
            fill="transparent"
            stroke={colors.brand.primary}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-mono font-bold"
            style={{ color: colors.text.primary }}
          >
            {percentage}%
          </span>
          <span
            className="text-[9px] font-mono font-bold"
            style={{ color: colors.brand.primary }}
          >
            {getLabel()}
          </span>
        </div>
      </div>
      <span
        className="text-[9px] font-mono mt-2"
        style={{ color: colors.text.muted }}
      >
        Confiança da Análise
      </span>
    </div>
  );
};

// =============================================
// Section Header Component
// =============================================

const SectionHeader: React.FC<{
  icon: LucideIcon;
  title: string;
  colors: ThemeColors;
  accentColor?: string;
}> = ({ icon: Icon, title, colors, accentColor }) => (
  <div className="flex items-center gap-2 mb-4">
    <div
      className="w-1 h-4 rounded-sm"
      style={{ backgroundColor: accentColor || colors.brand.primary }}
    />
    <Icon className="w-4 h-4" style={{ color: accentColor || colors.brand.primary }} />
    <span
      className="text-xs font-mono font-bold uppercase tracking-widest"
      style={{ color: colors.text.primary }}
    >
      {title}
    </span>
  </div>
);

// =============================================
// Activity Timeline Component
// =============================================

interface TimelineEvent {
  title: string;
  description: string;
  time: string;
  isActive: boolean;
}

const ActivityTimeline: React.FC<{ events: TimelineEvent[]; colors: ThemeColors }> = ({ events, colors }) => (
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
        <p className="text-[11px] font-bold font-mono" style={{ color: colors.text.primary }}>
          {event.title}
        </p>
        <p className="text-[10px] font-mono" style={{ color: colors.text.muted }}>
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

// =============================================
// Insight Stat Card Component
// =============================================

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

// =============================================
// Conflict Risk Card Component
// =============================================

const ConflictRiskCard: React.FC<{ risk: ConflictRisk; colors: ThemeColors }> = ({
  risk,
  colors,
}) => {
  const severityColors: Record<string, string> = {
    high: colors.status.error,
    medium: colors.status.warning,
    low: colors.status.info,
  };

  const severityColor = severityColors[risk.risk_level] || colors.text.muted;

  return (
    <div
      className="border p-4"
      style={{
        backgroundColor: `${colors.background.content}80`,
        borderColor: colors.border.default,
        borderLeft: `3px solid ${severityColor}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-3.5 h-3.5" style={{ color: severityColor }} />
        <span
          className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5"
          style={{
            color: severityColor,
            border: `1px solid ${severityColor}40`,
            backgroundColor: `${severityColor}10`,
          }}
        >
          {risk.risk_level}
        </span>
        <span
          className="text-[10px] font-mono ml-auto"
          style={{ color: colors.text.muted }}
        >
          {risk.conflicting_branches.join(' ↔ ')}
        </span>
      </div>

      <p className="text-xs font-mono font-bold mb-1 break-all" style={{ color: colors.text.primary }}>
        {risk.file_path}
      </p>

      <p className="text-[11px] font-mono leading-relaxed mb-2" style={{ color: colors.text.secondary }}>
        {risk.description}
      </p>

      <div
        className="text-[10px] font-mono p-2 mt-2"
        style={{
          backgroundColor: `${colors.brand.primary}08`,
          border: `1px solid ${colors.border.subtle}`,
          color: colors.text.secondary,
        }}
      >
        <span style={{ color: colors.brand.primary }} className="font-bold">
          &gt; RECOMENDAÇÃO:
        </span>{' '}
        {risk.recommendation}
      </div>
    </div>
  );
};

// =============================================
// Conflict Analysis View Component
// =============================================

const ConflictAnalysisView: React.FC<{
  conflictData: ConflictAnalysisData;
  colors: ThemeColors;
}> = ({ conflictData, colors }) => {
  const highRisks = conflictData.conflict_risks.filter((r) => r.risk_level === 'high');
  const medRisks = conflictData.conflict_risks.filter((r) => r.risk_level === 'medium');
  const overlappingCount = Object.keys(conflictData.overlapping_files).length;

  return (
    <div className="flex-1 p-6 pt-4 flex flex-col overflow-auto gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <InsightStatCard icon={AlertTriangle} label="Riscos Altos" value={highRisks.length} detail="Conflitos de alta severidade que requerem atenção imediata." />
        <InsightStatCard icon={Shield} label="Riscos Médios" value={medRisks.length} detail="Conflitos moderados que merecem revisão antes do merge." />
        <InsightStatCard icon={FileText} label="Arquivos Sobrepostos" value={overlappingCount} detail="Arquivos modificados por mais de uma branch." />
        <InsightStatCard icon={GitBranch} label="Branches" value={conflictData.branches.length} detail={`Analisando: ${conflictData.branches.join(', ')}`} />
      </div>

      {conflictData.merge_order_suggestion.length > 0 && (
        <div className="p-4" style={{ backgroundColor: `${colors.brand.primary}08`, border: `1px solid ${colors.border.subtle}` }}>
          <div className="flex items-center gap-2 mb-3">
            <GitMerge className="w-4 h-4" style={{ color: colors.brand.primary }} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: colors.brand.primary }}>Ordem de Merge Sugerida</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {conflictData.merge_order_suggestion.map((branch, idx) => (
              <React.Fragment key={branch}>
                <span className="px-3 py-1.5 font-mono text-xs font-bold" style={{ backgroundColor: colors.background.content, border: `1px solid ${colors.border.default}`, color: colors.text.primary }}>
                  {idx + 1}. {branch}
                </span>
                {idx < conflictData.merge_order_suggestion.length - 1 && (
                  <ChevronRight className="w-4 h-4" style={{ color: colors.brand.primary }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {conflictData.conflict_risks.length > 0 && (
        <div>
          <SectionHeader icon={AlertTriangle} title={`Riscos de Conflito (${conflictData.conflict_risks.length})`} colors={colors} accentColor={colors.status.warning} />
          <div className="space-y-3">
            {conflictData.conflict_risks.map((risk, idx) => (
              <ConflictRiskCard key={idx} risk={risk} colors={colors} />
            ))}
          </div>
        </div>
      )}

      {Object.keys(conflictData.semantic_context).length > 0 && (
        <div>
          <SectionHeader icon={Brain} title="Resumo Semântico por Branch" colors={colors} />
          <div className="space-y-2">
            {Object.entries(conflictData.semantic_context).map(([branch, summary]) => (
              <div key={branch} className="p-3" style={{ backgroundColor: `${colors.background.content}80`, border: `1px solid ${colors.border.default}`, borderLeft: `3px solid ${colors.brand.primary}` }}>
                <span className="text-[11px] font-mono font-bold uppercase" style={{ color: colors.brand.primary }}>{branch}</span>
                <p className="text-[11px] font-mono mt-1 leading-relaxed" style={{ color: colors.text.secondary }}>{summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {conflictData.general_recommendations.length > 0 && (
        <div>
          <SectionHeader icon={Lightbulb} title="Recomendações Gerais" colors={colors} accentColor={colors.status.warning} />
          <div className="space-y-2">
            {conflictData.general_recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 font-mono text-[11px]" style={{ backgroundColor: `${colors.background.content}80`, border: `1px solid ${colors.border.default}`, color: colors.text.secondary }}>
                <span className="font-bold" style={{ color: colors.brand.primary }}>&gt;</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {overlappingCount > 0 && (
        <div>
          <SectionHeader icon={FileText} title="Arquivos com Sobreposição" colors={colors} accentColor={colors.text.muted} />
          <div className="space-y-1">
            {Object.entries(conflictData.overlapping_files).map(([file, branches]) => (
              <div key={file} className="flex items-center justify-between p-2 font-mono text-[11px]" style={{ backgroundColor: `${colors.background.content}80`, border: `1px solid ${colors.border.default}` }}>
                <span className="break-all" style={{ color: colors.text.primary }}>{file}</span>
                <span className="ml-3 shrink-0" style={{ color: colors.text.muted }}>{branches.length} branches</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================
// Documentation Overlay Component
// =============================================

const DocumentationOverlay: React.FC<{
  jobId: string;
  documentation?: string;
  hasMultiFile: boolean;
  repoName: string;
  colors: ThemeColors;
  onClose: () => void;
}> = ({ jobId, documentation, hasMultiFile, repoName, colors, onClose }) => {
  const handleCopy = () => {
    if (documentation) {
      navigator.clipboard.writeText(documentation);
    }
  };

  const handleDownload = () => {
    if (!documentation) return;
    const fileName = `${repoName || 'analysis'}-documentation.md`;
    const blob = new Blob([documentation], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="ml-auto w-full max-w-4xl h-full flex flex-col"
        style={{
          backgroundColor: colors.background.surface,
          borderLeft: `1px solid ${colors.border.default}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div
          className="h-12 flex items-center justify-between px-5 shrink-0"
          style={{
            backgroundColor: `${colors.background.content}80`,
            borderBottom: `1px solid ${colors.border.default}`,
          }}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: colors.brand.primary }} />
            <span className="text-xs font-mono font-bold" style={{ color: colors.text.primary }}>
              {hasMultiFile ? 'Documentation Package' : 'AGENTS.md'}
            </span>
            {hasMultiFile && (
              <span
                className="text-[9px] uppercase tracking-tighter border px-1 ml-1 font-mono"
                style={{ color: colors.text.muted, borderColor: colors.border.default }}
              >
                MULTI-ARQUIVO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!hasMultiFile && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-1.5 transition-colors"
                  style={{ color: colors.text.muted }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
                  title="Copiar"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 transition-colors"
                  style={{ color: colors.text.muted }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 ml-2 transition-colors"
              style={{ color: colors.text.muted }}
              onMouseEnter={(e) => { e.currentTarget.style.color = colors.status.error; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.muted; }}
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {hasMultiFile ? (
            <DocumentationViewer jobId={jobId} className="h-full border-0" />
          ) : (
            <div className="p-6 font-mono text-sm leading-relaxed">
              <pre className="whitespace-pre-wrap" style={{ color: colors.text.secondary }}>
                {documentation}
              </pre>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// =============================================
// Helper Functions
// =============================================

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

  const [activeView, setActiveView] = useState<AnalysisView>('codebase');
  const [showDocumentation, setShowDocumentation] = useState(false);

  useEffect(() => {
    if (lastUpdate && job) {
      if (lastUpdate.status !== job.status) {
        refresh();
      }
    }
  }, [lastUpdate, job, refresh]);

  useEffect(() => {
    if (job?.status === 'completed' && job.analysis) {
      const hasCodebase = !!job.analysis.documentation;
      const hasConflicts = !!job.analysis.conflict_analysis;
      if (!hasCodebase && hasConflicts) {
        setActiveView('conflicts');
      } else {
        setActiveView('codebase');
      }
    }
  }, [job]);

  const handleRetry = async () => {
    const result = await retryJob(jobId!);
    if (result.job) {
      refresh();
    }
  };

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
  const conflictData = analysis?.conflict_analysis;
  const reasoningSteps = useMemo(() => normalizeReasoningSteps(analysis), [analysis]);
  const dependencyStats = useMemo(() => extractDependencyStats(analysis), [analysis]);

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
  const hasCodebaseAnalysis = !!analysis?.documentation;
  const hasConflictAnalysis = !!conflictData;
  const showSwitcher = isCompleted && (hasCodebaseAnalysis || hasConflictAnalysis);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-6 lg:-m-8">
      {/* ===== Top Header Bar ===== */}
      <div className="px-6 py-4 shrink-0" style={{ borderBottom: `1px solid ${colors.border.default}` }}>
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

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5" style={{ color: colors.brand.primary }} />
              <h1 className="text-xl font-mono font-bold" style={{ color: colors.text.primary }}>
                {repoName}
              </h1>
              <StatusBadge status={job.status} size="sm" />
              {job.job_type === 'conflict_analysis' && (
                <span
                  className="text-[9px] px-1.5 py-0.5 font-mono font-bold uppercase"
                  style={{
                    border: `1px solid ${colors.status.warning}50`,
                    color: colors.status.warning,
                    backgroundColor: `${colors.status.warning}10`,
                  }}
                >
                  CONFLICT
                </span>
              )}
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
            {/* Documentation Button */}
            {isCompleted && hasCodebaseAnalysis && (
              <button
                onClick={() => setShowDocumentation(true)}
                className="flex items-center gap-2 border px-4 py-1.5 text-xs font-mono font-bold transition-colors"
                style={{
                  borderColor: colors.brand.primary,
                  color: colors.brand.primary,
                  backgroundColor: `${colors.brand.primary}10`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.brand.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.brand.primary}10`;
                }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                VER DOCUMENTAÇÃO
              </button>
            )}

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
      </div>

      {/* ===== Screen Switcher ===== */}
      {showSwitcher && (
        <ScreenSwitcher
          activeView={activeView}
          onSwitch={setActiveView}
          hasCodebase={hasCodebaseAnalysis}
          hasConflicts={hasConflictAnalysis}
          colors={colors}
        />
      )}

      {/* ===== Main Content Area (full width, no sidebar) ===== */}
      <div className="flex-1 overflow-hidden">

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

        {/* ===== Completed: Codebase Analysis (full-width insights) ===== */}
        {isCompleted && activeView === 'codebase' && hasCodebaseAnalysis && (
          <div className="flex-1 h-full overflow-auto p-6 space-y-6">

            {/* ── Row 1: Confidence + Architecture + Snapshot ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Confidence Gauge */}
              <div
                className="border p-5 flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.background.content}80`,
                  borderColor: colors.border.default,
                }}
              >
                <ConfidenceGauge score={job.analysis!.confidence_score} colors={colors} />
              </div>

              {/* Architecture + Patterns */}
              <div
                className="border p-5 flex flex-col justify-between"
                style={{
                  backgroundColor: `${colors.background.content}80`,
                  borderColor: colors.border.default,
                }}
              >
                {job.analysis!.architecture_type && (
                  <div className="mb-4">
                    <span className="text-[9px] font-mono uppercase block mb-1" style={{ color: colors.text.muted }}>
                      Tipo de Arquitetura
                    </span>
                    <span className="text-lg font-mono font-bold" style={{ color: colors.brand.primary }}>
                      {job.analysis!.architecture_type}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[9px] font-mono uppercase block mb-2" style={{ color: colors.text.muted }}>
                    Padrões Identificados
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.analysis!.patterns.length > 0 ? (
                      job.analysis!.patterns.map((pattern, idx) => {
                        const patternColors = [colors.brand.primary, colors.status.warning, colors.status.info, colors.status.error];
                        const dotColor = patternColors[idx % patternColors.length];
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 border px-2 py-1"
                            style={{ backgroundColor: colors.background.surface, borderColor: colors.border.default }}
                          >
                            <span className="w-1.5 h-1.5" style={{ backgroundColor: dotColor }} />
                            <span className="text-[10px] font-mono" style={{ color: colors.text.secondary }}>{pattern}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[10px] font-mono" style={{ color: colors.text.muted }}>Nenhum padrão identificado</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Snapshot */}
              <div
                className="border p-5"
                style={{
                  backgroundColor: `${colors.background.content}80`,
                  borderColor: colors.border.default,
                }}
              >
                <span className="text-[9px] font-mono uppercase block mb-3" style={{ color: colors.text.muted }}>
                  Snapshot Técnico
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Arquivos', value: dependencyStats.file_count || EMPTY_GRAPH_STATS.file_count },
                    { label: 'Funções', value: dependencyStats.function_count || EMPTY_GRAPH_STATS.function_count },
                    { label: 'Classes', value: dependencyStats.class_count || EMPTY_GRAPH_STATS.class_count },
                    { label: 'Arestas', value: dependencyStats.total_edges || EMPTY_GRAPH_STATS.total_edges },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="border p-2 text-center"
                      style={{ backgroundColor: colors.background.surface, borderColor: colors.border.default }}
                    >
                      <p className="text-[8px] font-mono uppercase" style={{ color: colors.text.muted }}>{item.label}</p>
                      <p className="text-xl font-mono font-bold" style={{ color: colors.text.primary }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Row 2: Suggested Improvements (full width, prominent) ── */}
            {job.analysis!.suggested_improvements.length > 0 && (
              <div>
                <SectionHeader icon={Lightbulb} title="Sugestões de Melhoria" colors={colors} accentColor={colors.status.warning} />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {job.analysis!.suggested_improvements.map((imp, idx) => (
                    <div
                      key={idx}
                      className="border p-4"
                      style={{
                        backgroundColor: `${colors.background.content}80`,
                        borderColor: colors.border.default,
                        borderLeft: `3px solid ${
                          imp.priority === 'high' ? colors.status.error
                            : imp.priority === 'medium' ? colors.status.warning
                              : colors.border.default
                        }`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={imp.priority === 'high' ? 'error' : imp.priority === 'medium' ? 'warning' : 'default'}
                          size="sm"
                        >
                          {imp.priority}
                        </Badge>
                        <Badge variant="outline" size="sm">{imp.category}</Badge>
                      </div>
                      <p className="text-xs font-mono font-bold" style={{ color: colors.text.primary }}>
                        {imp.title}
                      </p>
                      <p className="text-[10px] font-mono mt-1 leading-relaxed" style={{ color: colors.text.muted }}>
                        {imp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Row 3: Agent Reasoning + Timeline side by side ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Reasoning */}
              {reasoningSteps.length > 0 && (
                <div>
                  <SectionHeader icon={Brain} title="Rastro do Agente" colors={colors} />
                  <div className="space-y-3">
                    {reasoningSteps.map((step) => {
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
                              <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.text.muted }}>
                                {step.title}
                              </p>
                              <p className="text-[11px] font-mono font-bold mt-1" style={{ color: colors.text.primary }}>
                                {step.action}
                              </p>
                            </div>
                            {confidenceLabel && (
                              <Badge variant="outline" size="sm">Δ {confidenceLabel}</Badge>
                            )}
                          </div>
                          <p className="text-[10px] font-mono mt-2 leading-relaxed" style={{ color: colors.text.muted }}>
                            {step.observation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activity Timeline + PR */}
              <div className="space-y-6">
                <div>
                  <SectionHeader icon={History} title="Atividades Recentes" colors={colors} />
                  <ActivityTimeline events={timelineEvents} colors={colors} />
                </div>

                {/* Pull Request Info */}
                {job.analysis!.pr_url && (
                  <div>
                    <SectionHeader icon={GitPullRequest} title="Pull Request" colors={colors} accentColor={colors.status.info} />
                    <a
                      href={job.analysis!.pr_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border p-4 transition-colors"
                      style={{
                        backgroundColor: `${colors.status.info}10`,
                        borderColor: `${colors.status.info}30`,
                        color: colors.status.info,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.status.info; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${colors.status.info}30`; }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold">PR #{job.analysis!.pr_number}</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                      <p className="text-[10px] font-mono mt-1 opacity-70">Branch: {job.analysis!.pr_branch}</p>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Completed: Conflict View ===== */}
        {isCompleted && activeView === 'conflicts' && hasConflictAnalysis && conflictData && (
          <ConflictAnalysisView conflictData={conflictData} colors={colors} />
        )}

        {/* ===== Codebase selected but no data ===== */}
        {isCompleted && activeView === 'codebase' && !hasCodebaseAnalysis && (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <Terminal className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: colors.text.muted }} />
              <p className="font-mono text-sm" style={{ color: colors.text.muted }}>
                Análise de codebase não disponível para este job.
              </p>
              {hasConflictAnalysis && (
                <button
                  onClick={() => setActiveView('conflicts')}
                  className="mt-3 font-mono text-xs transition-colors"
                  style={{ color: colors.brand.primary }}
                >
                  Ver Análise de Conflitos →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isCompleted && job.status !== 'pending' && job.status !== 'processing' && job.status !== 'failed' && (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: colors.text.muted }} />
              <p className="font-mono text-sm" style={{ color: colors.text.muted }}>
                Nenhum resultado disponível
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===== Documentation Overlay (slide-in panel) ===== */}
      <AnimatePresence>
        {showDocumentation && isCompleted && (
          <DocumentationOverlay
            jobId={jobId!}
            documentation={job.analysis!.documentation}
            hasMultiFile={hasMultiFile}
            repoName={repoName}
            colors={colors}
            onClose={() => setShowDocumentation(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
