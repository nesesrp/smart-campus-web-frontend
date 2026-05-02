'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, User, Clock, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { getMyCourses, dropCourse } from '@/services/enrollment.service';
import { toast } from 'sonner';

/**
 * Attendance Badge Component
 */
function AttendanceBadge({ percentage, status }) {
    if (status === 'Pending') {
        return (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Clock className="size-4" />
                <span>Onay Bekliyor</span>
            </div>
        );
    }

    const getColor = () => {
        if (percentage >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (percentage >= 70) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    };

    const getIcon = () => {
        if (percentage >= 80) return <CheckCircle className="size-4" />;
        return <AlertTriangle className="size-4" />;
    };

    return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
            {getIcon()}
            <span>%{percentage.toFixed(0)}</span>
        </div>
    );
}

/**
 * Course Card Component
 */
function EnrolledCourseCard({ enrollment, onDrop }) {
    const [dropping, setDropping] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleDrop() {
        setDropping(true);
        try {
            await dropCourse(enrollment.enrollmentId);
            toast.success(enrollment.status === 'Pending' ? 'Kayıt talebi iptal edildi' : 'Dersten başarıyla çekildiniz');
            onDrop?.();
        } catch (error) {
            toast.error(error.message || 'İşlem başarısız');
        } finally {
            setDropping(false);
            setShowConfirm(false);
        }
    }

    // Mock attendance percentage (will come from API)
    const attendancePercentage = Math.floor(Math.random() * 30 + 70);
    const isPending = enrollment.status === 'Pending';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border shadow-sm ${isPending
                    ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                    : 'bg-white dark:bg-slate-800/50 border-border'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${isPending
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                            : 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
                        }`}>
                        <BookOpen className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{enrollment.courseCode}</p>
                        <h3 className="text-lg font-semibold">{enrollment.courseName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Seksiyon {enrollment.sectionNumber}
                        </p>
                    </div>
                </div>
                <AttendanceBadge percentage={attendancePercentage} status={enrollment.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <User className="size-4" />
                    <span>{enrollment.instructorName}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    <span>{enrollment.credits} Kredi</span>
                </div>
            </div>

            {/* Grades only visible if active */}
            {!isPending && (enrollment.midtermGrade || enrollment.finalGrade) && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex gap-6 text-sm">
                        <div>
                            <span className="text-muted-foreground">Vize:</span>
                            <span className="ml-2 font-medium">{enrollment.midtermGrade ?? '-'}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Final:</span>
                            <span className="ml-2 font-medium">{enrollment.finalGrade ?? '-'}</span>
                        </div>
                        {enrollment.letterGrade && (
                            <div>
                                <span className="text-muted-foreground">Harf:</span>
                                <span className="ml-2 font-bold text-primary">{enrollment.letterGrade}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Drop/Cancel Button */}
            <div className="mt-4 pt-4 border-t border-border">
                {showConfirm ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Emin misiniz?</span>
                        <button
                            onClick={handleDrop}
                            disabled={dropping}
                            className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                        >
                            {dropping ? 'İşleniyor...' : (isPending ? 'Evet, İptal Et' : 'Evet, Çekil')}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80"
                        >
                            Vazgeç
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="size-4" />
                        <span>{isPending ? 'Talebi İptal Et' : 'Dersten Çekil'}</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}

/**
 * My Courses Page - Student
 */
export default function MyCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    async function loadCourses() {
        try {
            setLoading(true);
            const response = await getMyCourses();
            setCourses(response.data || []);
        } catch (error) {
            toast.error('Dersler yüklenemedi');
            console.error(error);
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
                <h1 className="text-2xl lg:text-3xl font-bold">Kayıtlı Derslerim</h1>
                <p className="text-muted-foreground mt-1">
                    {loading ? 'Yükleniyor...' : `${courses.length} ders kayıtlı`}
                </p>
            </motion.div>

            {/* Courses Grid */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-6 rounded-xl bg-muted animate-pulse h-48" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="size-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Henüz kayıtlı dersiniz yok</h3>
                    <p className="text-muted-foreground">Ders kataloğundan ders seçebilirsiniz</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((enrollment, index) => (
                        <motion.div
                            key={enrollment.enrollmentId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <EnrolledCourseCard
                                enrollment={enrollment}
                                onDrop={loadCourses}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
