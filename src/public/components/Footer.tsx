import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Terminal className="text-brand-primary w-6 h-6" />
              <span className="text-xl font-bold text-white">Code-in</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              Análise arquitetural de repositórios para gerar contexto
              inteligente para IAs de código. CLI em C + Agente Python +
              MCP Server.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Produto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="#how-it-works" className="hover:text-brand-primary">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-primary">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#roi" className="hover:text-brand-primary">
                  Por Que Usar
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Tecnologia</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <span className="text-gray-500">CLI em C (Multiplataforma)</span>
              </li>
              <li>
                <span className="text-gray-500">Python + LangGraph</span>
              </li>
              <li>
                <span className="text-gray-500">MCP Server (stdio/HTTP)</span>
              </li>
              <li>
                <span className="text-gray-500">Bun + Elysia API</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Code-in</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacidade
            </a>
            <a href="#" className="hover:text-white">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
