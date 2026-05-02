import { pagedResponse, errorResponse, unauthorizedResponse, forbiddenResponse } from '@/mocks/helpers/response';
import { decodeToken } from '@/mocks/helpers/token';
import mockDb from '@/mocks/data/db.json';

/**
 * GET /api/v1/users
 * Tüm kullanıcıları listeler (Sadece Admin yetkisi ile, sayfalama ve filtreleme)
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

        // Admin yetkisi kontrolü
        if (tokenPayload.role !== 'Admin') {
            return forbiddenResponse('Bu işlem için Admin yetkisi gereklidir');
        }

        // URL parametrelerini al
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const pageSize = Math.min(parseInt(searchParams.get('pageSize')) || 10, 50);
        const role = searchParams.get('role');
        const department = searchParams.get('departmentId');
        const search = searchParams.get('search')?.toLowerCase();

        // Filtreleme
        let filteredUsers = mockDb.users.filter(u => {
            // Hassas verileri gösterme
            return true;
        });

        // Role filtresi
        if (role) {
            filteredUsers = filteredUsers.filter(u => u.role === role);
        }

        // Department filtresi
        if (department) {
            filteredUsers = filteredUsers.filter(u => {
                if (u.student) return u.student.departmentId === department;
                if (u.faculty) return u.faculty.departmentId === department;
                return false;
            });
        }

        // Arama (isim veya email)
        if (search) {
            filteredUsers = filteredUsers.filter(u =>
                u.fullName.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
            );
        }

        const totalCount = filteredUsers.length;

        // Sayfalama
        const startIndex = (page - 1) * pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

        // Hassas verileri çıkar
        const safeUsers = paginatedUsers.map(({ password, ...user }) => user);

        return pagedResponse(safeUsers, page, pageSize, totalCount);

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
