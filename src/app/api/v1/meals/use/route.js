import { NextResponse } from 'next/server';
import { useMockReservation } from '@/mocks/meal.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/meals/use
 * Rezervasyonu kullan
 */
export async function POST(request) {
    try {
        const data = await request.json();
        
        if (!data.qrCode) {
            return errorResponse('QR kod gerekli', 400);
        }
        
        const reservation = useMockReservation(data.qrCode);
        
        return successResponse(reservation, 'Rezervasyon başarıyla kullanıldı');
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

