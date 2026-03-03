import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, GitBranch, FileText } from 'lucide-react';
import { Button } from '@shared/components/ui';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] -z-10 opacity-30" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[100px] -z-10 opacity-20" />

      <div className="container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-sm font-medium text-gray-300">
            CLI em C + MCP Server + Agente LangGraph
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
        >
          Contexto <span className="text-brand-primary">arquitetural</span>
          <br />
          para suas IAs de código.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Analisamos seu repositório com Tree-sitter e LangGraph para gerar{' '}
          <span className="text-white font-medium">llms.txt</span>,{' '}
          <span className="text-white font-medium">AGENTS.md</span> e{' '}
          <span className="text-white font-medium">repomap.txt</span> — arquivos
          que ensinam Cursor, Copilot e Claude a respeitar sua arquitetura.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/signup">
            <Button size="lg" icon={ArrowRight}>
              Começar Análise Grátis
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg" icon={Terminal}>
              Ver Como Funciona
            </Button>
          </a>
        </motion.div>

        {/* Real metrics - what actually exists */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70"
        >
          {[
            { label: 'Linguagens Suportadas', value: '6+', icon: Terminal },
            { label: 'Arquivos Gerados por Análise', value: '5+', icon: FileText },
            { label: 'Providers de LLM', value: '4', icon: GitBranch },
            { label: 'Modelos Disponíveis', value: '10+', icon: Terminal },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <stat.icon className="w-6 h-6 text-brand-primary mb-2" />
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
