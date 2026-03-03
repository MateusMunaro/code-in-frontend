import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  GitBranch,
  FileText,
  Network,
  BarChart3,
  Layers,
} from 'lucide-react';

export const ROI: React.FC = () => {
  return (
    <section id="roi" className="py-24 bg-brand-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-mono text-sm tracking-wider uppercase">
            Por Que Usar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            O Que o Code-in Realmente Entrega
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Dados concretos sobre o que nossa análise gera e como isso melhora
            a qualidade do código produzido pelas suas IAs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: what you get */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">
              Sem Code-in <span className="text-red-400">vs</span> Com Code-in
            </h3>

            <div className="space-y-6">
              {[
                {
                  without: 'IA gera código sem saber sua arquitetura',
                  with: 'AGENTS.md ensina que você usa Clean Architecture e Repository Pattern',
                  icon: Layers,
                },
                {
                  without: 'Você cola 10+ arquivos no chat para dar contexto',
                  with: 'llms.txt e repomap.txt dão a visão completa em segundos',
                  icon: FileText,
                },
                {
                  without: 'IA cria imports errados e viola camadas',
                  with: 'Anti-patterns documentados previnem violações antes de acontecerem',
                  icon: Network,
                },
                {
                  without: 'Contexto se perde a cada nova conversa',
                  with: 'Documentação fica no repositório — persistente e versionada',
                  icon: GitBranch,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-brand-dark p-6 rounded-xl border border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 mt-1">
                      <item.icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-400 text-xs font-mono px-2 py-0.5 bg-red-500/10 rounded">SEM</span>
                        <span className="text-sm text-gray-400">{item.without}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-brand-primary text-xs font-mono px-2 py-0.5 bg-brand-primary/10 rounded">COM</span>
                        <span className="text-sm text-white">{item.with}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: technical specs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-brand-dark p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">
              Stack Técnica Real
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Cpu className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-1">Agente LangGraph (4 nós)</h4>
                  <p className="text-sm text-gray-400">
                    ReadStructure → Planning → Verification → Response.
                    Ciclo com threshold de confiança (80%) e até 5 iterações.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <BarChart3 className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-1">4 Providers de LLM</h4>
                  <p className="text-sm text-gray-400">
                    OpenAI (gpt-4o, gpt-4o-mini), Anthropic (Claude 3.5 Sonnet),
                    Google (Gemini 1.5 Pro/Flash), e Ollama para modelos locais.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Network className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-1">Grafo de Dependências</h4>
                  <p className="text-sm text-gray-400">
                    Nós: arquivos, classes, funções. Arestas: imports, calls,
                    extends, implements. Detecção de dependências circulares.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <GitBranch className="w-5 h-5 text-brand-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-1">Infraestrutura</h4>
                  <p className="text-sm text-gray-400">
                    API em Bun + Elysia, fila com Redis Pub/Sub,
                    banco Supabase (PostgreSQL + pgvector para embeddings),
                    WebSocket para updates em tempo real.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-brand-black/50 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 text-center font-mono">
                Toda a análise roda no backend — seu código não é enviado para terceiros.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
