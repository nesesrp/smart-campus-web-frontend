import { NextResponse } from 'next/server';
import { getMockMyEvents } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/events/my-events
 * Kullanıcının kayıt olduğu etkinlikleri getir
 */
export async function GET(request) {
    try {
        // Mock: userId = 1 (gerçek backend'de token'dan alınacak)
        const myEvents = getMockMyEvents(1);
        
        return successResponse(myEvents);
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

