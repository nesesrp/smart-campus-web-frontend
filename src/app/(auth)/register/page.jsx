import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
    title: 'Kayıt Ol - SmartCampus',
    description: 'SmartCampus hesabı oluşturun',
};

/**
 * Register Page
 * Modern, minimalist kayıt sayfası
 */
export default function RegisterPage() {
    return (
        <AuthLayout
            title="Hesap Oluştur"
            subtitle="SmartCampus ailesine katılın"
            footer={
                <span>
                    Zaten hesabınız var mı?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Giriş Yap
                    </Link>
                </span>
            }
        >
            <RegisterForm />
        </AuthLayout>
    );
}
