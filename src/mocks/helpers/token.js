/**
 * Token Helper Functions
 * JWT token oluşturma ve doğrulama simülasyonu
 */

/**
 * Base64 encode (Node.js compatible)
 */
function base64Encode(str) {
    return Buffer.from(str).toString('base64url');
}

/**
 * Base64 decode (Node.js compatible)
 */
function base64Decode(str) {
    return Buffer.from(str, 'base64url').toString('utf-8');
}

/**
 * Rastgele token oluşturur
 * @param {number} length - Token uzunluğu
 * @returns {string} Rastgele token
 */
export function generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

/**
 * Mock JWT Access Token oluşturur
 * @param {object} user - Kullanıcı bilgileri
 * @returns {string} Mock JWT token
 */
export function generateAccessToken(user) {
    const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = base64Encode(JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 dakika
    }));
    const signature = generateToken(43);

    return `${header}.${payload}.${signature}`;
}

/**
 * Mock Refresh Token oluşturur
 * @returns {string} Refresh token
 */
export function generateRefreshToken() {
    return generateToken(64);
}

/**
 * Email doğrulama token'ı oluşturur
 * @returns {string} Doğrulama token'ı
 */
export function generateEmailVerificationToken() {
    return generateToken(48);
}

/**
 * Şifre sıfırlama token'ı oluşturur
 * @returns {string} Sıfırlama token'ı
 */
export function generatePasswordResetToken() {
    return generateToken(48);
}

/**
 * Token sona erme tarihi hesaplar
 * @param {number} minutes - Dakika
 * @returns {string} ISO tarih string
 */
export function getTokenExpiry(minutes) {
    return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

/**
 * Token'dan kullanıcı bilgilerini çıkarır (Mock)
 * @param {string} token - JWT token
 * @returns {object|null} Kullanıcı bilgileri veya null
 */
export function decodeToken(token) {
    try {
        if (!token || !token.startsWith('Bearer ')) {
            return null;
        }

        const jwt = token.replace('Bearer ', '');
        const parts = jwt.split('.');

        if (parts.length !== 3) {
            return null;
        }

        const payload = JSON.parse(base64Decode(parts[1]));

        // Token süresi kontrolü
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

