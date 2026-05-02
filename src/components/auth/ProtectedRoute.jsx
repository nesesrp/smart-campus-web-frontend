'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

/**
 * ProtectedRoute Component
 * Giriş yapmamış kullanıcıları login sayfasına yönlendirir
 */
export function ProtectedRoute({ children, requiredRoles = [] }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        // Hydration tamamlanana kadar bekle
        const checkAuth = () => {
            if (!isAuthenticated) {
                // Kullanıcı giriş yapmamış, login'e yönlendir
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
            }

            // Rol kontrolü (eğer gerekli roller belirtilmişse)
            if (requiredRoles.length > 0 && user) {
                const hasRequiredRole = requiredRoles.includes(user.role);
                if (!hasRequiredRole) {
                    // Yetkisiz erişim, dashboard'a yönlendir
                    router.push('/dashboard');
                    return;
                }
            }

            setIsChecking(false);
        };

        // Zustand hydration'dan sonra kontrol et
        const timeout = setTimeout(checkAuth, 100);
        return () => clearTimeout(timeout);
    }, [isAuthenticated, user, requiredRoles, router, pathname]);

    // Kontrol devam ederken loading göster
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-violet-950/30 dark:to-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Yetkilendirme kontrol ediliyor...</p>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
