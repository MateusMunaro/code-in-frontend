import { useState, useEffect, useCallback } from 'react';
import { api } from '@shared/lib/api';
import type { LLMModel, ModelsByProvider } from '@shared/types';

export function useModels() {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await api.models.list();

    if (result.success && result.data) {
      setModels(result.data);
    } else {
      setError(result.error || 'Erro ao carregar modelos');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { models, isLoading, error };
}

export function useModelsByProvider() {
  const [modelsByProvider, setModelsByProvider] = useState<ModelsByProvider>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await api.models.byProvider();

    if (result.success && result.data) {
      setModelsByProvider(result.data);
    } else {
      setError(result.error || 'Erro ao carregar modelos');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const cloudModels = Object.entries(modelsByProvider)
    .filter(([provider]) => provider !== 'ollama')
    .flatMap(([, models]) => models);

  const localModels = modelsByProvider['ollama'] || [];

  return { modelsByProvider, cloudModels, localModels, isLoading, error };
}

export function useModel(modelId: string) {
  const [model, setModel] = useState<LLMModel | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModel = useCallback(async () => {
    if (!modelId) return;

    setIsLoading(true);
    setError(null);

    const [modelResult, availabilityResult] = await Promise.all([
      api.models.get(modelId),
      api.models.checkAvailable(modelId),
    ]);

    if (modelResult.success && modelResult.data) {
      setModel(modelResult.data);
    } else {
      setError(modelResult.error || 'Erro ao carregar modelo');
    }

    if (availabilityResult.success && availabilityResult.data) {
      setIsAvailable(availabilityResult.data.available);
    }

    setIsLoading(false);
  }, [modelId]);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  return { model, isAvailable, isLoading, error };
}
