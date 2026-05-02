'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, CheckCircle, XCircle, Clock,
    User, Calendar, ExternalLink, Search
} from 'lucide-react';
import { getExcuseRequests, approveExcuseRequest, rejectExcuseRequest } from '@/services/attendance.service';
import { toast } from 'sonner';

/**
 * Status Badge
 */
function StatusBadge({ status }) {
    const config = {
        Pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30', icon: Clock, label: 'Bekliyor' },
        Approved: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30', icon: CheckCircle, label: 'Onaylandı' },
        Rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30', icon: XCircle, label: 'Reddedildi' }
    };

    const { color, icon: Icon, label } = config[status] || config.Pending;

    return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            <Icon className="size-3" />
            <span>{label}</span>
        </div>
    );
}

/**
 * Excuse Request Card
 */
function ExcuseRequestCard({ request, onAction }) {
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    async function handleApprove() {
        setProcessing(true);
        try {
            await approveExcuseRequest(request.id, { notes });
            toast.success('Talep onaylandı');
            onAction?.();
        } catch (error) {
            toast.error('İşlem başarısız');
        } finally {
            setProcessing(false);
        }
    }

    async function handleReject() {
        setProcessing(true);
        try {
            await rejectExcuseRequest(request.id, { notes });
            toast.success('Talep reddedildi');
            onAction?.();
        } catch (error) {
            toast.error('İşlem başarısız');
        } finally {
            setProcessing(false);
        }
    }

    const isPending = request.status === 'Pending' || request.status === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white dark:bg-slate-800/50 border border-border"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                        <User className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{request.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{request.studentNumber}</p>
                    </div>
                </div>
                <StatusBadge status={request.status} />
            </div>

            <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{new Date(request.sessionDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <span>•</span>
                    <span>{request.courseCode}</span>
                </div>
                <p className="text-sm">{request.reason}</p>
            </div>

            {request.documentUrl && (
                <a
                    href={request.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
                >
                    <ExternalLink className="size-4" />
                    <span>Belgeyi Görüntüle</span>
                </a>
            )}

            {isPending && (
                <div className="mt-4 space-y-3">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Not ekle (opsiyonel)..."
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        rows={2}
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={handleApprove}
                            disabled={processing}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                            <CheckCircle className="size-4" />
                            <span>Onayla</span>
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={processing}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                            <XCircle className="size-4" />
                            <span>Reddet</span>
                        </button>
                    </div>
                </div>
            )}

            {request.notes && !isPending && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30 text-sm">
                    <p className="text-muted-foreground">Not: {request.notes}</p>
                </div>
            )}
        </motion.div>
    );
}

/**
 * Excuse Requests Page - Faculty
 */
export default function ExcuseRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        try {
            setLoading(true);
            const response = await getExcuseRequests();
            setRequests(response.data || []);
        } catch (error) {
            toast.error('Talepler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter || (filter === 'Pending' && r.status === 0));

    const pendingCount = requests.filter(r => r.status === 'Pending' || r.status === 0).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Mazeret Talepleri</h1>
                    <p className="text-muted-foreground mt-1">
                        {pendingCount} bekleyen talep
                    </p>
                </div>
                <div className="flex gap-2">
                    {['Pending', 'Approved', 'Rejected', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                                }`}
                        >
                            {f === 'all' ? 'Tümü' : f === 'Pending' ? 'Bekleyen' : f === 'Approved' ? 'Onaylanan' : 'Reddedilen'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Request Cards */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="size-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Talep bulunamadı</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredRequests.map((request, index) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ExcuseRequestCard
                                request={request}
                                onAction={loadRequests}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
