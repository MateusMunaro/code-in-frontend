import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Network,
  FileCode,
  MonitorSmartphone,
  BookOpen,
  Terminal,
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Layers,
      title: 'Parser AST com Tree-sitter',
      desc: 'Extraímos classes, funções, parâmetros, decorators, docstrings e chamadas usando Tree-sitter. Suportamos Python, TypeScript, JavaScript, TSX, Java, Go, Rust, C e C++.',
    },
    {
      icon: Network,
      title: 'Grafo de Dependências Real',
      desc: 'Construímos um grafo com nós (arquivos, classes, funções) e arestas (imports, calls, extends, implements). Detectamos dependências circulares e mapeamos entry points.',
    },
    {
      icon: FileCode,
      title: 'Documentação Multi-Camada',
      desc: 'Geramos llms.txt, AGENTS.md e repomap.txt no nível raiz, além de ReadMe.LLM por módulo. Cada arquivo tem um papel específico para o agente de IA.',
    },
    {
      icon: MonitorSmartphone,
      title: 'Integração MCP Nativa',
      desc: 'Nosso MCP Server expõe tools como analyze_project, analyze_changes, get_project_context e save_snapshot. Funciona com Claude Desktop, Cursor e VS Code Copilot.',
    },
    {
      icon: BookOpen,
      title: 'Diagramas Mermaid do Código Real',
      desc: 'Geramos diagramas de arquitetura, camadas, classes, sequência, componentes, data flow e dependências — todos gerados a partir de dados reais do AST, não templates genéricos.',
    },
    {
      icon: Terminal,
      title: 'CLI Multiplataforma em C',
      desc: 'CLI compilado nativamente em C com suporte a Linux, macOS e Windows. Comandos: scan, diff, context, snapshot e watch. Saída em JSON compatível com MCP.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-mono text-sm tracking-wider uppercase">
            O Que Já Funciona Hoje
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            Funcionalidades Reais, Implementadas
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Sem roadmap vago. Estas são features que existem no código agora
            e que você pode usar hoje.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-brand-primary/20"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-black flex items-center justify-center mb-6 group-hover:text-brand-primary text-gray-300 transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
