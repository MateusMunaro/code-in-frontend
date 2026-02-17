import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SidebarProvider, useSidebar, ThemeProvider } from '@shared/contexts';

function AuthLayoutContent() {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-brand-black flex w-full">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                    }`}
            >
                <Header />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto overflow-x-hidden max-w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function AuthLayout() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <AuthLayoutContent />
            </SidebarProvider>
        </ThemeProvider>
    );
}
