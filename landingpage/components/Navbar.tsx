import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Problema', href: '#problem' },
    { label: 'Solução', href: '#solution' },
    { label: 'Diferenciais', href: '#features' },
    { label: 'ROI', href: '#roi' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-black/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="p-2 bg-gradient-to-br from-brand-primary to-emerald-800 rounded-lg group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-shadow">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Code-in</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-brand-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button variant="outline" size="sm">
            Entrar
          </Button>
          <Button size="sm">
            Começar Agora
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-black border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-lg font-medium text-gray-300 hover:text-brand-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Button className="w-full">Começar Agora</Button>
        </div>
      )}
    </nav>
  );
};