import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Plus,
  User,
  Bell,
  Shield,
  CheckCircle,
  Loader2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Card, CardTitle, CardDescription, Button, Alert, Badge } from '@shared/components/ui';
import { useAuthStore } from '@shared/stores';
import { api } from '@shared/lib/api';
import type { UserApiKey, ApiKeyStatus } from '@shared/types';
import { PROVIDER_INFO } from '@shared/types';
import { cn } from '@shared/lib/utils';
import { ApiKeyModal } from './ApiKeyModal';
import { useTheme } from '@shared/contexts/ThemeContext';
import { requestBrowserNotificationPermission } from '@config/hooks';

const NOTIF_STORAGE_KEY = 'code-in:notification-prefs';

const defaultNotifPrefs: Record<string, boolean> = {
  email_complete: true,
  email_failed: true,
  browser: false,
};

function loadNotifPrefs(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
    return stored ? { ...defaultNotifPrefs, ...JSON.parse(stored) } : defaultNotifPrefs;
  } catch {
    return defaultNotifPrefs;
  }
}

export const Settings: React.FC = () => {
  const { user } = useAuthStore();

  // API Keys state
  const [keys, setKeys] = useState<UserApiKey[]>([]);
  const [statuses, setStatuses] = useState<ApiKeyStatus[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  // Notification prefs state (persisted to localStorage)
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(loadNotifPrefs);
  const [notifSaved, setNotifSaved] = useState(false);

  // Danger zone confirmation state
  const [dangerConfirm, setDangerConfirm] = useState<'data' | 'account' | null>(null);
  const notifSavedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (notifSavedTimer.current) clearTimeout(notifSavedTimer.current); }, []);

  const { colors } = useTheme();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const providers = Object.keys(PROVIDER_INFO);

  const fetchKeys = useCallback(async () => {
    setIsLoadingKeys(true);
    setKeyError(null);
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
      setKeyError('Falha ao carregar chaves de API');
    } finally {
      setIsLoadingKeys(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  // Clear delete success after 3 seconds
  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => setDeleteSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  const handleDeleteKey = async (keyId: string) => {
    setDeletingId(keyId);
    const result = await api.apiKeys.delete(keyId);
    if (result.success) {
      setDeleteSuccess(true);
      fetchKeys();
    } else {
      setKeyError(result.error || 'Falha ao remover chave');
    }
    setDeletingId(null);
  };

  const getProviderStatus = (provider: string): boolean => {
    return statuses.find((s) => s.provider === provider)?.configured ?? false;
  };

  const getProviderKeys = (provider: string): UserApiKey[] => {
    return keys.filter((k) => k.provider === provider);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchKeys();
  };

  const handleNotifChange = async (id: string, value: boolean) => {
    if (id === 'browser' && value) {
      const permission = await requestBrowserNotificationPermission();
      if (permission !== 'granted') {
        setKeyError(
          permission === 'denied'
            ? 'Permissão de notificações negada. Habilite nas configurações do navegador.'
            : 'Permissão de notificações não concedida.'
        );
        return;
      }
    }
    const updated = { ...notifPrefs, [id]: value };
    setNotifPrefs(updated);
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
    setNotifSaved(true);
    if (notifSavedTimer.current) clearTimeout(notifSavedTimer.current);
    notifSavedTimer.current = setTimeout(() => setNotifSaved(false), 2000);
  };

  const handleDangerAction = (type: 'data' | 'account') => {
    if (dangerConfirm !== type) {
      setDangerConfirm(type);
      return;
    }
    // Funcionalidade de exclusão requer endpoint backend — em desenvolvimento
    setDangerConfirm(null);
    setKeyError(
      type === 'account'
        ? 'Exclusão de conta requer suporte via admin. Entre em contato.'
        : 'Exclusão de dados requer suporte via admin. Entre em contato.'
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>Configurações</h1>
        <p className="text-gray-400" style={{ color: colors.text.muted }}>
          Gerencie suas chaves de API e preferências
        </p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-brand-primary" />
            <CardTitle>Perfil</CardTitle>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 flex items-center justify-center border-2 font-mono font-bold text-2xl"
              style={{ borderColor: colors.brand.primary, backgroundColor: `${colors.brand.primary}1A`, color: colors.brand.primary }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold font-mono" style={{ color: colors.text.primary }}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-sm font-mono" style={{ color: colors.text.secondary }}>{user?.email}</p>
              <p className="text-xs font-mono mt-1" style={{ color: colors.text.muted }}>
                Membro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* API Keys (BYOK) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-primary" />
              <CardTitle>Chaves de API (BYOK)</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              iconPosition="left"
              onClick={() => setIsModalOpen(true)}
            >
              Adicionar
            </Button>
          </div>
          <CardDescription className="mb-6">
            Configure suas próprias chaves de API para usar modelos de IA de diferentes provedores.
            Suas chaves são criptografadas e nunca armazenadas em texto puro.
          </CardDescription>

          {/* Alerts */}
          {deleteSuccess && (
            <Alert variant="success" className="mb-4">
              Chave removida com sucesso!
            </Alert>
          )}
          {keyError && (
            <Alert variant="error" className="mb-4" onClose={() => setKeyError(null)}>
              {keyError}
            </Alert>
          )}

          {/* Provider cards */}
          <div className="space-y-3">
            {isLoadingKeys ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                <span className="ml-3 font-mono text-sm" style={{ color: colors.text.muted }}>Carregando chaves...</span>
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
                      transition={{ delay: 0.25 + index * 0.05 }}
                      className={cn(
                        'flex items-center justify-between p-4 border transition-colors duration-150',
                        configured
                          ? 'border-brand-primary/30 bg-brand-primary/5'
                          : 'border-[#333] bg-white/5 hover:border-[#444]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 flex items-center justify-center border',
                            configured
                              ? 'border-brand-primary/30 bg-brand-primary/10'
                              : 'border-[#333] bg-brand-gray/50'
                          )}
                        >
                          {configured ? (
                            <CheckCircle className="w-5 h-5 text-brand-primary" />
                          ) : (
                            <Key className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
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
                              <span className="text-xs font-mono" style={{ color: colors.text.secondary }}>
                                {providerKeys[0].key_hint}
                              </span>
                              {providerKeys[0].label && (
                                <span className="text-xs font-mono" style={{ color: colors.text.muted }}>
                                  • {providerKeys[0].label}
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs font-mono mt-1" style={{ color: colors.text.muted }}>
                              Nenhuma chave configurada
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {providerKeys.length > 0 ? (
                          <button
                            onClick={() => handleDeleteKey(providerKeys[0].id)}
                            disabled={deletingId === providerKeys[0].id}
                            className={cn(
                              'p-2 border border-transparent text-gray-500',
                              'hover:text-red-400 hover:border-red-500/30',
                              'transition-colors duration-100',
                              'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                            title="Remover chave"
                          >
                            {deletingId === providerKeys[0].id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className={cn(
                              'p-2 border border-[#333] text-gray-500',
                              'hover:text-brand-primary hover:border-brand-primary/30',
                              'transition-colors duration-100'
                            )}
                            title="Adicionar chave"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>

          {/* Privacy notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 mt-6">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300">
                <strong>Privacidade BYOK:</strong> Sua chave é criptografada com AES-256-GCM
                e usada apenas para fazer requisições em seu nome.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                {providers.map((provider) => {
                  const info = PROVIDER_INFO[provider];
                  return (
                    <a
                      key={provider}
                      href={info?.keyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-primary hover:text-white transition-colors font-mono"
                    >
                      Obter chave {info?.name} <ExternalLink className="w-3 h-3" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-primary" />
              <CardTitle>Notificações</CardTitle>
            </div>
            {notifSaved && (
              <span className="text-xs font-mono" style={{ color: colors.status.success }}>
                ✓ Salvo
              </span>
            )}
          </div>

          <div className="space-y-1">
            {[
              { id: 'email_complete', label: 'Email quando análise concluir' },
              { id: 'email_failed', label: 'Email quando análise falhar' },
              { id: 'browser', label: 'Notificações no navegador' },
            ].map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4"
                style={{
                  backgroundColor: colors.background.content,
                  border: `1px solid ${colors.border.default}`,
                }}
              >
                <span className="font-mono text-sm" style={{ color: colors.text.secondary }}>
                  {notification.label}
                </span>
                <button
                  role="switch"
                  aria-checked={notifPrefs[notification.id]}
                  onClick={() => handleNotifChange(notification.id, !notifPrefs[notification.id])}
                  className="flex-shrink-0 w-16 h-7 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-1 border-2"
                  style={{
                    backgroundColor: notifPrefs[notification.id]
                      ? colors.brand.primary
                      : 'transparent',
                    borderColor: notifPrefs[notification.id]
                      ? colors.brand.primary
                      : colors.border.default,
                    color: notifPrefs[notification.id]
                      ? colors.background.content
                      : colors.text.muted,
                  }}
                >
                  {notifPrefs[notification.id] ? '[SIM]' : '[NÃO]'}
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] font-mono mt-3" style={{ color: colors.text.muted }}>
            // Preferências salvas localmente. Notificações de email dependem do backend estar disponível.
          </p>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="bordered" padding="lg" className="border-red-500/20">
          <CardTitle className="text-red-400">Zona de Perigo</CardTitle>
          <CardDescription className="mb-6">
            Ações irreversíveis para sua conta
          </CardDescription>

          <div className="space-y-4">
            {/* Delete data */}
            <div
              className="p-4"
              style={{ backgroundColor: colors.background.content, border: `1px solid ${colors.status.error}20` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                    Excluir todos os dados
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: colors.text.muted }}>
                    Remove todos os jobs e análises. Sua conta é mantida.
                  </p>
                </div>
                {dangerConfirm === 'data' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: colors.status.error }}>Tem certeza?</span>
                    <Button variant="danger" size="sm" onClick={() => handleDangerAction('data')}>
                      Confirmar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDangerConfirm(null)}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button variant="danger" size="sm" onClick={() => handleDangerAction('data')}>
                    Excluir dados
                  </Button>
                )}
              </div>
            </div>

            {/* Delete account */}
            <div
              className="p-4"
              style={{ backgroundColor: colors.background.content, border: `1px solid ${colors.status.error}20` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-mono font-bold text-sm" style={{ color: colors.text.primary }}>
                    Excluir conta
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: colors.text.muted }}>
                    Remove permanentemente sua conta e todos os dados associados.
                  </p>
                </div>
                {dangerConfirm === 'account' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: colors.status.error }}>Tem certeza?</span>
                    <Button variant="danger" size="sm" onClick={() => handleDangerAction('account')}>
                      Confirmar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDangerConfirm(null)}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button variant="danger" size="sm" onClick={() => handleDangerAction('account')}>
                    Excluir conta
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* API Key Modal */}
      <ApiKeyModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};
