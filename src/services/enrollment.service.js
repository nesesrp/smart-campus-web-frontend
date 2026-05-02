/**
 * Enrollment Service - Ders kayıt işlemleri için API servisi
 */

import { get, post, del } from './api-client';

/**
 * Derse kayıt ol
 * @param {number} sectionId 
 */
export async function enrollInCourse(sectionId) {
    return post('/enrollments', { sectionId });
}

/**
 * Dersten çekil
 * @param {number} enrollmentId 
 */
export async function dropCourse(enrollmentId) {
    return del(`/enrollments/${enrollmentId}`);
}

/**
 * Kayıtlı derslerimi getir
 */
export async function getMyCourses() {
    return get('/enrollments/my-courses');
}

/**
 * Önkoşul kontrolü
 * @param {number} courseId 
 */
export async function checkPrerequisites(courseId) {
    return get(`/enrollments/check-prerequisites/${courseId}`);
}

/**
 * Çakışma kontrolü
 * @param {number} sectionId 
 */
export async function checkScheduleConflict(sectionId) {
    return get(`/enrollments/check-conflict/${sectionId}`);
}

/**
 * Seksiyon öğrencilerini getir (Faculty)
 * @param {number} sectionId 
 */
export async function getStudentsBySection(sectionId) {
    return get(`/enrollments/sections/${sectionId}/students`);
}

/**
 * Kişisel ders programını getir
 * @param {string} semester - Opsiyonel dönem filtresi
 * @param {number} year - Opsiyonel yıl filtresi
 */
export async function getMySchedule(semester = null, year = null) {
    const params = new URLSearchParams();
    if (semester) params.append('semester', semester);
    if (year) params.append('year', year);
    const query = params.toString() ? `?${params.toString()}` : '';
    return get(`/enrollments/my-schedule${query}`);
}

/**
 * Akademisyenin kendi sectionlarını getir
 */
export async function getMySections() {
    return get('/enrollments/my-sections');
}

export default {
    enrollInCourse,
    dropCourse,
    getMyCourses,
    getMySections,
    checkPrerequisites,
    checkScheduleConflict,
    getStudentsBySection,
    getMySchedule
};
