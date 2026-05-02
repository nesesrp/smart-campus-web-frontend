import { NextResponse } from 'next/server';
import { cancelMockReservation } from '@/mocks/meal.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/meals/reservations/:id/cancel
 * Rezervasyon iptal et
 */
export async function POST(request, { params }) {
    try {
        const { id } = params;
        
        if (!id) {
            return errorResponse('Rezervasyon ID gerekli', 400);
        }
        
        const reservation = cancelMockReservation(id);
        
        return successResponse(reservation, 'Rezervasyon başarıyla iptal edildi');
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

