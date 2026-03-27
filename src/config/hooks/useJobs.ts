import { useState, useEffect, useCallback } from 'react';
import { api } from '@shared/lib/api';
import { useAuthStore } from '@shared/stores/authStore';
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
  const { user } = useAuthStore();

  const createJob = async (repoUrl: string, selectedModel: string) => {
    setIsLoading(true);
    setError(null);

    // Debug log
    console.log('[useCreateJob] GitHub token available:', !!user?.github_token);

    const result = await api.jobs.create({
      repo_url: repoUrl,
      selected_model: selectedModel,
      github_token: user?.github_token, // Include token for PR creation
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

export function useCreateConflictAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConflictAnalysis = async (repoUrl: string, branches: string[], modelId?: string) => {
    setIsLoading(true);
    setError(null);

    const result = await api.repos.conflictAnalysis({
      repo_url: repoUrl,
      branches,
      model_id: modelId,
    });

    setIsLoading(false);

    if (result.success && result.data) {
      return { jobId: result.data.job_id, error: null };
    }

    setError(result.error || 'Erro ao criar análise de conflitos');
    return { jobId: null, error: result.error };
  };

  return { createConflictAnalysis, isLoading, error };
}

export function useFetchBranches() {
  const [branches, setBranches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setBranches([]);

    try {
      // Extract owner/repo from GitHub URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/.]+)/);
      if (!match) {
        setError('URL inválida. Apenas repositórios GitHub são suportados para seleção de branches.');
        setIsLoading(false);
        return;
      }

      const [, owner, repo] = match;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Repositório não encontrado. Verifique se o repositório é público.');
        } else {
          setError('Erro ao buscar branches do repositório.');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const branchNames = data.map((b: { name: string }) => b.name) as string[];
      setBranches(branchNames);
    } catch {
      setError('Erro de rede ao buscar branches.');
    }

    setIsLoading(false);
  }, []);

  return { branches, fetchBranches, isLoading, error };
}
