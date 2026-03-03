import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useTheme } from '@shared/contexts';

export const AppLayout: React.FC = () => {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.background.content }}>
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
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 relative z-10">
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
