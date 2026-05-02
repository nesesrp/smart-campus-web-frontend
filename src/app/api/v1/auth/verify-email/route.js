import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/auth/verify-email
 * E-postadaki linke tıklanınca hesabı aktif eder
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return errorResponse('Doğrulama token\'ı zorunludur', 400);
        }

        // Mock: Token doğrulaması simülasyonu
        // Gerçek uygulamada token veritabanında aranır

        // Test amaçlı: "valid-token" ile her zaman başarılı
        if (token === 'valid-token' || token.length === 48) {
            return successResponse({
                verified: true
            }, 'Email başarıyla doğrulandı. Artık giriş yapabilirsiniz.');
        }

        return errorResponse('Geçersiz veya süresi dolmuş doğrulama linki', 400);

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
