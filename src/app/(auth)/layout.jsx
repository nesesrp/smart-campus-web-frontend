import { Toaster } from '@/components/ui/sonner';

export const metadata = {
    title: 'Giriş - SmartCampus',
    description: 'SmartCampus Akıllı Kampüs Yönetim Sistemi',
};

/**
 * Auth Routes Layout
 * Toaster içerir
 */
export default function AuthLayout({ children }) {
    return (
        <>
            {children}
            <Toaster position="top-right" richColors closeButton />
        </>
    );
}
