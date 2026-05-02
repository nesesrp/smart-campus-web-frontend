'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Check,
    CheckCheck,
    AlertCircle,
    Info,
    AlertTriangle,
    CheckCircle,
    Clock,
    GraduationCap,
    Calendar,
    Wallet,
    UtensilsCrossed,
    Settings
} from 'lucide-react';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    NotificationCategory,
    NotificationType
} from '@/services/notification.service';
import { startConnection, onNotification, offNotification, stopConnection } from '@/lib/signalr';

/**
 * NotificationBell Component
 * Navbar'da görünen bildirim çanı
 */
export function NotificationBell() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Bildirimleri yükle
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const [notifRes, countRes] = await Promise.all([
                getNotifications({ page: 1, pageSize: 5 }),
                getUnreadCount()
            ]);
            setNotifications(notifRes.data?.data || notifRes.data || []);
            setUnreadCount(countRes.data?.count || countRes.data || 0);
        } catch (error) {
            console.error('Notification load error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // SignalR bağlantısı
    useEffect(() => {
        let token = null;
        if (typeof window !== 'undefined') {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                try {
                    const parsed = JSON.parse(authStorage);
                    token = parsed?.state?.accessToken;
                } catch (e) {
                    console.error('Failed to parse auth storage:', e);
                }
            }
        }

        if (token) {
            startConnection(token).catch(console.error);

            const handleNotification = (notification) => {
                setNotifications(prev => [notification, ...prev.slice(0, 4)]);
                setUnreadCount(prev => prev + 1);
            };

            onNotification(handleNotification);

            return () => {
                offNotification(handleNotification);
            };
        }
    }, []);

    // İlk yükleme
    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Dropdown dışına tıklama
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Bildirimi okundu işaretle
    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Mark as read error:', error);
        }
    };

    // Tümünü okundu işaretle
    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Mark all as read error:', error);
        }
    };

    // Kategori ikonu
    const getCategoryIcon = (category) => {
        switch (category) {
            case NotificationCategory.Academic:
            case 1:
                return GraduationCap;
            case NotificationCategory.Attendance:
            case 2:
                return Clock;
            case NotificationCategory.Event:
            case 3:
                return Calendar;
            case NotificationCategory.Payment:
            case 4:
                return Wallet;
            case NotificationCategory.Meal:
            case 5:
                return UtensilsCrossed;
            default:
                return Settings;
        }
    };

    // Tip ikonu
    const getTypeIcon = (type) => {
        switch (type) {
            case NotificationType.Warning:
            case 1:
                return AlertTriangle;
            case NotificationType.Error:
            case 2:
                return AlertCircle;
            case NotificationType.Success:
            case 3:
                return CheckCircle;
            case NotificationType.Reminder:
            case 4:
                return Clock;
            default:
                return Info;
        }
    };

    // Tip rengi
    const getTypeColor = (type) => {
        switch (type) {
            case NotificationType.Warning:
            case 1:
                return 'text-amber-500';
            case NotificationType.Error:
            case 2:
                return 'text-red-500';
            case NotificationType.Success:
            case 3:
                return 'text-green-500';
            case NotificationType.Reminder:
            case 4:
                return 'text-blue-500';
            default:
                return 'text-slate-500';
        }
    };

    // Zaman formatı
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Az önce';
        if (minutes < 60) return `${minutes} dk önce`;
        if (hours < 24) return `${hours} saat önce`;
        if (days < 7) return `${days} gün önce`;
        return date.toLocaleDateString('tr-TR');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
                <Bell className="size-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 size-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl border border-border shadow-xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="font-semibold">Bildirimler</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                    <CheckCheck className="size-3" />
                                    Tümünü Okundu İşaretle
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Bell className="size-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Bildirim bulunmuyor</p>
                                </div>
                            ) : (
                                notifications.map((notification) => {
                                    const CategoryIcon = getCategoryIcon(notification.category);
                                    const TypeIcon = getTypeIcon(notification.type);
                                    const typeColor = getTypeColor(notification.type);

                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''
                                                }`}
                                            onClick={() => {
                                                setIsOpen(false);
                                                handleMarkAsRead(notification.id, { stopPropagation: () => { } });

                                                if (notification.relatedEntityType === 'AttendanceSession' && notification.relatedEntityId) {
                                                    router.push(`/attendance/give/${notification.relatedEntityId}`);
                                                } else {
                                                    router.push('/notifications');
                                                }
                                            }}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`p-2 rounded-lg bg-muted ${typeColor}`}>
                                                    <TypeIcon className="size-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                                className="p-1 rounded hover:bg-muted"
                                                                title="Okundu işaretle"
                                                            >
                                                                <Check className="size-3 text-primary" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">
                                                        {formatTime(notification.createdDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-border bg-muted/30">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/notifications');
                                }}
                                className="w-full text-sm text-center text-primary hover:underline"
                            >
                                Tüm Bildirimleri Gör
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
