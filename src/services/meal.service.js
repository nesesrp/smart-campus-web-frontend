/**
 * Meal Service - Yemek servisi için API entegrasyonu
 * Menu Page için gerekli fonksiyonlar
 * Backend endpoint'leri: MealMenusController, MealReservationsController
 */

import { get, post, del } from './api-client';

/**
 * Menü listesi getir
 * Backend: GET /api/v1/MealMenus
 * @param {object} params - { date, cafeteriaId, mealType }
 */
export async function getMenus(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.cafeteriaId) queryParams.append('cafeteriaId', params.cafeteriaId);
    if (params.mealType) queryParams.append('mealType', params.mealType);

    const queryString = queryParams.toString();
    const endpoint = `/MealMenus${queryString ? `?${queryString}` : ''}`;

    return await get(endpoint);
}

/**
 * Menü detayı getir
 * Backend: GET /api/v1/MealMenus/{id}
 * @param {number} menuId - Menü ID
 */
export async function getMenuById(menuId) {
    return await get(`/MealMenus/${menuId}`);
}

/**
 * Yemek rezervasyonu yap
 * Backend: POST /api/v1/MealReservations
 * @param {object} data - { menuId, ... }
 */
export async function createReservation(data) {
    return await post('/MealReservations', data);
}

/**
 * Kullanıcının rezervasyonlarını getir
 * Backend: GET /api/v1/MealReservations/my-reservations
 * @param {object} params - { fromDate, toDate }
 */
export async function getMyReservations(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params.toDate) queryParams.append('toDate', params.toDate);

    const queryString = queryParams.toString();
    const endpoint = `/MealReservations/my-reservations${queryString ? `?${queryString}` : ''}`;

    return await get(endpoint);
}

/**
 * Rezervasyon detayı getir
 * Backend: GET /api/v1/MealReservations/{id}
 * @param {number} reservationId - Rezervasyon ID
 */
export async function getReservationById(reservationId) {
    return await get(`/MealReservations/${reservationId}`);
}

/**
 * Rezervasyon iptal et
 * Backend: DELETE /api/v1/MealReservations/{id}
 * @param {number} reservationId - Rezervasyon ID
 */
export async function cancelReservation(reservationId) {
    return await del(`/MealReservations/${reservationId}`);
}

/**
 * QR kod tarama (Admin/CafeteriaStaff)
 * Backend: POST /api/v1/MealReservations/scan
 * @param {string} qrCode - QR kod
 */
export async function scanQRCode(qrCode) {
    return await post('/MealReservations/scan', { QRCode: qrCode });
}

/**
 * QR kod ile rezervasyon getir (Admin/CafeteriaStaff)
 * Backend: GET /api/v1/MealReservations/qr/{qrCode}
 * @param {string} qrCode - QR kod
 */
export async function getReservationByQR(qrCode) {
    return await get(`/MealReservations/qr/${encodeURIComponent(qrCode)}`);
}

/**
 * Rezervasyonu kullan (scan sayfası için)
 * Backend: POST /api/v1/MealReservations/{id}/use endpoint'i olmayabilir,
 * bu durumda scan endpoint'i kullanılır
 * @param {number} reservationId - Rezervasyon ID
 * @param {string} qrCode - QR kod
 */
export async function useReservation(reservationId, qrCode = null) {
    // Backend'de /use endpoint'i yoksa scan kullan
    return await post('/MealReservations/scan', { QRCode: qrCode });
}

export default {
    getMenus,
    getMenuById,
    createReservation,
    getMyReservations,
    getReservationById,
    cancelReservation,
    scanQRCode,
    getReservationByQR,
    useReservation
};
