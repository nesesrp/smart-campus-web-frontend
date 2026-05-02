import apiClient from './api-client';

/**
 * Notification Service - Part 4
 * Bildirim API'leri
 */

/**
 * Kullanıcının bildirimlerini getirir
 */
export async function getNotifications(params = {}) {
    const { page = 1, pageSize = 20 } = params;
    return apiClient.get(`/notifications?page=${page}&pageSize=${pageSize}`);
}

/**
 * Okunmamış bildirim sayısını getirir
 */
export async function getUnreadCount() {
    return apiClient.get('/notifications/unread-count');
}

/**
 * Bildirimi okundu olarak işaretler
 */
export async function markAsRead(id) {
    return apiClient.put(`/notifications/${id}/read`);
}

/**
 * Tüm bildirimleri okundu olarak işaretler
 */
export async function markAllAsRead() {
    return apiClient.put('/notifications/read-all');
}

/**
 * Bildirim tercihlerini getirir
 */
export async function getNotificationPreferences() {
    return apiClient.get('/notifications/preferences');
}

/**
 * Bildirim tercihlerini günceller
 */
export async function updateNotificationPreferences(preferences) {
    return apiClient.put('/notifications/preferences', { preferences });
}

/**
 * Admin: Toplu bildirim gönderir
 */
export async function broadcastNotification(data) {
    return apiClient.post('/notifications/broadcast', data);
}

/**
 * Admin: Belirli bir kullanıcıya bildirim gönderir
 */
export async function sendNotification(data) {
    return apiClient.post('/notifications/send', data);
}

/**
 * Notification Category Enum
 */
export const NotificationCategory = {
    System: 0,
    Academic: 1,
    Attendance: 2,
    Event: 3,
    Payment: 4,
    Meal: 5
};

/**
 * Notification Type Enum
 */
export const NotificationType = {
    Info: 0,
    Warning: 1,
    Error: 2,
    Success: 3,
    Reminder: 4
};

/**
 * Kategori etiketleri
 */
export const categoryLabels = {
    [NotificationCategory.System]: 'Sistem',
    [NotificationCategory.Academic]: 'Akademik',
    [NotificationCategory.Attendance]: 'Devamsızlık',
    [NotificationCategory.Event]: 'Etkinlik',
    [NotificationCategory.Payment]: 'Ödeme',
    [NotificationCategory.Meal]: 'Yemek'
};

/**
 * Tip etiketleri
 */
export const typeLabels = {
    [NotificationType.Info]: 'Bilgi',
    [NotificationType.Warning]: 'Uyarı',
    [NotificationType.Error]: 'Hata',
    [NotificationType.Success]: 'Başarı',
    [NotificationType.Reminder]: 'Hatırlatma'
};
