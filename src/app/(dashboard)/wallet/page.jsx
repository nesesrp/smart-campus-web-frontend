'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    Plus,
    ArrowDown,
    ArrowUp,
    CreditCard,
    Building2,
    Smartphone,
    X,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Clock,
    XCircle,
    UtensilsCrossed,
    Printer,
    ShoppingBag,
    AlertCircle
} from 'lucide-react';
import { getBalance, addMoneyWithIyzico, getTransactions } from '@/services/wallet.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Status Badge Component
 */
function StatusBadge({ status }) {
    const statusConfig = {
        completed: {
            label: 'Başarılı',
            className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
            icon: CheckCircle
        },
        pending: {
            label: 'Beklemede',
            className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
            icon: Clock
        },
        failed: {
            label: 'Başarısız',
            className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
            icon: XCircle
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className="size-3" />
            {config.label}
        </span>
    );
}

/**
 * Get category icon and color
 */
function getCategoryIcon(category) {
    const categoryConfig = {
        'Yemek': { icon: UtensilsCrossed, color: 'bg-orange-300' },
        'Kırtasiye': { icon: Printer, color: 'bg-blue-300' },
        'Yükleme': { icon: ArrowDown, color: 'bg-green-300' },
        'Alışveriş': { icon: ShoppingBag, color: 'bg-purple-300' }
    };
    return categoryConfig[category] || { icon: Wallet, color: 'bg-gray-300' };
}

/**
 * Add Money Modal
 */
function AddMoneyModal({ isOpen, onClose, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [loading, setLoading] = useState(false);

    const paymentMethods = [
        { value: 'credit_card', label: 'Kredi Kartı', icon: CreditCard },
        { value: 'debit_card', label: 'Banka Kartı', icon: CreditCard },
        { value: 'bank_transfer', label: 'Banka Havalesi', icon: Building2 },
        { value: 'mobile_payment', label: 'Mobil Ödeme', icon: Smartphone }
    ];

    async function handleSubmit(e) {
        e.preventDefault();

        const amountNum = parseFloat(amount);
        if (!amountNum || amountNum <= 0) {
            toast.error('Geçerli bir tutar giriniz');
            return;
        }

        if (amountNum < 10) {
            toast.error('Minimum yükleme tutarı 10 TL\'dir');
            return;
        }

        if (amountNum > 5000) {
            toast.error('Maksimum yükleme tutarı 5000 TL\'dir');
            return;
        }

        try {
            setLoading(true);
            const response = await addMoneyWithIyzico({
                amount: amountNum
            });

            // Iyzico ödeme sayfasına yönlendir
            if (response.data?.paymentPageUrl) {
                toast.success('Ödeme sayfasına yönlendiriliyorsunuz...');
                // Iyzico sayfasına yönlendir
                window.location.href = response.data.paymentPageUrl;
            } else {
                toast.error('Ödeme sayfası oluşturulamadı');
            }
        } catch (error) {
            toast.error(error.message || 'Para yükleme başlatılamadı');
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Para Yükle</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Tutar (TL)
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="10"
                                max="5000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                                className="text-lg"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Minimum: 10 TL, Maksimum: 5000 TL
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Ödeme Yöntemi
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    const isSelected = paymentMethod === method.value;
                                    return (
                                        <button
                                            key={method.value}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.value)}
                                            className={`p-3 rounded-lg border-2 transition-all ${isSelected
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20 shadow-md'
                                                    : 'border-border hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/10 hover:shadow-md'
                                                }`}
                                        >
                                            <Icon className={`size-5 mx-auto mb-1 transition-colors ${isSelected
                                                    ? 'text-purple-600 dark:text-purple-400'
                                                    : 'text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400'
                                                }`} />
                                            <p className={`text-xs font-medium transition-colors ${isSelected
                                                    ? 'text-purple-600 dark:text-purple-400'
                                                    : 'text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400'
                                                }`}>
                                                {method.label}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {loading ? 'Yükleniyor...' : 'Yükle'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Wallet Page
 * Cüzdan sayfası - Bakiye, para yükleme, işlem geçmişi
 */
export default function WalletPage() {
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    });

    useEffect(() => {
        loadData();
    }, [currentPage]);

    async function loadData() {
        await Promise.all([loadBalance(), loadTransactions()]);
    }

    async function loadBalance() {
        try {
            const response = await getBalance();
            setBalance(response.data);
        } catch (error) {
            toast.error('Bakiye yüklenemedi');
            console.error(error);
        }
    }

    async function loadTransactions() {
        try {
            setTransactionsLoading(true);
            const response = await getTransactions({
                page: currentPage,
                pageSize
            });
            setTransactions(response.data?.data || []);
            setPagination({
                totalCount: response.data?.totalCount || 0,
                totalPages: response.data?.totalPages || 1,
                hasNextPage: response.data?.hasNextPage || false,
                hasPreviousPage: response.data?.hasPreviousPage || false
            });
        } catch (error) {
            toast.error('İşlem geçmişi yüklenemedi');
            console.error(error);
        } finally {
            setTransactionsLoading(false);
            setLoading(false);
        }
    }

    function handleAddMoneySuccess() {
        loadBalance();
        loadTransactions();
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(amount);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('tr-TR', { month: 'long' });
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }

    function getTransactionColor(type, status) {
        if (status === 'failed') {
            return 'text-gray-500';
        }
        return type === 'deposit'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400';
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
            >
                <h1 className="text-2xl lg:text-3xl font-bold">Cüzdan</h1>
            </motion.div>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-xl p-6 lg:p-8 text-white"
            >
                {/* Animated Gradient Background */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #a855f7 100%)',
                            'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #9333ea 100%)',
                            'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%)',
                            'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #a855f7 100%)',
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Subtle Gradient Layer for Depth */}
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)',
                        ],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                                <Wallet className="size-6" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Mevcut Bakiye</p>
                                {loading ? (
                                    <div className="h-8 w-32 bg-white/20 rounded animate-pulse mt-1" />
                                ) : (
                                    <h2 className="text-3xl lg:text-4xl font-bold">
                                        {balance ? formatCurrency(balance.balance) : '₺0,00'}
                                    </h2>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowAddMoneyModal(true)}
                        className="bg-white text-violet-600 hover:bg-white/90 font-medium"
                    >
                        <Plus className="size-4 mr-2" />
                        Para Yükle
                    </Button>
                </div>
            </motion.div>

            {/* Transactions History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border overflow-hidden"
            >
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold">İşlem Geçmişi</h2>
                </div>

                {transactionsLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <Wallet className="size-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Henüz işlem geçmişiniz yok</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">İŞLEM TARİHİ</th>
                                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">AÇIKLAMA</th>
                                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">KATEGORİ</th>
                                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">TUTAR</th>
                                        <th className="text-center p-4 text-sm font-medium text-muted-foreground">DURUM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => {
                                        const categoryInfo = getCategoryIcon(transaction.category);
                                        const CategoryIcon = categoryInfo.icon;
                                        const iconBg = categoryInfo.color;
                                        const color = getTransactionColor(transaction.type, transaction.status);
                                        return (
                                            <tr key={transaction.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                                                <td className="p-4 text-sm">
                                                    {formatDate(transaction.transactionDate)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`${iconBg} p-2 rounded-full`}>
                                                            <CategoryIcon className="size-4 text-white" />
                                                        </div>
                                                        <span className="text-sm font-medium">{transaction.description}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {transaction.category || '-'}
                                                </td>
                                                <td className={`p-4 text-sm font-medium text-right ${color}`}>
                                                    {transaction.status === 'failed'
                                                        ? formatCurrency(0)
                                                        : transaction.amount > 0
                                                            ? `+${formatCurrency(transaction.amount)}`
                                                            : formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <StatusBadge status={transaction.status} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="p-4 border-t border-border flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Toplam {pagination.totalCount} işlemden {((currentPage - 1) * pageSize) + 1} ile {Math.min(currentPage * pageSize, pagination.totalCount)} arası gösteriliyor
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={!pagination.hasPreviousPage || transactionsLoading}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    {[...Array(pagination.totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        if (page === 1 || page === pagination.totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    disabled={transactionsLoading}
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="px-2">...</span>;
                                        }
                                        return null;
                                    })}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                        disabled={!pagination.hasNextPage || transactionsLoading}
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Add Money Modal */}
            <AddMoneyModal
                isOpen={showAddMoneyModal}
                onClose={() => setShowAddMoneyModal(false)}
                onSuccess={handleAddMoneySuccess}
            />
        </div>
    );
}

