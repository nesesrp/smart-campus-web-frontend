'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    User,
    Users,
    Settings,
    Calendar,
    BookOpen,
    MessageSquare,
    Bell,
    FileText,
    X,
    GraduationCap,
    Award,
    ClipboardCheck,
    MapPin,
    FileCheck,
    NotebookPen,
    UtensilsCrossed,
    Wallet,
    QrCode,
    PartyPopper,
    BarChart3,
    Activity,
    Cpu,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Navigation items
 */
const navItems = [
    {
        title: 'Ana Sayfa',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Profilim',
        href: '/profile',
        icon: User,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Kullanıcılar',
        href: '/users',
        icon: Users,
        roles: ['Admin']
    },
    {
        title: 'Program Oluşturma',
        href: '/admin/scheduling/generate',
        icon: Calendar,
        roles: ['Admin']
    },
    {
        title: 'Yemek Yönetimi',
        href: '/admin/meals',
        icon: UtensilsCrossed,
        roles: ['Admin']
    },
    // Admin Analytics - Part 4
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
        icon: BarChart3,
        roles: ['Admin']
    },
    {
        title: 'Akademik Analiz',
        href: '/admin/analytics/academic',
        icon: GraduationCap,
        roles: ['Admin']
    },
    {
        title: 'Devamsızlık Analizi',
        href: '/admin/analytics/attendance',
        icon: Clock,
        roles: ['Admin']
    },
    {
        title: 'Yemek Analizi',
        href: '/admin/analytics/meal',
        icon: UtensilsCrossed,
        roles: ['Admin']
    },
    {
        title: 'IoT Sensörler',
        href: '/admin/iot',
        icon: Cpu,
        roles: ['Admin']
    },
    {
        title: 'Akademisyen Talepleri',
        href: '/admin/faculty-requests',
        icon: Users,
        roles: ['Admin']
    },
    {
        title: 'Etkinlik Yönetimi',
        href: '/admin/events',
        icon: Calendar,
        roles: ['Admin']
    },
    // Academic Management
    {
        title: 'Ders Kataloğu',
        href: '/courses',
        icon: BookOpen,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Kayıtlı Derslerim',
        href: '/my-courses',
        icon: GraduationCap,
        roles: ['Student']
    },
    {
        title: 'Ders Programım',
        href: '/schedule',
        icon: Calendar,
        roles: ['Student']
    },
    {
        title: 'Notlarım',
        href: '/grades',
        icon: Award,
        roles: ['Student']
    },
    // Attendance - Student
    {
        title: 'Yoklama Durumum',
        href: '/my-attendance',
        icon: ClipboardCheck,
        roles: ['Student']
    },
    // Attendance - Faculty
    {
        title: 'Yoklama Başlat',
        href: '/attendance/start',
        icon: MapPin,
        roles: ['Faculty']
    },
    {
        title: 'Yoklama Raporları',
        href: '/attendance/reports',
        icon: ClipboardCheck,
        roles: ['Faculty']
    },
    // Enrollment Requests - Faculty
    {
        title: 'Kayıt Talepleri',
        href: '/enrollment-requests',
        icon: Users,
        roles: ['Faculty']
    },
    // Take Course - Faculty
    {
        title: 'Ders Al',
        href: '/take-course',
        icon: GraduationCap,
        roles: ['Faculty']
    },
    // Grades - Faculty
    {
        title: 'Not Girişi',
        href: '/gradebook',
        icon: NotebookPen,
        roles: ['Faculty']
    },
    // Excuse Requests
    {
        title: 'Mazeret Talepleri',
        href: '/excuse-requests',
        icon: FileCheck,
        roles: ['Faculty', 'Student']
    },
    // Classroom Reservations
    {
        title: 'Derslik Rezervasyonları',
        href: '/reservations',
        icon: Calendar,
        roles: ['Student', 'Faculty', 'Admin']
    },
    // Meal Service
    {
        title: 'Yemek Menüsü',
        href: '/meals/menu',
        icon: UtensilsCrossed,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Rezervasyonlarım',
        href: '/meals/reservations',
        icon: Calendar,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'QR Kod Tarayıcı',
        href: '/meals/scan',
        icon: QrCode,
        roles: ['Faculty', 'Admin']
    },
    // Wallet
    {
        title: 'Cüzdan',
        href: '/wallet',
        icon: Wallet,
        roles: ['Student', 'Faculty', 'Admin']
    },
    // Event Management
    {
        title: 'Etkinlikler',
        href: '/events',
        icon: PartyPopper,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Etkinliklerim',
        href: '/my-events',
        icon: Calendar,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Etkinlik Check-in',
        href: '/events/checkin',
        icon: QrCode,
        roles: ['Faculty', 'Admin']
    },
    // Others
    {
        title: 'Takvim',
        href: '/calendar',
        icon: Calendar,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Mesajlar',
        href: '/messages',
        icon: MessageSquare,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Bildirimler',
        href: '/notifications',
        icon: Bell,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Bildirim Ayarları',
        href: '/settings/notifications',
        icon: Bell,
        roles: ['Student', 'Faculty', 'Admin']
    },
    {
        title: 'Ayarlar',
        href: '/settings',
        icon: Settings,
        roles: ['Student', 'Faculty', 'Admin']
    },
];

/**
 * Sidebar Component
 * Sol menü, navigasyon linkleri
 */
export function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    // Kullanıcının rolüne göre filtreleme
    const filteredNavItems = navItems.filter(item => {
        if (!user?.role) return false;
        return item.roles.includes(user.role);
    });

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 z-50 lg:z-30 h-screen top-0 w-64 bg-white dark:bg-slate-900 border-r border-border flex flex-col transition-transform duration-300",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Header with Logo (Desktop) / Close button (Mobile) */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <GraduationCap className="size-8 text-primary" />
                        <span className="font-bold text-xl">SmartCampus</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-md hover:bg-muted"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2">
                    <ul className="space-y-1">
                        {filteredNavItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="size-5" />
                                        <span>{item.title}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-indicator"
                                                className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                        © 2024 SmartCampus
                    </p>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
