import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, TrendingUp } from 'lucide-react';

export const ROI: React.FC = () => {
  const [devs, setDevs] = useState(5);
  const [rate, setRate] = useState(50);

  const hoursPerMonth = 160;
  const wastedTimePercentage = 0.2;
  const recoveryRate = 0.75;

  const savedMonthly = Math.round(
    devs * hoursPerMonth * rate * wastedTimePercentage * recoveryRate
  );
  const savedYearly = savedMonthly * 12;

  return (
    <section id="roi" className="py-24 bg-brand-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              O Custo Invisível do <br />
              <span className="text-brand-secondary">"Context Switching"</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Quanto sua empresa gasta enquanto devs seniores corrigem código de
              IA ou explicam a arquitetura repetidamente?
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 text-brand-primary mr-3" />
                <span>Onboarding 3x mais rápido para novos devs</span>
              </li>
              <li className="flex items-center text-gray-300">
                <TrendingUp className="w-5 h-5 text-brand-primary mr-3" />
                <span>Código limpo desde o primeiro prompt</span>
              </li>
              <li className="flex items-center text-gray-300">
                <DollarSign className="w-5 h-5 text-brand-primary mr-3" />
                <span>Redução drástica em custos de API (tokens)</span>
              </li>
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-brand-dark p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">
              Calculadora de ROI
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">
                    Tamanho da Equipe
                  </label>
                  <span className="text-brand-primary font-mono">{devs} devs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={devs}
                  onChange={(e) => setDevs(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">
                    Custo Hora Médio (USD)
                  </label>
                  <span className="text-brand-primary font-mono">${rate}/h</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={rate}
                  onChange={(e) => setRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              <div className="bg-brand-black/50 p-6 rounded-xl border border-brand-primary/20">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">
                    Economia Projetada (Ano)
                  </p>
                  <p className="text-4xl font-bold text-white tracking-tight">
                    ${savedYearly.toLocaleString()}
                  </p>
                  <p className="text-xs text-brand-primary mt-2">
                    *Baseado em recuperação de 15% do tempo total de engenharia.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
