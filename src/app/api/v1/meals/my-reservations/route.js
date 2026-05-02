import { NextResponse } from 'next/server';
import { getMockMyReservations } from '@/mocks/meal.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/meals/my-reservations
 * Kullanıcının rezervasyonlarını getir
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        
        const reservations = getMockMyReservations({
            status,
            dateFrom,
            dateTo
        });
        
        return successResponse(reservations);
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

