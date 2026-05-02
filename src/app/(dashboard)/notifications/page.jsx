'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Filter,
    AlertCircle,
    Info,
    AlertTriangle,
    CheckCircle,
    Clock,
    GraduationCap,
    Calendar,
    Wallet,
    UtensilsCrossed,
    Settings,
    Search,
    X
} from 'lucide-react';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    NotificationCategory,
    NotificationType,
    categoryLabels,
    typeLabels
} from '@/services/notification.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

/**
 * Notifications Page
 * Tüm bildirimleri listeler
 */
export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [categoryFilter, setCategoryFilter] = useState('all');

    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const [notifRes, countRes] = await Promise.all([
                getNotifications({ page: currentPage, pageSize: 20 }),
                getUnreadCount()
            ]);

            let data = notifRes.data?.data || notifRes.data || [];

            // Client-side filtering
            if (filter === 'unread') {
                data = data.filter(n => !n.isRead);
            } else if (filter === 'read') {
                data = data.filter(n => n.isRead);
            }

            if (categoryFilter !== 'all') {
                data = data.filter(n => n.category === parseInt(categoryFilter));
            }

            setNotifications(data);
            setUnreadCount(countRes.data?.count || countRes.data || 0);
            setTotalPages(notifRes.data?.totalPages || 1);
        } catch (error) {
            console.error('Notifications load error:', error);
            toast.error('Bildirimler yüklenemedi');
        } finally {
            setLoading(false);
        }
    }, [currentPage, filter, categoryFilter]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            toast.success('Bildirim okundu olarak işaretlendi');
        } catch (error) {
            toast.error('İşlem başarısız');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('Tüm bildirimler okundu olarak işaretlendi');
        } catch (error) {
            toast.error('İşlem başarısız');
        }
    };

    // Kategori ikonu
    const getCategoryIcon = (category) => {
        switch (category) {
            case 1: return GraduationCap;
            case 2: return Clock;
            case 3: return Calendar;
            case 4: return Wallet;
            case 5: return UtensilsCrossed;
            default: return Settings;
        }
    };

    // Tip ikonu
    const getTypeIcon = (type) => {
        switch (type) {
            case 1: return AlertTriangle;
            case 2: return AlertCircle;
            case 3: return CheckCircle;
            case 4: return Clock;
            default: return Info;
        }
    };

    // Tip rengi
    const getTypeColor = (type) => {
        switch (type) {
            case 1: return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30';
            case 2: return 'text-red-500 bg-red-100 dark:bg-red-900/30';
            case 3: return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            case 4: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
            default: return 'text-slate-500 bg-slate-100 dark:bg-slate-900/30';
        }
    };

    // Zaman formatı
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Bell className="size-8" />
                        <h1 className="text-2xl lg:text-3xl font-bold">Bildirimler</h1>
                    </div>
                    <p className="text-white/90">
                        {unreadCount > 0 ? `${unreadCount} okunmamış bildiriminiz var` : 'Tüm bildirimleriniz okundu'}
                    </p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center gap-4"
            >
                {/* Status Filter */}
                <div className="flex gap-2">
                    {[
                        { value: 'all', label: 'Tümü' },
                        { value: 'unread', label: 'Okunmamış' },
                        { value: 'read', label: 'Okunmuş' }
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f.value
                                    ? 'bg-violet-600 text-white shadow-md'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Category Filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                    <option value="all">Tüm Kategoriler</option>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Mark All as Read */}
                {unreadCount > 0 && (
                    <Button
                        onClick={handleMarkAllAsRead}
                        variant="outline"
                        className="ml-auto"
                    >
                        <CheckCheck className="size-4 mr-2" />
                        Tümünü Okundu İşaretle
                    </Button>
                )}
            </motion.div>

            {/* Notifications List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 rounded-xl bg-white dark:bg-slate-800/50 border border-border">
                        <Bell className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Bildirim Bulunamadı</h3>
                        <p className="text-muted-foreground">
                            {filter !== 'all' || categoryFilter !== 'all'
                                ? 'Seçili filtrelere uygun bildirim yok'
                                : 'Henüz bildiriminiz bulunmuyor'}
                        </p>
                    </div>
                ) : (
                    notifications.map((notification, index) => {
                        const CategoryIcon = getCategoryIcon(notification.category);
                        const TypeIcon = getTypeIcon(notification.type);
                        const typeColor = getTypeColor(notification.type);

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 rounded-xl border transition-all hover:shadow-md ${notification.isRead
                                        ? 'bg-white dark:bg-slate-800/50 border-border'
                                        : 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${typeColor}`}>
                                        <TypeIcon className="size-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="shrink-0"
                                                >
                                                    <Check className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <CategoryIcon className="size-3" />
                                                {categoryLabels[notification.category] || 'Sistem'}
                                            </span>
                                            <span>•</span>
                                            <span>{formatTime(notification.createdDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        Önceki
                    </Button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        Sonraki
                    </Button>
                </div>
            )}
        </div>
    );
}
