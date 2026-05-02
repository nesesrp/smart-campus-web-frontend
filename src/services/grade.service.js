/**
 * Grade Service - Not yönetimi için API servisi
 */

import { get, post } from './api-client';

/**
 * Öğrencinin notlarını getir
 */
export async function getMyGrades() {
    return get('/grades/my-grades');
}

/**
 * Transkript verilerini getir
 */
export async function getTranscript() {
    return get('/grades/transcript');
}

/**
 * Transkript PDF indir
 */
export async function downloadTranscriptPdf() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_FULL_API_URL || '/api/v1';
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const response = await fetch(`${API_BASE_URL}/grades/transcript/pdf`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('PDF indirilemedi');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transkript.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

/**
 * Not gir (Faculty)
 * @param {object} gradeData - { enrollmentId, midtermGrade, finalGrade }
 */
export async function enterGrade(gradeData) {
    return post('/grades/enter', gradeData);
}

/**
 * Toplu not gir (Faculty)
 * @param {array} grades - [{ enrollmentId, midtermGrade, finalGrade }, ...]
 */
export async function enterGradesBatch(grades) {
    return post('/grades/enter-batch', grades);
}

/**
 * Harf notu hesapla (client-side preview)
 * @param {number} midterm 
 * @param {number} final 
 */
export function calculateLetterGrade(midterm, final) {
    const weighted = midterm * 0.4 + final * 0.6;

    if (weighted >= 90) return 'AA';
    if (weighted >= 85) return 'BA';
    if (weighted >= 80) return 'BB';
    if (weighted >= 75) return 'CB';
    if (weighted >= 70) return 'CC';
    if (weighted >= 65) return 'DC';
    if (weighted >= 60) return 'DD';
    if (weighted >= 50) return 'FD';
    return 'FF';
}

/**
 * Harf notundan puan hesapla
 * @param {string} letter 
 */
export function letterToGradePoint(letter) {
    const gradePoints = {
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
    };
    return gradePoints[letter] || 0;
}

export default {
    getMyGrades,
    getTranscript,
    downloadTranscriptPdf,
    enterGrade,
    enterGradesBatch,
    calculateLetterGrade,
    letterToGradePoint
};
