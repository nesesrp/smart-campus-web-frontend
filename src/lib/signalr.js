import * as signalR from '@microsoft/signalr';

/**
 * SignalR Helper - Part 4
 * Real-time notification connection
 */

let connection = null;
let reconnectTimer = null;
let hubNotAvailable = false;

const HUB_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5150';

/**
 * SignalR bağlantısını başlatır
 * Not: Backend'de SignalR hub yoksa sessizce başarısız olur
 */
export async function startConnection(token) {
    // Eğer hub yoksa tekrar deneme
    if (hubNotAvailable) {
        return null;
    }

    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        return connection;
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${HUB_URL}/hubs/notifications`, {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.None) // Hataları gizle
        .build();

    try {
        await connection.start();
        console.log('SignalR Connected');
        return connection;
    } catch (err) {
        // 404 hatası = hub yok, sessizce devam et
        if (err.message?.includes('404') || err.statusCode === 404) {
            console.log('SignalR hub not available, continuing without real-time updates');
            hubNotAvailable = true;
            connection = null;
            return null;
        }
        console.warn('SignalR Connection failed:', err.message);
        connection = null;
        return null;
    }
}

/**
 * SignalR bağlantısını kapatır
 */
export async function stopConnection() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    if (connection) {
        try {
            await connection.stop();
            console.log('SignalR Disconnected');
        } catch (err) {
            console.error('SignalR Stop Error:', err);
        }
        connection = null;
    }
}

/**
 * Bildirim event'ini dinler
 */
export function onNotification(callback) {
    if (connection) {
        connection.on('ReceiveNotification', callback);
    }
}

/**
 * Bildirim event listener'ını kaldırır
 */
export function offNotification(callback) {
    if (connection) {
        connection.off('ReceiveNotification', callback);
    }
}

/**
 * Sensör güncelleme event'ini dinler
 */
export function onSensorUpdate(callback) {
    if (connection) {
        connection.on('SensorUpdate', callback);
    }
}

/**
 * Sensör güncelleme event listener'ını kaldırır
 */
export function offSensorUpdate(callback) {
    if (connection) {
        connection.off('SensorUpdate', callback);
    }
}

/**
 * Bağlantı durumunu döndürür
 */
export function getConnectionState() {
    if (!connection) return 'disconnected';
    switch (connection.state) {
        case signalR.HubConnectionState.Connected:
            return 'connected';
        case signalR.HubConnectionState.Connecting:
            return 'connecting';
        case signalR.HubConnectionState.Reconnecting:
            return 'reconnecting';
        default:
            return 'disconnected';
    }
}

/**
 * Mevcut bağlantıyı döndürür
 */
export function getConnection() {
    return connection;
}
