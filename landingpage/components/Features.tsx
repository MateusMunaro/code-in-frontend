import React from 'react';
import { Layers, FileCode, Lock, Network, Zap, BookOpen } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Layers,
      title: "Indexação Profunda (AST)",
      desc: "Não lemos apenas texto. Lemos a estrutura óssea do código (AST) para entender classes, métodos e hierarquias reais."
    },
    {
      icon: Network,
      title: "Grafo de Dependências",
      desc: "Mapeamos quem chama quem. Se você mudar uma interface no Core, a IA sabe exatamente quais Services serão afetados."
    },
    {
      icon: FileCode,
      title: "Regras .cursorrules",
      desc: "Geramos automaticamente arquivos de configuração para Cursor e VS Code, garantindo que o contexto persista na IDE."
    },
    {
      icon: Lock,
      title: "Privacidade BYOK",
      desc: "Bring Your Own Key. Seus dados são processados em memória volátil e enviamos o contexto para o SEU modelo (OpenAI/Anthropic)."
    },
    {
      icon: BookOpen,
      title: "Auto-Documentação",
      desc: "Transforme código legado em documentação viva. O Code-in explica arquiteturas complexas para novos desenvolvedores."
    },
    {
      icon: Zap,
      title: "Economia de Tokens",
      desc: "Em vez de enviar 50 arquivos para o chat, enviamos um Blueprint compactado e otimizado, reduzindo custos em até 70%."
    }
  ];

  return (
    <section id="features" className="py-24 bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-mono text-sm tracking-wider uppercase">Funcionalidades</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">Tecnologia de Nível Enterprise</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-brand-primary/20">
              <div className="w-12 h-12 rounded-lg bg-brand-black flex items-center justify-center mb-6 group-hover:text-brand-primary text-gray-300 transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};