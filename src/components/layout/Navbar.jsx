'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    LogOut,
    User,
    Bell,
    ChevronDown,
    Settings,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { logout } from '@/services/auth.service';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { getProfilePictureUrl } from '@/lib/url-helper';

/**
 * Navbar Component
 * Üst menü, kullanıcı bilgileri, logout
 */
export function Navbar({ onMenuClick }) {
    const router = useRouter();
    const { user, logout: storeLogout } = useAuthStore();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            storeLogout();
            router.push('/login');
        }
    }

    return (
        <header className="sticky top-0 z-50 h-16 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-border">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                {/* Left: Menu button + Logo (mobile only) */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
                    >
                        <Menu className="size-5" />
                    </button>

                    {/* Logo - Mobile only */}
                    <Link href="/dashboard" className="lg:hidden flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
                            <GraduationCap className="size-5" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            SmartCampus
                        </span>
                    </Link>
                </div>

                {/* Right: Notifications + User menu */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <NotificationBell />

                    {/* User info */}
                    <div className="flex items-center gap-3 pl-2 border-l border-border">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium">{user?.fullName || 'Kullanıcı'}</span>
                            <span className="text-xs text-muted-foreground">{user?.role || 'Misafir'}</span>
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                            <button className="flex items-center gap-1 group">
                                {user?.profilePictureUrl ? (
                                    <img
                                        src={getProfilePictureUrl(user.profilePictureUrl)}
                                        alt={user.fullName || 'Profil'}
                                        className="size-9 rounded-full object-cover border-2 border-violet-500/20"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`size-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 items-center justify-center text-white text-sm font-medium ${user?.profilePictureUrl ? 'hidden' : 'flex'}`}
                                >
                                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <ChevronDown className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </button>
                        </div>

                        {/* Logout button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <LogOut className="size-4" />
                            <span className="hidden md:inline">Çıkış</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
