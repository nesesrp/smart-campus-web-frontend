'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    Clock, 
    MapPin,
    QrCode, 
    X, 
    XCircle, 
    CheckCircle,
    AlertCircle,
    Users,
    PartyPopper,
    GraduationCap,
    Code,
    Music,
    Trophy
} from 'lucide-react';
import { getMyEvents, cancelEventRegistration } from '@/services/event.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * My Events Page
 * Dokümantasyona göre:
 * - List registered events
 * - Display QR code for each event
 * - "Cancel Registration" button
 * - Past events with check-in status
 */
export default function MyEventsPage() {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQR, setSelectedQR] = useState(null);
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        loadMyEvents();
    }, []);

    async function loadMyEvents() {
        try {
            setLoading(true);
            const response = await getMyEvents();
            setMyEvents(response.data || []);
        } catch (error) {
            toast.error('Kayıtlı etkinlikler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel(registrationId) {
        if (!confirm('Bu etkinlik kaydını iptal etmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            setCancelling(registrationId);
            await cancelEventRegistration(registrationId);
            toast.success('Kayıt başarıyla iptal edildi');
            loadMyEvents();
        } catch (error) {
            toast.error(error.message || 'Kayıt iptal edilemedi');
        } finally {
            setCancelling(null);
        }
    }

    function getCategoryIcon(category) {
        const icons = {
            conference: GraduationCap,
            workshop: Code,
            social: Music,
            sports: Trophy
        };
        return icons[category] || Calendar;
    }

    function getCategoryGradient(category) {
        const gradients = {
            conference: 'from-blue-500 via-blue-600 to-indigo-600',
            workshop: 'from-purple-500 via-purple-600 to-indigo-600',
            social: 'from-pink-500 via-pink-600 to-rose-600',
            sports: 'from-green-500 via-green-600 to-emerald-600'
        };
        return gradients[category] || 'from-purple-500 via-purple-600 to-indigo-600';
    }

    function getCategoryColor(category) {
        const colors = {
            conference: 'text-blue-600 dark:text-blue-400',
            workshop: 'text-purple-600 dark:text-purple-400',
            social: 'text-pink-600 dark:text-pink-400',
            sports: 'text-green-600 dark:text-green-400'
        };
        return colors[category] || 'text-purple-600 dark:text-purple-400';
    }

    function getCategoryLabel(category) {
        const labels = {
            conference: 'Konferans',
            workshop: 'Workshop',
            social: 'Sosyal',
            sports: 'Spor'
        };
        return labels[category] || category;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function isEventPast(event) {
        if (!event) return false;
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
    }

    const upcomingEvents = myEvents.filter(item => !isEventPast(item.event));
    const pastEvents = myEvents.filter(item => isEventPast(item.event));

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-64 bg-muted animate-pulse rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <h1 className="text-2xl lg:text-3xl font-bold">Etkinliklerim</h1>
                    <p className="text-white/90 mt-2">
                        Kayıt olduğunuz etkinlikleri görüntüleyin ve yönetin
                    </p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Yaklaşan Etkinlikler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingEvents.map((item, index) => {
                            const event = item.event;
                            if (!event) return null;
                            
                            const CategoryIcon = getCategoryIcon(event.category);
                            
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`rounded-xl border p-6 bg-gradient-to-br ${
                                        event.category === 'conference' ? 'from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800' :
                                        event.category === 'workshop' ? 'from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800' :
                                        event.category === 'social' ? 'from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/10 border-pink-200 dark:border-pink-800' :
                                        event.category === 'sports' ? 'from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800' :
                                        'from-gray-50 to-gray-100/50 dark:from-gray-950/20 dark:to-gray-900/10 border-gray-200 dark:border-gray-800'
                                    }`}
                                >
                                    {/* Category Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <CategoryIcon className={`size-5 ${getCategoryColor(event.category)}`} />
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                event.category === 'conference' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
                                                event.category === 'workshop' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' :
                                                event.category === 'social' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400' :
                                                event.category === 'sports' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400'
                                            }`}>
                                                {getCategoryLabel(event.category)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>

                                    {/* Event Details */}
                                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-4" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-4" />
                                            <span>{event.startTime} - {event.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-border">
                                        <Button
                                            onClick={() => setSelectedQR(item)}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <QrCode className="size-4 mr-2" />
                                            QR Kod
                                        </Button>
                                        <Button
                                            onClick={() => handleCancel(item.id)}
                                            disabled={cancelling === item.id}
                                            variant="outline"
                                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                        >
                                            <XCircle className="size-4 mr-2" />
                                            İptal Et
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Geçmiş Etkinlikler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pastEvents.map((item, index) => {
                            const event = item.event;
                            if (!event) return null;
                            
                            const CategoryIcon = getCategoryIcon(event.category);
                            
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6 opacity-75"
                                >
                                    {/* Category Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <CategoryIcon className={`size-5 ${getCategoryColor(event.category)}`} />
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                event.category === 'conference' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
                                                event.category === 'workshop' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400' :
                                                event.category === 'social' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400' :
                                                event.category === 'sports' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400'
                                            }`}>
                                                {getCategoryLabel(event.category)}
                                            </span>
                                        </div>
                                        {item.checkedIn ? (
                                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-1.5">
                                                <CheckCircle className="size-3.5" />
                                                Katıldı
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-medium flex items-center gap-1.5">
                                                <XCircle className="size-3.5" />
                                                Katılmadı
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>

                                    {/* Event Details */}
                                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="size-4" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-4" />
                                            <span>{event.startTime} - {event.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {myEvents.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <PartyPopper className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Henüz etkinliğe kayıt olmadınız</h3>
                    <p className="text-muted-foreground mb-4">
                        Etkinliklere kayıt olmak için etkinlikler sayfasını ziyaret edin
                    </p>
                </motion.div>
            )}

            {/* QR Code Modal */}
            <AnimatePresence>
                {selectedQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setSelectedQR(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full text-center"
                        >
                            <button
                                onClick={() => setSelectedQR(null)}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <X className="size-5" />
                            </button>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{selectedQR.event?.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedQR.event && formatDate(selectedQR.event.date)}
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl mb-6 flex items-center justify-center">
                                <QrCode className="size-64 text-slate-900" strokeWidth={1} />
                            </div>

                            <p className="text-sm text-muted-foreground">
                                QR kodunuzu etkinlik girişinde gösterin
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

