'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    QrCode, 
    Scan, 
    CheckCircle, 
    XCircle, 
    User, 
    GraduationCap, 
    Calendar,
    Clock,
    MapPin,
    Loader2,
    Camera,
    Users,
    PartyPopper
} from 'lucide-react';
import { validateEventQRCode, checkInEvent, getEventAttendeeCount } from '@/services/event.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Event Check-in Page
 * Event manager için QR scanner
 * Dokümantasyona göre:
 * - QR scanner
 * - Validate registration
 * - Mark as checked in
 * - Display attendee count
 */
export default function EventCheckInPage() {
    const [qrInput, setQrInput] = useState('');
    const [validating, setValidating] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [attendeeCount, setAttendeeCount] = useState(null);
    const [currentEventId, setCurrentEventId] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    async function handleScan() {
        const code = qrInput.trim();
        
        if (!code) {
            toast.error('Lütfen QR kod giriniz');
            return;
        }

        try {
            setValidating(true);
            setError(null);
            setScanResult(null);
            
            const response = await validateEventQRCode(code);
            setScanResult(response.data);
            setCurrentEventId(response.data.event?.id);
            
            // Katılımcı sayısını getir
            if (response.data.event?.id) {
                try {
                    const countResponse = await getEventAttendeeCount(response.data.event.id);
                    setAttendeeCount(countResponse.data);
                } catch (err) {
                    console.error('Attendee count error:', err);
                }
            }
            
            toast.success('QR kod doğrulandı');
        } catch (error) {
            setError(error.message);
            setScanResult(null);
            toast.error(error.message);
        } finally {
            setValidating(false);
        }
    }

    async function handleCheckIn() {
        if (!scanResult?.registration?.qrCode) {
            return;
        }

        try {
            setCheckingIn(true);
            const response = await checkInEvent(scanResult.registration.qrCode);
            toast.success('Check-in başarıyla yapıldı!');
            
            // Katılımcı sayısını güncelle
            if (response.data?.attendeeCount) {
                setAttendeeCount(response.data.attendeeCount);
            }
            
            // Scan result'ı güncelle
            setScanResult({
                ...scanResult,
                registration: {
                    ...scanResult.registration,
                    checkedIn: true,
                    checkedInAt: new Date().toISOString()
                }
            });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setCheckingIn(false);
        }
    }

    function handleReset() {
        setScanResult(null);
        setQrInput('');
        setError(null);
        setAttendeeCount(null);
        setCurrentEventId(null);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const registration = scanResult?.registration;
    const event = scanResult?.event;
    const user = scanResult?.user;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <h1 className="text-2xl lg:text-3xl font-bold">Etkinlik Check-in</h1>
                    <p className="text-white/90 mt-2">
                        QR kod ile etkinlik katılımcılarını kontrol edin
                    </p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - QR Scanner */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* QR Scanner Section */}
                    <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden">
                        <div className="p-4 border-b border-border">
                            <h2 className="font-semibold">QR Kod Tarayıcı</h2>
                        </div>
                        
                        {/* Camera View Placeholder */}
                        <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <QrCode className="size-32 text-slate-700" />
                                </div>
                            </div>
                            
                            {/* QR Frame Overlay */}
                            <div className="relative z-10 w-64 h-64 border-4 border-purple-500 rounded-lg">
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-purple-500 rounded-tl-lg" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-purple-500 rounded-tr-lg" />
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-purple-500 rounded-bl-lg" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-purple-500 rounded-br-lg" />
                            </div>
                            
                            {/* Instruction */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                                <p className="text-sm">QR kodu çerçeveye hizalayın</p>
                            </div>
                        </div>
                        
                        {/* Camera Status */}
                        <div className="p-4 bg-muted/30 flex items-center gap-2 text-sm text-muted-foreground">
                            <Camera className="size-4 text-green-600" />
                            <span>Kamera Aktif</span>
                        </div>
                    </div>

                    {/* Manual Entry Section */}
                    <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6">
                        <h2 className="font-semibold mb-4">Manuel Giriş</h2>
                        <div className="space-y-3">
                            <Input
                                ref={inputRef}
                                type="text"
                                value={qrInput}
                                onChange={(e) => setQrInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleScan();
                                    }
                                }}
                                placeholder="QR kod giriniz..."
                                className="text-lg py-6"
                                disabled={validating}
                            />
                            <Button
                                onClick={handleScan}
                                disabled={validating || !qrInput.trim()}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                            >
                                {validating ? (
                                    <>
                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                        Doğrulanıyor...
                                    </>
                                ) : (
                                    <>
                                        <Scan className="size-4 mr-2" />
                                        Doğrula
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Scan Result */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <AnimatePresence>
                        {scanResult && registration && event && user ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="rounded-xl bg-white dark:bg-slate-800/50 border-2 border-green-200 dark:border-green-800 p-6"
                            >
                                {/* Success Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold">Tarama Sonucu</h2>
                                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-1.5">
                                        <CheckCircle className="size-3.5" />
                                        GEÇERLİ
                                    </span>
                                </div>

                                {/* User Info */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                        <User className="size-5 text-purple-600" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Ad Soyad</p>
                                            <p className="font-semibold">{user.fullName || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                                        <GraduationCap className="size-5 text-purple-600" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Öğrenci No</p>
                                            <p className="font-semibold">{user.studentNumber || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="space-y-3 mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold mb-2">{event.title}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="size-4" />
                                            <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="size-4" />
                                            <span>{event.startTime} - {event.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="size-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Check-in Status */}
                                {registration.checkedIn ? (
                                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 mb-6">
                                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                            <CheckCircle className="size-5" />
                                            <span className="font-medium">Zaten Check-in Yapılmış</span>
                                        </div>
                                        {registration.checkedInAt && (
                                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                                {new Date(registration.checkedInAt).toLocaleString('tr-TR')}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleCheckIn}
                                        disabled={checkingIn}
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-6 mb-6"
                                    >
                                        {checkingIn ? (
                                            <>
                                                <Loader2 className="size-5 mr-2 animate-spin" />
                                                Check-in Yapılıyor...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="size-5 mr-2" />
                                                Check-in Yap
                                            </>
                                        )}
                                    </Button>
                                )}

                                {/* Attendee Count */}
                                {attendeeCount && (
                                    <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-5 text-purple-600" />
                                            <span className="text-sm text-muted-foreground">Katılımcı Sayısı</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg">{attendeeCount.checkedIn} / {attendeeCount.total}</p>
                                            <p className="text-xs text-muted-foreground">Check-in yapıldı</p>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="w-full mt-4"
                                >
                                    Yeni Tarama
                                </Button>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="rounded-xl bg-white dark:bg-slate-800/50 border-2 border-red-200 dark:border-red-800 p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <XCircle className="size-6 text-red-600 dark:text-red-400" />
                                    <h2 className="font-semibold text-red-900 dark:text-red-100">Hata</h2>
                                </div>
                                <p className="text-red-700 dark:text-red-300 text-sm mb-4">{error}</p>
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Tekrar Dene
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                            >
                                <h2 className="font-semibold mb-4">Tarama Sonucu</h2>
                                <div className="text-center py-12">
                                    <QrCode className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <p className="text-muted-foreground text-sm">
                                        QR kod giriniz
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

