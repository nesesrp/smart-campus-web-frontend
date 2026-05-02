/**
 * Event Service - Etkinlik servisi için API entegrasyonu
 * Events Page için gerekli fonksiyonlar
 * Backend endpoint'leri hazır olmadığı için mock API kullanılıyor
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_FULL_API_URL || '/api/v1';

/**
 * Etkinlik listesi getir
 * @param {object} params - { category, date, search }
 */
export async function getEvents(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.date) queryParams.append('date', params.date);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const response = await fetch(`${API_BASE_URL}/events${queryString ? `?${queryString}` : ''}`);

    if (!response.ok) {
        throw new Error('Etkinlikler yüklenemedi');
    }

    const data = await response.json();
    return data;
}

/**
 * Yeni etkinlik oluştur (Admin/Faculty only)
 * @param {object} eventData - Etkinlik verileri
 */
export async function createEvent(eventData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('${API_BASE_URL}/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0] || 'Etkinlik oluşturulamadı');
    }

    return await response.json();
}

/**
 * Etkinlik güncelle (Admin/Faculty only)
 * @param {number} eventId - Etkinlik ID
 * @param {object} eventData - Güncellenecek veriler
 */
export async function updateEvent(eventId, eventData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0] || 'Etkinlik güncellenemedi');
    }

    return await response.json();
}

/**
 * Etkinlik sil (Admin/Faculty only)
 * @param {number} eventId - Etkinlik ID
 */
export async function deleteEvent(eventId) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0] || 'Etkinlik silinemedi');
    }

    return await response.json();
}

/**
 * Etkinlik detayı getir
 * @param {string} eventId - Etkinlik ID
 */
export async function getEventById(eventId) {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);

    if (!response.ok) {
        throw new Error('Etkinlik detayı yüklenemedi');
    }

    const data = await response.json();
    return data;
}

/**
 * Etkinliğe kayıt ol
 * @param {string} eventId - Etkinlik ID
 * @param {object} formData - Kayıt form verileri
 */
export async function registerToEvent(eventId, formData = {}) {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Kayıt işlemi başarısız oldu';

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
}

/**
 * Kullanıcının kayıt olduğu etkinlikleri getir
 */
export async function getMyEvents() {
    const response = await fetch('${API_BASE_URL}/events/my-events');

    if (!response.ok) {
        throw new Error('Kayıtlı etkinlikler yüklenemedi');
    }

    const data = await response.json();
    return data;
}

/**
 * Etkinlik kaydını iptal et
 * @param {string} registrationId - Kayıt ID
 */
export async function cancelEventRegistration(registrationId) {
    const response = await fetch(`${API_BASE_URL}/events/registrations/${registrationId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Kayıt iptal edilemedi';

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
}

/**
 * QR kod ile kayıt doğrula (Check-in için)
 * @param {string} qrCode - QR kod
 */
export async function validateEventQRCode(qrCode) {
    const response = await fetch('${API_BASE_URL}/events/checkin/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode })
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'QR kod doğrulanamadı';

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
}

/**
 * Check-in yap
 * @param {string} qrCode - QR kod
 */
export async function checkInEvent(qrCode) {
    const response = await fetch('${API_BASE_URL}/events/checkin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode })
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Check-in başarısız oldu';

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
}

/**
 * Etkinlik katılımcı sayısını getir
 * @param {string} eventId - Etkinlik ID
 */
export async function getEventAttendeeCount(eventId) {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendees`);

    if (!response.ok) {
        throw new Error('Katılımcı sayısı yüklenemedi');
    }

    const data = await response.json();
    return data;
}

export default {
    getEvents,
    getEventById,
    registerToEvent,
    getMyEvents,
    cancelEventRegistration,
    validateEventQRCode,
    checkInEvent,
    getEventAttendeeCount
};
