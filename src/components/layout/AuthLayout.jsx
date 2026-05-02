'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

/**
 * AuthLayout Component
 * Modern, minimalist auth sayfaları için layout
 * Gradient background, glassmorphism card
 */
export function AuthLayout({
    children,
    title,
    subtitle,
    footer
}) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-violet-950/30 dark:to-slate-950" />

            {/* Animated Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -top-40 -left-40 w-80 h-80 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 60, 0],
                        y: [0, 60, 0],
                        scale: [1, 0.9, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                            <GraduationCap className="size-7" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            SmartCampus
                        </span>
                    </Link>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-violet-500/5 p-8">
                        {/* Header */}
                        {(title || subtitle) && (
                            <div className="text-center mb-8">
                                {title && (
                                    <h1 className="text-2xl font-bold text-foreground mb-2">
                                        {title}
                                    </h1>
                                )}
                                {subtitle && (
                                    <p className="text-muted-foreground">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Form Content */}
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 text-center text-sm text-muted-foreground"
                        >
                            {footer}
                        </motion.div>
                    )}
                </motion.div>

                {/* Copyright */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-xs text-muted-foreground"
                >
                    © {new Date().getFullYear()} SmartCampus. Tüm hakları saklıdır.
                </motion.p>
            </div>
        </div>
    );
}

export default AuthLayout;
