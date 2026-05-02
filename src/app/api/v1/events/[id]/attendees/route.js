import { NextResponse } from 'next/server';
import { getEventAttendeeCount } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/events/:id/attendees
 * Etkinlik katılımcı sayısını getir
 */
export async function GET(request, { params }) {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');
        const id = pathParts[pathParts.length - 2]; // events/[id]/attendees
        
        let eventId = id;
        if (params) {
            if (typeof params === 'object' && 'then' in params) {
                const resolvedParams = await params;
                eventId = resolvedParams?.id || id;
            } else {
                eventId = params.id || id;
            }
        }
        
        if (!eventId) {
            return errorResponse('Etkinlik ID gerekli', 400);
        }
        
        const attendeeCount = getEventAttendeeCount(eventId);
        
        return successResponse(attendeeCount);
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

