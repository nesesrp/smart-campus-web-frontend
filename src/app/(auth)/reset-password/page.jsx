'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { resetPasswordSchema, resetPasswordDefaultValues } from '@/schemas/reset-password.schema';
import { resetPassword } from '@/services/auth.service';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

/**
 * Reset Password Content (uses useSearchParams)
 */
function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('form'); // form, success, error
    const [passwordValue, setPasswordValue] = useState('');

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: resetPasswordDefaultValues,
        mode: 'onChange',
    });

    const password = form.watch('password');

    useEffect(() => {
        setPasswordValue(password || '');
    }, [password]);

    useEffect(() => {
        if (!token || !email) {
            setStatus('error');
        }
    }, [token, email]);

    async function onSubmit(data) {
        if (!token || !email) {
            toast.error('Geçersiz sıfırlama linki');
            return;
        }

        setIsLoading(true);

        try {
            const response = await resetPassword({
                email,
                token,
                newPassword: data.password,
                confirmPassword: data.confirmPassword,
            });

            if (response.success) {
                setStatus('success');
                toast.success('Şifre başarıyla değiştirildi!');
            }
        } catch (error) {
            toast.error('Şifre sıfırlama başarısız', {
                description: error.message || 'Lütfen tekrar deneyin.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (status === 'error') {
        return (
            <AuthLayout title="Geçersiz Link">
                <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                        <XCircle className="size-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                        Geçersiz Sıfırlama Linki
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                        Bu şifre sıfırlama linki geçersiz veya süresi dolmuş olabilir.
                        Lütfen yeni bir sıfırlama linki talep edin.
                    </p>
                    <Button asChild>
                        <Link href="/forgot-password">Yeni Link Talep Et</Link>
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    if (status === 'success') {
        return (
            <AuthLayout title="Şifre Değiştirildi">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                >
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                        Şifreniz Başarıyla Değiştirildi!
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                        Yeni şifrenizle giriş yapabilirsiniz.
                    </p>
                    <Button asChild>
                        <Link href="/login">Giriş Yap</Link>
                    </Button>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Yeni Şifre Belirle"
            subtitle="Hesabınız için yeni bir şifre oluşturun."
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yeni Şifre</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Strength Meter */}
                        <PasswordStrengthMeter password={passwordValue} />

                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Şifre Tekrar</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Şifre değiştiriliyor...
                                </>
                            ) : (
                                'Şifreyi Değiştir'
                            )}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </AuthLayout>
    );
}

/**
 * Reset Password Page
 * Token ile yeni şifre belirleme sayfası
 */
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <AuthLayout title="Yeni Şifre Belirle">
                <div className="flex justify-center py-8">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            </AuthLayout>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
