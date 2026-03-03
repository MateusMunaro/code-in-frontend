import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MessageSquare } from 'lucide-react';

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-24 bg-brand-dark relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O Problema Real que Resolvemos
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            IAs de código como ChatGPT, Copilot e Cursor <strong className="text-white">não conhecem
              a arquitetura do seu projeto</strong>. Sem esse contexto, o código gerado funciona
            sintaticamente, mas viola seus padrões — e você precisa refatorar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: AlertTriangle,
              title: 'Sem Contexto Arquitetural',
              description:
                'A IA não sabe que você usa Repository Pattern, Clean Architecture ou Hexagonal. Ela gera código acoplado que passa no lint, mas quebra suas regras de design.',
            },
            {
              icon: Clock,
              title: 'Tempo Gasto Explicando',
              description:
                'Você perde tempo colando arquivos, descrevendo pastas e explicando "não coloque lógica no controller". Isso acontece em toda conversa nova com o chat.',
            },
            {
              icon: MessageSquare,
              title: 'Contexto se Perde Entre Sessões',
              description:
                'Mesmo que explique uma vez, o contexto desaparece na próxima sessão. Não existe memória persistente sobre como seu repositório funciona.',
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

        {/* Real code example showing the problem */}
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
            <span className="ml-4 text-gray-600 text-xs">prompt: "Crie um service de usuário"</span>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500">// ❌ Resposta sem Code-in — IA não conhece a arquitetura</p>
            <p className="text-purple-400">
              <span className="text-yellow-300">class</span>{' '}
              <span className="text-cyan-300">UserService</span> {'{'}
            </p>
            <p className="text-gray-400 pl-4">
              <span className="text-blue-300">constructor</span>() {'{'}
            </p>
            <p className="text-gray-400 pl-8">
              <span className="text-red-400">this.db = new Database();</span>
              <span className="text-gray-600"> // Instanciação direta, ignora DI</span>
            </p>
            <p className="text-gray-400 pl-4">{'}'}</p>
            <p className="text-gray-400 pl-4">
              <span className="text-red-400">async getUser(id) {'{'} return this.db.query(`SELECT * FROM users WHERE id=${'${id}'}`) {'}'}</span>
            </p>
            <p className="text-gray-600 pl-4">
              // ^ SQL direto no Service — viola Repository Pattern
            </p>
            <p className="text-purple-400">{'}'}</p>
            <p className="mt-4 text-red-400 animate-pulse">
              {'>>>'} Código funciona, mas viola 3 regras da sua arquitetura
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
