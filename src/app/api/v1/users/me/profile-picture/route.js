import { successResponse, errorResponse, unauthorizedResponse } from '@/mocks/helpers/response';
import { decodeToken } from '@/mocks/helpers/token';

/**
 * POST /api/v1/users/me/profile-picture
 * Profil fotoğrafı yükler (max 5MB)
 */
export async function POST(request) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return unauthorizedResponse('Authorization header zorunludur');
        }

        const tokenPayload = decodeToken(authHeader);

        if (!tokenPayload) {
            return unauthorizedResponse('Geçersiz veya süresi dolmuş token');
        }

        // FormData kontrolü
        const contentType = request.headers.get('Content-Type') || '';

        if (!contentType.includes('multipart/form-data')) {
            return errorResponse('Content-Type multipart/form-data olmalıdır', 400);
        }

        try {
            const formData = await request.formData();
            const file = formData.get('profilePicture') || formData.get('file');

            if (!file) {
                return errorResponse('Dosya yüklenmedi', 400);
            }

            // Dosya boyutu kontrolü (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                return errorResponse('Dosya boyutu 5MB\'dan büyük olamaz', 400);
            }

            // Dosya tipi kontrolü
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                return errorResponse('Sadece JPEG, PNG, GIF ve WebP formatları desteklenir', 400);
            }

            // Mock: Dosya URL'i oluştur
            const mockUrl = `/uploads/profile-pictures/${tokenPayload.sub}_${Date.now()}.${file.type.split('/')[1]}`;

            return successResponse({
                profilePictureUrl: mockUrl,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type
            }, 'Profil fotoğrafı başarıyla yüklendi');

        } catch {
            return errorResponse('Dosya işlenirken hata oluştu', 400);
        }

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
