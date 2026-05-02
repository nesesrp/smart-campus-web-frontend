'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, AlertTriangle, XCircle,
    BookOpen, BarChart3, FileText
} from 'lucide-react';
import { getMyAttendance } from '@/services/attendance.service';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Attendance Status Badge
 */
function StatusBadge({ level }) {
    const config = {
        OK: {
            color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            icon: CheckCircle
        },
        Warning: {
            color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            icon: AlertTriangle
        },
        Critical: {
            color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            icon: XCircle
        }
    };

    const { color, icon: Icon } = config[level] || config.OK;

    return (
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
            <Icon className="size-4" />
            <span>{level}</span>
        </div>
    );
}

/**
 * Attendance Card
 */
function AttendanceCard({ course }) {
    const percentage = course.attendancePercentage || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                        <BookOpen className="size-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                        <h3 className="font-semibold">{course.courseName}</h3>
                    </div>
                </div>
                <StatusBadge level={course.warningLevel} />
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Devam Oranı</span>
                    <span className="font-medium">%{percentage.toFixed(0)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${percentage >= 80 ? 'bg-green-500' :
                            percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{course.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Toplam</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-2xl font-bold text-green-600">{course.attendedSessions}</p>
                    <p className="text-xs text-muted-foreground">Katıldım</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-2xl font-bold text-blue-600">{course.excusedSessions}</p>
                    <p className="text-xs text-muted-foreground">Mazeretli</p>
                </div>
            </div>

            {/* Request Excuse Button */}
            {course.warningLevel !== 'OK' && (
                <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
                    <FileText className="size-4" />
                    <span>Mazeret Bildirimi</span>
                </button>
            )}
        </motion.div>
    );
}

/**
 * My Attendance Page - Student
 */
export default function MyAttendancePage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAttendance();
    }, []);

    async function loadAttendance() {
        try {
            setLoading(true);
            const response = await getMyAttendance();
            setCourses(response.data || []);
        } catch (error) {
            toast.error('Veriler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Calculate overall stats
    const overallStats = courses.reduce((acc, course) => {
        acc.total += course.totalSessions || 0;
        acc.attended += course.attendedSessions || 0;
        acc.excused += course.excusedSessions || 0;
        return acc;
    }, { total: 0, attended: 0, excused: 0 });

    const overallPercentage = overallStats.total > 0
        ? ((overallStats.attended + overallStats.excused) / overallStats.total * 100)
        : 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl lg:text-3xl font-bold">Devam Durumum</h1>
                <p className="text-muted-foreground mt-1">
                    Tüm derslerinizin yoklama istatistikleri
                </p>
            </motion.div>

            {/* Overall Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4"
            >
                <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                    <BarChart3 className="size-8 mb-2" />
                    <p className="text-3xl font-bold">%{overallPercentage.toFixed(0)}</p>
                    <p className="text-white/80 text-sm">Genel Oran</p>
                </div>
                <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border">
                    <p className="text-3xl font-bold">{overallStats.total}</p>
                    <p className="text-muted-foreground text-sm">Toplam Oturum</p>
                </div>
                <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border">
                    <p className="text-3xl font-bold text-green-600">{overallStats.attended}</p>
                    <p className="text-muted-foreground text-sm">Katıldığım</p>
                </div>
                <div className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border">
                    <p className="text-3xl font-bold text-blue-600">{overallStats.excused}</p>
                    <p className="text-muted-foreground text-sm">Mazeretli</p>
                </div>
            </motion.div>

            {/* Course Cards */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="size-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Yoklama verisi yok</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.courseCode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <AttendanceCard course={course} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
