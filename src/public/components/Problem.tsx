import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, GitPullRequest, BrainCircuit } from 'lucide-react';

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-24 bg-brand-dark relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A Realidade da IA "Júnior"
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ferramentas como ChatGPT e Copilot são incríveis, mas sem contexto
            profundo, elas agem como estagiários talentosos porém imprudentes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: AlertTriangle,
              title: 'O Caos Arquitetural',
              description:
                'IAs padrão escrevem código que funciona isoladamente, mas viola seus padrões de design, criando espaguete que ignora sua Clean Architecture.',
            },
            {
              icon: BrainCircuit,
              title: 'Alucinação de Contexto',
              description:
                'Desenvolvedores perdem horas preciosas explicando a estrutura do projeto para o chat ou corrigindo imports de bibliotecas que nem existem no projeto.',
            },
            {
              icon: GitPullRequest,
              title: 'Dívida Técnica Instantânea',
              description:
                'Cada PR gerado por IA sem supervisão de contexto adiciona micro-dívidas técnicas que se acumulam em um monstro de manutenção.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-brand-gray/30 p-8 rounded-2xl border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
            >
              <div className="w-14 h-14 bg-brand-black rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/10">
                <item.icon className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Visual Metaphor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 bg-brand-black border border-white/10 rounded-xl p-6 md:p-10 font-mono text-sm md:text-base relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500" />
          <div className="flex gap-2 mb-4 text-gray-500">
            <span className="text-red-500">●</span>
            <span className="text-yellow-500">●</span>
            <span className="text-cyan-500">●</span>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500">// IA Padrão (Sem Code-in)</p>
            <p className="text-purple-400">
              const <span className="text-blue-300">userService</span> ={' '}
              <span className="text-yellow-300">new</span>{' '}
              <span className="text-cyan-300">UserService</span>();
            </p>
            <p className="text-gray-400">
              <span className="text-red-400">Error:</span> Direct instantiation
              violates Dependency Injection pattern defined in /core/container.ts
            </p>
            <p className="text-gray-400">
              <span className="text-red-400">Error:</span> 'UserService' is part
              of the Domain layer and should not be accessed directly by
              Controllers.
            </p>
            <p className="mt-4 text-red-400 animate-pulse">
              {'>>>'} Architecture Violation Detected
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
