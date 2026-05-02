/**
 * API Client - Fetch Wrapper
 * SOLID: Single Responsibility - Sadece HTTP isteklerini yönetir
 */

// process.env.NEXT_PUBLIC_FULL_API_URL kullanımı sayesinde Vercel'deki Next.js Mock API'ları atlanıp 
// doğrudan gerçek backend'e istek atılacak. (Örn: https://api.smartcampus.taskinnovation.net/api/v1)
const API_BASE_URL = process.env.NEXT_PUBLIC_FULL_API_URL || 'http://127.0.0.1:5150/api/v1';

/**
 * API isteği gönderir
 * @param {string} endpoint - API endpoint'i
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API yanıtı
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Token varsa header'a ekle
    if (typeof window !== 'undefined') {
        // Zustand auth store uses 'auth-storage' key with JSON structure
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                const token = parsed?.state?.accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.error('Failed to parse auth storage:', e);
            }
        }
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        // Backend formatına uyumluluk: isSuccessful veya success
        const isSuccess = data.success ?? data.isSuccessful ?? response.ok;

        if (!isSuccess) {
            // Backend hata mesajını al: errors array veya message
            const errorMessage = data.errors?.[0] || data.message || 'Bir hata oluştu';
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        // Yanıtı normalize et
        return {
            success: true,
            data: data.data ?? data,
            message: data.message || null
        };
    } catch (error) {
        // Network hatası veya JSON parse hatası
        if (!error.status) {
            error.message = 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
            error.status = 0;
        }
        throw error;
    }
}

/**
 * GET isteği
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
}

/**
 * POST isteği
 * @param {string} endpoint 
 * @param {object} body 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function post(endpoint, body, options = {}) {
    return request(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * PUT isteği
 * @param {string} endpoint 
 * @param {object} body 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function put(endpoint, body, options = {}) {
    return request(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * DELETE isteği
 * @param {string} endpoint 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export function del(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
}

/**
 * FormData ile POST isteği (dosya yükleme için)
 * @param {string} endpoint 
 * @param {FormData} formData 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export async function postFormData(endpoint, formData, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        method: 'POST',
        body: formData,
        ...options,
    };

    // Token varsa header'a ekle
    if (typeof window !== 'undefined') {
        // Zustand auth store uses 'auth-storage' key with JSON structure
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                const token = parsed?.state?.accessToken;
                if (token) {
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
            } catch (e) {
                console.error('Failed to parse auth storage:', e);
            }
        }
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Bir hata oluştu');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        if (!error.status) {
            error.message = 'Sunucuya bağlanılamadı';
            error.status = 0;
        }
        throw error;
    }
}

export default { get, post, put, del, postFormData };
