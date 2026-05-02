'use client';

import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Users,
    Bell,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Dashboard Stats Card
 */
function StatsCard({ icon: Icon, title, value, trend, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="size-6 text-white" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="size-4" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </motion.div>
    );
}

/**
 * Dashboard Page
 * Ana sayfa - istatistikler ve aktiviteler
 */
export default function DashboardPage() {
    const { user } = useAuthStore();

    const stats = [
        {
            icon: BookOpen,
            title: 'Aktif Dersler',
            value: '6',
            trend: '+2',
            color: 'bg-gradient-to-br from-violet-500 to-indigo-600'
        },
        {
            icon: Calendar,
            title: 'Bugünkü Etkinlik',
            value: '3',
            color: 'bg-gradient-to-br from-blue-500 to-cyan-600'
        },
        {
            icon: Users,
            title: 'Toplam Öğrenci',
            value: '156',
            trend: '+12',
            color: 'bg-gradient-to-br from-emerald-500 to-teal-600'
        },
        {
            icon: Bell,
            title: 'Bildirimler',
            value: '8',
            color: 'bg-gradient-to-br from-orange-500 to-amber-600'
        },
    ];

    const recentActivities = [
        { id: 1, text: 'Matematik dersi notu yüklendi', time: '5 dakika önce' },
        { id: 2, text: 'Yeni duyuru: Sınav tarihleri', time: '1 saat önce' },
        { id: 3, text: 'Fizik ödev teslimi yaklaşıyor', time: '3 saat önce' },
        { id: 4, text: 'Kütüphane rezervasyonu onaylandı', time: '5 saat önce' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        Hoş Geldiniz, {user?.fullName?.split(' ')[0] || 'Kullanıcı'}! 👋
                    </h1>
                    <p className="mt-2 text-white/80 max-w-xl">
                        SmartCampus Akıllı Kampüs Yönetim Sistemine hoş geldiniz.
                        Bugün için planlanmış 3 etkinliğiniz var.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <StatsCard {...stat} />
                    </motion.div>
                ))}
            </div>

            {/* Recent Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
            >
                <h2 className="text-lg font-semibold mb-4">Son Aktiviteler</h2>
                <div className="space-y-4">
                    {recentActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            <div className="p-2 rounded-full bg-primary/10">
                                <Clock className="size-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{activity.text}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
