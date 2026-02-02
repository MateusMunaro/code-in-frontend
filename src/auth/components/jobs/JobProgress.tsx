import React from 'react';
import { motion } from 'framer-motion';
import { Progress, Badge } from '@shared/components/ui';
import { cn } from '@shared/lib/utils';
import type { JobStatus } from '@shared/types';

interface JobProgressProps {
  status: JobStatus;
  progress?: number;
  message?: string;
}

export const JobProgress: React.FC<JobProgressProps> = ({
  status,
  progress = 0,
  message,
}) => {
  const steps = [
    { id: 'pending', label: 'Na fila' },
    { id: 'processing', label: 'Analisando' },
    { id: 'completed', label: 'Concluído' },
  ];

  const getStepStatus = (stepId: string) => {
    if (status === 'failed') {
      if (stepId === 'pending') return 'completed';
      if (stepId === 'processing') return 'failed';
      return 'pending';
    }
    
    const currentIndex = steps.findIndex((s) => s.id === status);
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="space-y-6">
      {/* Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(step.id);
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: stepStatus === 'current' ? 1.1 : 1 }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                    stepStatus === 'completed' && 'bg-brand-primary text-white',
                    stepStatus === 'current' && 'bg-brand-primary/20 text-brand-primary border-2 border-brand-primary',
                    stepStatus === 'pending' && 'bg-white/10 text-gray-500',
                    stepStatus === 'failed' && 'bg-red-500/20 text-red-400 border-2 border-red-500'
                  )}
                >
                  {stepStatus === 'completed' ? '✓' : idx + 1}
                </motion.div>
                <span
                  className={cn(
                    'text-sm',
                    stepStatus === 'current' ? 'text-white font-medium' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      'h-0.5 rounded-full',
                      stepStatus === 'completed' ? 'bg-brand-primary' : 'bg-white/10'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Bar (for processing status) */}
      {status === 'processing' && (
        <div className="space-y-2">
          <Progress value={progress} showLabel animated />
          {message && (
            <p className="text-sm text-gray-400 text-center">{message}</p>
          )}
        </div>
      )}

      {/* Status Badge */}
      {status === 'failed' && (
        <div className="text-center">
          <Badge variant="error" size="lg">
            Análise falhou - verifique os logs
          </Badge>
        </div>
      )}

      {status === 'completed' && (
        <div className="text-center">
          <Badge variant="success" size="lg">
            Análise concluída com sucesso!
          </Badge>
        </div>
      )}
    </div>
  );
};
