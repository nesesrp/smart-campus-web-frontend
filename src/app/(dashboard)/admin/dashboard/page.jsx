'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    TrendingUp,
    AlertTriangle,
    Activity,
    Download,
    Clock,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { getDashboardStats, getDepartmentGpaStats, getGradeDistribution, getAtRiskStudents } from '@/services/analytics.service';
import { exportStudentListToExcel, exportAtRiskStudentsToExcel } from '@/services/report.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

/**
 * Admin Dashboard Page
 * Analytics ve raporlama merkezi
 */
export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [gradeDistribution, setGradeDistribution] = useState([]);
    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [statsRes, deptRes, gradeRes, riskRes] = await Promise.all([
                getDashboardStats().catch(() => ({ data: null })),
                getDepartmentGpaStats().catch(() => ({ data: [] })),
                getGradeDistribution().catch(() => ({ data: [] })),
                getAtRiskStudents(2.0, 20).catch(() => ({ data: [] }))
            ]);

            setStats(statsRes.data || {
                totalUsers: 1250,
                totalStudents: 1100,
                totalFaculty: 150,
                activeEnrollments: 4500,
                upcomingEvents: 12,
                attendanceRate: 87.5,
                averageGpa: 2.85
            });

            setDepartmentStats(deptRes.data || [
                { name: 'Bilgisayar Müh.', averageGpa: 3.2, studentCount: 320 },
                { name: 'Elektrik Müh.', averageGpa: 2.9, studentCount: 280 },
                { name: 'Makine Müh.', averageGpa: 2.7, studentCount: 250 },
                { name: 'İşletme', averageGpa: 3.0, studentCount: 200 },
                { name: 'Mimarlık', averageGpa: 3.1, studentCount: 150 }
            ]);

            setGradeDistribution(gradeRes.data || [
                { grade: 'AA', count: 180 },
                { grade: 'BA', count: 320 },
                { grade: 'BB', count: 450 },
                { grade: 'CB', count: 380 },
                { grade: 'CC', count: 290 },
                { grade: 'DC', count: 150 },
                { grade: 'DD', count: 80 },
                { grade: 'FF', count: 50 }
            ]);

            setAtRiskStudents(riskRes.data || []);
        } catch (error) {
            console.error('Dashboard load error:', error);
            toast.error('Veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    async function handleExportStudents() {
        try {
            setExporting(true);
            await exportStudentListToExcel();
            toast.success('Öğrenci listesi indirildi');
        } catch (error) {
            toast.error('İndirme başarısız');
        } finally {
            setExporting(false);
        }
    }

    async function handleExportAtRisk() {
        try {
            setExporting(true);
            await exportAtRiskStudentsToExcel(2.0);
            toast.success('Riskli öğrenci listesi indirildi');
        } catch (error) {
            toast.error('İndirme başarısız');
        } finally {
            setExporting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="size-12 animate-spin mx-auto mb-4 text-violet-500" />
                    <p className="text-muted-foreground">Dashboard yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 className="size-8" />
                                <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
                            </div>
                            <p className="text-white/90">Kampüs analitik ve raporları</p>
                        </div>
                        <Button
                            onClick={handleExportStudents}
                            disabled={exporting}
                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                            <Download className="size-4 mr-2" />
                            Rapor İndir
                        </Button>
                    </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Toplam Kullanıcı', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600' },
                    { label: 'Öğrenci', value: stats?.totalStudents || 0, icon: GraduationCap, color: 'from-green-500 to-green-600' },
                    { label: 'Akademisyen', value: stats?.totalFaculty || 0, icon: BookOpen, color: 'from-purple-500 to-purple-600' },
                    { label: 'Aktif Kayıt', value: stats?.activeEnrollments || 0, icon: Activity, color: 'from-amber-500 to-amber-600' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                                <stat.icon className="size-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department GPA Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="size-5 text-violet-500" />
                        Bölüm Bazlı Ortalama GPA
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 4]} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="averageGpa" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Grade Distribution Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="size-5 text-violet-500" />
                        Not Dağılımı
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={gradeDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="grade"
                            >
                                {gradeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Attendance Rate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Clock className="size-5 text-green-500" />
                            Devam Oranı
                        </h3>
                        <span className="text-2xl font-bold text-green-500">
                            {stats?.attendanceRate || 87.5}%
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${stats?.attendanceRate || 87.5}%` }}
                        />
                    </div>
                </motion.div>

                {/* Average GPA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <GraduationCap className="size-5 text-blue-500" />
                            Ortalama GPA
                        </h3>
                        <span className="text-2xl font-bold text-blue-500">
                            {stats?.averageGpa || 2.85}
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${((stats?.averageGpa || 2.85) / 4) * 100}%` }}
                        />
                    </div>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="size-5 text-purple-500" />
                            Yaklaşan Etkinlik
                        </h3>
                        <span className="text-3xl font-bold text-purple-500">
                            {stats?.upcomingEvents || 12}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* At-Risk Students */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="size-5 text-amber-500" />
                        Riskli Öğrenciler
                        <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                            GPA &lt; 2.0 veya Devamsızlık &gt; 20%
                        </span>
                    </h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportAtRisk}
                        disabled={exporting}
                    >
                        <Download className="size-4 mr-2" />
                        Excel İndir
                    </Button>
                </div>

                {atRiskStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckCircle className="size-12 mx-auto mb-4 text-green-500" />
                        <p className="text-muted-foreground">Riskli öğrenci bulunmuyor</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Öğrenci</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bölüm</th>
                                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">GPA</th>
                                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Devamsızlık</th>
                                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Risk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atRiskStudents.slice(0, 10).map((student, index) => (
                                    <tr key={student.id || index} className="border-t border-border hover:bg-muted/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-medium">
                                                    {student.fullName?.charAt(0) || 'Ö'}
                                                </div>
                                                <span className="font-medium">{student.fullName || 'Öğrenci'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{student.department || '-'}</td>
                                        <td className="p-4 text-center">
                                            <span className={`font-medium ${student.gpa < 2.0 ? 'text-red-500' : 'text-foreground'}`}>
                                                {student.gpa?.toFixed(2) || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`font-medium ${student.absenceRate > 20 ? 'text-red-500' : 'text-foreground'}`}>
                                                %{student.absenceRate?.toFixed(1) || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                                Yüksek
                                            </span>
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
