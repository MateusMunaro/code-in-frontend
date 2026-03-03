import React from 'react';
import { motion } from 'framer-motion';
import { Check, Cpu, Cloud, HardDrive } from 'lucide-react';
import { Card } from '@shared/components/ui';
import { cn, getProviderColor, formatNumber } from '@shared/lib/utils';
import type { LLMModel } from '@shared/types';

interface ModelCardProps {
  model: LLMModel;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isSelected,
  onSelect,
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
    >
      <Card
        variant="interactive"
        padding="md"
        className={cn(
          'cursor-pointer relative',
          isSelected && 'border-brand-primary bg-brand-primary/5 shadow-retro-sm'
        )}
        onClick={() => onSelect(model.id)}
      >
        {isSelected && (
          <div className="absolute top-3 right-3 p-1 bg-brand-primary border border-brand-primary">
            <Check className="w-3 h-3 text-black" />
          </div>
        )}

        <div className="flex items-start gap-4">
          <div
            className={cn(
              'p-3 border bg-brand-gray',
              model.isLocal ? 'text-purple-400 border-purple-400/30' : 'text-brand-primary border-brand-primary/30'
            )}
          >
            {model.isLocal ? (
              <HardDrive className="w-5 h-5" />
            ) : (
              <Cloud className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-white truncate font-mono">{model.name}</h4>
              <span
                className={cn(
                  'text-xs font-mono px-2 py-0.5 border border-[#444] bg-brand-gray',
                  getProviderColor(model.provider)
                )}
              >
                {model.provider}
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 font-mono">{model.description}</p>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                {formatNumber(model.maxTokens)} tokens
              </span>
              {model.costPer1kTokens !== null ? (
                <span>${model.costPer1kTokens}/1K</span>
              ) : (
                <span className="text-brand-primary">[FREE] Local</span>
              )}
            </div>

            {model.capabilities.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {model.capabilities.slice(0, 3).map((cap) => (
                  <span
                    key={cap}
                    className="text-xs px-2 py-0.5 bg-brand-gray border border-[#444] text-gray-400 font-mono"
                  >
                    {cap}
                  </span>
                ))}
                {model.capabilities.length > 3 && (
                  <span className="text-xs px-2 py-0.5 text-gray-500 font-mono">
                    +{model.capabilities.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
