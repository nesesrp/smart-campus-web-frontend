import { NextResponse } from 'next/server';
import { createMockReservation } from '@/mocks/meal.mock';
import { createdResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/meals/reservations
 * Yemek rezervasyonu oluştur
 */
export async function POST(request) {
    try {
        const data = await request.json();
        
        // Validasyon
        if (!data.menuId || !data.mealType || !data.date) {
            return errorResponse('menuId, mealType ve date alanları zorunludur', 400);
        }
        
        const reservation = createMockReservation(data);
        
        return createdResponse(reservation, 'Rezervasyon başarıyla oluşturuldu!');
    } catch (error) {
        return errorResponse(error.message || 'Rezervasyon oluşturulamadı', 500);
    }
}

