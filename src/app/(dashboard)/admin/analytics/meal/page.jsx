'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    UtensilsCrossed,
    Users,
    TrendingUp,
    Clock,
    Calendar,
    Download,
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Meal Analytics Page
 */
export default function MealAnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            // Simulated data since we don't have a specific meal analytics endpoint
            setStats({
                totalReservations: 3250,
                todayReservations: 450,
                averageDaily: 425,
                peakHour: '12:00-13:00',
                dailyUsage: [
                    { day: 'Pzt', lunch: 420, dinner: 180 },
                    { day: 'Sal', lunch: 450, dinner: 200 },
                    { day: 'Çar', lunch: 380, dinner: 150 },
                    { day: 'Per', lunch: 460, dinner: 210 },
                    { day: 'Cum', lunch: 400, dinner: 120 }
                ],
                hourlyDistribution: [
                    { hour: '11:00', count: 80 },
                    { hour: '11:30', count: 120 },
                    { hour: '12:00', count: 200 },
                    { hour: '12:30', count: 180 },
                    { hour: '13:00', count: 150 },
                    { hour: '13:30', count: 80 },
                    { hour: '17:00', count: 60 },
                    { hour: '17:30', count: 90 },
                    { hour: '18:00', count: 120 },
                    { hour: '18:30', count: 100 },
                    { hour: '19:00', count: 70 }
                ],
                weeklyTrend: [
                    { week: 'Hafta 1', total: 2100 },
                    { week: 'Hafta 2', total: 2250 },
                    { week: 'Hafta 3', total: 2180 },
                    { week: 'Hafta 4', total: 2400 },
                    { week: 'Hafta 5', total: 2350 }
                ],
                cafeteriaStats: [
                    { name: 'Ana Yemekhane', reservations: 1800 },
                    { name: 'Mühendislik', reservations: 800 },
                    { name: 'İşletme', reservations: 450 },
                    { name: 'Sosyal Tesisler', reservations: 200 }
                ]
            });
        } catch (error) {
            console.error('Load error:', error);
            toast.error('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="size-12 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <UtensilsCrossed className="size-8" />
                            <h1 className="text-2xl lg:text-3xl font-bold">Yemek Analizi</h1>
                        </div>
                        <p className="text-white/90">Günlük kullanım ve yoğunluk saatleri</p>
                    </div>
                    <Button className="bg-white/20 hover:bg-white/30 text-white border-0">
                        <Download className="size-4 mr-2" />
                        Rapor İndir
                    </Button>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Toplam Rezervasyon', value: stats?.totalReservations?.toLocaleString() || 0, icon: Calendar, color: 'from-orange-500 to-red-500' },
                    { label: 'Bugün', value: stats?.todayReservations || 0, icon: UtensilsCrossed, color: 'from-green-500 to-emerald-500' },
                    { label: 'Günlük Ortalama', value: stats?.averageDaily || 0, icon: TrendingUp, color: 'from-blue-500 to-indigo-500' },
                    { label: 'Yoğun Saat', value: stats?.peakHour || '-', icon: Clock, color: 'from-purple-500 to-violet-500', isText: true }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                                <stat.icon className="size-5" />
                            </div>
                            <div>
                                <p className={`font-bold ${stat.isText ? 'text-lg' : 'text-2xl'}`}>{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Usage */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Günlük Kullanım</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats?.dailyUsage || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="lunch" name="Öğle" fill="#f97316" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="dinner" name="Akşam" fill="#fb923c" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Hourly Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Saatlik Yoğunluk</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats?.hourlyDistribution || []}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" name="Kişi" stroke="#f97316" fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Cafeteria Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
            >
                <h3 className="text-lg font-semibold mb-4">Yemekhane Bazlı Kullanım</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats?.cafeteriaStats || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="reservations" name="Rezervasyon" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
}
