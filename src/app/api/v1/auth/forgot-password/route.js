import { successResponse, errorResponse } from '@/mocks/helpers/response';
import { generatePasswordResetToken, getTokenExpiry } from '@/mocks/helpers/token';
import mockDb from '@/mocks/data/db.json';

/**
 * POST /api/v1/auth/forgot-password
 * Şifre sıfırlama linki gönderir
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return errorResponse('Email zorunludur', 400);
        }

        // Email format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse('Geçerli bir email adresi giriniz', 400);
        }

        // Kullanıcı kontrolü
        const user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        // Güvenlik: Kullanıcı bulunamasa bile aynı mesajı ver
        // Bu, email enumeration saldırılarını önler
        const resetToken = generatePasswordResetToken();

        // Mock: Token'ı "kaydet"
        if (user) {
            const passwordReset = {
                token: resetToken,
                userId: user.id,
                email: user.email,
                expiresAt: getTokenExpiry(24 * 60) // 24 saat
            };
            // mockDb.passwordResetTokens.push(passwordReset);
        }

        return successResponse({
            message: 'Şifre sıfırlama linki email adresinize gönderildi.',
            // Development için token'ı göster
            _devResetToken: user ? resetToken : null
        }, 'Şifre sıfırlama işlemi başlatıldı');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
