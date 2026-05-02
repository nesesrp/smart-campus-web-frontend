import apiClient from './api-client';

/**
 * User Service
 * Kullanıcı profil işlemleri
 */

/**
 * Mevcut kullanıcının profilini getirir
 */
export async function getProfile() {
    return apiClient.get('/users/me');
}

/**
 * Profil bilgilerini günceller
 * @param {object} data - Güncellenecek profil bilgileri
 */
export async function updateProfile(data) {
    return apiClient.put('/users/me', data);
}

/**
 * Profil fotoğrafı yükler
 * @param {File} file - Yüklenecek dosya
 */
export async function uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.postFormData('/users/me/profile-picture', formData);
}

/**
 * Tüm kullanıcıları listeler (Admin)
 * @param {object} params - Sayfalama ve filtreleme parametreleri
 */
export async function getUsers(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page);
    if (params.pageSize) queryParams.set('pageSize', params.pageSize);
    if (params.role) queryParams.set('role', params.role);
    if (params.departmentId) queryParams.set('departmentId', params.departmentId);
    if (params.search) queryParams.set('search', params.search);

    const query = queryParams.toString();
    return apiClient.get(`/users${query ? `?${query}` : ''}`);
}
