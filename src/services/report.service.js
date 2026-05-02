import apiClient from './api-client';

/**
 * Report Service - Part 4
 * Excel/PDF rapor export API'leri
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5150/api/v1';

/**
 * Token'ı localStorage'dan alır (Zustand formatı)
 */
function getAuthToken() {
    if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                return parsed?.state?.accessToken;
            } catch (e) {
                console.error('Failed to parse auth storage:', e);
            }
        }
    }
    return null;
}

/**
 * Dosya indirme helper fonksiyonu
 */
async function downloadFile(endpoint, filename) {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Dosya indirilemedi');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Öğrenci listesini Excel olarak indirir
 */
export async function exportStudentListToExcel(departmentId = null) {
    const query = departmentId ? `?departmentId=${departmentId}` : '';
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    await downloadFile(`/reports/students/excel${query}`, `ogrenci_listesi_${date}.xlsx`);
}

/**
 * Ders not raporunu Excel olarak indirir
 */
export async function exportGradeReportToExcel(sectionId) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    await downloadFile(`/reports/grades/${sectionId}/excel`, `not_raporu_${sectionId}_${date}.xlsx`);
}

/**
 * Öğrenci transkriptini PDF olarak indirir
 */
export async function exportTranscriptToPdf(studentId) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    await downloadFile(`/reports/transcript/${studentId}/pdf`, `transkript_${studentId}_${date}.pdf`);
}

/**
 * Ders devamsızlık raporunu PDF olarak indirir
 */
export async function exportAttendanceReportToPdf(sectionId) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    await downloadFile(`/reports/attendance/${sectionId}/pdf`, `devamsizlik_raporu_${sectionId}_${date}.pdf`);
}

/**
 * Riskli öğrenciler raporunu Excel olarak indirir
 */
export async function exportAtRiskStudentsToExcel(gpaThreshold = 2.0) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    await downloadFile(`/reports/at-risk-students/excel?gpaThreshold=${gpaThreshold}`, `riskli_ogrenciler_${date}.xlsx`);
}
