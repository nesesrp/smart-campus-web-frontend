'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Bell,
    Mail,
    Smartphone,
    Save,
    Loader2,
    GraduationCap,
    Clock,
    Calendar,
    Wallet,
    UtensilsCrossed,
    Check
} from 'lucide-react';
import {
    getNotificationPreferences,
    updateNotificationPreferences,
    NotificationCategory,
    categoryLabels
} from '@/services/notification.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Notification Settings Page
 * Bildirim tercihlerini yönetir
 */
export default function NotificationSettingsPage() {
    const [preferences, setPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    async function loadPreferences() {
        try {
            setLoading(true);
            const response = await getNotificationPreferences();

            // Eğer backend'den tercih gelmezse, varsayılan tercihleri oluştur
            if (response.data && response.data.length > 0) {
                setPreferences(response.data);
            } else {
                // Varsayılan tercihler
                const defaultPrefs = Object.keys(NotificationCategory).map(key => ({
                    category: NotificationCategory[key],
                    inAppEnabled: true,
                    emailEnabled: true
                }));
                setPreferences(defaultPrefs);
            }
        } catch (error) {
            console.error('Preferences load error:', error);
            // Varsayılan tercihler
            const defaultPrefs = [
                { category: 0, inAppEnabled: true, emailEnabled: true },
                { category: 1, inAppEnabled: true, emailEnabled: true },
                { category: 2, inAppEnabled: true, emailEnabled: true },
                { category: 3, inAppEnabled: true, emailEnabled: true },
                { category: 4, inAppEnabled: true, emailEnabled: true },
                { category: 5, inAppEnabled: true, emailEnabled: true },
            ];
            setPreferences(defaultPrefs);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        try {
            setSaving(true);
            await updateNotificationPreferences(preferences);
            toast.success('Tercihler kaydedildi');
        } catch (error) {
            toast.error('Tercihler kaydedilemedi');
        } finally {
            setSaving(false);
        }
    }

    function togglePreference(category, field) {
        setPreferences(prev =>
            prev.map(p =>
                p.category === category
                    ? { ...p, [field]: !p[field] }
                    : p
            )
        );
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 0: return Settings;
            case 1: return GraduationCap;
            case 2: return Clock;
            case 3: return Calendar;
            case 4: return Wallet;
            case 5: return UtensilsCrossed;
            default: return Bell;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 0: return 'from-slate-500 to-slate-600';
            case 1: return 'from-blue-500 to-blue-600';
            case 2: return 'from-amber-500 to-amber-600';
            case 3: return 'from-purple-500 to-purple-600';
            case 4: return 'from-green-500 to-green-600';
            case 5: return 'from-orange-500 to-orange-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="size-8" />
                        <h1 className="text-2xl lg:text-3xl font-bold">Bildirim Ayarları</h1>
                    </div>
                    <p className="text-white/90">
                        Hangi bildirimler hakkında nasıl haberdar olmak istediğinizi seçin
                    </p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            </motion.div>

            {/* Settings Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-border bg-white dark:bg-slate-800/50 overflow-hidden"
            >
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="size-8 animate-spin mx-auto mb-4 text-violet-500" />
                        <p className="text-muted-foreground">Tercihler yükleniyor...</p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b border-border">
                            <div className="font-medium text-muted-foreground">Kategori</div>
                            <div className="font-medium text-muted-foreground text-center flex items-center justify-center gap-2">
                                <Bell className="size-4" />
                                Uygulama İçi
                            </div>
                            <div className="font-medium text-muted-foreground text-center flex items-center justify-center gap-2">
                                <Mail className="size-4" />
                                E-posta
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-border">
                            {preferences.map((pref, index) => {
                                const Icon = getCategoryIcon(pref.category);
                                const colorClass = getCategoryColor(pref.category);

                                return (
                                    <motion.div
                                        key={pref.category}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} text-white`}>
                                                <Icon className="size-4" />
                                            </div>
                                            <span className="font-medium">
                                                {categoryLabels[pref.category] || 'Sistem'}
                                            </span>
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => togglePreference(pref.category, 'inAppEnabled')}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${pref.inAppEnabled
                                                        ? 'bg-violet-500'
                                                        : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${pref.inAppEnabled ? 'left-6' : 'left-0.5'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => togglePreference(pref.category, 'emailEnabled')}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${pref.emailEnabled
                                                        ? 'bg-violet-500'
                                                        : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${pref.emailEnabled ? 'left-6' : 'left-0.5'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}
            </motion.div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end"
            >
                <Button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8"
                >
                    {saving ? (
                        <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save className="size-4 mr-2" />
                            Tercihleri Kaydet
                        </>
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
