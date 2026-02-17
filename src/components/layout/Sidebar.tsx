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
          <div className="p-2 rounded-lg" style={{
            background: `linear-gradient(to bottom right, ${colors.brand.primary}, ${colors.brand.primaryHover})`,
            boxShadow: `0 0 20px ${colors.glow.primary}`
          }}>
            <Terminal className="w-5 h-5" style={{ color: colors.text.primary }} />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold" style={{ color: colors.text.primary }}>Code-in</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
            style={isActive(item.href)
              ? {
                backgroundColor: `${colors.brand.primary}1A`,
                color: colors.brand.primary,
                border: `1px solid ${colors.border.emphasis}`
              }
              : {
                color: colors.text.muted,
                border: '1px solid transparent'
              }
            }
            onMouseEnter={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.color = colors.text.primary;
                e.currentTarget.style.backgroundColor = colors.border.subtle;
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
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t" style={{ borderColor: colors.border.subtle }}>
        {!isCollapsed && user && (
          <div className="px-4 py-3 mb-2">
            <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs truncate" style={{ color: colors.text.muted }}>{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200"
          style={{ color: colors.text.muted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.status.error;
            e.currentTarget.style.backgroundColor = `${colors.status.error}1A`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.text.muted;
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>

      {/* Collapse Toggle (Desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full items-center justify-center transition-colors"
        style={{
          backgroundColor: colors.background.surface,
          border: `1px solid ${colors.border.default}`,
          color: colors.text.muted
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = colors.text.primary}
        onMouseLeave={(e) => e.currentTarget.style.color = colors.text.muted}
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{
          backgroundColor: colors.background.surface,
          border: `1px solid ${colors.border.default}`,
          color: colors.text.primary
        }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
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
