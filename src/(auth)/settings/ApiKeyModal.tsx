import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Shield,
  ExternalLink,
  CheckCircle,
  Loader2,
  Key,
  ChevronRight,
} from 'lucide-react';
import { Modal, Input, Button, Badge, Alert } from '@shared/components/ui';
import { api } from '@shared/lib/api';
import type { UserApiKey, ApiKeyStatus } from '@shared/types';
import { PROVIDER_INFO } from '@shared/types';
import { cn } from '@shared/lib/utils';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'list' | 'add';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  // State
  const [view, setView] = useState<ModalView>('list');
  const [keys, setKeys] = useState<UserApiKey[]>([]);
  const [statuses, setStatuses] = useState<ApiKeyStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add key form state
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [keyLabel, setKeyLabel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const providers = Object.keys(PROVIDER_INFO);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [keysResult, statusResult] = await Promise.all([
        api.apiKeys.list(),
        api.apiKeys.status(),
      ]);

      if (keysResult.success && keysResult.data) {
        setKeys(keysResult.data);
      }
      if (statusResult.success && statusResult.data) {
        setStatuses(statusResult.data);
      }
    } catch {
      setError('Falha ao carregar chaves de API');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setView('list');
      resetForm();
    }
  }, [isOpen, fetchData]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const resetForm = () => {
    setSelectedProvider('');
    setApiKeyValue('');
    setKeyLabel('');
    setShowKey(false);
    setError(null);
  };

  const handleAddKey = async () => {
    if (!selectedProvider) {
      setError('Selecione um provedor');
      return;
    }
    if (!apiKeyValue || apiKeyValue.trim().length < 10) {
      setError('A chave de API é muito curta. Forneça uma chave válida.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const result = await api.apiKeys.store({
      provider: selectedProvider,
      api_key: apiKeyValue.trim(),
      label: keyLabel || undefined,
    });

    setIsSaving(false);

    if (result.success) {
      setSuccessMsg(`Chave ${PROVIDER_INFO[selectedProvider]?.name || selectedProvider} salva com sucesso!`);
      resetForm();
      setView('list');
      fetchData();
    } else {
      setError(result.error || 'Falha ao salvar chave');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    setDeletingId(keyId);
    const result = await api.apiKeys.delete(keyId);

    if (result.success) {
      setSuccessMsg('Chave removida com sucesso');
      fetchData();
    } else {
      setError(result.error || 'Falha ao deletar chave');
    }
    setDeletingId(null);
  };

  const getProviderStatus = (provider: string): boolean => {
    return statuses.find((s) => s.provider === provider)?.configured ?? false;
  };

  const getProviderKeys = (provider: string): UserApiKey[] => {
    return keys.filter((k) => k.provider === provider);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CHAVES DE API"
      description="Gerencie suas chaves BYOK (Bring Your Own Key)"
      size="lg"
    >
      <div className="space-y-4">
        {/* Alerts */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="success">{successMsg}</Alert>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Views */}
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ListView
                providers={providers}
                getProviderStatus={getProviderStatus}
                getProviderKeys={getProviderKeys}
                isLoading={isLoading}
                deletingId={deletingId}
                onAdd={() => {
                  resetForm();
                  setView('add');
                }}
                onDelete={handleDeleteKey}
              />
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <AddView
                providers={providers}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                apiKeyValue={apiKeyValue}
                setApiKeyValue={setApiKeyValue}
                keyLabel={keyLabel}
                setKeyLabel={setKeyLabel}
                showKey={showKey}
                setShowKey={setShowKey}
                isSaving={isSaving}
                onSave={handleAddKey}
                onBack={() => {
                  resetForm();
                  setView('list');
                }}
                configuredProviders={statuses
                  .filter((s) => s.configured)
                  .map((s) => s.provider)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy notice */}
        <div className="flex items-start gap-3 p-3 bg-brand-primary/5 border border-brand-primary/20">
          <Shield className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 font-mono">
            <span className="text-brand-primary font-bold">BYOK:</span> Suas chaves são
            criptografadas com AES-256-GCM e nunca armazenadas em texto puro.
          </p>
        </div>
      </div>
    </Modal>
  );
};

// ────────────────────────────────────────────────────────────────────
// ListView — Shows all providers and their configured keys
// ────────────────────────────────────────────────────────────────────
interface ListViewProps {
  providers: string[];
  getProviderStatus: (provider: string) => boolean;
  getProviderKeys: (provider: string) => UserApiKey[];
  isLoading: boolean;
  deletingId: string | null;
  onAdd: () => void;
  onDelete: (keyId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({
  providers,
  getProviderStatus,
  getProviderKeys,
  isLoading,
  deletingId,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-3">
      {/* Provider list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
          <span className="ml-3 text-gray-400 font-mono text-sm">Carregando...</span>
        </div>
      ) : (
        <>
          {providers.map((provider, index) => {
            const info = PROVIDER_INFO[provider];
            const configured = getProviderStatus(provider);
            const providerKeys = getProviderKeys(provider);

            return (
              <motion.div
                key={provider}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'p-4 border transition-colors duration-150',
                  configured
                    ? 'border-brand-primary/30 bg-brand-primary/5'
                    : 'border-[#333] bg-brand-gray/30 hover:border-[#444]'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 flex items-center justify-center border',
                        configured
                          ? 'border-brand-primary/30 bg-brand-primary/10'
                          : 'border-[#333] bg-brand-gray/50'
                      )}
                    >
                      <Key
                        className={cn(
                          'w-5 h-5',
                          configured ? 'text-brand-primary' : 'text-gray-500'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">
                          {info?.name || provider}
                        </span>
                        <Badge
                          variant={configured ? 'success' : 'default'}
                          size="sm"
                        >
                          {info?.badge || provider}
                        </Badge>
                      </div>
                      {providerKeys.length > 0 ? (
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="w-3 h-3 text-brand-primary" />
                          <span className="text-xs text-gray-400 font-mono">
                            {providerKeys[0].key_hint}
                          </span>
                          {providerKeys[0].label && (
                            <span className="text-xs text-gray-500 font-mono">
                              ({providerKeys[0].label})
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          Nenhuma chave configurada
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {providerKeys.length > 0 && (
                      <button
                        onClick={() => onDelete(providerKeys[0].id)}
                        disabled={deletingId === providerKeys[0].id}
                        className={cn(
                          'p-2 border border-transparent text-gray-500',
                          'hover:text-red-400 hover:border-red-500/30',
                          'transition-colors duration-100',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                      >
                        {deletingId === providerKeys[0].id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add new key button */}
          <Button
            variant="outline"
            icon={Plus}
            iconPosition="left"
            fullWidth
            onClick={onAdd}
            className="mt-4"
          >
            Adicionar Chave
          </Button>
        </>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────
// AddView — Form to add a new API key
// ────────────────────────────────────────────────────────────────────
interface AddViewProps {
  providers: string[];
  selectedProvider: string;
  setSelectedProvider: (p: string) => void;
  apiKeyValue: string;
  setApiKeyValue: (v: string) => void;
  keyLabel: string;
  setKeyLabel: (v: string) => void;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
  onBack: () => void;
  configuredProviders: string[];
}

const AddView: React.FC<AddViewProps> = ({
  providers,
  selectedProvider,
  setSelectedProvider,
  apiKeyValue,
  setApiKeyValue,
  keyLabel,
  setKeyLabel,
  showKey,
  setShowKey,
  isSaving,
  onSave,
  onBack,
  configuredProviders,
}) => {
  const selectedInfo = selectedProvider ? PROVIDER_INFO[selectedProvider] : null;

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-gray-400 hover:text-brand-primary transition-colors font-mono text-sm uppercase tracking-wider"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Voltar
      </button>

      {/* Provider selection */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-primary mb-3 font-mono">
          &gt; Selecione o provedor
        </label>
        <div className="grid grid-cols-3 gap-2">
          {providers.map((provider) => {
            const info = PROVIDER_INFO[provider];
            const isSelected = selectedProvider === provider;
            const isConfigured = configuredProviders.includes(provider);

            return (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={cn(
                  'p-3 border font-mono text-sm transition-all duration-100',
                  'flex flex-col items-center gap-1.5',
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-retro-sm'
                    : 'border-[#333] text-gray-400 hover:border-[#555] hover:text-white'
                )}
              >
                <span className="font-bold text-xs uppercase">{info?.name || provider}</span>
                <Badge
                  variant={isSelected ? 'primary' : isConfigured ? 'success' : 'default'}
                  size="sm"
                >
                  {info?.badge || provider}
                </Badge>
                {isConfigured && (
                  <span className="text-[10px] text-brand-primary">● configurada</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key input */}
      {selectedProvider && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* API Key field */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-primary mb-2 font-mono">
              &gt; Chave de API
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder={selectedInfo?.keyPrefix || 'Cole sua chave aqui...'}
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                className={cn(
                  'w-full bg-brand-black border-b-2 border-[#333]',
                  'text-white placeholder-gray-600 font-mono',
                  'transition-colors duration-150',
                  'focus:outline-none focus:border-brand-primary',
                  'px-4 py-3 pr-12'
                )}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-primary transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {selectedInfo?.keyUrl && (
              <a
                href={selectedInfo.keyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs text-brand-primary hover:text-white transition-colors font-mono"
              >
                Obter chave <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Label field */}
          <Input
            label="Label (opcional)"
            placeholder="Ex: Pessoal, Trabalho..."
            value={keyLabel}
            onChange={(e) => setKeyLabel(e.target.value)}
            hint="Um nome para identificar esta chave"
          />

          {/* Configured warning */}
          {configuredProviders.includes(selectedProvider) && (
            <Alert variant="warning">
              Este provedor já possui uma chave configurada. Ao salvar, a chave anterior será substituída.
            </Alert>
          )}

          {/* Save button */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={onBack}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={onSave}
              isLoading={isSaving}
              icon={Key}
              iconPosition="left"
              className="flex-1"
              disabled={!apiKeyValue.trim()}
            >
              Salvar Chave
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
