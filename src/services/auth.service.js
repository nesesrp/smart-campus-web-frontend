/**
 * Auth Service
 * SOLID: Single Responsibility - Sadece authentication işlemlerini yönetir
 */

import { post } from './api-client';

/**
 * Kullanıcı girişi
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} Token ve kullanıcı bilgileri
 */
export async function login(credentials) {
    const response = await post('/auth/login', credentials);

    if (response.success && response.data) {
        // Token'ları localStorage'a kaydet
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
    }

    return response;
}

/**
 * Yeni kullanıcı kaydı
 * @param {object} userData - Kullanıcı bilgileri
 * @returns {Promise<object>} Kayıt sonucu
 */
export async function register(userData) {
    return post('/auth/register', userData);
}

/**
 * Email doğrulama
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} token - Doğrulama token'ı
 * @returns {Promise<object>}
 */
export async function verifyEmail(userId, token) {
    // Backend [FromQuery] kullanıyor, parametreleri URL'de gönderiyoruz
    const params = new URLSearchParams({ userId, token });
    return post(`/auth/verify-email?${params.toString()}`, {});
}

/**
 * Şifre sıfırlama isteği
 * @param {string} email - Email adresi
 * @returns {Promise<object>}
 */
export async function forgotPassword(email) {
    return post('/auth/forgot-password', { email });
}

/**
 * Yeni şifre belirleme
 * @param {object} data - { token, newPassword, confirmPassword }
 * @returns {Promise<object>}
 */
export async function resetPassword(data) {
    return post('/auth/reset-password', data);
}

/**
 * Token yenileme
 * @returns {Promise<object>} Yeni token'lar
 */
export async function refreshToken() {
    if (typeof window === 'undefined') return null;

    const currentRefreshToken = localStorage.getItem('refreshToken');

    if (!currentRefreshToken) {
        throw new Error('Refresh token bulunamadı');
    }

    const response = await post('/auth/refresh', { refreshToken: currentRefreshToken });

    if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
}

/**
 * Çıkış yapma
 * @returns {Promise<object>}
 */
export async function logout() {
    try {
        const refreshToken = typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : null;

        // Backend RefreshTokenDto { Token: string } bekliyor
        await post('/auth/logout', { token: refreshToken });
    } finally {
        // Her durumda local verileri temizle
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }
}

/**
 * Mevcut kullanıcıyı al
 * @returns {object|null} Kullanıcı bilgileri
 */
export function getCurrentUser() {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

/**
 * Kullanıcı giriş yapmış mı kontrol et
 * @returns {boolean}
 */
export function isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
}

export default {
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout,
    getCurrentUser,
    isAuthenticated,
};
