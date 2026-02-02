import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  GitBranch,
  Clock,
  FileText,
  Download,
  RefreshCw,
  Copy,
  CheckCircle,
  ExternalLink,
  Layers,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import {
  Card,
  CardTitle,
  CardContent,
  Button,
  Badge,
  StatusBadge,
  Skeleton,
  Alert,
  EmptyState,
} from '@shared/components/ui';
import { JobProgress } from '@auth/components/jobs';
import { useJob, useRetryJob, useWebSocket } from '@auth/hooks';
import { formatDate, extractRepoName, getProviderColor } from '@shared/lib/utils';

export const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { job, isLoading, error, refresh } = useJob(jobId!);
  const { retryJob, isLoading: isRetrying } = useRetryJob();
  const { lastUpdate } = useWebSocket(jobId);

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/app')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao Dashboard
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <GitBranch className="w-5 h-5 text-brand-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white">{repoName}</h1>
            <StatusBadge status={job.status} />
          </div>
          <a
            href={job.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-brand-primary flex items-center gap-1"
          >
            {job.repo_url}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          {job.status === 'failed' && (
            <Button
              variant="outline"
              icon={RefreshCw}
              iconPosition="left"
              onClick={handleRetry}
              isLoading={isRetrying}
            >
              Tentar Novamente
            </Button>
          )}
          <Button variant="ghost" icon={RefreshCw} onClick={refresh}>
            Atualizar
          </Button>
        </div>
      </div>

      {/* Job Info */}
      <Card variant="default" padding="md">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Criado em {formatDate(job.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Modelo:</span>
            <span className={`font-mono ${getProviderColor(job.selected_model.split('-')[0])}`}>
              {job.selected_model}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">ID:</span>
            <code className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300">
              {job.id}
            </code>
          </div>
        </div>
      </Card>

      {/* Progress (for pending/processing) */}
      {(job.status === 'pending' || job.status === 'processing') && (
        <Card variant="elevated" padding="lg">
          <CardTitle className="mb-6">Progresso da Análise</CardTitle>
          <JobProgress
            status={job.status}
            progress={lastUpdate?.progress}
            message={lastUpdate?.message}
          />
        </Card>
      )}

      {/* Error Message */}
      {job.status === 'failed' && job.error_message && (
        <Alert variant="error" title="Erro na Análise">
          {job.error_message}
        </Alert>
      )}

      {/* Analysis Results */}
      {job.status === 'completed' && job.analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Documentation */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-primary" />
                <CardTitle>Documentação Gerada</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={Copy} onClick={handleCopyDocumentation}>
                  Copiar
                </Button>
                <Button variant="ghost" size="sm" icon={Download}>
                  Exportar
                </Button>
              </div>
            </div>
            <CardContent>
              <div className="bg-brand-black rounded-xl p-6 border border-white/5 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {job.analysis.documentation}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Patterns & Architecture */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-brand-secondary" />
                <CardTitle>Padrões Identificados</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.analysis.patterns.length > 0 ? (
                  job.analysis.patterns.map((pattern, idx) => (
                    <Badge key={idx} variant="secondary">
                      {pattern}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum padrão identificado</p>
                )}
              </div>
              {job.analysis.architecture_type && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-sm text-gray-400">Tipo de Arquitetura</p>
                  <p className="text-lg font-semibold text-white">
                    {job.analysis.architecture_type}
                  </p>
                </div>
              )}
            </Card>

            <Card variant="default" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-brand-primary" />
                <CardTitle>Confiança da Análise</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-white/10"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${job.analysis.confidence_score * 251.2} 251.2`}
                      className="text-brand-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                    {Math.round(job.analysis.confidence_score * 100)}%
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Baseado na complexidade do código e qualidade dos padrões detectados
                </p>
              </div>
            </Card>
          </div>

          {/* Suggested Improvements */}
          {job.analysis.suggested_improvements.length > 0 && (
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <CardTitle>Sugestões de Melhoria</CardTitle>
              </div>
              <div className="space-y-4">
                {job.analysis.suggested_improvements.map((improvement, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" size="sm">
                            {improvement.category}
                          </Badge>
                          <Badge
                            variant={
                              improvement.priority === 'high'
                                ? 'error'
                                : improvement.priority === 'medium'
                                ? 'warning'
                                : 'default'
                            }
                            size="sm"
                          >
                            {improvement.priority}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-white">{improvement.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {improvement.description}
                        </p>
                      </div>
                      <Badge variant="default" size="sm">
                        Esforço: {improvement.effort}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};
