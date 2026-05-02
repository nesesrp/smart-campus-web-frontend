import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
    title: 'Giriş Yap - SmartCampus',
    description: 'SmartCampus hesabınıza giriş yapın',
};

/**
 * Login Page
 * Modern, minimalist giriş sayfası
 */
export default function LoginPage() {
    return (
        <AuthLayout
            title="Hoş Geldiniz"
            subtitle="Hesabınıza giriş yapın"
            footer={
                <span>
                    Hesabınız yok mu?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Kayıt Ol
                    </Link>
                </span>
            }
        >
            <LoginForm />
        </AuthLayout>
    );
}
