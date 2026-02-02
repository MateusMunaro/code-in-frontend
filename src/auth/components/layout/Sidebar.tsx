import React, { useState } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      <div className="p-6 border-b border-white/5">
        <Link to="/app" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-brand-primary to-emerald-800 rounded-lg shadow-glow">
            <Terminal className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-white">Code-in</span>
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
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              isActive(item.href)
                ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/5">
        {!isCollapsed && user && (
          <div className="px-4 py-3 mb-2">
            <p className="text-sm text-white font-medium truncate">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl w-full',
            'text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>

      {/* Collapse Toggle (Desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-brand-dark border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white transition-colors"
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-brand-dark border border-white/10 rounded-lg text-white"
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
          'hidden lg:flex fixed left-0 top-0 h-screen flex-col bg-brand-dark border-r border-white/5 z-30 transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed left-0 top-0 h-screen w-64 flex flex-col bg-brand-dark border-r border-white/5 z-50 transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
