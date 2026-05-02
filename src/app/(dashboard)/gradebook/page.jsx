'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { NotebookPen, BookOpen, Users, Calendar, ArrowRight, Loader2, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { getMySections } from '@/services/enrollment.service';

/**
 * Gradebook List Page
 * Not defteri listesi - öğretim üyesi için
 */
export default function GradebookListPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'Faculty' && user.role !== 'Admin') {
            router.push('/dashboard');
        } else {
            loadSections();
        }
    }, [user, router]);

    async function loadSections() {
        try {
            setLoading(true);
            const response = await getMySections();

            if (response.success) {
                // Map backend response to frontend format
                const mappedSections = (response.data || []).map(s => ({
                    id: s.id,
                    sectionNumber: s.sectionNumber,
                    enrolledCount: s.enrolledCount || 0,
                    course: {
                        code: s.courseCode,
                        name: s.courseName
                    },
                    schedule: s.schedule ? {
                        day: s.schedule.dayOfWeek,
                        time: `${s.schedule.startTime}-${s.schedule.endTime}`
                    } : null
                }));
                setSections(mappedSections);
            } else {
                setSections([]);
            }
        } catch (error) {
            console.error('Section\'lar yüklenemedi:', error);
            setSections([]);
        } finally {
            setLoading(false);
        }
    }

    if (user && user.role !== 'Faculty' && user.role !== 'Admin') {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-muted-foreground">Bu sayfaya erişim yetkiniz yok.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold">Not Girişi</h1>
                <p className="text-muted-foreground mt-2">
                    Dersleriniz için not girişi yönetimi
                </p>
            </motion.div>

            {sections.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <NotebookPen className="size-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">Henüz size atanmış ders bulunmuyor</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sections.map((section, index) => {
                        const course = section.course;

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border hover:shadow-lg transition-all"
                            >
                                {/* Course Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                                        <BookOpen className="size-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-mono text-sm text-primary">
                                            {course?.code}
                                        </div>
                                        <h3 className="text-lg font-semibold">
                                            {course?.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Section Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="font-medium">Grup:</span>
                                        <span>Grup {section.sectionNumber}</span>
                                    </div>
                                    {section.schedule && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="size-4" />
                                            <span>{section.schedule.day} {section.schedule.time}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="size-4" />
                                        <span>{section.enrolledCount || 0} öğrenci</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link href={`/gradebook/${section.id}`}>
                                    <Button className="w-full gap-2">
                                        <NotebookPen className="size-4" />
                                        Not Girişi Yap
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

