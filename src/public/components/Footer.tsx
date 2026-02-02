import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Twitter, Github, Linkedin } from 'lucide-react';

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
              Inteligência de arquitetura para equipes que não aceitam código
              ruim. O padrão de Tech Lead para suas ferramentas de IA.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
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
                <a href="#features" className="hover:text-brand-primary">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary">
                  Integrações
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Empresa</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-brand-primary">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-primary">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Code-in Intelligence Inc.</p>
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
