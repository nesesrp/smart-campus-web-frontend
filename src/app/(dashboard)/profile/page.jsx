'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    Loader2,
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Hash,
    Briefcase,
    Calendar,
    Save,
    GraduationCap
} from 'lucide-react';
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

import { profileSchema, profileDefaultValues } from '@/schemas/profile.schema';
import { updateProfile, getProfile } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';

/**
 * Profile Page
 * Kullanıcı profil bilgileri ve düzenleme
 */
export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    // Sayfa yüklendiğinde API'den güncel kullanıcı verilerini çek
    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await getProfile();
                if (response.success && response.data) {
                    // Boş veya null alanları önceki değerlerle doldur
                    const newUserData = response.data;
                    const mergedUser = {
                        ...user, // Önceki değerler
                        ...Object.fromEntries(
                            Object.entries(newUserData).filter(([_, v]) => v != null && v !== '')
                        ),
                    };
                    setUser(mergedUser);
                }
            } catch (error) {
                console.error('Profil yüklenirken hata:', error);
            } finally {
                setIsPageLoading(false);
            }
        }

        fetchUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: profileDefaultValues,
    });

    // Form'u kullanıcı bilgileriyle doldur
    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                officeLocation: user.faculty?.officeLocation || '',
            });
        }
    }, [user, form]);

    async function onSubmit(data) {
        setIsLoading(true);

        try {
            // Email'i isteğe ekle (backend zorunlu tutuyor)
            const updateData = {
                ...data,
                email: user.email, // Email değişmeyecek ama backend istiyor
            };

            const response = await updateProfile(updateData);

            if (response.success) {
                // Store'u güncelle
                setUser({
                    ...user,
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    faculty: user.faculty ? {
                        ...user.faculty,
                        officeLocation: data.officeLocation,
                    } : undefined,
                });

                toast.success('Profil güncellendi');
            }
        } catch (error) {
            toast.error('Profil güncellenemedi', {
                description: error.message || 'Lütfen tekrar deneyin.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handlePictureUpload = (url) => {
        setUser({
            ...user,
            profilePictureUrl: url,
        });
    };

    if (!user || isPageLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold">Profilim</h1>
                <p className="text-muted-foreground">Kişisel bilgilerinizi görüntüleyin ve düzenleyin.</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Profile Picture */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6">
                        <ProfilePictureUpload
                            currentPicture={user.profilePictureUrl}
                            onUploadSuccess={handlePictureUpload}
                        />

                        {/* User info summary */}
                        <div className="mt-6 pt-6 border-t border-border space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <User className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{user.role}</span>
                            </div>
                            {user.student && (
                                <>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Hash className="size-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">{user.student.studentNumber}</span>
                                    </div>
                                    {user.student.departmentName && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <GraduationCap className="size-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">{user.student.departmentName}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            {user.faculty && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Briefcase className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{user.faculty.title}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right: Edit Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6">
                        <h2 className="text-lg font-semibold mb-6">Bilgilerimi Düzenle</h2>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

                                {/* Read-only Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            value={user.email}
                                            className="pl-10 bg-muted"
                                            disabled
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Email adresi değiştirilemez.</p>
                                </div>

                                {/* Phone Number */}
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefon <span className="text-muted-foreground">(Opsiyonel)</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="0532 123 4567"
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

                                {/* Faculty-specific: Office Location */}
                                {user.userType === 'Faculty' && (
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
                                )}

                                {/* Read-only info for Students */}
                                {user.student && (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Öğrenci Numarası</label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    value={user.student.studentNumber}
                                                    className="pl-10 bg-muted"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Kayıt Tarihi</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    value={new Date(user.student.enrollmentDate).toLocaleDateString('tr-TR')}
                                                    className="pl-10 bg-muted"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Read-only info for Faculty */}
                                {user.faculty && (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Personel Numarası</label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    value={user.faculty.employeeNumber}
                                                    className="pl-10 bg-muted"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Ünvan</label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    value={user.faculty.title}
                                                    className="pl-10 bg-muted"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Kaydediliyor...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="size-4" />
                                                Değişiklikleri Kaydet
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
