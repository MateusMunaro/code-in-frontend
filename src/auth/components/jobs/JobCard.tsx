import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Clock, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import { Card, StatusBadge, Button } from '@shared/components/ui';
import { formatRelativeTime, extractRepoName, getProviderColor } from '@shared/lib/utils';
import type { Job } from '@shared/types';

interface JobCardProps {
  job: Job;
  onRetry?: (jobId: string) => void;
  onCancel?: (jobId: string) => void;
  isRetrying?: boolean;
  isCanceling?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onRetry,
  onCancel,
  isRetrying,
  isCanceling,
}) => {
  const repoName = extractRepoName(job.repo_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="interactive" padding="md">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <GitBranch className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white truncate">{repoName}</h3>
                <p className="text-xs text-gray-500 truncate">{job.repo_url}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <StatusBadge status={job.status} size="sm" />
              <span className={`text-xs font-mono ${getProviderColor(job.selected_model.split('-')[0])}`}>
                {job.selected_model}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(job.created_at)}
              </span>
            </div>

            {job.error_message && (
              <p className="mt-3 text-xs text-red-400 truncate">
                {job.error_message}
              </p>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {job.status === 'failed' && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                iconPosition="left"
                onClick={() => onRetry(job.id)}
                isLoading={isRetrying}
              >
                Retry
              </Button>
            )}
            {(job.status === 'pending' || job.status === 'processing') && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                iconPosition="left"
                onClick={() => onCancel(job.id)}
                isLoading={isCanceling}
              >
                Cancelar
              </Button>
            )}
            <Link to={`/app/jobs/${job.id}`}>
              <Button variant="ghost" size="sm" icon={ArrowRight}>
                Ver
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
