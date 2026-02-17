import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardTitle, Button } from '@shared/components/ui';
import { JobList } from '@components/jobs';
import { useJobs, useRetryJob, useCancelJob, useJobUpdates } from '@config/hooks';

export const Dashboard: React.FC = () => {
  const { jobs, isLoading, error, refresh } = useJobs();
  const { retryJob } = useRetryJob();
  const { cancelJob } = useCancelJob();

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

  return (
    <div className="space-y-8 max-w-full overflow-x-hidden">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Bem-vindo ao Code-in
          </h1>
          <p className="text-gray-400">
            Gerencie suas análises de repositórios e contextos de IA
          </p>
        </div>
        <Link to="/app/new">
          <Button icon={Plus} iconPosition="left">
            Nova Análise
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total de Análises',
            value: stats.total,
            icon: TrendingUp,
            color: 'text-brand-primary',
          },
          {
            label: 'Em Progresso',
            value: stats.processing,
            icon: Clock,
            color: 'text-blue-400',
          },
          {
            label: 'Concluídas',
            value: stats.completed,
            icon: CheckCircle,
            color: 'text-cyan-400',
          },
          {
            label: 'Falharam',
            value: stats.failed,
            icon: AlertCircle,
            color: 'text-red-400',
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card variant="default" padding="md">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Jobs List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <CardTitle as="h2">Análises Recentes</CardTitle>
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={refresh}>
            Atualizar
          </Button>
        </div>
        <JobList
          jobs={jobs}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          onCancel={handleCancel}
        />
      </div>

      {/* Quick Actions */}
      {jobs.length > 0 && (
        <Card variant="bordered" padding="lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white mb-1">
                Pronto para mais?
              </h3>
              <p className="text-sm text-gray-400">
                Adicione mais repositórios para melhorar o contexto das suas IAs
              </p>
            </div>
            <Link to="/app/new">
              <Button variant="outline" icon={Plus} iconPosition="left">
                Adicionar Repositório
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};
