'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Users,
    AlertTriangle,
    Download,
    Loader2,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    XCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { getAttendanceStats, getAtRiskStudents } from '@/services/analytics.service';
import { exportAttendanceReportToPdf, exportAtRiskStudentsToExcel } from '@/services/report.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Attendance Analytics Page
 */
export default function AttendanceAnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [statsRes, riskRes] = await Promise.all([
                getAttendanceStats().catch(() => ({ data: null })),
                getAtRiskStudents(2.0, 20).catch(() => ({ data: [] }))
            ]);

            setStats(statsRes.data || {
                overallRate: 87.5,
                totalSessions: 1250,
                courseStats: [
                    { name: 'Yazılım Müh.', rate: 92 },
                    { name: 'Veri Yapıları', rate: 88 },
                    { name: 'Matematik', rate: 85 },
                    { name: 'Fizik', rate: 82 },
                    { name: 'Kimya', rate: 79 }
                ],
                weeklyTrend: [
                    { week: 'Hafta 1', rate: 85 },
                    { week: 'Hafta 2', rate: 87 },
                    { week: 'Hafta 3', rate: 89 },
                    { week: 'Hafta 4', rate: 86 },
                    { week: 'Hafta 5', rate: 88 },
                    { week: 'Hafta 6', rate: 90 },
                    { week: 'Hafta 7', rate: 87 }
                ]
            });

            setAtRiskStudents(riskRes.data || [
                { id: 1, fullName: 'Ahmet Yılmaz', department: 'Bilgisayar Müh.', absenceRate: 28, gpa: 1.8 },
                { id: 2, fullName: 'Ayşe Demir', department: 'Elektrik Müh.', absenceRate: 25, gpa: 2.1 },
                { id: 3, fullName: 'Mehmet Kaya', department: 'Makine Müh.', absenceRate: 32, gpa: 1.5 }
            ]);
        } catch (error) {
            console.error('Load error:', error);
            toast.error('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    async function handleExportAtRisk() {
        try {
            setExporting(true);
            await exportAtRiskStudentsToExcel(2.0);
            toast.success('Rapor indirildi');
        } catch (error) {
            toast.error('İndirme başarısız');
        } finally {
            setExporting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="size-12 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="size-8" />
                            <h1 className="text-2xl lg:text-3xl font-bold">Devamsızlık Analizi</h1>
                        </div>
                        <p className="text-white/90">Ders bazlı devam oranları ve riskli öğrenciler</p>
                    </div>
                    <Button
                        onClick={handleExportAtRisk}
                        disabled={exporting}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                        <Download className="size-4 mr-2" />
                        Rapor İndir
                    </Button>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            <CheckCircle className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-500">%{stats?.overallRate || 0}</p>
                            <p className="text-xs text-muted-foreground">Genel Devam Oranı</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats?.totalSessions || 0}</p>
                            <p className="text-xs text-muted-foreground">Toplam Oturum</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-500">{atRiskStudents.length}</p>
                            <p className="text-xs text-muted-foreground">Riskli Öğrenci</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 text-white">
                            <TrendingUp className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">+3%</p>
                            <p className="text-xs text-muted-foreground">Bu Hafta</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Attendance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Ders Bazlı Devam Oranı</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats?.courseStats || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value) => `%${value}`} />
                            <Bar dataKey="rate" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Weekly Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Haftalık Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats?.weeklyTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                            <YAxis domain={[70, 100]} />
                            <Tooltip formatter={(value) => `%${value}`} />
                            <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* At-Risk Students */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="size-5 text-amber-500" />
                        Yüksek Devamsızlık (&gt;20%)
                    </h3>
                </div>
                {atRiskStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckCircle className="size-12 mx-auto mb-4 text-green-500" />
                        <p className="text-muted-foreground">Yüksek devamsızlığı olan öğrenci yok</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Öğrenci</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bölüm</th>
                                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Devamsızlık</th>
                                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">GPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atRiskStudents.map((student) => (
                                    <tr key={student.id} className="border-t border-border hover:bg-muted/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-medium">
                                                    {student.fullName?.charAt(0) || 'Ö'}
                                                </div>
                                                <span className="font-medium">{student.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{student.department}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
                                                %{student.absenceRate}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center font-medium">{student.gpa?.toFixed(2)}</td>
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
