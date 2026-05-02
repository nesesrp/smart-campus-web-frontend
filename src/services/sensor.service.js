import apiClient from './api-client';

/**
 * Sensor Service - Part 4
 * IoT Sensör API'leri
 */

/**
 * Tüm sensörleri listeler
 */
export async function getAllSensors() {
    return apiClient.get('/sensors');
}

/**
 * Sensör dashboard verilerini getirir
 */
export async function getSensorDashboard() {
    return apiClient.get('/sensors/dashboard');
}

/**
 * Belirli sensörün son okumalarını getirir
 */
export async function getSensorReadings(sensorId, limit = 50) {
    return apiClient.get(`/sensors/${sensorId}/readings?limit=${limit}`);
}

/**
 * Sensör tipleri
 */
export const SensorType = {
    Temperature: 'Temperature',
    Humidity: 'Humidity',
    Occupancy: 'Occupancy',
    Energy: 'Energy',
    AirQuality: 'AirQuality',
    Light: 'Light'
};

/**
 * Sensör tipi etiketleri
 */
export const sensorTypeLabels = {
    [SensorType.Temperature]: 'Sıcaklık',
    [SensorType.Humidity]: 'Nem',
    [SensorType.Occupancy]: 'Doluluk',
    [SensorType.Energy]: 'Enerji',
    [SensorType.AirQuality]: 'Hava Kalitesi',
    [SensorType.Light]: 'Işık'
};

/**
 * Sensör tipi birimleri
 */
export const sensorTypeUnits = {
    [SensorType.Temperature]: '°C',
    [SensorType.Humidity]: '%',
    [SensorType.Occupancy]: '%',
    [SensorType.Energy]: 'kWh',
    [SensorType.AirQuality]: 'AQI',
    [SensorType.Light]: 'lux'
};

/**
 * Sensör tipi renkleri (chart için)
 */
export const sensorTypeColors = {
    [SensorType.Temperature]: '#ef4444',
    [SensorType.Humidity]: '#3b82f6',
    [SensorType.Occupancy]: '#22c55e',
    [SensorType.Energy]: '#f59e0b',
    [SensorType.AirQuality]: '#8b5cf6',
    [SensorType.Light]: '#eab308'
};
