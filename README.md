# Code-in Frontend

Frontend React + TypeScript para a aplicação Code-in.

## 🚀 Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite 6** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router DOM 6** - Routing
- **Zustand** - State management
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Supabase** - Authentication

## 📁 Estrutura do Projeto

```
src/
├── shared/              # Código compartilhado
│   ├── components/      # Componentes UI reutilizáveis
│   │   └── ui/          # Design system
│   ├── lib/             # Utilitários e clientes
│   ├── stores/          # State management (Zustand)
│   └── types/           # TypeScript types
├── public/              # Rotas públicas
│   ├── components/      # Componentes da landing page
│   └── pages/           # Login, Signup, Landing
└── auth/                # Rotas autenticadas
    ├── components/      # Componentes específicos
    │   ├── layout/      # AppLayout, Sidebar, Header
    │   ├── jobs/        # JobCard, JobList, JobProgress
    │   └── models/      # ModelCard, ModelSelector
    ├── hooks/           # React hooks
    └── pages/           # Dashboard, NewAnalysis, JobDetail, Settings
```

## 🛠️ Setup

### Pré-requisitos

- Node.js 18+
- npm ou pnpm

### Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas configurações
```

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3333
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_WS_URL=ws://localhost:3333/ws
```

### Desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:3000`

### Build

```bash
npm run build
```

Output em `dist/`

## 🎨 Design System

### Cores

- **Primary (Emerald)**: `#10b981` - Ações principais, sucesso
- **Secondary (Violet)**: `#8b5cf6` - Destaques, accent
- **Black**: `#0a0a0a` - Background principal
- **Dark**: `#171717` - Surfaces elevadas

### Componentes UI

- `Button` - 5 variantes (primary, secondary, outline, ghost, danger)
- `Card` - Container com elevation
- `Input` / `Textarea` - Form inputs com suporte a ícones
- `Select` - Dropdown com grupos
- `Badge` / `StatusBadge` - Labels e status
- `Progress` - Progress bars
- `Modal` - Dialogs
- `Spinner` / `LoadingScreen` - Loading states
- `Alert` - Mensagens de feedback
- `EmptyState` - Estados vazios

## 📱 Páginas

### Públicas (`/`)
- **LandingPage** - Página inicial com hero, features, pricing
- **LoginPage** - Autenticação
- **SignupPage** - Registro

### Autenticadas (`/app/*`)
- **Dashboard** - Lista de jobs, stats, quick actions
- **NewAnalysis** - Wizard para criar nova análise
- **JobDetail** - Detalhes do job, progresso, resultados
- **Settings** - Configuração de API keys, perfil

## 🔗 API Integration

O frontend se comunica com o backend via:

- **REST API** - CRUD operations em `/api/*`
- **WebSocket** - Real-time updates para jobs

### Endpoints Principais

```typescript
// Jobs
GET    /jobs              - Lista jobs
GET    /jobs/:id          - Detalhes do job
GET    /jobs/:id/full     - Job + análise
PATCH  /jobs/:id          - Atualizar job
DELETE /jobs/:id          - Cancelar job

// Repos
POST   /repos             - Criar novo job
POST   /repos/:id/retry   - Reprocessar job

// Models
GET    /models            - Lista modelos
GET    /models/by-provider - Modelos por provider
```

## 🧪 Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Linting com ESLint
```

## 📝 License

MIT
