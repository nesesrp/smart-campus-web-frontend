'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
    Calendar, 
    MapPin, 
    Clock, 
    Users, 
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Loader2,
    GraduationCap,
    Code,
    Music,
    Trophy,
    DollarSign
} from 'lucide-react';
import { getEventById, registerToEvent } from '@/services/event.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Event Detail Page
 * Dokümantasyona göre:
 * - Event info (title, description, date, location, capacity)
 * - Remaining spots
 * - Registration deadline
 * - Price (if paid)
 * - "Register" button
 * - Registration form (if custom fields required)
 */
export default function EventDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (params.id) {
            loadEventDetails();
        }
    }, [params.id]);

    async function loadEventDetails() {
        try {
            setLoading(true);
            const response = await getEventById(params.id);
            setEvent(response.data);
        } catch (error) {
            toast.error('Etkinlik detayı yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleRegister() {
        // Check if custom fields required
        // For now, just show registration form
        setShowRegistrationForm(true);
    }

    async function handleSubmitRegistration() {
        try {
            setRegistering(true);
            await registerToEvent(params.id, formData);
            toast.success('Etkinliğe başarıyla kayıt oldunuz!');
            setShowRegistrationForm(false);
            setFormData({});
            // Refresh event data to update registered count
            loadEventDetails();
        } catch (error) {
            toast.error(error.message || 'Kayıt işlemi başarısız oldu');
        } finally {
            setRegistering(false);
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

    function formatDateTime(dateString, timeString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) + ' • ' + timeString;
    }

    function isRegistrationOpen() {
        if (!event) return false;
        const deadline = new Date(event.registrationDeadline);
        const now = new Date();
        return now < deadline;
    }

    function isEventFull() {
        if (!event) return false;
        return event.registeredCount >= event.capacity;
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-96 bg-muted animate-pulse rounded-xl" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="size-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Etkinlik bulunamadı</h3>
                <Button
                    onClick={() => router.push('/events')}
                    variant="outline"
                    className="mt-4"
                >
                    <ArrowLeft className="size-4 mr-2" />
                    Etkinliklere Dön
                </Button>
            </div>
        );
    }

    const CategoryIcon = getCategoryIcon(event.category);
    const remainingSpots = event.capacity - event.registeredCount;
    const registrationOpen = isRegistrationOpen();
    const eventFull = isEventFull();

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button
                onClick={() => router.push('/events')}
                variant="ghost"
                className="mb-2"
            >
                <ArrowLeft className="size-4 mr-2" />
                Etkinliklere Dön
            </Button>

            {/* Header with Gradient */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getCategoryGradient(event.category)} p-6 lg:p-8 text-white`}
            >
                <div className="relative z-10">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <CategoryIcon className="size-5" />
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                            {getCategoryLabel(event.category)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                        {event.title}
                    </h1>

                    {/* Description */}
                    <p className="text-white/90 text-lg mb-4">
                        {event.description}
                    </p>

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
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
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Event Info */}
                <div className="space-y-6">
                    {/* Capacity & Remaining Spots */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Users className={`size-5 ${getCategoryColor(event.category)}`} />
                            Kapasite Bilgileri
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Toplam Kapasite</span>
                                <span className="font-semibold">{event.capacity} kişi</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Kayıtlı</span>
                                <span className="font-semibold">{event.registeredCount} kişi</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Kalan Kontenjan</span>
                                <span className={`font-semibold ${remainingSpots > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {remainingSpots} kişi
                                </span>
                            </div>
                            {/* Capacity Bar */}
                            <div className="w-full bg-muted rounded-full h-3 mt-4">
                                <div
                                    className={`h-3 rounded-full transition-all ${
                                        event.category === 'conference' ? 'bg-blue-600' :
                                        event.category === 'workshop' ? 'bg-purple-600' :
                                        event.category === 'social' ? 'bg-pink-600' :
                                        event.category === 'sports' ? 'bg-green-600' :
                                        'bg-purple-600'
                                    }`}
                                    style={{
                                        width: `${(event.registeredCount / event.capacity) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Registration Deadline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className={`size-5 ${getCategoryColor(event.category)}`} />
                            Kayıt Bilgileri
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Kayıt Son Tarihi</span>
                                <span className="font-semibold">
                                    {formatDate(event.registrationDeadline)}
                                </span>
                            </div>
                            {event.isPaid && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Ücret</span>
                                    <span className="font-semibold flex items-center gap-1">
                                        <DollarSign className="size-4" />
                                        {event.price} ₺
                                    </span>
                                </div>
                            )}
                            {!event.isPaid && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Ücret</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        Ücretsiz
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-muted-foreground">Durum</span>
                                {registrationOpen ? (
                                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-1.5">
                                        <CheckCircle className="size-3.5" />
                                        Kayıt Açık
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm font-medium flex items-center gap-1.5">
                                        <XCircle className="size-3.5" />
                                        Kayıt Kapalı
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Registration */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h2 className="text-lg font-semibold mb-4">Etkinliğe Kayıt Ol</h2>
                    
                    {!showRegistrationForm ? (
                        <div className="space-y-4">
                            {eventFull ? (
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                        <XCircle className="size-5" />
                                        <span className="font-medium">Etkinlik Dolu</span>
                                    </div>
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                        Bu etkinlik için kontenjan dolmuştur.
                                    </p>
                                </div>
                            ) : !registrationOpen ? (
                                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                        <AlertCircle className="size-5" />
                                        <span className="font-medium">Kayıt Kapalı</span>
                                    </div>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                                        Kayıt son tarihi geçmiştir.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Bu etkinliğe kayıt olmak istediğinizden emin misiniz?
                                        </p>
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium">Tarih:</span> {formatDate(event.date)}</p>
                                            <p><span className="font-medium">Saat:</span> {event.startTime} - {event.endTime}</p>
                                            <p><span className="font-medium">Lokasyon:</span> {event.location}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleRegister}
                                        className={`w-full ${
                                            event.category === 'conference' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                                            event.category === 'workshop' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' :
                                            event.category === 'social' ? 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800' :
                                            event.category === 'sports' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                                            'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                                        } text-white font-medium py-6`}
                                    >
                                        <CheckCircle className="size-5 mr-2" />
                                        Kayıt Ol
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Kayıt formunu doldurun:
                            </p>
                            {/* Registration Form - Custom fields can be added here */}
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Ad Soyad
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.fullName || ''}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Adınız ve soyadınız"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        E-posta
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="E-posta adresiniz"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Telefon (Opsiyonel)
                                    </label>
                                    <Input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Telefon numaranız"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={() => setShowRegistrationForm(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={handleSubmitRegistration}
                                    disabled={registering || !formData.fullName || !formData.email}
                                    className={`flex-1 ${
                                        event.category === 'conference' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                                        event.category === 'workshop' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' :
                                        event.category === 'social' ? 'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800' :
                                        event.category === 'sports' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                                        'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                                    } text-white`}
                                >
                                    {registering ? (
                                        <>
                                            <Loader2 className="size-4 mr-2 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="size-4 mr-2" />
                                            Kayıt Ol
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

