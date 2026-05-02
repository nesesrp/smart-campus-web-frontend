'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Map Component with Leaflet
 * @param {object} props
 * @param {[number, number]} props.center - [lat, lng] of classroom
 * @param {[number, number]|null} props.userLocation - [lat, lng] of user
 * @param {number} props.radius - Geofence radius in meters
 */
export default function MapComponent({ center, userLocation, radius = 15 }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const userMarkerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView(center, 18);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Add classroom marker
        L.marker(center)
            .addTo(map)
            .bindPopup('Sınıf Konumu')
            .openPopup();

        // Add geofence circle
        L.circle(center, {
            color: '#6366f1',
            fillColor: '#6366f1',
            fillOpacity: 0.2,
            radius: radius
        }).addTo(map);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [center, radius]);

    // Update user marker when location changes
    useEffect(() => {
        if (!mapInstanceRef.current || !userLocation) return;

        // Remove old marker
        if (userMarkerRef.current) {
            userMarkerRef.current.remove();
        }

        // Add new user marker
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
                <div style="
                    width: 20px;
                    height: 20px;
                    background: #22c55e;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        userMarkerRef.current = L.marker(userLocation, { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('Konumunuz');

        // Fit bounds to show both markers
        const bounds = L.latLngBounds([center, userLocation]);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }, [userLocation, center]);

    return (
        <div
            ref={mapRef}
            className="h-full w-full rounded-xl"
            style={{ minHeight: '256px' }}
        />
    );
}
