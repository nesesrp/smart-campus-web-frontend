'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, Wallet, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

/**
 * Payment Fail Content Component
 */
function PaymentFailContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || 'Ödeme işlemi tamamlanamadı';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                </motion.div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ödeme Başarısız
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Ödeme işleminiz tamamlanamadı.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-6">
                    {decodeURIComponent(reason)}
                </p>

                <div className="flex flex-col gap-3">
                    <Link href="/wallet">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Tekrar Dene
                        </Button>
                    </Link>
                    <Link href="/wallet">
                        <Button variant="outline" className="w-full">
                            <Wallet className="w-4 h-4 mr-2" />
                            Cüzdana Git
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full">
                            Ana Sayfa
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

/**
 * Payment Fail Page
 * Iyzico ödeme başarısız olduğunda yönlendirilecek sayfa
 */
export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
            <PaymentFailContent />
        </Suspense>
    );
}
