'use client';

import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Globe } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function SettingsPage() {
    const { theme, toggleTheme, language, changeLanguage, t } = useSettings();

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <Settings className="size-8" />
                        <h1 className="text-2xl lg:text-3xl font-bold">{t('settings')}</h1>
                    </div>
                    <p className="text-white/90 mt-2">
                        {t('settingsDescription')}
                    </p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 -right-20 w-60 h-60 rounded-full bg-white/5" />
            </motion.div>

            {/* Settings Cards */}
            <div className="space-y-4">
                {/* Dark Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-border p-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                                {theme === 'dark' ? (
                                    <Moon className="size-6 text-purple-600 dark:text-purple-400" />
                                ) : (
                                    <Sun className="size-6 text-purple-600 dark:text-purple-400" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{t('darkMode')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('darkModeDescription')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </motion.div>

                {/* Language */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-border p-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Globe className="size-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{t('language')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('languageDescription')}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => changeLanguage('tr')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${language === 'tr'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                🇹🇷 {t('turkish')}
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${language === 'en'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                🇬🇧 {t('english')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
