/**
 * Attendance Service - Yoklama işlemleri için API servisi
 */

import { get, post, put, postFormData } from './api-client';

// ==================== SESSION MANAGEMENT (Faculty) ====================

/**
 * Yeni yoklama oturumu oluştur
 * @param {object} sessionData - { sectionId, date, startTime, endTime, latitude, longitude, geofenceRadius }
 */
export async function createSession(sessionData) {
    return post('/attendance/sessions', sessionData);
}

/**
 * Oturum detaylarını getir
 * @param {number} sessionId 
 */
export async function getSessionById(sessionId) {
    return get(`/attendance/sessions/${sessionId}`);
}

/**
 * Oturumu kapat
 * @param {number} sessionId 
 */
export async function closeSession(sessionId) {
    return put(`/attendance/sessions/${sessionId}/close`);
}

/**
 * Instructor'ın oturumlarını getir
 */
export async function getMySessions() {
    return get('/attendance/sessions/my-sessions');
}

/**
 * Oturum kayıtlarını getir
 * @param {number} sessionId 
 */
export async function getSessionRecords(sessionId) {
    return get(`/attendance/sessions/${sessionId}/records`);
}

// ==================== STUDENT CHECK-IN ====================

/**
 * Yoklamaya katıl (GPS ile)
 * @param {number} sessionId 
 * @param {object} locationData - { latitude, longitude, accuracy }
 */
export async function checkIn(sessionId, locationData) {
    return post(`/attendance/sessions/${sessionId}/checkin`, locationData);
}

/**
 * Öğrencinin yoklama istatistiklerini getir
 */
export async function getMyAttendance() {
    return get('/attendance/my-attendance');
}

/**
 * Bölüm bazlı yoklama raporunu getir (Faculty)
 * @param {number} sectionId 
 * @param {object} filters - { startDate, endDate }
 */
export async function getAttendanceReport(sectionId, filters = {}) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return get(`/attendance/sections/${sectionId}/report${query}`);
}

// ==================== EXCUSE REQUESTS ====================

/**
 * Mazeret talebi oluştur
 * @param {object} requestData - { sessionId, reason }
 */
export async function createExcuseRequest(requestData) {
    return post('/attendance/excuse-requests', requestData);
}

/**
 * Mazeret dosyası ile birlikte talep oluştur
 * @param {object} excuseData - { sessionId, reason, document (File) }
 */
export async function submitExcuseWithFile(excuseData) {
    const formData = new FormData();
    formData.append('sessionId', excuseData.sessionId);
    formData.append('reason', excuseData.reason);

    if (excuseData.document) {
        formData.append('document', excuseData.document);
    }

    return postFormData('/attendance/excuse-requests', formData);
}

/**
 * Mazeret taleplerini getir (Faculty)
 * @param {number} sectionId - Opsiyonel filtre
 */
export async function getExcuseRequests(sectionId = null) {
    const query = sectionId ? `?sectionId=${sectionId}` : '';
    return get(`/attendance/excuse-requests${query}`);
}

/**
 * Mazeret talebini onayla
 * @param {number} requestId 
 * @param {object} reviewData - { notes }
 */
export async function approveExcuseRequest(requestId, reviewData = {}) {
    return put(`/attendance/excuse-requests/${requestId}/approve`, reviewData);
}

/**
 * Mazeret talebini reddet
 * @param {number} requestId 
 * @param {object} reviewData - { notes }
 */
export async function rejectExcuseRequest(requestId, reviewData = {}) {
    return put(`/attendance/excuse-requests/${requestId}/reject`, reviewData);
}

// ==================== GPS UTILITIES ====================

/**
 * İki koordinat arasındaki mesafeyi hesapla (Haversine - metre)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Dünya yarıçapı (m)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

export default {
    createSession,
    getSessionById,
    closeSession,
    getMySessions,
    getSessionRecords,
    checkIn,
    getMyAttendance,
    getAttendanceReport,
    createExcuseRequest,
    submitExcuseWithFile,
    getExcuseRequests,
    approveExcuseRequest,
    rejectExcuseRequest,
    calculateDistance
};
