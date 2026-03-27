import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Terminal,
  LayoutDashboard,
  Plus,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Download,
} from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { useAuthStore } from '@shared/stores';
import { useSidebar, useTheme } from '@shared/contexts';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { label: 'Nova Análise', href: '/app/new', icon: Plus },
  { label: 'CLI Download', href: '/app/cli', icon: Download },
  { label: 'Configurações', href: '/app/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const { colors } = useTheme();

  const isActive = (href: string) => {
    if (href === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: colors.border.subtle }}>
        <Link to="/app" className="flex items-center gap-3">
          <div className="p-2 border flex items-center justify-center" style={{
            borderColor: colors.brand.primary,
            backgroundColor: colors.background.content
          }}>
            <Terminal className="w-5 h-5" style={{ color: colors.brand.primary }} />
          </div>
          {!isCollapsed && (
            <span className="text-2xl font-display uppercase tracking-widest" style={{ color: colors.brand.primary }}>
              CODE-IN
            </span>
          )}
        </Link>
        {!isCollapsed && (
          <span className="block text-xs font-mono mt-1 opacity-70" style={{ color: colors.text.muted }}>
            v.2.0.4-beta
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs uppercase tracking-widest mb-3 pl-2" style={{ color: colors.text.muted }}>
          {!isCollapsed && 'Navigation'}
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 transition-all duration-100 border"
            style={isActive(item.href)
              ? {
                backgroundColor: `${colors.brand.primary}1A`,
                color: colors.brand.primary,
                borderColor: colors.brand.primary,
                boxShadow: `2px 2px 0px 0px ${colors.brand.primary}40`
              }
              : {
                color: colors.text.muted,
                borderColor: 'transparent'
              }
            }
            onMouseEnter={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.color = colors.brand.primary;
                e.currentTarget.style.backgroundColor = colors.background.elevated;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.color = colors.text.muted;
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-mono text-sm">
                {isActive(item.href) && <span className="mr-1">&gt;</span>}
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t" style={{ borderColor: colors.border.subtle }}>
        {/* System Status */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <span className="w-2 h-2 inline-block animate-pulse" style={{ backgroundColor: colors.brand.primary }} />
            <span className="text-xs font-mono uppercase" style={{ color: colors.brand.primary }}>ONLINE</span>
          </div>
        )}
        {!isCollapsed && user && (
          <div className="px-3 py-2 mb-2 border-b" style={{ borderColor: colors.border.default }}>
            <p className="text-sm font-mono truncate" style={{ color: colors.text.primary }}>
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs font-mono truncate" style={{ color: colors.text.muted }}>{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full transition-all duration-100 border border-transparent"
          style={{ color: colors.text.muted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.status.error;
            e.currentTarget.style.borderColor = colors.status.error;
            e.currentTarget.style.backgroundColor = `${colors.status.error}1A`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.muted;
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-mono text-sm">Sair</span>}
        </button>
      </div>

      {/* Collapse Toggle (Desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 items-center justify-center transition-colors border"
        style={{
          backgroundColor: colors.background.surface,
          borderColor: colors.border.default,
          color: colors.text.muted
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.brand.primary;
          e.currentTarget.style.borderColor = colors.brand.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.muted;
          e.currentTarget.style.borderColor = colors.border.default;
        }}
      >
        <ChevronLeft
          className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')}
        />
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 border"
        style={{
          backgroundColor: colors.background.surface,
          borderColor: colors.brand.primary,
          color: colors.brand.primary
        }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r z-30 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64'
        )}
        style={{
          backgroundColor: colors.background.surface,
          borderColor: colors.border.subtle
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed left-0 top-0 h-screen w-64 flex flex-col border-r z-50 transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          backgroundColor: colors.background.surface,
          borderColor: colors.border.subtle
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
