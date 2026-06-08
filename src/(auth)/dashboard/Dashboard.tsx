import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, BarChart3, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { JobList } from '@components/jobs';
import { useJobs, useRetryJob, useCancelJob, useJobUpdates } from '@config/hooks';
import { useTheme } from '@shared/contexts';

export const Dashboard: React.FC = () => {
  const { jobs, isLoading, error, refresh } = useJobs();
  const { retryJob } = useRetryJob();
  const { cancelJob } = useCancelJob();
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() ?? '';

  const filteredJobs = searchQuery
    ? jobs.filter((job) => {
        const repoName = job.repo_url.split('/').slice(-2).join('/').toLowerCase();
        return (
          repoName.includes(searchQuery) ||
          job.status.toLowerCase().includes(searchQuery) ||
          job.selected_model.toLowerCase().includes(searchQuery)
        );
      })
    : jobs;

  // Real-time updates for active jobs
  const activeJobIds = jobs
    .filter((j) => j.status === 'pending' || j.status === 'processing')
    .map((j) => j.id);

  useJobUpdates(activeJobIds, useCallback((_jobId, update) => {
    // Refresh jobs list when we get an update
    if (update.status === 'completed' || update.status === 'failed') {
      refresh();
    }
  }, [refresh]));

  const handleRetry = async (jobId: string) => {
    await retryJob(jobId);
    refresh();
  };

  const handleCancel = async (jobId: string) => {
    await cancelJob(jobId);
    refresh();
  };

  // Stats
  const stats = {
    total: jobs.length,
    processing: jobs.filter((j) => j.status === 'processing' || j.status === 'pending').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  };

  // Terminal-style stat card definitions matching the design system
  const statCards = [
    {
      label: 'Total de Análises',
      value: stats.total,
      subtext: 'SCANNING COMPLETE',
      subtextColor: colors.brand.primary,
      valueColor: colors.text.primary,
      icon: Terminal,
      showBgIcon: true,
    },
    {
      label: 'Em Progresso',
      value: stats.processing,
      subtext: stats.processing > 0 ? 'PROCESSING' : 'STANDBY',
      subtextColor: stats.processing > 0 ? colors.brand.primary : colors.text.muted,
      valueColor: colors.text.primary,
      icon: BarChart3,
      showBgIcon: false,
    },
    {
      label: 'Concluídas',
      value: stats.completed,
      subtext: 'ACTIVE CACHE',
      subtextColor: `${colors.brand.primary}99`,
      valueColor: colors.brand.primary,
      icon: CheckCircle2,
      showBgIcon: false,
    },
    {
      label: 'Falharam',
      value: stats.failed,
      subtext: 'LOGS ARCHIVED',
      subtextColor: `${colors.status.error}80`,
      valueColor: colors.status.error,
      icon: XCircle,
      showBgIcon: false,
    },
  ];

  return (
    <div className="h-full flex flex-col gap-6 max-w-full overflow-hidden">
      {/* ===== Stat Cards Grid ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="group relative overflow-hidden border p-5"
            style={{
              backgroundColor: colors.background.surface,
              borderColor: colors.border.default,
            }}
          >
            {/* Background Icon (first card only) */}
            {stat.showBgIcon && (
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <stat.icon className="w-8 h-8" style={{ color: colors.text.secondary }} />
              </div>
            )}

            {/* Label */}
            <div
              className="text-[10px] font-bold uppercase tracking-widest mb-1 font-mono"
              style={{ color: colors.text.muted }}
            >
              {stat.label}
            </div>

            {/* Value — VT323 display font */}
            <div
              className="text-3xl font-display leading-none"
              style={{ color: stat.valueColor }}
            >
              {stat.value}
            </div>

            {/* Terminal Subtext */}
            <div
              className="mt-2 text-[10px] font-mono tracking-wide"
              style={{ color: stat.subtextColor }}
            >
              {stat.subtext}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== Análises Recentes ===== */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          {/* Section Label — terminal style */}
          <span
            className="text-[15px] font-bold uppercase tracking-widest font-mono"
            style={{ color: colors.text.muted }}
          >
            {searchQuery
              ? `> ${filteredJobs.length} resultado${filteredJobs.length !== 1 ? 's' : ''} para "${searchQuery}"`
              : 'Análises Recentes'}
          </span>

          {/* Refresh Button — minimal terminal style */}
          <button
            onClick={refresh}
            className="text-[15px] font-mono flex items-center gap-1.5 transition-colors duration-150"
            style={{ color: colors.text.muted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.brand.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.muted;
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ATUALIZAR</span>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 p-2">
          <JobList
            jobs={filteredJobs}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
            onCancel={handleCancel}
            emptyMessage={searchQuery ? {
              title: 'Nenhum resultado',
              description: `Nenhum job encontrado para "${searchQuery}". Tente buscar por repositório, status ou modelo.`,
            } : undefined}
          />
        </div>
      </div>

    </div>
  );
};
