import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@shared/components/ui';

const pageTitles: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/new': 'Nova Análise',
  '/app/settings': 'Configurações',
};

export const Header: React.FC = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith('/app/jobs/')) {
      return 'Detalhes do Job';
    }
    return pageTitles[location.pathname] || 'Dashboard';
  };

  return (
    <header className="h-16 bg-brand-dark/50 backdrop-blur-lg border-b border-white/5 sticky top-0 z-20">
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
          <h1 className="text-xl font-semibold text-white">{getTitle()}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-black/50 border border-white/10 rounded-lg">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar jobs..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-48"
            />
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs text-gray-500 bg-white/5 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full" />
          </button>

          {/* New Analysis CTA */}
          <Link to="/app/new">
            <Button size="sm" icon={Plus} iconPosition="left">
              <span className="hidden sm:inline">Nova Análise</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
