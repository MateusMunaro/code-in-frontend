import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, FileText, GitBranch, Cpu } from 'lucide-react';

export const Trust: React.FC = () => {
  return (
    <section className="py-20 bg-brand-dark relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Compatível com seu Workflow
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            O Code-in se integra com as ferramentas que você já usa, através
            do Model Context Protocol (MCP).
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              name: 'Claude Desktop',
              desc: 'Via MCP stdio transport',
              icon: Cpu,
            },
            {
              name: 'Cursor',
              desc: 'Via .cursorrules e MCP',
              icon: Terminal,
            },
            {
              name: 'VS Code Copilot',
              desc: 'Via MCP extensão',
              icon: FileText,
            },
            {
              name: 'GitHub',
              desc: 'Clone direto via HTTPS/SSH',
              icon: GitBranch,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-black border border-white/10 rounded-xl p-5 text-center hover:border-brand-primary/20 transition-colors"
            >
              <item.icon className="w-8 h-8 text-brand-primary mx-auto mb-3" />
              <h3 className="text-white font-bold text-sm mb-1">{item.name}</h3>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="bg-brand-black border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
            <Terminal className="text-brand-primary w-5 h-5" />
            <span className="text-gray-300 text-sm">
              <strong className="text-white">Open Source CLI:</strong>{' '}
              Código do CLI em C disponível para auditoria
            </span>
          </div>
          <div className="bg-brand-black border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
            <FileText className="text-brand-primary w-5 h-5" />
            <span className="text-gray-300 text-sm">
              <strong className="text-white">Outputs no seu repo:</strong>{' '}
              Arquivos gerados ficam no seu repositório
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
