import { createdResponse, errorResponse, validationErrorResponse } from '@/mocks/helpers/response';
import { generateEmailVerificationToken, getTokenExpiry } from '@/mocks/helpers/token';
import mockDb from '@/mocks/data/db.json';

/**
 * POST /api/v1/auth/register
 * Yeni kullanıcı kaydı (Email doğrulama token'ı oluşturur)
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const {
            email,
            password,
            fullName,
            userType,
            // Student fields
            studentNumber,
            departmentId,
            // Faculty fields
            employeeNumber,
            title,
            officeLocation
        } = body;

        // Temel validasyon
        const errors = {};

        if (!email) errors.email = ['Email zorunludur'];
        if (!password) errors.password = ['Şifre zorunludur'];
        if (!fullName) errors.fullName = ['Ad soyad zorunludur'];
        if (!userType) errors.userType = ['Kullanıcı tipi zorunludur'];

        // Email format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.email = ['Geçerli bir email adresi giriniz'];
        }

        // Şifre uzunluk kontrolü
        if (password && password.length < 8) {
            errors.password = ['Şifre en az 8 karakter olmalıdır'];
        }

        // UserType kontrolü
        if (userType && !['Student', 'Faculty'].includes(userType)) {
            errors.userType = ['Geçersiz kullanıcı tipi'];
        }

        // Conditional validation
        if (userType === 'Student') {
            if (!studentNumber) errors.studentNumber = ['Öğrenci numarası zorunludur'];
            if (!departmentId) errors.departmentId = ['Bölüm seçimi zorunludur'];
        }

        if (userType === 'Faculty') {
            if (!employeeNumber) errors.employeeNumber = ['Personel numarası zorunludur'];
            if (!title) errors.title = ['Ünvan zorunludur'];
            if (!departmentId) errors.departmentId = ['Bölüm seçimi zorunludur'];
        }

        if (Object.keys(errors).length > 0) {
            return validationErrorResponse(errors);
        }

        // Email benzersizlik kontrolü
        const existingUser = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return errorResponse('Bu email adresi zaten kayıtlı', 409);
        }

        // Yeni kullanıcı oluştur
        const newUserId = `usr_${Date.now()}`;
        const verificationToken = generateEmailVerificationToken();

        const newUser = {
            id: newUserId,
            email,
            password, // Gerçek uygulamada hash'lenmiş olurdu
            fullName,
            userType,
            role: userType,
            isEmailVerified: false,
            isActive: true,
            profilePictureUrl: null,
            createdAt: new Date().toISOString()
        };

        // UserType'a göre ek bilgiler
        if (userType === 'Student') {
            newUser.student = {
                studentNumber,
                departmentId,
                enrollmentDate: new Date().toISOString()
            };
        } else if (userType === 'Faculty') {
            newUser.faculty = {
                employeeNumber,
                title,
                departmentId,
                officeLocation: officeLocation || null
            };
        }

        // Mock: Kullanıcıyı "kaydet" (gerçekte JSON dosyasına yazılmaz)
        // mockDb.users.push(newUser);

        // Email doğrulama token'ı oluştur
        const emailVerification = {
            token: verificationToken,
            userId: newUserId,
            email,
            expiresAt: getTokenExpiry(24 * 60) // 24 saat
        };

        // Hassas verileri çıkar
        const { password: _, ...safeUser } = newUser;

        return createdResponse({
            user: safeUser,
            message: 'Kayıt başarılı. Lütfen email adresinizi doğrulayın.',
            // Development için token'ı göster
            _devEmailVerificationToken: verificationToken
        }, 'Kullanıcı başarıyla oluşturuldu');

    } catch (error) {
        return errorResponse('Sunucu hatası: ' + error.message, 500);
    }
}
