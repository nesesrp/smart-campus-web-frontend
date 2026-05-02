import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/auth/reset-password
 * Yeni şifreyi kaydeder
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { token, newPassword, confirmPassword } = body;

        // Validasyon
        if (!token) {
            return errorResponse('Sıfırlama token\'ı zorunludur', 400);
        }

        if (!newPassword) {
            return errorResponse('Yeni şifre zorunludur', 400);
        }

        if (newPassword.length < 8) {
            return errorResponse('Şifre en az 8 karakter olmalıdır', 400);
        }

        if (newPassword !== confirmPassword) {
            return errorResponse('Şifreler eşleşmiyor', 400);
        }

        // Şifre güçlük kontrolü
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumbers = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return errorResponse('Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir', 400);
        }

        // Mock: Token doğrulaması
        if (token.length !== 48) {
            return errorResponse('Geçersiz veya süresi dolmuş sıfırlama linki', 400);
        }

        return successResponse({
            passwordReset: true
        }, 'Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
