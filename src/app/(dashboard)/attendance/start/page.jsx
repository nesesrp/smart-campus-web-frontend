'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Clock, QrCode, Users, Play,
    Copy, CheckCircle, AlertCircle
} from 'lucide-react';
import { getMySessions, createSession, closeSession } from '@/services/attendance.service';
import { getMySections } from '@/services/enrollment.service';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

/**
 * QR Code Display Component
 */
function QRCodeDisplay({ code }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Kod kopyalandı');
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="p-6 rounded-xl bg-white/10 text-center">
            <div className="w-52 h-52 mx-auto bg-white rounded-xl flex items-center justify-center p-2">
                <QRCodeSVG
                    value={code || 'NO_CODE'}
                    size={192}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#000000"
                />
            </div>
            <p className="mt-4 text-sm text-white/80">Öğrenciler bu kodu tarayabilir:</p>
            <div className="mt-2 flex items-center justify-center gap-2">
                <code className="px-4 py-2 rounded-lg bg-white/20 font-mono text-xs text-white break-all max-w-[200px]">
                    {code?.slice(0, 25)}...
                </code>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                    {copied ? <CheckCircle className="size-5 text-green-300" /> : <Copy className="size-5 text-white" />}
                </button>
            </div>
        </div>
    );
}

/**
 * Active Session Card
 */
function ActiveSessionCard({ session, onClose }) {
    const [closing, setClosing] = useState(false);

    async function handleClose() {
        setClosing(true);
        try {
            await closeSession(session.id);
            toast.success('Oturum kapatıldı');
            onClose?.();
        } catch (error) {
            toast.error('Kapatma başarısız');
        } finally {
            setClosing(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/80 text-sm">Aktif Oturum</p>
                    <h3 className="text-xl font-bold mt-1">{session.courseName}</h3>
                    <p className="text-white/80 mt-1">Seksiyon {session.sectionNumber}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 text-white/80">
                        <Users className="size-4" />
                        <span>{session.presentCount || 0} / {session.totalStudents || 0}</span>
                    </div>
                </div>
            </div>

            <QRCodeDisplay code={session.qrCode} />

            <button
                onClick={handleClose}
                disabled={closing}
                className="mt-4 w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 font-medium transition-colors disabled:opacity-50"
            >
                {closing ? 'Kapatılıyor...' : 'Oturumu Kapat'}
            </button>
        </motion.div>
    );
}

/**
 * Start Attendance Page - Faculty
 */
export default function StartAttendancePage() {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
    const [geofenceRadius, setGeofenceRadius] = useState(15);
    const [duration, setDuration] = useState(15);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeSession, setActiveSession] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);

    useEffect(() => {
        loadSessions();
        getCurrentLocation();
    }, []);

    async function loadSessions() {
        try {
            const response = await getMySessions();
            const sessions = response.data || [];
            // Find active session
            const active = sessions.find(s => s.status === 'Open' || s.status === 0);
            setActiveSession(active || null);

            // Fetch faculty's sections
            const sectionsResponse = await getMySections();
            if (sectionsResponse.success) {
                const mappedSections = (sectionsResponse.data || []).map(s => ({
                    id: s.id,
                    name: `${s.courseCode} - ${s.courseName}`,
                    sectionNumber: s.sectionNumber
                }));
                setSections(mappedSections);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function getCurrentLocation() {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                    setGettingLocation(false);
                },
                (error) => {
                    toast.error('Konum alınamadı: ' + error.message);
                    setGettingLocation(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            toast.error('Tarayıcınız konum özelliğini desteklemiyor');
            setGettingLocation(false);
        }
    }

    async function handleStartSession() {
        if (!selectedSection) {
            toast.error('Lütfen bir seksiyon seçin');
            return;
        }
        if (!location) {
            toast.error('Lütfen konum izni verin');
            return;
        }

        setLoading(true);
        try {
            const now = new Date();
            const end = new Date(now.getTime() + duration * 60000);

            // Format time as HH:mm:ss for backend TimeSpan
            const formatTime = (d) => d.toTimeString().split(' ')[0];

            const response = await createSession({
                sectionId: parseInt(selectedSection),
                date: now.toISOString().split('T')[0],
                startTime: formatTime(now),
                endTime: formatTime(end),
                latitude: location.latitude,
                longitude: location.longitude,
                geofenceRadius
            });

            setActiveSession(response.data);
            toast.success('Yoklama oturumu başlatıldı');
        } catch (error) {
            toast.error(error.message || 'Oturum başlatılamadı');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl lg:text-3xl font-bold">Yoklama Başlat</h1>
                <p className="text-muted-foreground mt-1">GPS tabanlı yoklama oturumu oluşturun</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Session or Create Form */}
                {activeSession ? (
                    <ActiveSessionCard session={activeSession} onClose={loadSessions} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border space-y-6"
                    >
                        <h2 className="text-lg font-semibold">Yeni Oturum</h2>

                        {/* Section Select */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Ders Seçin</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Ders seçin...</option>
                                {sections.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} - Seksiyon {s.sectionNumber}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Geofence Radius */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Geofence Yarıçapı: {geofenceRadius}m
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={geofenceRadius}
                                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>5m</span>
                                <span>50m</span>
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Süre: {duration} dakika
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Location Status */}
                        <div className="p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <MapPin className={`size-5 ${location ? 'text-green-500' : 'text-yellow-500'}`} />
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {gettingLocation ? 'Konum alınıyor...' : location ? 'Konum alındı' : 'Konum gerekli'}
                                    </p>
                                    {location && (
                                        <p className="text-xs text-muted-foreground">
                                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} (±{location.accuracy?.toFixed(0)}m)
                                        </p>
                                    )}
                                </div>
                                {!location && !gettingLocation && (
                                    <button
                                        onClick={getCurrentLocation}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Yenile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStartSession}
                            disabled={loading || !location || !selectedSection}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            <Play className="size-5" />
                            <span>{loading ? 'Başlatılıyor...' : 'Oturumu Başlat'}</span>
                        </button>
                    </motion.div>
                )}

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <h3 className="text-lg font-semibold mb-4">Nasıl Çalışır?</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 h-fit">
                                <MapPin className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">GPS Tabanlı</p>
                                <p className="text-sm text-muted-foreground">
                                    Öğrenciler belirlenen yarıçap içinde olmalı
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 h-fit">
                                <QrCode className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">QR Kod Desteği</p>
                                <p className="text-sm text-muted-foreground">
                                    Alternatif olarak QR kod ile giriş
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 h-fit">
                                <AlertCircle className="size-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Sahtecilik Tespiti</p>
                                <p className="text-sm text-muted-foreground">
                                    Şüpheli konumlar otomatik işaretlenir
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
