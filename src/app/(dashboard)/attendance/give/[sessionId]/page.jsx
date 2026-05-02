'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MapPin, Clock, CheckCircle, AlertTriangle,
    Loader2, Navigation, QrCode
} from 'lucide-react';
import { getSessionById, checkIn, calculateDistance } from '@/services/attendance.service';
import { toast } from 'sonner';

/**
 * Give Attendance Page - Student
 */
export default function GiveAttendancePage() {
    const params = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [location, setLocation] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [distance, setDistance] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSession();
    }, [params.sessionId]);

    async function loadSession() {
        try {
            setLoading(true);
            const response = await getSessionById(params.sessionId);
            setSession(response.data);
        } catch (error) {
            setError('Oturum bulunamadı');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function getCurrentLocation() {
        setGettingLocation(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Tarayıcınız konum özelliğini desteklemiyor');
            setGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                setLocation(loc);
                setGettingLocation(false);

                // Calculate distance from classroom
                if (session) {
                    const dist = calculateDistance(
                        loc.latitude, loc.longitude,
                        session.latitude, session.longitude
                    );
                    setDistance(dist);
                }
            },
            (err) => {
                setError('Konum alınamadı: ' + err.message);
                setGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    async function handleCheckIn() {
        if (!location) {
            toast.error('Lütfen önce konum izni verin');
            return;
        }

        setSubmitting(true);
        try {
            const response = await checkIn(params.sessionId, {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy
            });

            setResult(response.data);
            toast.success(response.data?.message || 'Yoklama başarılı!');
        } catch (error) {
            toast.error(error.message || 'Yoklama başarısız');
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error && !session) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="size-12 mx-auto text-red-500" />
                <h3 className="mt-4 text-lg font-medium">{error}</h3>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Session Info */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 text-white"
            >
                <div className="flex items-center gap-2 text-white/80">
                    <Clock className="size-4" />
                    <span>{new Date(session?.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <h1 className="text-2xl font-bold mt-2">{session?.courseName}</h1>
                <p className="text-white/80 mt-1">
                    {session?.courseCode} - Seksiyon {session?.sectionNumber}
                </p>
            </motion.div>

            {/* Result Card */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-xl ${result.isFlagged
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        } border`}
                >
                    <div className="flex items-center gap-3">
                        {result.isFlagged ? (
                            <AlertTriangle className="size-8 text-yellow-600" />
                        ) : (
                            <CheckCircle className="size-8 text-green-600" />
                        )}
                        <div>
                            <h3 className="font-bold text-lg">
                                {result.success ? 'Yoklama Kaydedildi' : 'İşlem Tamamlandı'}
                            </h3>
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                            {result.distanceFromCenter !== undefined && (
                                <p className="text-sm mt-1">
                                    Merkeze uzaklık: {result.distanceFromCenter.toFixed(1)}m
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Location & Map */}
            {!result && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                    >
                        <h2 className="text-lg font-semibold mb-4">Konumunuz</h2>

                        {/* Map Placeholder */}
                        <div className="h-64 rounded-xl overflow-hidden mb-4 bg-muted flex items-center justify-center">
                            <MapPin className="size-12 text-muted-foreground" />
                        </div>

                        {/* Location Info */}
                        <div className="p-4 rounded-lg bg-muted/50">
                            {gettingLocation ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="size-5 animate-spin text-primary" />
                                    <span>Konum alınıyor...</span>
                                </div>
                            ) : location ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="size-5" />
                                        <span className="font-medium">Konum alındı</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </p>
                                    {distance !== null && (
                                        <p className={`text-sm font-medium ${distance <= (session?.geofenceRadius || 50)
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                            }`}>
                                            Sınıfa uzaklık: {distance.toFixed(1)}m
                                            {distance <= (session?.geofenceRadius || 50)
                                                ? ' ✓ Geofence içinde'
                                                : ` ✗ Geofence dışında (max ${session?.geofenceRadius || 50}m)`
                                            }
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={getCurrentLocation}
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <Navigation className="size-5" />
                                    <span>Konum İzni Ver</span>
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <button
                            onClick={handleCheckIn}
                            disabled={submitting || !location}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Gönderiliyor...</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="size-5" />
                                    <span>Yoklama Ver</span>
                                </>
                            )}
                        </button>

                        <button
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
                        >
                            <QrCode className="size-5" />
                            <span>QR Kod ile Gir (Bonus)</span>
                        </button>
                    </motion.div>
                </>
            )}
        </div>
    );
}
