/**
 * Course Service - Ders yönetimi için API servisi
 */

import { get, post, put, del } from './api-client';

/**
 * Tüm dersleri getir
 * @param {object} params - sayfalama ve filtreleme
 */
export async function getCourses(params = {}) {
    const { page = 1, pageSize = 10, departmentId, search } = params;
    let query = `?page=${page}&pageSize=${pageSize}`;
    if (departmentId) query += `&departmentId=${departmentId}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    return get(`/courses${query}`);
}

/**
 * Ders detaylarını getir
 * @param {number} courseId 
 */
export async function getCourseById(courseId) {
    return get(`/courses/${courseId}`);
}

/**
 * Ders önkoşullarını getir
 * @param {number} courseId 
 */
export async function getPrerequisites(courseId) {
    return get(`/courses/${courseId}/prerequisites`);
}

/**
 * Ders oluştur (Admin)
 * @param {object} courseData 
 */
export async function createCourse(courseData) {
    return post('/courses', courseData);
}

/**
 * Ders güncelle (Admin)
 * @param {number} courseId 
 * @param {object} courseData 
 */
export async function updateCourse(courseId, courseData) {
    return put(`/courses/${courseId}`, courseData);
}

/**
 * Ders sil (Admin)
 * @param {number} courseId 
 */
export async function deleteCourse(courseId) {
    return del(`/courses/${courseId}`);
}

export default {
    getCourses,
    getCourseById,
    getPrerequisites,
    createCourse,
    updateCourse,
    deleteCourse
};
