'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Send, Check, X, Clock, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { get, post } from '@/services/api-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Faculty Take Course Page
 * Akademisyenlerin bölümlerindeki dersleri alabilmeleri için istek gönderme sayfası
 */
export default function TakeCoursePage() {
    const { user } = useAuthStore();
    const [availableSections, setAvailableSections] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available'); // 'available' | 'requests'

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [sectionsRes, requestsRes] = await Promise.all([
                get('/FacultyRequests/available-sections'),
                get('/FacultyRequests/my')
            ]);

            if (sectionsRes.success) {
                setAvailableSections(sectionsRes.data || []);
            }
            if (requestsRes.success) {
                setMyRequests(requestsRes.data || []);
            }
        } catch (error) {
            console.error('Veri yüklenemedi:', error);
            toast.error('Veriler yüklenemedi');
        } finally {
            setLoading(false);
        }
    }

    async function handleRequestCourse(sectionId) {
        try {
            const response = await post('/FacultyRequests', { sectionId });
            if (response.success) {
                toast.success('Ders alma isteği gönderildi!');
                loadData(); // Refresh
            } else {
                toast.error(response.errors?.[0] || 'İstek gönderilemedi');
            }
        } catch (error) {
            toast.error(error.message || 'Bir hata oluştu');
        }
    }

    function getStatusBadge(status) {
        switch (status) {
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600">
                        <Clock className="size-3" />
                        Beklemede
                    </span>
                );
            case 'Approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                        <Check className="size-3" />
                        Onaylandı
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
                        <X className="size-3" />
                        Reddedildi
                    </span>
                );
            default:
                return null;
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                    <GraduationCap className="size-8 text-primary" />
                    Ders Al
                </h1>
                <p className="text-muted-foreground mt-1">
                    Bölümünüzdeki dersleri seçin ve admin onayı için istek gönderin
                </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
                <button
                    onClick={() => setActiveTab('available')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'available'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Uygun Dersler
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'requests'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    İsteklerim ({myRequests.length})
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Yükleniyor...</div>
                </div>
            ) : activeTab === 'available' ? (
                /* Available Sections */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableSections.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            <BookOpen className="size-12 mx-auto mb-4 opacity-50" />
                            <p>Uygun ders bulunamadı</p>
                        </div>
                    ) : (
                        availableSections.map((section, index) => (
                            <motion.div
                                key={section.sectionId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="px-2 py-1 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-mono text-xs font-semibold">
                                        {section.courseCode}
                                    </span>
                                    {section.alreadyAssigned && (
                                        <span className="text-xs text-green-600">Atanmış</span>
                                    )}
                                </div>
                                <h3 className="font-semibold mb-1">{section.courseName}</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Section {section.sectionNumber} • {section.semester} {section.year}
                                </p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Kapasite: {section.capacity} öğrenci
                                </p>

                                {section.alreadyAssigned ? (
                                    <Button disabled className="w-full" variant="outline">
                                        <Check className="size-4 mr-2" />
                                        Zaten Atanmış
                                    </Button>
                                ) : section.alreadyRequested ? (
                                    <Button disabled className="w-full" variant="outline">
                                        <Clock className="size-4 mr-2" />
                                        İstek Gönderildi
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleRequestCourse(section.sectionId)}
                                        className="w-full"
                                    >
                                        <Send className="size-4 mr-2" />
                                        Ders Al İsteği Gönder
                                    </Button>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            ) : (
                /* My Requests */
                <div className="space-y-4">
                    {myRequests.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Clock className="size-12 mx-auto mb-4 opacity-50" />
                            <p>Henüz istek göndermediniz</p>
                        </div>
                    ) : (
                        myRequests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-primary/10">
                                            <BookOpen className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-semibold text-primary">
                                                    {request.courseCode}
                                                </span>
                                                <span className="font-semibold">{request.courseName}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Section {request.sectionNumber} • İstek: {new Date(request.requestDate).toLocaleDateString('tr-TR')}
                                            </p>
                                            {request.adminNote && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Not: {request.adminNote}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
