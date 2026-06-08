import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatusBar } from '@/components/layout/StatusBar';
import { SidebarProvider, StatusBarProvider, useSidebar, ThemeProvider } from '@shared/contexts';
import { useTheme } from '@shared/contexts';
import { useBrowserNotifications } from '@config/hooks';

function AuthLayoutContent() {
  const { isCollapsed } = useSidebar();
  const { colors } = useTheme();
  useBrowserNotifications();

  return (
    <div className="h-screen flex w-full overflow-hidden" style={{ backgroundColor: colors.background.content }}>
      {/* Scanlines Overlay */}
      <div className="scanlines opacity-10" />

      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 grid-bg"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col h-screen max-w-full overflow-hidden transition-all duration-300 relative z-10 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
      >
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto overflow-x-hidden max-w-full">
          <Outlet />
        </main>
        <StatusBar />
      </div>
    </div>
  );
}

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <StatusBarProvider>
          <AuthLayoutContent />
        </StatusBarProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
