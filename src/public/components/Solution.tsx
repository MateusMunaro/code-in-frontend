import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, FileText, ArrowRight } from 'lucide-react';

export const Solution: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'Ingestão Inteligente',
      desc: 'Conectamos ao Git e usamos Tree-sitter para ignorar "ruído" e extrair a AST (Árvore Sintática Abstrata).',
      icon: Database,
      color: 'text-blue-400',
    },
    {
      id: '02',
      title: 'Raciocínio Arquitetural',
      desc: 'Um agente autônomo baseado em Grafos navega pelo código identificando padrões (MVC, Clean Arch) e dependências.',
      icon: Cpu,
      color: 'text-brand-primary',
    },
    {
      id: '03',
      title: 'Geração de Blueprint',
      desc: 'Criamos arquivos .cursorrules e prompts de sistema que ensinam sua IA onde e como codar.',
      icon: FileText,
      color: 'text-brand-secondary',
    },
  ];

  return (
    <section id="solution" className="py-24 bg-brand-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            A Diferença <span className="text-brand-primary">Code-in</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl">
            Não é mágica, é engenharia de contexto. Nossa pipeline transforma
            repositórios opacos em mapas cristalinos para IA.
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
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>

                {idx < 2 && (
                  <div className="md:hidden flex justify-center mt-8 text-white/20">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* The Result */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-1 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary"
        >
          <div className="bg-brand-black rounded-xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">O Resultado?</h3>
            <p className="text-lg text-gray-300">
              Sua IA agora{' '}
              <span className="text-brand-primary font-bold">sabe</span> que você
              usa Repository Pattern e não vai tentar injetar SQL direto na View.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
