'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BookOpen, ArrowLeft, Clock, GraduationCap, Users,
    Calendar, MapPin, ChevronRight, AlertCircle, Check
} from 'lucide-react';
import Link from 'next/link';
import { getCourseById } from '@/services/course.service';
import { enrollInCourse } from '@/services/enrollment.service';
import { toast } from 'sonner';

/**
 * Section Card Component
 */
function SectionCard({ section, onEnroll }) {
    const [enrolling, setEnrolling] = useState(false);

    async function handleEnroll() {
        setEnrolling(true);
        try {
            await enrollInCourse(section.id);
            toast.success('Kayıt talebi başarıyla gönderildi');
            onEnroll?.();
        } catch (error) {
            toast.error(error.message || 'Kayıt başarısız');
        } finally {
            setEnrolling(false);
        }
    }

    return (
        <div className="p-4 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Seksiyon {section.sectionNumber}</p>
                    <p className="text-sm text-muted-foreground">{section.instructorName}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">
                        {section.availableSeats} / {section.capacity} kişilik
                    </p>
                    <p className="text-xs text-muted-foreground">{section.semester} {section.year}</p>
                </div>
            </div>

            {section.scheduleJson && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>Haftalık Program</span>
                </div>
            )}

            <button
                onClick={handleEnroll}
                disabled={enrolling || section.availableSeats === 0}
                className="mt-4 w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {enrolling ? 'Kayıt yapılıyor...' : section.availableSeats === 0 ? 'Dolu' : 'Kayıt Ol'}
            </button>
        </div>
    );
}

/**
 * Course Detail Page
 */
export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourseDetails();
    }, [params.id]);

    async function loadCourseDetails() {
        try {
            setLoading(true);
            const response = await getCourseById(params.id);
            setCourse(response.data);
        } catch (error) {
            toast.error('Ders bilgileri yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-64 bg-muted animate-pulse rounded-xl" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="size-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Ders bulunamadı</h3>
                <Link href="/courses" className="text-primary hover:underline">
                    Ders kataloğuna dön
                </Link>
            </div>
        );
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

            {/* Course Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-600 p-8 text-white shadow-xl"
            >
                <div className="relative z-10">
                    <div className="flex items-start gap-6">
                        <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                            <BookOpen className="size-8" />
                        </div>
                        <div className="flex-1">
                            <div className="mb-3">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm font-mono text-sm font-semibold border border-white/30">
                                    {course.code}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold mb-3 leading-tight">{course.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-5" />
                                    <span className="font-medium">{course.credits} Kredi</span>
                                </div>
                                {course.ects && (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="size-5" />
                                        <span className="font-medium">{course.ects} ECTS</span>
                                    </div>
                                )}
                                {course.department && (
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="size-5" />
                                        <span className="font-medium">{course.department.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Course Description */}
            {course.description && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <h2 className="text-lg font-semibold mb-3">Ders Açıklaması</h2>
                    <p className="text-muted-foreground">{course.description}</p>
                </motion.div>
            )}

            {/* Sections */}
            {course.sections && course.sections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <h2 className="text-lg font-semibold mb-4">Açık Seksiyonlar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.sections.map((section) => (
                            <SectionCard
                                key={section.id}
                                section={section}
                                onEnroll={loadCourseDetails}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                >
                    <h2 className="text-lg font-semibold mb-4">Ön Koşullar</h2>
                    <div className="space-y-2">
                        {course.prerequisites.map((prereq) => (
                            <div
                                key={prereq.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                            >
                                <AlertCircle className="size-5 text-yellow-500" />
                                <span>{prereq.code} - {prereq.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
