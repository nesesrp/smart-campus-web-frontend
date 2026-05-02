import { successResponse, errorResponse, unauthorizedResponse } from '@/mocks/helpers/response';
import { generateAccessToken, generateRefreshToken, getTokenExpiry } from '@/mocks/helpers/token';
import mockDb from '@/mocks/data/db.json';

/**
 * POST /api/v1/auth/login
 * Email/Şifre kontrolü, Access Token (15 dk) ve Refresh Token (7 gün) döner
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validasyon
        if (!email || !password) {
            return errorResponse('Email ve şifre zorunludur', 400);
        }

        // Kullanıcı bul
        const user = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return errorResponse('Geçersiz email veya şifre', 401);
        }

        // Şifre kontrolü (Mock için plain text karşılaştırma)
        if (user.password !== password) {
            return errorResponse('Geçersiz email veya şifre', 401);
        }

        // Email doğrulaması kontrolü
        if (!user.isEmailVerified) {
            return errorResponse('Lütfen önce email adresinizi doğrulayın', 403);
        }

        // Hesap aktiflik kontrolü
        if (!user.isActive) {
            return errorResponse('Hesabınız devre dışı bırakılmış', 403);
        }

        // Token oluştur
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        // Kullanıcı bilgilerinden hassas verileri çıkar
        const { password: _, ...safeUser } = user;

        return successResponse({
            accessToken,
            refreshToken,
            accessTokenExpiration: getTokenExpiry(15), // 15 dakika
            refreshTokenExpiration: getTokenExpiry(7 * 24 * 60), // 7 gün
            user: safeUser
        }, 'Giriş başarılı');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
