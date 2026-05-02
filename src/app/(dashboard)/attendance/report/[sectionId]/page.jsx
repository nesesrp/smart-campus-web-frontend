'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download, Users, AlertTriangle, CheckCircle2, XCircle, Calendar, Flag } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAttendanceReport } from '@/services/attendance.service';
import { mockAttendanceReport } from '@/mocks/academic.mock';

/**
 * Attendance Report Page
 * Yoklama raporu - öğretim üyesi için
 */
export default function AttendanceReportPage() {
    const params = useParams();
    const sectionId = params.sectionId;

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: '',
    });
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        loadReport();
    }, [sectionId]);

    useEffect(() => {
        if (report?.students) {
            filterStudents();
        }
    }, [dateFilter, report]);

    async function loadReport() {
        try {
            setLoading(true);
            const response = await getAttendanceReport(sectionId, {
                startDate: dateFilter.startDate || undefined,
                endDate: dateFilter.endDate || undefined,
            });
            
            if (response.success) {
                setReport(response.data);
            } else {
                // Mock data fallback
                setReport(mockAttendanceReport);
            }
        } catch (error) {
            // Mock data fallback
            console.error('Rapor yüklenemedi, mock data kullanılıyor:', error);
            setReport(mockAttendanceReport);
        } finally {
            setLoading(false);
        }
    }

    function filterStudents() {
        if (!report?.students) return;
        
        let filtered = [...report.students];
        
        // Date filter (if implemented in backend)
        // For now, just show all students
        
        setFilteredStudents(filtered);
    }

    function getStatusBadge(percentage) {
        if (percentage >= 80) {
            return { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle2, label: 'İyi' };
        } else if (percentage >= 70) {
            return { color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20', icon: AlertTriangle, label: 'Uyarı' };
        } else {
            return { color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20', icon: XCircle, label: 'Kritik' };
        }
    }

    function exportToExcel() {
        if (!report || !filteredStudents.length) {
            toast.error('Dışa aktarılacak veri yok');
            return;
        }

        // CSV format (Excel compatible)
        const headers = ['Öğrenci Adı', 'Öğrenci No', 'Toplam Oturum', 'Katıldı', 'Yoklama Oranı', 'Durum', 'GPS Şüpheli'];
        const rows = filteredStudents.map(student => {
            const percentage = student.attendancePercentage || 0;
            const status = getStatusBadge(percentage);
            return [
                student.fullName || '',
                student.studentNumber || '',
                student.totalSessions || 0,
                student.attendedSessions || 0,
                `${percentage.toFixed(1)}%`,
                status.label,
                student.isFlagged ? 'Evet' : 'Hayır',
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // BOM for Excel UTF-8 support
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `yoklama-raporu-${sectionId}-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Excel dosyası indirildi');
    }

    function handleDateFilterChange() {
        loadReport();
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
        );
    }

    if (!report) {
        return null;
    }

    const flaggedStudents = filteredStudents.filter(s => s.isFlagged);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between flex-wrap gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold">Yoklama Raporu</h1>
                    <p className="text-muted-foreground mt-2">
                        {report.section?.course?.name} - Grup {report.section?.sectionNumber}
                    </p>
                </div>
                <Button onClick={exportToExcel} className="gap-2">
                    <Download className="size-4" />
                    Excel'e Aktar
                </Button>
            </motion.div>

            {/* Date Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
            >
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Tarih Filtresi:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={dateFilter.startDate}
                            onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                            className="w-auto"
                            placeholder="Başlangıç"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="date"
                            value={dateFilter.endDate}
                            onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                            className="w-auto"
                            placeholder="Bitiş"
                        />
                        <Button variant="outline" size="sm" onClick={handleDateFilterChange}>
                            Filtrele
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="size-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Toplam Öğrenci</span>
                    </div>
                    <p className="text-2xl font-bold">{report.totalStudents || 0}</p>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="size-5 text-green-600" />
                        <span className="text-sm text-muted-foreground">İyi Durumda</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        {report.goodAttendance || 0}
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="size-5 text-yellow-600" />
                        <span className="text-sm text-muted-foreground">Uyarı</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                        {report.warningAttendance || 0}
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="size-5 text-red-600" />
                        <span className="text-sm text-muted-foreground">Kritik</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                        {report.criticalAttendance || 0}
                    </p>
                </div>
            </div>

            {/* Flagged Students Alert */}
            {flaggedStudents.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Flag className="size-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800 dark:text-yellow-400">
                            GPS Şüpheli Öğrenciler ({flaggedStudents.length})
                        </span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Bu öğrencilerin GPS konumları şüpheli görünüyor. Manuel kontrol önerilir.
                    </p>
                </motion.div>
            )}

            {/* Students Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                                    Öğrenci
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Toplam
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Katıldı
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Oran
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">
                                    GPS Şüpheli
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredStudents.map((student) => {
                                const percentage = student.attendancePercentage || 0;
                                const status = getStatusBadge(percentage);
                                const StatusIcon = status.icon;

                                return (
                                    <tr
                                        key={student.id}
                                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                                            student.isFlagged ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                    {student.fullName?.charAt(0)?.toUpperCase() || 'S'}
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {student.fullName || 'Öğrenci'}
                                                    </div>
                                                    {student.studentNumber && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {student.studentNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {student.totalSessions || 0}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {student.attendedSessions || 0}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-semibold">
                                                %{percentage.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs ${status.bgColor} ${status.color}`}>
                                                <StatusIcon className="size-3" />
                                                <span>{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {student.isFlagged ? (
                                                <div className="flex items-center justify-center gap-1 text-yellow-600">
                                                    <Flag className="size-4" />
                                                    <span className="text-xs font-medium">Şüpheli</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
