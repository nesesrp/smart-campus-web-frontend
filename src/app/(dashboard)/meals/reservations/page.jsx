'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    Clock, 
    UtensilsCrossed, 
    QrCode, 
    X, 
    XCircle, 
    CheckCircle, 
    AlertCircle,
    MapPin,
    Trash2
} from 'lucide-react';
import { getMyReservations, cancelReservation } from '@/services/meal.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Status Badge Component
 */
function StatusBadge({ status }) {
    const statusConfig = {
        reserved: {
            label: 'Rezerve',
            className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            icon: Clock
        },
        used: {
            label: 'Kullanıldı',
            className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
            icon: CheckCircle
        },
        cancelled: {
            label: 'İptal Edildi',
            className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
            icon: XCircle
        }
    };

    const config = statusConfig[status] || statusConfig.reserved;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className="size-3.5" />
            {config.label}
        </span>
    );
}

/**
 * QR Code Full Screen Modal
 */
function QRCodeModal({ reservation, isOpen, onClose }) {
    if (!isOpen || !reservation) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full text-center"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="size-5" />
                    </button>

                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">Yemek Rezervasyonu</h3>
                        <p className="text-sm text-muted-foreground">
                            {new Date(reservation.date).toLocaleDateString('tr-TR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {reservation.mealType === 'lunch' ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl mb-6 flex items-center justify-center">
                        <QrCode className="size-64 text-slate-900" strokeWidth={1} />
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-2">QR Kod</p>
                        <code className="text-sm font-mono break-all">{reservation.qrCode}</code>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                        Bu QR kodu yemekhanede gösterin
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Reservation Card Component
 */
function ReservationCard({ reservation, onCancel, onShowQR }) {
    const [cancelling, setCancelling] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const reservationDate = new Date(reservation.date);
    const mealTime = reservation.mealType === 'lunch' ? 12 : 18;
    reservationDate.setHours(mealTime, 0, 0, 0);
    
    const now = new Date();
    const hoursUntilMeal = (reservationDate - now) / (1000 * 60 * 60);
    const canCancel = hoursUntilMeal >= 2 && reservation.status === 'reserved';

    async function handleCancel() {
        try {
            setCancelling(true);
            await cancelReservation(reservation.id);
            toast.success('Rezervasyon iptal edildi');
            setShowCancelConfirm(false);
            onCancel?.();
        } catch (error) {
            toast.error(error.message || 'İptal edilemedi');
        } finally {
            setCancelling(false);
        }
    }

    const isUpcoming = reservationDate > now && reservation.status === 'reserved';
    const isPast = reservationDate < now || reservation.status === 'used' || reservation.status === 'cancelled';
    
    // Öğle yemeği: mavi, Akşam yemeği: mor
    const isLunch = reservation.mealType === 'lunch';
    const themeColor = isLunch ? 'blue' : 'purple';
    const iconBg = isLunch ? 'bg-blue-500/20' : 'bg-purple-500/20';
    const iconColor = isLunch ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300';
    const borderColor = isLunch ? 'border-blue-300 dark:border-blue-700' : 'border-purple-300 dark:border-purple-700';
    const cardBg = isLunch 
        ? 'bg-gradient-to-br from-blue-100/80 to-white dark:from-blue-950/40 dark:to-slate-800/50' 
        : 'bg-gradient-to-br from-purple-100/80 to-white dark:from-purple-950/40 dark:to-slate-800/50';
    const menuItemBg = isLunch 
        ? 'bg-blue-500 text-white dark:bg-blue-600' 
        : 'bg-purple-500 text-white dark:bg-purple-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${cardBg} border ${borderColor}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${iconBg}`}>
                        <UtensilsCrossed className={`size-6 ${iconColor}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">
                            {reservation.mealType === 'lunch' ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {reservation.cafeteriaName}
                        </p>
                    </div>
                </div>
                <StatusBadge status={reservation.status} />
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>
                        {reservationDate.toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>
                        {mealTime}:00
                    </span>
                </div>
                {reservation.menu?.items && (
                    <div className="pt-3 border-t border-border/50">
                        <p className={`text-sm font-medium mb-3 ${isLunch ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300'}`}>
                            Menü:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {reservation.menu.items.map((item, idx) => (
                                <span 
                                    key={idx} 
                                    className={`text-xs font-medium px-3 py-1.5 rounded-full ${menuItemBg} shadow-sm`}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {isUpcoming && (
                    <Button
                        onClick={() => onShowQR(reservation)}
                        variant="outline"
                        className={`flex-1 ${
                            isLunch 
                                ? 'border-blue-400 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-950/40' 
                                : 'border-purple-400 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-950/40'
                        }`}
                    >
                        <QrCode className="size-4 mr-2" />
                        QR Kod Göster
                    </Button>
                )}
                {canCancel && (
                    <Button
                        onClick={() => setShowCancelConfirm(true)}
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                        <Trash2 className="size-4 mr-2" />
                        İptal Et
                    </Button>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {showCancelConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        onClick={() => setShowCancelConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-sm w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                    <AlertCircle className="size-5 text-red-600" />
                                </div>
                                <h3 className="font-semibold">Rezervasyonu İptal Et</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-6">
                                Bu rezervasyonu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setShowCancelConfirm(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Vazgeç
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    {cancelling ? 'İptal Ediliyor...' : 'İptal Et'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/**
 * My Reservations Page
 * Kullanıcının rezervasyonlarını listeler
 */
export default function MyReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        loadReservations();
    }, [filter]);

    async function loadReservations() {
        try {
            setLoading(true);
            const params = {};
            if (filter === 'upcoming') {
                params.status = 'reserved';
            } else if (filter === 'past') {
                // Geçmiş rezervasyonlar için status filtresi yok, hepsini alıp client-side filtreleyeceğiz
            }
            
            const response = await getMyReservations(params);
            let data = response.data || [];
            
            // Client-side filtreleme
            if (filter === 'past') {
                const now = new Date();
                data = data.filter(r => {
                    const reservationDate = new Date(r.date);
                    const mealTime = r.mealType === 'lunch' ? 12 : 18;
                    reservationDate.setHours(mealTime, 0, 0, 0);
                    return reservationDate < now || r.status === 'used' || r.status === 'cancelled';
                });
            } else if (filter === 'upcoming') {
                const now = new Date();
                data = data.filter(r => {
                    const reservationDate = new Date(r.date);
                    const mealTime = r.mealType === 'lunch' ? 12 : 18;
                    reservationDate.setHours(mealTime, 0, 0, 0);
                    return reservationDate > now && r.status === 'reserved';
                });
            }
            
            setReservations(data);
        } catch (error) {
            toast.error('Rezervasyonlar yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleShowQR(reservation) {
        setSelectedReservation(reservation);
        setShowQRModal(true);
    }

    function handleCancel() {
        loadReservations();
    }

    const upcomingCount = reservations.filter(r => {
        const reservationDate = new Date(r.date);
        const mealTime = r.mealType === 'lunch' ? 12 : 18;
        reservationDate.setHours(mealTime, 0, 0, 0);
        return reservationDate > new Date() && r.status === 'reserved';
    }).length;

    const pastCount = reservations.filter(r => {
        const reservationDate = new Date(r.date);
        const mealTime = r.mealType === 'lunch' ? 12 : 18;
        reservationDate.setHours(mealTime, 0, 0, 0);
        return reservationDate < new Date() || r.status === 'used' || r.status === 'cancelled';
    }).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
            >
                <h1 className="text-2xl lg:text-3xl font-bold">Rezervasyonlarım</h1>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2 border-b border-border"
            >
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        filter === 'all'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Tümü ({reservations.length})
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        filter === 'upcoming'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Gelecek ({upcomingCount})
                </button>
                <button
                    onClick={() => setFilter('past')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        filter === 'past'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Geçmiş ({pastCount})
                </button>
            </motion.div>

            {/* Reservations List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
                </div>
            ) : reservations.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <UtensilsCrossed className="size-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {filter === 'upcoming' 
                            ? 'Henüz gelecek rezervasyonunuz yok'
                            : filter === 'past'
                            ? 'Geçmiş rezervasyonunuz yok'
                            : 'Henüz rezervasyonunuz yok'}
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onCancel={handleCancel}
                            onShowQR={handleShowQR}
                        />
                    ))}
                </div>
            )}

            {/* QR Code Modal */}
            <QRCodeModal
                reservation={selectedReservation}
                isOpen={showQRModal}
                onClose={() => {
                    setShowQRModal(false);
                    setSelectedReservation(null);
                }}
            />
        </div>
    );
}

