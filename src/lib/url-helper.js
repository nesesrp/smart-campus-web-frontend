/**
 * URL Helper Utilities
 */

// Backend base URL (statik dosyalar için)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5150';

/**
 * Relative URL'leri absolute URL'e çevirir
 * Backend'den gelen resim/dosya URL'leri için kullanılır
 * 
 * @param {string} url - Relative veya absolute URL
 * @returns {string} - Tam URL
 */
export function getFullUrl(url) {
    if (!url) return null;

    // Zaten absolute URL ise (http:// veya https:// ile başlıyor)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Data URL ise (base64 encoded image preview)
    if (url.startsWith('data:')) {
        return url;
    }

    // Relative URL ise backend URL'i ile birleştir
    // URL başında / yoksa ekle
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${BACKEND_URL}${path}`;
}

/**
 * Profil resmi URL'ini düzeltir
 * @param {string} profilePictureUrl 
 * @returns {string}
 */
export function getProfilePictureUrl(profilePictureUrl) {
    return getFullUrl(profilePictureUrl);
}
