import { successResponse, errorResponse, unauthorizedResponse } from '@/mocks/helpers/response';
import { generateAccessToken, generateRefreshToken, getTokenExpiry } from '@/mocks/helpers/token';
import mockDb from '@/mocks/data/db.json';

/**
 * POST /api/v1/auth/refresh
 * Access token süresi bitince yeni token verir
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return errorResponse('Refresh token zorunludur', 400);
        }

        // Mock: Refresh token doğrulaması
        // Gerçek uygulamada token veritabanında aranır ve doğrulanır

        // Basit simülasyon: 64 karakterlik token'ı kabul et
        if (refreshToken.length !== 64) {
            return unauthorizedResponse('Geçersiz refresh token');
        }

        // Mock: İlk kullanıcıyı döndür (gerçekte token'a bağlı kullanıcı bulunur)
        const user = mockDb.users[0];

        if (!user) {
            return unauthorizedResponse('Kullanıcı bulunamadı');
        }

        // Yeni token'lar oluştur
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken();

        return successResponse({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenExpiration: getTokenExpiry(15),
            refreshTokenExpiration: getTokenExpiry(7 * 24 * 60)
        }, 'Token yenilendi');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
