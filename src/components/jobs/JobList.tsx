import React from 'react';
import { FolderGit2 } from 'lucide-react';
import { EmptyState, Skeleton, Button } from '@shared/components/ui';
import { JobCard } from './JobCard';
import type { Job } from '@shared/types';
import { Link } from 'react-router-dom';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  onRetry?: (jobId: string) => void;
  onCancel?: (jobId: string) => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  error,
  onRetry,
  onCancel,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-start gap-4">
              <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <div className="flex gap-4">
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={100} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<FolderGit2 className="w-12 h-12" />}
        title="Erro ao carregar"
        description={error}
        action={
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        }
      />
    );
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={<FolderGit2 className="w-12 h-12" />}
        title="Nenhuma análise ainda"
        description="Comece analisando seu primeiro repositório para gerar contexto arquitetural para suas IAs."
        action={
          <Link to="/app/new">
            <Button>Criar primeira análise</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onRetry={onRetry}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};
