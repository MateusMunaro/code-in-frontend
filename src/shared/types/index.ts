// ===== Job Types =====
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  repo_url: string;
  status: JobStatus;
  selected_model: string;
  result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobWithAnalysis extends Job {
  analysis?: AnalysisResult;
  repo?: Repository;
}

// Backend response format for /jobs/:id/analysis
export interface JobWithAnalysisResponse {
  job: Job;
  analysis: AnalysisResult | null;
}

// ===== Repository Types =====
export interface Repository {
  id: string;
  job_id: string;
  name: string;
  structure_json: Record<string, unknown>;
  file_count: number;
  total_lines: number;
  languages: string[];
  created_at: string;
}

// ===== Analysis Types =====
export interface AnalysisResult {
  id: string;
  job_id: string;
  documentation: string;
  patterns: string[];
  architecture_type: string | null;
  confidence_score: number;
  agent_reasoning: AgentReasoning[];
  dependencies_graph: Record<string, unknown>;
  suggested_improvements: SuggestedImprovement[];
  created_at: string;
}

export interface AgentReasoning {
  step: number;
  thought: string;
  action: string;
  observation: string;
}

export interface SuggestedImprovement {
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

// ===== Model Types =====
export type ModelProvider = 'openai' | 'anthropic' | 'ollama' | 'google';

export interface LLMModel {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
  maxTokens: number;
  costPer1kTokens: number | null;
  isLocal: boolean;
  capabilities: string[];
}

export interface ModelsByProvider {
  [provider: string]: LLMModel[];
}

// ===== WebSocket Types =====
export interface WSStatusMessage {
  job_id: string;
  status: JobStatus;
  message?: string;
  progress?: number;
  timestamp: string;
}

export interface WSCompleteMessage {
  job_id: string;
  success: boolean;
  result?: Record<string, unknown>;
  error?: string;
  timestamp: string;
}

export type WSMessage =
  | { type: 'status'; job_id: string; data: WSStatusMessage }
  | { type: 'complete'; job_id: string; data: WSCompleteMessage }
  | { type: 'subscribed'; job_id: string; message: string }
  | { type: 'pong' };

// ===== API Response Types =====
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ===== User & Auth Types =====
export interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ===== Form Types =====
export interface CreateJobForm {
  repo_url: string;
  selected_model: string;
}

export interface UpdateJobForm {
  selected_model: string;
}

// ===== API Response Types for Create/Retry =====
export interface CreateJobResponse {
  job_id: string;
  repo_url: string;
  repo_name: string;
  selected_model: string;
  status: JobStatus;
  message: string;
}

// ===== Settings Types =====
export interface ApiKeySettings {
  openai?: string;
  anthropic?: string;
  google?: string;
}
