'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Payment Success Page
 * Iyzico ödeme başarılı olduğunda yönlendirilecek sayfa
 */
export default function PaymentSuccessPage() {
    useEffect(() => {
        // 5 saniye sonra otomatik yönlendir
        const timer = setTimeout(() => {
            window.location.href = '/wallet';
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </motion.div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ödeme Başarılı!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bakiyeniz başarıyla yüklendi. Cüzdan sayfanıza yönlendiriliyorsunuz...
                </p>

                <div className="flex flex-col gap-3">
                    <Link href="/wallet">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                            <Wallet className="w-4 h-4 mr-2" />
                            Cüzdana Git
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" className="w-full">
                            Ana Sayfa
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    5 saniye içinde otomatik yönlendirileceksiniz...
                </p>
            </motion.div>
        </div>
    );
}
