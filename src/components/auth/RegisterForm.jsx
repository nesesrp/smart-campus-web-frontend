'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, Eye, EyeOff, User, Hash, Briefcase, MapPin, Building } from 'lucide-react';
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

import {
    registerSchema,
    registerDefaultValues,
    userTypeOptions,
    facultyTitleOptions
} from '@/schemas/register.schema';
import { register } from '@/services/auth.service';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import mockDb from '@/mocks/data/db.json';

/**
 * Register Form Component
 * Modern, minimalist kayıt formu - Öğrenci/Akademisyen seçimi
 */
export function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: registerDefaultValues,
        mode: 'onChange',
    });

    const userType = form.watch('userType');
    const password = form.watch('password');

    useEffect(() => {
        setPasswordValue(password || '');
    }, [password]);

    async function onSubmit(data) {
        setIsLoading(true);

        try {
            const response = await register(data);

            if (response.success) {
                toast.success('Kayıt başarılı!', {
                    description: 'Lütfen email adresinizi doğrulayın.',
                });

                router.push('/login?registered=true');
            }
        } catch (error) {
            toast.error('Kayıt başarısız', {
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
                    {/* User Type Selection */}
                    <FormField
                        control={form.control}
                        name="userType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kullanıcı Tipi</FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-2 gap-3">
                                        {userTypeOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => field.onChange(option.value)}
                                                className={`
                          relative px-4 py-3 rounded-lg border-2 transition-all duration-200
                          ${field.value === option.value
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}
                        `}
                                            >
                                                <span className="font-medium">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Full Name */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ad Soyad</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Adınız Soyadınız"
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

                    {/* Email */}
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

                    {/* Department Selection */}
                    <AnimatePresence mode="wait">
                        {userType && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="departmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bölüm</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <select
                                                        {...field}
                                                        disabled={isLoading}
                                                        className="w-full h-9 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    >
                                                        <option value="">Bölüm seçiniz</option>
                                                        {mockDb.departments.map((dept) => (
                                                            <option key={dept.id} value={dept.id}>
                                                                {dept.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Student-specific fields */}
                    <AnimatePresence mode="wait">
                        {userType === 'Student' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="studentNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Öğrenci Numarası</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="2024001234"
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
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Faculty-specific fields */}
                    <AnimatePresence mode="wait">
                        {userType === 'Faculty' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="employeeNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Personel Numarası</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="AKD2024001"
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

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ünvan</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <select
                                                        {...field}
                                                        disabled={isLoading}
                                                        className="w-full h-9 pl-10 pr-3 rounded-md border border-input bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    >
                                                        <option value="">Ünvan seçiniz</option>
                                                        {facultyTitleOptions.map((title) => (
                                                            <option key={title.value} value={title.value}>
                                                                {title.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="officeLocation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ofis Konumu <span className="text-muted-foreground">(Opsiyonel)</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="A Blok 305"
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
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password */}
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

                    {/* Confirm Password */}
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
                                Kayıt yapılıyor...
                            </>
                        ) : (
                            'Kayıt Ol'
                        )}
                    </Button>
                </form>
            </Form>
        </motion.div>
    );
}

export default RegisterForm;
