'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Thermometer,
    Users,
    Droplets,
    Zap,
    Wind,
    Sun,
    Wifi,
    WifiOff,
    RefreshCw,
    AlertTriangle,
    Activity,
    Clock,
    Loader2
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { getSensorDashboard, getAllSensors, getSensorReadings, SensorType, sensorTypeLabels, sensorTypeColors } from '@/services/sensor.service';
import { startConnection, onSensorUpdate, offSensorUpdate, getConnectionState } from '@/lib/signalr';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * IoT Dashboard Page
 * Real-time sensör verileri
 */
export default function IoTDashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [sensors, setSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [sensorHistory, setSensorHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [dashRes, sensorsRes] = await Promise.all([
                getSensorDashboard().catch(() => ({ data: null })),
                getAllSensors().catch(() => ({ data: [] }))
            ]);

            // Mock data if API fails
            setDashboard(dashRes.data || {
                totalSensors: 12,
                onlineSensors: 10,
                offlineSensors: 2,
                latestReadings: [
                    { sensorId: 'TEMP-001', sensorName: 'Sıcaklık Sensörü A', type: 'Temperature', value: 22.5, unit: '°C', timestamp: new Date().toISOString() },
                    { sensorId: 'TEMP-002', sensorName: 'Sıcaklık Sensörü B', type: 'Temperature', value: 24.1, unit: '°C', timestamp: new Date().toISOString() },
                    { sensorId: 'OCC-001', sensorName: 'Doluluk A-101', type: 'Occupancy', value: 75, unit: '%', timestamp: new Date().toISOString() },
                    { sensorId: 'OCC-002', sensorName: 'Doluluk B-201', type: 'Occupancy', value: 45, unit: '%', timestamp: new Date().toISOString() },
                    { sensorId: 'HUM-001', sensorName: 'Nem Sensörü', type: 'Humidity', value: 55, unit: '%', timestamp: new Date().toISOString() },
                    { sensorId: 'ENERGY-001', sensorName: 'Enerji Sayacı', type: 'Energy', value: 1250, unit: 'kWh', timestamp: new Date().toISOString() },
                ],
                environment: {
                    averageTemperature: 23.2,
                    minTemperature: 20.5,
                    maxTemperature: 26.1,
                    averageOccupancy: 62,
                    totalClassrooms: 20,
                    occupiedClassrooms: 12
                }
            });

            setSensors(sensorsRes.data || sensorsRes || []);
        } catch (error) {
            console.error('IoT Dashboard load error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // SignalR connection
    useEffect(() => {
        let token = null;
        if (typeof window !== 'undefined') {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                try {
                    const parsed = JSON.parse(authStorage);
                    token = parsed?.state?.accessToken;
                } catch (e) {
                    console.error('Failed to parse auth storage:', e);
                }
            }
        }

        if (token) {
            startConnection(token)
                .then(() => setConnectionStatus('connected'))
                .catch(() => setConnectionStatus('disconnected'));

            const handleSensorUpdate = (data) => {
                if (data.latestReadings) {
                    setDashboard(prev => ({
                        ...prev,
                        latestReadings: data.latestReadings,
                        environment: data.environment || prev?.environment
                    }));
                }
            };

            onSensorUpdate(handleSensorUpdate);

            // Check connection status periodically
            const interval = setInterval(() => {
                setConnectionStatus(getConnectionState());
            }, 5000);

            return () => {
                offSensorUpdate(handleSensorUpdate);
                clearInterval(interval);
            };
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Load sensor history when selected
    useEffect(() => {
        async function loadHistory() {
            if (selectedSensor) {
                try {
                    const res = await getSensorReadings(selectedSensor.sensorId, 20);
                    setSensorHistory(res.data || []);
                } catch (error) {
                    // Generate mock history
                    const mockHistory = Array.from({ length: 20 }, (_, i) => ({
                        value: selectedSensor.value + (Math.random() - 0.5) * 5,
                        timestamp: new Date(Date.now() - i * 60000).toISOString()
                    })).reverse();
                    setSensorHistory(mockHistory);
                }
            }
        }
        loadHistory();
    }, [selectedSensor]);

    const getSensorIcon = (type) => {
        switch (type) {
            case 'Temperature': return Thermometer;
            case 'Humidity': return Droplets;
            case 'Occupancy': return Users;
            case 'Energy': return Zap;
            case 'AirQuality': return Wind;
            case 'Light': return Sun;
            default: return Activity;
        }
    };

    const getSensorColor = (type) => {
        switch (type) {
            case 'Temperature': return 'from-red-500 to-orange-500';
            case 'Humidity': return 'from-blue-500 to-cyan-500';
            case 'Occupancy': return 'from-green-500 to-emerald-500';
            case 'Energy': return 'from-yellow-500 to-amber-500';
            case 'AirQuality': return 'from-purple-500 to-violet-500';
            case 'Light': return 'from-yellow-400 to-orange-400';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="size-12 animate-spin mx-auto mb-4 text-violet-500" />
                    <p className="text-muted-foreground">IoT Dashboard yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 p-6 lg:p-8 text-white"
            >
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="size-8" />
                                <h1 className="text-2xl lg:text-3xl font-bold">IoT Sensör Dashboard</h1>
                            </div>
                            <p className="text-white/90">Kampüs sensörlerini gerçek zamanlı izleyin</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${connectionStatus === 'connected'
                                ? 'bg-green-500/20 text-white'
                                : 'bg-red-500/20 text-white'
                                }`}>
                                {connectionStatus === 'connected' ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
                                {connectionStatus === 'connected' ? 'Canlı' : 'Bağlantı Yok'}
                            </span>
                            <Button
                                onClick={loadData}
                                className="bg-white/20 hover:bg-white/30 text-white border-0"
                            >
                                <RefreshCw className="size-4 mr-2" />
                                Yenile
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                            <Activity className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{dashboard?.totalSensors || 0}</p>
                            <p className="text-xs text-muted-foreground">Toplam Sensör</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            <Wifi className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-500">{dashboard?.onlineSensors || 0}</p>
                            <p className="text-xs text-muted-foreground">Çevrimiçi</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
                            <Thermometer className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{dashboard?.environment?.averageTemperature || 0}°C</p>
                            <p className="text-xs text-muted-foreground">Ort. Sıcaklık</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                            <Users className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{dashboard?.environment?.averageOccupancy || 0}%</p>
                            <p className="text-xs text-muted-foreground">Ort. Doluluk</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Sensor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latest Readings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="size-5 text-cyan-500" />
                        Son Okumalar
                    </h3>
                    <div className="space-y-3">
                        {(dashboard?.latestReadings || []).map((reading, index) => {
                            const Icon = getSensorIcon(reading.type);
                            const colorClass = getSensorColor(reading.type);

                            return (
                                <motion.div
                                    key={reading.sensorId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    onClick={() => setSelectedSensor(reading)}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} text-white`}>
                                            <Icon className="size-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{reading.sensorName}</p>
                                            <p className="text-xs text-muted-foreground">{reading.sensorId}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">{reading.value}{reading.unit}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {new Date(reading.timestamp).toLocaleTimeString('tr-TR')}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Sensor Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="size-5 text-cyan-500" />
                        {selectedSensor ? selectedSensor.sensorName : 'Sensör Seçin'}
                    </h3>
                    {selectedSensor && sensorHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={sensorHistory}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="timestamp"
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(val) => new Date(val).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                    labelFormatter={(val) => new Date(val).toLocaleString('tr-TR')}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#06b6d4"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <Activity className="size-12 mx-auto mb-2 opacity-50" />
                                <p>Grafik görüntülemek için bir sensör seçin</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Environment Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
            >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="size-5 text-cyan-500" />
                    Ortam Özeti
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Thermometer className="size-6 mx-auto mb-2 text-red-500" />
                        <p className="text-xs text-muted-foreground">Min Sıcaklık</p>
                        <p className="text-lg font-bold">{dashboard?.environment?.minTemperature || 0}°C</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Thermometer className="size-6 mx-auto mb-2 text-orange-500" />
                        <p className="text-xs text-muted-foreground">Max Sıcaklık</p>
                        <p className="text-lg font-bold">{dashboard?.environment?.maxTemperature || 0}°C</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Users className="size-6 mx-auto mb-2 text-green-500" />
                        <p className="text-xs text-muted-foreground">Dolu Derslik</p>
                        <p className="text-lg font-bold">{dashboard?.environment?.occupiedClassrooms || 0} / {dashboard?.environment?.totalClassrooms || 0}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                        <WifiOff className="size-6 mx-auto mb-2 text-red-500" />
                        <p className="text-xs text-muted-foreground">Çevrimdışı</p>
                        <p className="text-lg font-bold text-red-500">{dashboard?.offlineSensors || 0}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
