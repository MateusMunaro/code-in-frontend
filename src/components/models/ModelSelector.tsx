import React from 'react';
import { Sparkles, Crown } from 'lucide-react';
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

  // Split into recommended (Flash models) and Pro models
  const recommendedModels = models.filter(
    (m) => m.id === 'gemini-2.5-flash' || m.id === 'gemini-2.5-pro'
  );
  const otherModels = models.filter(
    (m) => m.id !== 'gemini-2.5-flash' && m.id !== 'gemini-2.5-pro'
  );

  return (
    <div className="space-y-8">
      {/* Recommended */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-primary" />
          <h3 className="font-semibold text-white">Recomendado</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendedModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={selectedModel === model.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {/* Other Gemini Models */}
      {otherModels.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white">Outros Modelos Gemini</h3>
            <Badge variant="default" size="sm">
              {otherModels.length} disponíveis
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {otherModels.map((model) => (
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
