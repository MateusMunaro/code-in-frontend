import React, { useState } from 'react';
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
  const [errorExpanded, setErrorExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="interactive" padding="md">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 max-w-full">
          {/* Left: Info */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 border border-brand-primary/30 bg-brand-primary/10 flex-shrink-0">
                <GitBranch className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-theme-text truncate font-mono">{repoName}</h3>
                <p className="text-xs text-theme-text-muted truncate font-mono">{job.repo_url}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <StatusBadge status={job.status} size="sm" />
              <span className={`text-xs font-mono truncate ${getProviderColor(job.selected_model?.split('-')[0] || '')}`}>
                {job.selected_model || 'N/A'}
              </span>
              <span className="flex items-center gap-1 text-xs text-theme-text-muted whitespace-nowrap font-mono">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(job.created_at)}
              </span>
            </div>

            {job.error_message && (
              <div className="mt-3">
                <p className={`text-xs text-theme-error font-mono break-all ${errorExpanded ? '' : 'line-clamp-2'}`}>
                  &gt; ERROR: {job.error_message}
                </p>
                {job.error_message.length > 80 && (
                  <button
                    onClick={(e) => { e.preventDefault(); setErrorExpanded((v) => !v); }}
                    className="text-[10px] font-mono mt-1 text-theme-error opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {errorExpanded ? '[VER MENOS]' : '[VER MAIS]'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0 w-full sm:w-auto justify-end">
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
