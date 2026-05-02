'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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

import { loginSchema, loginDefaultValues } from '@/schemas/login.schema';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Login Form Component
 * Modern, minimalist giriş formu
 */
export function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const authStore = useAuthStore();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: loginDefaultValues,
    });

    async function onSubmit(data) {
        setIsLoading(true);

        try {
            const response = await login(data);

            if (response.success) {
                // Zustand store'u güncelle
                authStore.login(response.data.user, {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                });

                toast.success('Giriş başarılı!', {
                    description: `Hoş geldiniz, ${response.data.user.fullName}`,
                });

                // Dashboard'a yönlendir
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error('Giriş başarısız', {
                description: error.message || 'Lütfen bilgilerinizi kontrol edin.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
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

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Şifre</FormLabel>
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
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <a
                            href="/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Şifremi unuttum
                        </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-11 font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Giriş yapılıyor...
                            </>
                        ) : (
                            'Giriş Yap'
                        )}
                    </Button>
                </form>
            </Form>
        </motion.div>
    );
}

export default LoginForm;
