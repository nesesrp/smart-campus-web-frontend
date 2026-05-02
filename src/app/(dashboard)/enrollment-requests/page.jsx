'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Users, Check, X, Clock,
    Search, ChevronRight, UserCheck, UserX
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { get, post } from '@/services/api-client';
import { toast } from 'sonner';

/**
 * Faculty Enrollment Requests Page
 * Shows courses with pending enrollment requests for faculty approval
 */
export default function FacultyEnrollmentsPage() {
    const { user } = useAuthStore();
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [pendingEnrollments, setPendingEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(false);

    useEffect(() => {
        loadMySections();
    }, []);

    async function loadMySections() {
        try {
            setLoading(true);
            // Get faculty's own sections
            const response = await get('/enrollments/my-sections');
            setSections(response.data || []);
        } catch (error) {
            toast.error('Dersler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function loadPendingEnrollments(sectionId) {
        try {
            setLoadingRequests(true);
            const response = await get(`/enrollments/sections/${sectionId}/pending`);
            setPendingEnrollments(response.data || []);
        } catch (error) {
            toast.error('Kayıt talepleri yüklenemedi');
            console.error(error);
            setPendingEnrollments([]);
        } finally {
            setLoadingRequests(false);
        }
    }

    async function handleApprove(enrollmentId) {
        try {
            await post(`/enrollments/${enrollmentId}/approve`);
            toast.success('Kayıt onaylandı!');
            // Refresh pending list
            if (selectedSection) {
                loadPendingEnrollments(selectedSection.id);
            }
        } catch (error) {
            toast.error(error.message || 'Onaylama başarısız');
        }
    }

    async function handleReject(enrollmentId) {
        try {
            await post(`/enrollments/${enrollmentId}/reject`, { reason: '' });
            toast.success('Kayıt reddedildi');
            // Refresh pending list
            if (selectedSection) {
                loadPendingEnrollments(selectedSection.id);
            }
        } catch (error) {
            toast.error(error.message || 'Reddetme başarısız');
        }
    }

    function handleSectionClick(section) {
        setSelectedSection(section);
        // Load pending enrollments for this section
        loadPendingEnrollments(section.id);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl lg:text-3xl font-bold">Kayıt Talepleri</h1>
                <p className="text-muted-foreground mt-1">
                    Öğrenci kayıt taleplerini onaylayın veya reddedin
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="size-5" />
                        Derslerim
                    </h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : sections.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="size-8 mx-auto mb-2" />
                            <p>Henüz ders atanmamış</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sections.map((section) => (
                                <motion.button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full p-4 rounded-lg border text-left transition-all ${selectedSection?.id === section.id
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-white dark:bg-slate-800/50 border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{section.courseCode}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {section.courseName}
                                            </p>
                                            {section.pendingCount > 0 && (
                                                <span className="text-xs text-amber-600">
                                                    {section.pendingCount} bekleyen talep
                                                </span>
                                            )}
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Enrollments */}
                <div className="lg:col-span-2">
                    {!selectedSection ? (
                        <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                            <div>
                                <Users className="size-12 mx-auto mb-4" />
                                <p>Kayıt taleplerini görüntülemek için bir ders seçin</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    {selectedSection.courseCode} - Bekleyen Talepler
                                </h2>
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-amber-500/10 text-amber-600">
                                    <Clock className="inline size-4 mr-1" />
                                    {pendingEnrollments.length} Talep
                                </span>
                            </div>

                            {loadingRequests ? (
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                                    ))}
                                </div>
                            ) : pendingEnrollments.length === 0 ? (
                                <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-xl border border-border">
                                    <UserCheck className="size-12 mx-auto text-green-500 mb-4" />
                                    <h3 className="font-medium">Bekleyen talep yok</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Tüm kayıt talepleri işlendi
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingEnrollments.map((enrollment, index) => (
                                        <motion.div
                                            key={enrollment.enrollmentId}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-border"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                                        {enrollment.studentName?.charAt(0) || 'Ö'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{enrollment.studentName}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {enrollment.studentNumber} • {enrollment.email}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Talep: {new Date(enrollment.requestDate).toLocaleDateString('tr-TR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleApprove(enrollment.enrollmentId)}
                                                        className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                                                        title="Onayla"
                                                    >
                                                        <Check className="size-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleReject(enrollment.enrollmentId)}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                                                        title="Reddet"
                                                    >
                                                        <X className="size-5" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
