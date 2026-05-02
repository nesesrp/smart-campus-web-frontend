'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, Users, BookOpen,
    Download, Mail, CheckCircle
} from 'lucide-react';
import { getSectionStudents, submitGrade } from '@/services/academic.service';
import { toast } from 'sonner';

// Calculate letter grade based on percentage
function calculateLetterGrade(midterm, final) {
    // Vize: 40%, Final: 60%
    const total = (midterm * 0.4) + (final * 0.6);

    if (total >= 90) return 'AA';
    if (total >= 85) return 'BA';
    if (total >= 80) return 'BB';
    if (total >= 75) return 'CB';
    if (total >= 70) return 'CC';
    if (total >= 65) return 'DC';
    if (total >= 60) return 'DD';
    return 'FF';
}

/**
 * Gradebook Page - Faculty
 */
export default function GradebookPage() {
    const params = useParams();
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [grades, setGrades] = useState({});

    useEffect(() => {
        loadStudents();
    }, [params.sectionId]);

    async function loadStudents() {
        try {
            setLoading(true);
            const response = await getSectionStudents(params.sectionId);
            const studentList = response.data || [];
            setStudents(studentList);

            // Initialize grades state
            const initialGrades = {};
            studentList.forEach(s => {
                initialGrades[s.studentId] = {
                    midterm: s.midtermGrade ?? '',
                    final: s.finalGrade ?? '',
                    letter: s.letterGrade ?? ''
                };
            });
            setGrades(initialGrades);
        } catch (error) {
            toast.error('Öğrenciler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleGradeChange(studentId, field, value) {
        const numValue = value === '' ? '' : Math.min(100, Math.max(0, Number(value)));

        setGrades(prev => {
            const updated = { ...prev };
            updated[studentId] = { ...updated[studentId], [field]: numValue };

            // Auto-calculate letter grade
            const mid = field === 'midterm' ? numValue : updated[studentId].midterm;
            const fin = field === 'final' ? numValue : updated[studentId].final;

            if (mid !== '' && fin !== '') {
                updated[studentId].letter = calculateLetterGrade(Number(mid), Number(fin));
            }

            return updated;
        });
    }

    async function handleSave() {
        setSaving(true);
        try {
            const gradeEntries = students
                .filter(s => grades[s.studentId]?.midterm !== '' || grades[s.studentId]?.final !== '')
                .map(s => ({
                    enrollmentId: s.enrollmentId,
                    midtermGrade: grades[s.studentId].midterm || null,
                    finalGrade: grades[s.studentId].final || null
                }));

            if (gradeEntries.length === 0) {
                toast.warning('Kaydedilecek not yok');
                return;
            }

            // Save each grade entry
            for (const entry of gradeEntries) {
                await submitGrade(entry);
            }
            toast.success('Notlar başarıyla kaydedildi');
        } catch (error) {
            toast.error(error.message || 'Kaydetme başarısız');
        } finally {
            setSaving(false);
        }
    }

    function handleExport() {
        // Create CSV
        const headers = ['Öğrenci No', 'Ad Soyad', 'Vize', 'Final', 'Harf Notu'];
        const rows = students.map(s => [
            s.studentNumber,
            s.studentName,
            grades[s.studentId]?.midterm || '',
            grades[s.studentId]?.final || '',
            grades[s.studentId]?.letter || ''
        ]);

        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notlar_${params.sectionId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success('Excel dosyası indirildi');
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="size-4" />
                <span>Geri</span>
            </button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Not Defteri</h1>
                    <p className="text-muted-foreground mt-1">
                        {loading ? 'Yükleniyor...' : `${students.length} öğrenci`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                        <Download className="size-4" />
                        <span>Dışa Aktar</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        <Save className="size-4" />
                        <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                    </button>
                </div>
            </motion.div>

            {/* Gradebook Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                {loading ? (
                    <div className="p-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-14 bg-muted animate-pulse rounded mb-3" />
                        ))}
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="size-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">Öğrenci bulunamadı</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Öğrenci</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Vize (40%)</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-32">Final (60%)</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider w-24">Harf</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {students.map((student) => (
                                    <tr key={student.studentId} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{student.studentName}</p>
                                                <p className="text-sm text-muted-foreground">{student.studentNumber}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={grades[student.studentId]?.midterm ?? ''}
                                                onChange={(e) => handleGradeChange(student.studentId, 'midterm', e.target.value)}
                                                className="w-20 px-3 py-2 text-center rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="-"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={grades[student.studentId]?.final ?? ''}
                                                onChange={(e) => handleGradeChange(student.studentId, 'final', e.target.value)}
                                                className="w-20 px-3 py-2 text-center rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="-"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${grades[student.studentId]?.letter
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {grades[student.studentId]?.letter || '-'}
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
