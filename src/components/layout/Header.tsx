import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, Plus, Moon, Sun } from 'lucide-react';
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
    <header className="h-16 backdrop-blur-lg border-b sticky top-0 z-20" style={{
      backgroundColor: colors.background.content,
      borderColor: colors.border.subtle
    }}>
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
          <h1 className="text-xl font-semibold" style={{ color: colors.text.primary }}>{getTitle()}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg" style={{
            backgroundColor: `${colors.background.elevated}80`,
            border: `1px solid ${colors.border.default}`
          }}>
            <Search className="w-4 h-4" style={{ color: colors.text.muted }} />
            <input
              type="text"
              placeholder="Buscar jobs..."
              className="bg-transparent border-none outline-none text-sm w-48"
              style={{ color: colors.text.primary }}
            />
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs rounded" style={{
              color: colors.text.muted,
              backgroundColor: colors.border.subtle
            }}>
              ⌘K
            </kbd>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.muted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.text.primary;
              e.currentTarget.style.backgroundColor = colors.border.subtle;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.muted;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg transition-colors" style={{ color: colors.text.muted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.text.primary;
              e.currentTarget.style.backgroundColor = colors.border.subtle;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.muted;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: colors.brand.primary }} />
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
