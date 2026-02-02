import React from 'react';
import { Cloud, HardDrive, Sparkles } from 'lucide-react';
import { ModelCard } from './ModelCard';
import { Skeleton, Badge } from '@shared/components/ui';
// Utils
import type { LLMModel } from '@shared/types';

interface ModelSelectorProps {
  models: LLMModel[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
  isLoading?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-start gap-4">
              <Skeleton variant="rectangular" width={48} height={48} className="rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="100%" />
                <div className="flex gap-2">
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={80} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cloudModels = models.filter((m) => !m.isLocal);
  const localModels = models.filter((m) => m.isLocal);

  return (
    <div className="space-y-8">
      {/* Recommended */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-primary" />
          <h3 className="font-semibold text-white">Recomendado</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {models
            .filter((m) => m.id === 'gpt-4o-mini' || m.id === 'claude-3-5-sonnet-20241022')
            .map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModel === model.id}
                onSelect={onSelect}
              />
            ))}
        </div>
      </div>

      {/* Cloud Models */}
      {cloudModels.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Cloud</h3>
            <Badge variant="default" size="sm">
              {cloudModels.length} disponíveis
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {cloudModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModel === model.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Local Models */}
      {localModels.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">Local (Ollama)</h3>
            <Badge variant="secondary" size="sm">
              Gratuito
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {localModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModel === model.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
