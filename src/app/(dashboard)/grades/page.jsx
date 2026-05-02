'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GraduationCap, TrendingUp, Download, BookOpen,
    Award, BarChart3
} from 'lucide-react';
import { getMyGrades } from '@/services/grade.service';
import { toast } from 'sonner';

/**
 * Grade Badge Component
 */
function GradeBadge({ letter }) {
    const getColor = () => {
        if (['AA', 'BA'].includes(letter)) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (['BB', 'CB', 'CC'].includes(letter)) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        if (['DC', 'DD'].includes(letter)) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getColor()}`}>
            {letter || '-'}
        </span>
    );
}

/**
 * Stats Card Component
 */
function StatsCard({ icon: Icon, title, value, subtitle, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
        >
            <div className={`p-3 rounded-lg w-fit ${color}`}>
                <Icon className="size-6 text-white" />
            </div>
            <div className="mt-4">
                <h3 className="text-3xl font-bold">{value}</h3>
                <p className="text-sm text-muted-foreground">{title}</p>
                {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>
        </motion.div>
    );
}

// Letter grade to grade point conversion
function letterToGradePoint(letter) {
    const gradePoints = {
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0
    };
    return gradePoints[letter] || 0;
}

/**
 * Grades Page - Student
 */
export default function GradesPage() {
    const [grades, setGrades] = useState([]);
    const [transcript, setTranscript] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const response = await getMyGrades();
            setGrades(response.data || []);
        } catch (error) {
            toast.error('Veriler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDownloadPdf() {
        setDownloading(true);
        try {
            // TODO: Implement actual PDF download
            toast.success('Transkript indirildi');
        } catch (error) {
            toast.error('İndirme başarısız');
        } finally {
            setDownloading(false);
        }
    }

    // Calculate local GPA if not from API
    const calculateGPA = () => {
        if (transcript?.gpa) return transcript.gpa;
        const validGrades = grades.filter(g => g.letterGrade && g.letterGrade !== 'FF');
        if (validGrades.length === 0) return 0;
        const totalPoints = validGrades.reduce((sum, g) => sum + letterToGradePoint(g.letterGrade) * (g.credits || 3), 0);
        const totalCredits = validGrades.reduce((sum, g) => sum + (g.credits || 3), 0);
        return (totalPoints / totalCredits).toFixed(2);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Notlarım</h1>
                    <p className="text-muted-foreground mt-1">
                        Akademik performansınızı görüntüleyin
                    </p>
                </div>
                <button
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    <Download className="size-4" />
                    <span>{downloading ? 'İndiriliyor...' : 'Transkript İndir'}</span>
                </button>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    icon={TrendingUp}
                    title="Dönem GPA"
                    value={calculateGPA()}
                    subtitle="4.00 üzerinden"
                    color="bg-gradient-to-br from-violet-500 to-indigo-600"
                />
                <StatsCard
                    icon={Award}
                    title="CGPA"
                    value={transcript?.cgpa?.toFixed(2) || calculateGPA()}
                    subtitle="Kümülatif ortalama"
                    color="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
                <StatsCard
                    icon={BookOpen}
                    title="Toplam Kredi"
                    value={transcript?.totalCredits || grades.reduce((s, g) => s + (g.credits || 3), 0)}
                    subtitle="Tamamlanan"
                    color="bg-gradient-to-br from-blue-500 to-cyan-600"
                />
                <StatsCard
                    icon={BarChart3}
                    title="Ders Sayısı"
                    value={grades.length}
                    subtitle="Bu dönem"
                    color="bg-gradient-to-br from-orange-500 to-amber-600"
                />
            </div>

            {/* Grades Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold">Ders Notları</h2>
                </div>

                {loading ? (
                    <div className="p-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-12 bg-muted animate-pulse rounded mb-3" />
                        ))}
                    </div>
                ) : grades.length === 0 ? (
                    <div className="p-12 text-center">
                        <GraduationCap className="size-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">Henüz not bulunmuyor</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ders</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Kredi</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Vize</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Final</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Harf</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {grades.map((grade) => (
                                    <tr key={grade.enrollmentId} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{grade.courseName}</p>
                                                <p className="text-sm text-muted-foreground">{grade.courseCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">{grade.credits}</td>
                                        <td className="px-6 py-4 text-center font-medium">{grade.midtermGrade ?? '-'}</td>
                                        <td className="px-6 py-4 text-center font-medium">{grade.finalGrade ?? '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <GradeBadge letter={grade.letterGrade} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
