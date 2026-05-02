'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { verifyEmail } from '@/services/auth.service';

/**
 * Verify Email Content (uses useSearchParams)
 */
function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function verify() {
            if (!token || !userId) {
                setStatus('error');
                setMessage('Doğrulama linki geçersiz. Lütfen email\'inizdeki linke tekrar tıklayın.');
                return;
            }

            try {
                const response = await verifyEmail(userId, token);

                if (response.success) {
                    setStatus('success');
                    setMessage('Email adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.');
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Doğrulama başarısız oldu.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
        }

        verify();
    }, [token, userId]);

    return (
        <AuthLayout
            title="Email Doğrulama"
            subtitle={status === 'loading' ? 'Email adresiniz doğrulanıyor...' : undefined}
        >
            <div className="text-center py-8">
                {status === 'loading' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <Loader2 className="size-16 text-primary animate-spin" />
                        <p className="text-muted-foreground">Lütfen bekleyin...</p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle className="size-16 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
                            Başarılı!
                        </h2>
                        <p className="text-muted-foreground max-w-sm">{message}</p>
                        <Button asChild className="mt-4">
                            <Link href="/login">Giriş Yap</Link>
                        </Button>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                            <XCircle className="size-16 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                            Doğrulama Başarısız
                        </h2>
                        <p className="text-muted-foreground max-w-sm">{message}</p>
                        <div className="flex gap-3 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/register">Kayıt Ol</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/login">Giriş Yap</Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </AuthLayout>
    );
}

/**
 * Verify Email Page
 * URL'den token alıp email doğrulama API'sine gönderir
 */
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <AuthLayout title="Email Doğrulama">
                <div className="flex justify-center py-8">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            </AuthLayout>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
