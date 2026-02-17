# Estrutura do Projeto Frontend

## Nova Organização de Pastas

A estrutura do projeto foi reorganizada seguindo as convenções do React Router e melhores práticas de organização:

### 📁 Estrutura Principal

```
src/
├── (auth)/                    # Rotas autenticadas (convenção React Router)
│   ├── Dashboard.tsx          # Página do dashboard
│   ├── JobDetail.tsx          # Detalhes do job
│   ├── NewAnalysis.tsx        # Nova análise
│   ├── Settings.tsx           # Configurações
│   ├── layout.tsx             # Layout principal das rotas autenticadas
│   └── index.ts               # Exports das páginas
│
├── components/                # Componentes compartilhados (global)
│   ├── docs/                  # Componentes de documentação
│   ├── jobs/                  # Componentes de jobs
│   ├── layout/                # Componentes de layout (Header, Sidebar)
│   └── models/                # Componentes de modelos
│
├── config/                    # Configurações e integrações
│   ├── apis/                  # Funções de API e requests
│   │   ├── api.ts             # Cliente de API principal
│   │   └── index.ts           # Exports
│   ├── hooks/                 # Hooks customizados
│   │   ├── useJobs.ts
│   │   ├── useModels.ts
│   │   ├── useWebSocket.ts
│   │   └── index.ts
│   └── index.ts               # Export principal
│
├── entities/                  # Entidades e tipos de domínio
│
├── shared/                    # Código compartilhado
│   ├── components/            # Componentes UI genéricos
│   ├── lib/                   # Utilitários
│   ├── stores/                # Stores de estado
│   └── types/                 # Tipos TypeScript
│
├── public/                    # Páginas públicas
│   ├── components/
│   └── pages/
│
├── context/                   # Contextos React
├── styles/                    # Estilos globais
├── App.tsx                    # Componente principal
└── main.tsx                   # Entry point
```

## 🔄 Mudanças Principais

### 1. Pasta `(auth)` com Parênteses
- Segue a convenção do React Router para rotas agrupadas
- Contém diretamente as páginas autenticadas
- Inclui `layout.tsx` como arquivo principal de layout

### 2. Pasta `config/`
- Centraliza configurações e integrações
- **`apis/`**: Funções de requisição HTTP
- **`hooks/`**: Hooks customizados movidos de `auth/hooks`

### 3. Pasta `components/` na Raiz
- Componentes agora são globalmente acessíveis
- Removidos de dentro de `auth/`
- Melhor reutilização em todo o projeto

### 4. Pasta `entities/`
- Preparada para receber entidades de domínio
- Tipos e interfaces de negócio

## 📝 Path Aliases Atualizados

```json
{
  "@/*": ["src/*"],
  "@shared/*": ["src/shared/*"],
  "@public/*": ["src/public/*"],
  "@/(auth)/*": ["src/(auth)/*"],
  "@config/*": ["src/config/*"],
  "@entities/*": ["src/entities/*"],
  "@components/*": ["src/components/*"]
}
```

## 🎯 Imports Atualizados

### Antes:
```tsx
import { ModelSelector } from '@auth/components/models';
import { useModels } from '@auth/hooks';
```

### Depois:
```tsx
import { ModelSelector } from '@components/models';
import { useModels } from '@config/hooks';
```

## ✅ Benefícios da Nova Estrutura

1. **Melhor Organização**: Separação clara entre páginas, componentes e configurações
2. **Convenções Modernas**: Uso de `(auth)` segue padrões do React Router
3. **Reutilização**: Componentes globalmente acessíveis
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Manutenibilidade**: Código mais fácil de encontrar e manter
