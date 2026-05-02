import React from 'react';
import { render } from '@testing-library/react';
import MapComponent from '@/components/attendance/MapComponent';
import L from 'leaflet';

// Mock Leaflet
jest.mock('leaflet', () => {
    const mapMock = {
        setView: jest.fn().mockReturnThis(),
        remove: jest.fn(),
        fitBounds: jest.fn(),
    };
    const markerMock = {
        addTo: jest.fn().mockReturnThis(),
        bindPopup: jest.fn().mockReturnThis(),
        openPopup: jest.fn().mockReturnThis(),
        remove: jest.fn(),
    };
    const circleMock = {
        addTo: jest.fn().mockReturnThis(),
    };
    const tileLayerMock = {
        addTo: jest.fn().mockReturnThis(),
    };

    return {
        map: jest.fn(() => mapMock),
        tileLayer: jest.fn(() => tileLayerMock),
        marker: jest.fn(() => markerMock),
        circle: jest.fn(() => circleMock),
        divIcon: jest.fn(),
        latLngBounds: jest.fn(),
        Icon: {
            Default: {
                prototype: {
                    _getIconUrl: jest.fn(),
                },
                mergeOptions: jest.fn(),
            },
        },
    };
});

describe('MapComponent', () => {
    const defaultProps = {
        center: [40.7128, -74.0060],
        userLocation: [40.7138, -74.0070],
        radius: 20,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Since we are mocking L directly, we don't need to spyOn usually, but let's reset calls
    });

    it('should render the map container', () => {
        const { container } = render(<MapComponent {...defaultProps} />);
        const mapContainer = container.querySelector('div');
        expect(mapContainer).toBeInTheDocument();
        expect(mapContainer).toHaveClass('h-full w-full rounded-xl');
    });

    it('should initialize leaflet map', () => {
        render(<MapComponent {...defaultProps} />);
        expect(L.map).toHaveBeenCalled();
        expect(L.tileLayer).toHaveBeenCalled();
        expect(L.marker).toHaveBeenCalledWith(defaultProps.center);
        expect(L.circle).toHaveBeenCalledWith(defaultProps.center, expect.any(Object));
    });

    it('should update user marker when userLocation changes', () => {
        const { rerender } = render(<MapComponent {...defaultProps} userLocation={null} />);

        // Initial render without user location
        // Should have called map, marker(center), circle

        // Rerender with user location
        rerender(<MapComponent {...defaultProps} />);

        expect(L.marker).toHaveBeenCalledWith(defaultProps.userLocation, expect.any(Object));
    });

    it('should remove map on unmount', () => {
        const { unmount } = render(<MapComponent {...defaultProps} />);
        const mapInstance = L.map.mock.results[0].value;
        unmount();
        expect(mapInstance.remove).toHaveBeenCalled();
    });
});
