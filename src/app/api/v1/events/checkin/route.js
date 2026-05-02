import { NextResponse } from 'next/server';
import { checkInEvent, getEventAttendeeCount } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/events/checkin
 * Check-in yap
 */
export async function POST(request) {
    try {
        const data = await request.json();
        
        if (!data.qrCode) {
            return errorResponse('QR kod gerekli', 400);
        }
        
        const registration = checkInEvent(data.qrCode);
        const attendeeCount = getEventAttendeeCount(registration.eventId);
        
        return successResponse({
            registration,
            attendeeCount
        }, 'Check-in başarıyla yapıldı');
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

