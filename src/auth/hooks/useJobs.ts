import { useState, useEffect, useCallback } from 'react';
import { api } from '@shared/lib/api';
import type { Job, JobWithAnalysis } from '@shared/types';

export function useJobs(params?: { status?: string; limit?: number }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await api.jobs.list(params);
    
    if (result.success && result.data) {
      setJobs(result.data);
    } else {
      setError(result.error || 'Erro ao carregar jobs');
    }
    
    setIsLoading(false);
  }, [params?.status, params?.limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const refresh = () => fetchJobs();

  return { jobs, isLoading, error, refresh };
}

export function useJob(jobId: string) {
  const [job, setJob] = useState<JobWithAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    
    setIsLoading(true);
    setError(null);
    
    const result = await api.jobs.getFull(jobId);
    
    if (result.success && result.data) {
      setJob(result.data);
    } else {
      setError(result.error || 'Erro ao carregar job');
    }
    
    setIsLoading(false);
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const refresh = () => fetchJob();

  return { job, isLoading, error, refresh, setJob };
}

export function useCreateJob() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = async (repoUrl: string, selectedModel: string) => {
    setIsLoading(true);
    setError(null);

    const result = await api.jobs.create({
      repo_url: repoUrl,
      selected_model: selectedModel,
    });

    setIsLoading(false);

    if (result.success && result.data) {
      // Backend returns job_id, not id
      return { jobId: result.data.job_id, error: null };
    }

    setError(result.error || 'Erro ao criar job');
    return { jobId: null, error: result.error };
  };

  return { createJob, isLoading, error };
}

export function useCancelJob() {
  const [isLoading, setIsLoading] = useState(false);

  const cancelJob = async (jobId: string) => {
    setIsLoading(true);
    const result = await api.jobs.cancel(jobId);
    setIsLoading(false);
    return result.success;
  };

  return { cancelJob, isLoading };
}

export function useRetryJob() {
  const [isLoading, setIsLoading] = useState(false);

  const retryJob = async (jobId: string) => {
    setIsLoading(true);
    const result = await api.jobs.retry(jobId);
    setIsLoading(false);
    
    if (result.success && result.data) {
      return { job: result.data, error: null };
    }
    return { job: null, error: result.error };
  };

  return { retryJob, isLoading };
}
