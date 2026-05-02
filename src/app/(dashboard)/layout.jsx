'use client';

import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SettingsProvider } from '@/contexts/SettingsContext';

/**
 * Dashboard Layout
 * ProtectedRoute, Navbar ve Sidebar wrapper
 */
export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SettingsProvider>
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    {/* Sidebar */}
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    {/* Main content area - offset by sidebar width on desktop */}
                    <div className="lg:ml-64 flex flex-col min-h-screen">
                        {/* Navbar */}
                        <Navbar onMenuClick={() => setSidebarOpen(true)} />

                        {/* Page content */}
                        <main className="flex-1 p-4 lg:p-6">
                            {children}
                        </main>
                    </div>
                </div>

                {/* Toast notifications */}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        style: {
                            background: 'var(--background)',
                            border: '2px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            padding: '16px',
                            fontSize: '14px',
                            minWidth: '300px',
                        },
                        className: 'toast-message',
                    }}
                />
            </ProtectedRoute>
        </SettingsProvider>
    );
}
