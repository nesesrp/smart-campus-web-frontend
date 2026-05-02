'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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
import { forgotPasswordSchema, forgotPasswordDefaultValues } from '@/schemas/forgot-password.schema';
import { forgotPassword } from '@/services/auth.service';

/**
 * Forgot Password Page
 * Email girdisi ile şifre sıfırlama linki gönderir
 */
export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: forgotPasswordDefaultValues,
    });

    async function onSubmit(data) {
        setIsLoading(true);

        try {
            const response = await forgotPassword(data.email);

            if (response.success) {
                setIsSubmitted(true);
                toast.success('Email gönderildi!', {
                    description: 'Şifre sıfırlama linki email adresinize gönderildi.',
                });
            }
        } catch (error) {
            // Email enumeration koruması için her zaman başarılı mesaj göster
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Şifremi Unuttum"
            subtitle={!isSubmitted ? "Email adresinizi girin, size şifre sıfırlama linki gönderelim." : undefined}
            footer={
                <Link href="/login" className="inline-flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="size-4" />
                    Giriş sayfasına dön
                </Link>
            }
        >
            {!isSubmitted ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="ornek@smartcampus.edu"
                                                    className="pl-10"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
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
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    'Sıfırlama Linki Gönder'
                                )}
                            </Button>
                        </form>
                    </Form>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                >
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Email Gönderildi!</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        Eğer bu email adresiyle kayıtlı bir hesap varsa, şifre sıfırlama linki gönderildi.
                        Lütfen email kutunuzu kontrol edin.
                    </p>
                    <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => {
                            setIsSubmitted(false);
                            form.reset();
                        }}
                    >
                        Farklı email dene
                    </Button>
                </motion.div>
            )}
        </AuthLayout>
    );
}
