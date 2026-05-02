import apiClient from './api-client';

/**
 * Analytics Service - Part 4
 * Admin Analytics API'leri
 */

/**
 * Admin dashboard istatistiklerini getirir
 */
export async function getDashboardStats() {
    return apiClient.get('/analytics/dashboard');
}

/**
 * Akademik performans raporunu getirir
 */
export async function getAcademicPerformance() {
    return apiClient.get('/analytics/academic-performance');
}

/**
 * Tüm bölümlerin GPA istatistiklerini getirir
 */
export async function getDepartmentGpaStats() {
    return apiClient.get('/analytics/department-stats');
}

/**
 * Belirli bir bölümün istatistiklerini getirir
 */
export async function getDepartmentStats(departmentId) {
    return apiClient.get(`/analytics/department/${departmentId}`);
}

/**
 * Harf notu dağılımını getirir
 */
export async function getGradeDistribution(sectionId = null) {
    const query = sectionId ? `?sectionId=${sectionId}` : '';
    return apiClient.get(`/analytics/grade-distribution${query}`);
}

/**
 * Riskli öğrencilerin listesini getirir
 */
export async function getAtRiskStudents(gpaThreshold = 2.0, attendanceThreshold = 20) {
    return apiClient.get(`/analytics/at-risk-students?gpaThreshold=${gpaThreshold}&attendanceThreshold=${attendanceThreshold}`);
}

/**
 * Ders doluluk oranlarını getirir
 */
export async function getCourseOccupancy() {
    return apiClient.get('/analytics/course-occupancy');
}

/**
 * Devamsızlık istatistiklerini getirir
 */
export async function getAttendanceStats() {
    return apiClient.get('/analytics/attendance-stats');
}
