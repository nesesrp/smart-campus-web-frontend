'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Check, X, Clock, GraduationCap, BookOpen, Building2 } from 'lucide-react';
import { get, post } from '@/services/api-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Admin Faculty Requests Page
 * Admin paneli - Akademisyenlerin ders alma taleplerini onaylama/reddetme
 */
export default function AdminFacultyRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        try {
            setLoading(true);
            const response = await get('/FacultyRequests/pending');
            if (response.success) {
                setRequests(response.data || []);
            }
        } catch (error) {
            console.error('Talepler yüklenemedi:', error);
            toast.error('Talepler yüklenemedi');
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(requestId) {
        try {
            setProcessingId(requestId);
            const response = await post(`/FacultyRequests/${requestId}/approve`, {});
            if (response.success) {
                toast.success('Talep onaylandı! Akademisyen derse atandı.');
                loadRequests();
            } else {
                toast.error(response.errors?.[0] || 'Onaylama başarısız');
            }
        } catch (error) {
            toast.error(error.message || 'Bir hata oluştu');
        } finally {
            setProcessingId(null);
        }
    }

    async function handleReject(requestId) {
        try {
            setProcessingId(requestId);
            const response = await post(`/FacultyRequests/${requestId}/reject`, {});
            if (response.success) {
                toast.success('Talep reddedildi');
                loadRequests();
            } else {
                toast.error(response.errors?.[0] || 'Reddetme başarısız');
            }
        } catch (error) {
            toast.error(error.message || 'Bir hata oluştu');
        } finally {
            setProcessingId(null);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                    <GraduationCap className="size-8 text-primary" />
                    Akademisyen Ders Talepleri
                </h1>
                <p className="text-muted-foreground mt-1">
                    Akademisyenlerin ders alma taleplerini onaylayın veya reddedin
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-amber-500/20">
                        <Clock className="size-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{requests.length}</p>
                        <p className="text-sm text-muted-foreground">Bekleyen Talep</p>
                    </div>
                </div>
            </motion.div>

            {/* Requests List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Yükleniyor...</div>
                </div>
            ) : requests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-xl border border-border"
                >
                    <Check className="size-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold">Bekleyen talep yok</h3>
                    <p className="text-muted-foreground mt-1">
                        Tüm talepler işlenmiş durumda
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request, index) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                {/* Faculty Info */}
                                <div className="flex items-start gap-4">
                                    <div className="size-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                                        {request.facultyName?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {request.facultyTitle} {request.facultyName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {request.facultyEmail}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                            <Building2 className="size-4" />
                                            {request.departmentName}
                                        </div>
                                    </div>
                                </div>

                                {/* Course Info */}
                                <div className="flex items-center gap-4 lg:text-right">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <BookOpen className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-mono text-xs font-semibold">
                                                {request.courseCode}
                                            </span>
                                        </div>
                                        <p className="font-medium mt-1">{request.courseName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Section {request.sectionNumber}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 lg:ml-4">
                                    <Button
                                        onClick={() => handleApprove(request.id)}
                                        disabled={processingId === request.id}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="size-4 mr-2" />
                                        Onayla
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(request.id)}
                                        disabled={processingId === request.id}
                                        variant="destructive"
                                    >
                                        <X className="size-4 mr-2" />
                                        Reddet
                                    </Button>
                                </div>
                            </div>

                            {/* Request Date */}
                            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="size-4" />
                                Talep tarihi: {new Date(request.requestDate).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
