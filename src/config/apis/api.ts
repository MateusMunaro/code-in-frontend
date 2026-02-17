import type { 
  Job, 
  JobWithAnalysis,
  JobWithAnalysisResponse, 
  LLMModel, 
  ModelsByProvider, 
  CreateJobForm,
  CreateJobResponse,
  UpdateJobForm,
  ApiResponse,
  DocumentationFilesResponse,
  DocumentationFileContent,
} from '@shared/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

/**
 * Base fetch wrapper with error handling
 * Backend returns { success: boolean, data: T, error?: string }
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const json = await response.json();

    if (!response.ok || json.success === false) {
      return {
        success: false,
        error: json.error || json.message || 'Request failed',
      };
    }

    // Backend wraps response in { success, data }, extract the inner data
    return {
      success: true,
      data: json.data as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ===== Health =====
export async function checkHealth() {
  return fetchApi<{ status: string; timestamp: string }>('/health');
}

// ===== Jobs =====
export async function getJobs(params?: { 
  status?: string; 
  limit?: number; 
  offset?: number 
}) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());
  
  const query = searchParams.toString();
  return fetchApi<Job[]>(`/jobs${query ? `?${query}` : ''}`);
}

export async function getJob(jobId: string) {
  return fetchApi<Job>(`/jobs/${jobId}`);
}

export async function getJobWithAnalysis(jobId: string): Promise<ApiResponse<JobWithAnalysis>> {
  const result = await fetchApi<JobWithAnalysisResponse>(`/jobs/${jobId}/analysis`);
  
  if (result.success && result.data && result.data.job) {
    // Flatten the response: merge job properties with analysis
    return {
      success: true,
      data: {
        ...result.data.job,
        analysis: result.data.analysis ?? undefined,
      },
    };
  }
  
  return {
    success: false,
    error: result.error || 'Job data not found',
  };
}

export async function updateJob(jobId: string, data: UpdateJobForm) {
  return fetchApi<Job>(`/jobs/${jobId}/model`, {
    method: 'PATCH',
    body: JSON.stringify({ model_id: data.selected_model }),
  });
}

export async function cancelJob(jobId: string) {
  return fetchApi<{ message: string }>(`/jobs/${jobId}`, {
    method: 'DELETE',
  });
}

// ===== Repos =====
export async function createJob(data: CreateJobForm) {
  console.log('[API] createJob - github_token:', data.github_token ? '✓ provided' : '✗ missing');
  
  return fetchApi<CreateJobResponse>('/repos', {
    method: 'POST',
    body: JSON.stringify({
      repo_url: data.repo_url,
      model_id: data.selected_model,
      github_token: data.github_token,
    }),
  });
}

export async function retryJob(jobId: string) {
  return fetchApi<Job>(`/repos/${jobId}/retry`, {
    method: 'POST',
  });
}

// ===== Models =====
export async function getModels() {
  return fetchApi<LLMModel[]>('/models');
}

export async function getModelsByProvider() {
  return fetchApi<ModelsByProvider>('/models/grouped');
}

export async function getLocalModels() {
  return fetchApi<LLMModel[]>('/models/local');
}

export async function getCloudModels() {
  return fetchApi<LLMModel[]>('/models/cloud');
}

export async function getModel(modelId: string) {
  return fetchApi<LLMModel>(`/models/${modelId}`);
}

export async function checkModelAvailability(modelId: string) {
  return fetchApi<{ model_id: string; available: boolean; message: string }>(`/models/${modelId}/status`);
}

// ===== Documentation =====
export async function getDocumentationFiles(jobId: string) {
  return fetchApi<DocumentationFilesResponse>(`/jobs/${jobId}/docs`);
}

export async function getDocumentationFile(jobId: string, filePath: string) {
  return fetchApi<DocumentationFileContent>(`/jobs/${jobId}/files/${filePath}`);
}

// ===== API Client Export =====
export const api = {
  health: checkHealth,
  jobs: {
    list: getJobs,
    get: getJob,
    getFull: getJobWithAnalysis,
    update: updateJob,
    cancel: cancelJob,
    create: createJob,
    retry: retryJob,
  },
  docs: {
    list: getDocumentationFiles,
    get: getDocumentationFile,
  },
  models: {
    list: getModels,
    byProvider: getModelsByProvider,
    local: getLocalModels,
    cloud: getCloudModels,
    get: getModel,
    checkAvailable: checkModelAvailability,
  },
};
