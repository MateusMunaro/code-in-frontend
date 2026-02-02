import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Save, AlertCircle, User, Bell } from 'lucide-react';
import { Card, CardTitle, CardDescription, Input, Button, Alert, Badge } from '@shared/components/ui';
import { useAuthStore } from '@shared/stores';

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
  });
  
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveKeys = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleShowKey = (provider: keyof typeof showKeys) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">
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
            <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-primary">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white">
                {user?.user_metadata?.full_name || 'Usuário'}
              </p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Membro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* API Keys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-brand-primary" />
            <CardTitle>Chaves de API (BYOK)</CardTitle>
          </div>
          <CardDescription className="mb-6">
            Configure suas próprias chaves de API para usar os modelos de IA.
            Suas chaves são criptografadas e nunca armazenadas em texto puro.
          </CardDescription>

          {saveSuccess && (
            <Alert variant="success" className="mb-6">
              Chaves salvas com sucesso!
            </Alert>
          )}

          <div className="space-y-6">
            {/* OpenAI */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                OpenAI
                <Badge variant="primary" size="sm">GPT-4</Badge>
              </label>
              <div className="relative">
                <Input
                  type={showKeys.openai ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys((prev) => ({ ...prev, openai: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('openai')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Anthropic */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Anthropic
                <Badge variant="secondary" size="sm">Claude</Badge>
              </label>
              <div className="relative">
                <Input
                  type={showKeys.anthropic ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={apiKeys.anthropic}
                  onChange={(e) => setApiKeys((prev) => ({ ...prev, anthropic: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('anthropic')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showKeys.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Google */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Google AI
                <Badge variant="default" size="sm">Gemini</Badge>
              </label>
              <div className="relative">
                <Input
                  type={showKeys.google ? 'text' : 'password'}
                  placeholder="AIza..."
                  value={apiKeys.google}
                  onChange={(e) => setApiKeys((prev) => ({ ...prev, google: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('google')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showKeys.google ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300">
                <strong>Privacidade BYOK:</strong> Suas chaves são usadas apenas para fazer
                requisições em seu nome. Nunca armazenamos ou acessamos seus dados de API.
              </p>
            </div>

            <Button
              onClick={handleSaveKeys}
              isLoading={isSaving}
              icon={Save}
              iconPosition="left"
            >
              Salvar Chaves
            </Button>
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
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-brand-primary" />
            <CardTitle>Notificações</CardTitle>
          </div>

          <div className="space-y-4">
            {[
              { id: 'email_complete', label: 'Email quando análise concluir', enabled: true },
              { id: 'email_failed', label: 'Email quando análise falhar', enabled: true },
              { id: 'browser', label: 'Notificações no navegador', enabled: false },
            ].map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
              >
                <span className="text-gray-300">{notification.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={notification.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                </label>
              </div>
            ))}
          </div>
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

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="danger">Excluir todos os dados</Button>
            <Button variant="danger">Excluir conta</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
