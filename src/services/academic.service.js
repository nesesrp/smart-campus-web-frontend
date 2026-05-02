/**
 * Academic Service
 * SOLID: Single Responsibility - Sadece akademik işlemleri yönetir
 */

import { get, post, put, del } from './api-client';

/**
 * Ders listesi
 * @param {object} params - { page, pageSize, search, departmentId }
 * @returns {Promise<object>} Ders listesi
 */
export async function getCourses(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.search) queryParams.append('search', params.search);
    if (params.departmentId) queryParams.append('departmentId', params.departmentId);

    const queryString = queryParams.toString();
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;

    return get(endpoint);
}

/**
 * Ders detayları
 * @param {number|string} courseId - Ders ID
 * @returns {Promise<object>} Ders detayları
 */
export async function getCourseById(courseId) {
    return get(`/courses/${courseId}`);
}

/**
 * Yeni ders oluşturma (Admin only)
 * @param {object} courseData - Ders bilgileri
 * @returns {Promise<object>}
 */
export async function createCourse(courseData) {
    return post('/courses', courseData);
}

/**
 * Ders güncelleme (Admin only)
 * @param {number|string} courseId - Ders ID
 * @param {object} courseData - Güncellenecek bilgiler
 * @returns {Promise<object>}
 */
export async function updateCourse(courseId, courseData) {
    return put(`/courses/${courseId}`, courseData);
}

/**
 * Ders silme (Admin only)
 * @param {number|string} courseId - Ders ID
 * @returns {Promise<object>}
 */
export async function deleteCourse(courseId) {
    return del(`/courses/${courseId}`);
}

/**
 * Section listesi
 * @param {object} params - { semester, year, instructorId, courseId }
 * @returns {Promise<object>} Section listesi
 */
export async function getSections(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.semester) queryParams.append('semester', params.semester);
    if (params.year) queryParams.append('year', params.year);
    if (params.instructorId) queryParams.append('instructorId', params.instructorId);
    if (params.courseId) queryParams.append('courseId', params.courseId);

    const queryString = queryParams.toString();
    const endpoint = `/sections${queryString ? `?${queryString}` : ''}`;

    return get(endpoint);
}

/**
 * Section detayları
 * @param {number|string} sectionId - Section ID
 * @returns {Promise<object>} Section detayları
 */
export async function getSectionById(sectionId) {
    return get(`/sections/${sectionId}`);
}

/**
 * Section oluşturma (Admin only)
 * @param {object} sectionData - Section bilgileri
 * @returns {Promise<object>}
 */
export async function createSection(sectionData) {
    return post('/sections', sectionData);
}

/**
 * Section güncelleme (Admin only)
 * @param {number|string} sectionId - Section ID
 * @param {object} sectionData - Güncellenecek bilgiler
 * @returns {Promise<object>}
 */
export async function updateSection(sectionId, sectionData) {
    return put(`/sections/${sectionId}`, sectionData);
}

/**
 * Derse kayıt olma (Student)
 * @param {object} enrollmentData - { sectionId }
 * @returns {Promise<object>}
 */
export async function enrollInCourse(enrollmentData) {
    return post('/enrollments', enrollmentData);
}

/**
 * Dersi bırakma (Student)
 * @param {number|string} enrollmentId - Enrollment ID
 * @returns {Promise<object>}
 */
export async function dropCourse(enrollmentId) {
    return del(`/enrollments/${enrollmentId}`);
}

/**
 * Kayıtlı derslerim (Student)
 * @returns {Promise<object>} Kayıtlı dersler listesi
 */
export async function getMyCourses() {
    return get('/enrollments/my-courses');
}

/**
 * Dersin öğrenci listesi (Faculty)
 * @param {number|string} sectionId - Section ID
 * @returns {Promise<object>} Öğrenci listesi
 */
export async function getSectionStudents(sectionId) {
    return get(`/enrollments/sections/${sectionId}/students`);
}

/**
 * Notlarım (Student)
 * @returns {Promise<object>} Notlar listesi
 */
export async function getMyGrades() {
    return get('/grades/my-grades');
}

/**
 * Transkript JSON (Student)
 * @returns {Promise<object>} Transkript verisi
 */
export async function getTranscript() {
    return get('/grades/transcript');
}

/**
 * Transkript PDF (Student)
 * @returns {Promise<Blob>} PDF dosyası
 */
export async function getTranscriptPDF() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_FULL_API_URL || '/api/v1';
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const response = await fetch(`${API_BASE_URL}/grades/transcript/pdf`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'PDF indirilemedi');
    }

    return response.blob();
}

/**
 * Not girişi (Faculty)
 * @param {object} gradeData - { enrollmentId, midtermGrade, finalGrade, homeworkGrade }
 * @returns {Promise<object>}
 */
export async function submitGrade(gradeData) {
    return post('/grades', gradeData);
}

/**
 * Not güncelleme (Faculty)
 * @param {number|string} enrollmentId - Enrollment ID
 * @param {object} gradeData - Güncellenecek notlar
 * @returns {Promise<object>}
 */
export async function updateGrade(enrollmentId, gradeData) {
    return put(`/grades/${enrollmentId}`, gradeData);
}

/**
 * Bölüm listesi
 * @returns {Promise<object>} Bölüm listesi
 */
export async function getDepartments() {
    return get('/departments');
}

export default {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getSections,
    getSectionById,
    createSection,
    updateSection,
    enrollInCourse,
    dropCourse,
    getMyCourses,
    getSectionStudents,
    getMyGrades,
    getTranscript,
    getTranscriptPDF,
    submitGrade,
    updateGrade,
    getDepartments,
};

