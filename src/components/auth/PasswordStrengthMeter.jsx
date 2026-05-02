'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Password Strength Meter Component
 * Şifre güçlük göstergesi (Bonus +1 puan)
 */
export function PasswordStrengthMeter({ password = '' }) {
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        Object.values(checks).forEach(passed => {
            if (passed) score++;
        });

        const levels = [
            { score: 0, label: '', color: 'bg-muted' },
            { score: 1, label: 'Çok Zayıf', color: 'bg-red-500' },
            { score: 2, label: 'Zayıf', color: 'bg-orange-500' },
            { score: 3, label: 'Orta', color: 'bg-yellow-500' },
            { score: 4, label: 'Güçlü', color: 'bg-lime-500' },
            { score: 5, label: 'Çok Güçlü', color: 'bg-green-500' },
        ];

        return { ...levels[score], checks };
    }, [password]);

    if (!password) return null;

    return (
        <div className="space-y-3">
            {/* Strength Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Şifre Güçlüğü</span>
                    <span className={cn(
                        "font-medium",
                        strength.score <= 2 ? "text-red-500" :
                            strength.score <= 3 ? "text-yellow-500" : "text-green-500"
                    )}>
                        {strength.label}
                    </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(strength.score / 5) * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={cn("h-full rounded-full", strength.color)}
                    />
                </div>
            </div>

            {/* Requirements Checklist */}
            <ul className="grid grid-cols-2 gap-1.5 text-xs">
                <RequirementItem
                    passed={strength.checks?.length}
                    label="En az 8 karakter"
                />
                <RequirementItem
                    passed={strength.checks?.uppercase}
                    label="Büyük harf"
                />
                <RequirementItem
                    passed={strength.checks?.lowercase}
                    label="Küçük harf"
                />
                <RequirementItem
                    passed={strength.checks?.number}
                    label="Rakam"
                />
                <RequirementItem
                    passed={strength.checks?.special}
                    label="Özel karakter"
                />
            </ul>
        </div>
    );
}

function RequirementItem({ passed, label }) {
    return (
        <li className="flex items-center gap-1.5">
            {passed ? (
                <Check className="size-3.5 text-green-500" />
            ) : (
                <X className="size-3.5 text-muted-foreground" />
            )}
            <span className={cn(
                passed ? "text-foreground" : "text-muted-foreground"
            )}>
                {label}
            </span>
        </li>
    );
}

export default PasswordStrengthMeter;
