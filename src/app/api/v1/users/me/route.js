import { successResponse, errorResponse, unauthorizedResponse } from '@/mocks/helpers/response';
import { decodeToken } from '@/mocks/helpers/token';
import mockDb from '@/mocks/data/db.json';

/**
 * GET /api/v1/users/me
 * Giriş yapmış kullanıcının bilgilerini getirir
 */
export async function GET(request) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return unauthorizedResponse('Authorization header zorunludur');
        }

        const tokenPayload = decodeToken(authHeader);

        if (!tokenPayload) {
            return unauthorizedResponse('Geçersiz veya süresi dolmuş token');
        }

        // Kullanıcıyı bul
        const user = mockDb.users.find(u => u.id === tokenPayload.sub);

        if (!user) {
            return errorResponse('Kullanıcı bulunamadı', 404);
        }

        // Hassas verileri çıkar
        const { password, ...safeUser } = user;

        return successResponse(safeUser, 'Kullanıcı bilgileri getirildi');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}

/**
 * PUT /api/v1/users/me
 * Profil bilgilerini günceller
 */
export async function PUT(request) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return unauthorizedResponse('Authorization header zorunludur');
        }

        const tokenPayload = decodeToken(authHeader);

        if (!tokenPayload) {
            return unauthorizedResponse('Geçersiz veya süresi dolmuş token');
        }

        const body = await request.json();
        const { fullName, phoneNumber, dateOfBirth } = body;

        // Kullanıcıyı bul
        const user = mockDb.users.find(u => u.id === tokenPayload.sub);

        if (!user) {
            return errorResponse('Kullanıcı bulunamadı', 404);
        }

        // Mock: Kullanıcıyı "güncelle"
        const updatedUser = {
            ...user,
            fullName: fullName || user.fullName,
            phoneNumber: phoneNumber || user.phoneNumber,
            dateOfBirth: dateOfBirth || user.dateOfBirth,
            updatedAt: new Date().toISOString()
        };

        // Hassas verileri çıkar
        const { password, ...safeUser } = updatedUser;

        return successResponse(safeUser, 'Profil başarıyla güncellendi');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
