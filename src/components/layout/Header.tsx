import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Plus, Moon, Sun } from 'lucide-react';
import { Button } from '@shared/components/ui';
import { useTheme } from '@shared/contexts';

const pageTitles: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/new': 'Nova Análise',
  '/app/settings': 'Configurações',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme, colors } = useTheme();

  const getTitle = () => {
    if (location.pathname.startsWith('/app/jobs/')) {
      return 'Detalhes do Job';
    }
    return pageTitles[location.pathname] || 'Dashboard';
  };

  return (
    <header className="h-16 border-b sticky top-0 z-20" style={{
      backgroundColor: colors.background.content,
      borderColor: colors.border.subtle
    }}>
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden w-10" />
          <h1 className="text-xl font-display uppercase tracking-widest" style={{ color: colors.brand.primary }}>
            {getTitle()} <span className="blink">_</span>
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2" style={{
            backgroundColor: colors.background.surface,
            borderBottom: `2px solid ${colors.border.default}`
          }}>
            <Search className="w-4 h-4" style={{ color: colors.text.muted }} />
            <input
              type="text"
              placeholder="Buscar jobs..."
              className="bg-transparent border-none outline-none text-sm w-48 font-mono"
              style={{ color: colors.text.primary }}
            />
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs font-mono" style={{
              color: colors.brand.primary,
              border: `1px solid ${colors.border.default}`,
              backgroundColor: colors.background.content
            }}>
              ⌘K
            </kbd>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 transition-colors border"
            style={{
              color: colors.text.muted,
              borderColor: colors.border.default,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.brand.primary;
              e.currentTarget.style.borderColor = colors.brand.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.muted;
              e.currentTarget.style.borderColor = colors.border.default;
            }}
            title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
