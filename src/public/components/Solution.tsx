import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Cpu, FileText, ArrowRight, Terminal } from 'lucide-react';

export const Solution: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'CLI Escaneia o Repositório',
      desc: 'Nosso CLI em C escaneia recursivamente seu projeto, identificando arquivos de código, configs e a árvore de diretórios. Ele gera um JSON estruturado com metadados de cada arquivo.',
      icon: Terminal,
      color: 'text-blue-400',
      detail: 'code-in scan ./meu-projeto',
    },
    {
      id: '02',
      title: 'Agente LangGraph Analisa',
      desc: 'Um agente autônomo com 4 fases (ReadStructure → Planning → Verification → Response) usa Tree-sitter para extrair AST, constrói grafo de dependências e detecta padrões como Clean Architecture, MVC e Hexagonal.',
      icon: Cpu,
      color: 'text-brand-primary',
      detail: 'Python + LangGraph + Tree-sitter',
    },
    {
      id: '03',
      title: 'Gera Documentação Multi-Camada',
      desc: 'O agente gera llms.txt (índice de navegação), AGENTS.md (contrato comportamental com regras e anti-patterns) e repomap.txt (mapa visual do repo) — tudo baseado em dados reais do AST.',
      icon: FileText,
      color: 'text-brand-secondary',
      detail: 'llms.txt + AGENTS.md + repomap.txt',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-brand-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-brand-primary font-mono text-sm tracking-wider uppercase">
            Como Funciona
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 mt-2">
            Pipeline em <span className="text-brand-primary">3 Etapas</span> Reais
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl">
            Não são promessas vagas — é uma pipeline de engenharia que você pode
            auditar. CLI open-source, agente transparente, outputs verificáveis.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-brand-primary to-brand-secondary -translate-y-1/2 opacity-20 z-0" />

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.3 }}
                className="bg-brand-dark border border-white/5 p-8 rounded-2xl hover:border-brand-primary/30 transition-all duration-300 shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-xl bg-white/5 ${step.color}`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-bold text-white/10 font-mono">
                    {step.id}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">{step.desc}</p>

                <div className="bg-brand-black/50 rounded-lg px-4 py-2 border border-white/5">
                  <code className="text-xs text-brand-primary font-mono">{step.detail}</code>
                </div>

                {idx < 2 && (
                  <div className="md:hidden flex justify-center mt-8 text-white/20">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* The actual output */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-1 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary"
        >
          <div className="bg-brand-black rounded-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Exemplo Real de Output</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-brand-dark rounded-lg p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-white font-mono">llms.txt</span>
                </div>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  # MeuProjeto<br />
                  &gt; Stack: TypeScript, React, Node.js<br />
                  &gt; Pattern: Clean Architecture<br />
                  <br />
                  ## Documentation Map<br />
                  - /AGENTS.md (behavioral contract)<br />
                  - /src/services/ReadMe.LLM<br />
                  - /src/domain/ReadMe.LLM
                </p>
              </div>
              <div className="bg-brand-dark rounded-lg p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-bold text-white font-mono">AGENTS.md</span>
                </div>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  ## 🧭 Navigation Protocol<br />
                  1. Read llms.txt first<br />
                  2. Check module ReadMe.LLM<br />
                  <br />
                  ## ⛔ Anti-Patterns<br />
                  - Never bypass Repository layer<br />
                  - No direct DB access in Services<br />
                  - Don't import across bounded contexts
                </p>
              </div>
              <div className="bg-brand-dark rounded-lg p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="w-4 h-4 text-brand-secondary" />
                  <span className="text-sm font-bold text-white font-mono">repomap.txt</span>
                </div>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  src/<br />
                  ├── domain/<br />
                  │   ├── entities/ (3 files)<br />
                  │   └── repositories/ (2 interfaces)<br />
                  ├── application/<br />
                  │   └── use-cases/ (5 files)<br />
                  └── infra/<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;├── database/ (3 files)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;└── http/ (4 routes)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
