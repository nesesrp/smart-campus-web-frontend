import { successResponse, errorResponse, unauthorizedResponse } from '@/mocks/helpers/response';
import { decodeToken } from '@/mocks/helpers/token';

/**
 * POST /api/v1/auth/logout
 * Çıkış yapar (Refresh token'ı iptal eder)
 */
export async function POST(request) {
    try {
        // Authorization header kontrolü
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return unauthorizedResponse('Authorization header zorunludur');
        }

        const tokenPayload = decodeToken(authHeader);

        if (!tokenPayload) {
            return unauthorizedResponse('Geçersiz veya süresi dolmuş token');
        }

        const body = await request.json().catch(() => ({}));
        const { refreshToken } = body;

        // Mock: Refresh token'ı "iptal et"
        // Gerçek uygulamada veritabanından silinir veya blacklist'e eklenir

        return successResponse({
            loggedOut: true
        }, 'Başarıyla çıkış yapıldı');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
