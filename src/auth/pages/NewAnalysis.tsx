import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardTitle, CardDescription, Input, Button, Alert } from '@shared/components/ui';
import { ModelSelector } from '@auth/components/models';
import { useModels, useCreateJob } from '@auth/hooks';

export const NewAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { models, isLoading: isLoadingModels } = useModels();
  const { createJob, isLoading: isCreating, error } = useCreateJob();

  const [repoUrl, setRepoUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [step, setStep] = useState(1);

  const isValidGitUrl = (url: string) => {
    return /^https?:\/\/(github|gitlab|bitbucket)\.(com|org)\/[\w.-]+\/[\w.-]+/.test(url);
  };

  const handleSubmit = async () => {
    if (!repoUrl || !selectedModel) return;

    const result = await createJob(repoUrl, selectedModel);

    if (result.jobId) {
      navigate(`/app/jobs/${result.jobId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Nova Análise</h1>
        <p className="text-gray-400">
          Conecte um repositório Git para gerar contexto arquitetural para suas IAs
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {['Repositório', 'Modelo'].map((label, idx) => (
          <React.Fragment key={label}>
            <button
              onClick={() => idx + 1 < step && setStep(idx + 1)}
              className={`flex items-center gap-2 ${
                step === idx + 1
                  ? 'text-brand-primary'
                  : step > idx + 1
                  ? 'text-white'
                  : 'text-gray-500'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === idx + 1
                    ? 'bg-brand-primary/20 border-2 border-brand-primary'
                    : step > idx + 1
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/10'
                }`}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </span>
              <span className="hidden sm:inline font-medium">{label}</span>
            </button>
            {idx < 1 && (
              <div
                className={`flex-1 h-0.5 rounded-full ${
                  step > idx + 1 ? 'bg-brand-primary' : 'bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <Alert variant="error" onClose={() => {}}>
          {error}
        </Alert>
      )}

      {/* Step 1: Repository URL */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <Card variant="elevated" padding="lg">
            <CardTitle>URL do Repositório</CardTitle>
            <CardDescription>
              Cole a URL do repositório que você deseja analisar (GitHub, GitLab ou Bitbucket)
            </CardDescription>

            <div className="mt-6 space-y-6">
              <Input
                label="URL do Repositório Git"
                placeholder="https://github.com/seu-usuario/seu-repo"
                icon={GitBranch}
                iconPosition="left"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                error={
                  repoUrl && !isValidGitUrl(repoUrl)
                    ? 'Insira uma URL válida do GitHub, GitLab ou Bitbucket'
                    : undefined
                }
                hint="Suportamos repositórios públicos e privados (com token)"
              />

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!repoUrl || !isValidGitUrl(repoUrl)}
                  icon={ArrowRight}
                >
                  Próximo: Escolher Modelo
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Model Selection */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card variant="elevated" padding="lg">
            <CardTitle>Escolha o Modelo de IA</CardTitle>
            <CardDescription>
              Selecione qual modelo será usado para analisar seu repositório
            </CardDescription>

            <div className="mt-6">
              <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onSelect={setSelectedModel}
                isLoading={isLoadingModels}
              />

              <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedModel}
                  isLoading={isCreating}
                  icon={ArrowRight}
                >
                  Iniciar Análise
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card variant="bordered" padding="md" className="mt-4">
            <div className="flex items-center gap-4 text-sm">
              <AlertCircle className="w-5 h-5 text-brand-primary" />
              <div className="text-gray-400">
                <strong className="text-white">Resumo:</strong> Analisando{' '}
                <span className="text-brand-primary font-mono">{repoUrl}</span> usando{' '}
                <span className="text-brand-primary">{selectedModel}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
