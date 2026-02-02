import React from 'react';
import { Shield, Lock, Server } from 'lucide-react';

export const Trust: React.FC = () => {
  return (
    <section className="py-20 bg-brand-dark relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-10">
          Integrado ao seu Workflow Seguro
        </h2>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6" /> GitHub Enterprise
          </div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6" /> GitLab
          </div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6" /> Bitbucket
          </div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6" /> SOC2 Ready
          </div>
        </div>

        <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-brand-black border border-white/10 px-8 py-4 rounded-full">
          <Shield className="text-brand-primary w-6 h-6" />
          <span className="text-gray-300 text-sm">
            <strong className="text-white">Segurança Primeiro:</strong> Seu
            código nunca é usado para treinar nossos modelos. Arquitetura
            "Zero-Retention".
          </span>
        </div>
      </div>
    </section>
  );
};
