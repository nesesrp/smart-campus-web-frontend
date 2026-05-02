/**
 * Classroom Service - Derslik yönetimi için API servisi
 */

import { get, post, put, del } from './api-client';

/**
 * Tüm derslikleri getir
 * @param {object} filters - { building, minCapacity, maxCapacity }
 */
export async function getClassrooms(filters = {}) {
    const params = new URLSearchParams();
    if (filters.building) params.append('building', filters.building);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity.toString());
    if (filters.maxCapacity) params.append('maxCapacity', filters.maxCapacity.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return get(`/classrooms${query}`);
}

/**
 * Derslik detaylarını getir
 * @param {number} classroomId 
 */
export async function getClassroomById(classroomId) {
    return get(`/classrooms/${classroomId}`);
}

/**
 * Uygun derslikleri getir
 * @param {string} date - YYYY-MM-DD formatında
 * @param {string} startTime - HH:mm formatında
 * @param {string} endTime - HH:mm formatında
 */
export async function getAvailableClassrooms(date, startTime, endTime) {
    const params = new URLSearchParams();
    params.append('date', date);
    params.append('startTime', startTime);
    params.append('endTime', endTime);
    return get(`/classrooms/available?${params.toString()}`);
}

/**
 * Rezervasyon oluştur
 * @param {object} reservationData - { classroomId, date, startTime, endTime, purpose }
 */
export async function createReservation(reservationData) {
    return post('/classrooms/reservations', reservationData);
}

/**
 * Rezervasyonlarımı getir
 */
export async function getMyReservations() {
    return get('/classrooms/reservations/my-reservations');
}

/**
 * Rezervasyon iptal et
 * @param {number} reservationId 
 */
export async function cancelReservation(reservationId) {
    return del(`/classrooms/reservations/${reservationId}`);
}

export default {
    getClassrooms,
    getClassroomById,
    getAvailableClassrooms,
    createReservation,
    getMyReservations,
    cancelReservation
};

