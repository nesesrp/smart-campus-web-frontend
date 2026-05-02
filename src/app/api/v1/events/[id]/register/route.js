import { NextResponse } from 'next/server';
import { getMockEventById, mockRegistrationsStore } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/events/:id/register
 * Etkinliğe kayıt ol
 */
export async function POST(request, { params }) {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');
        const id = pathParts[pathParts.length - 2]; // events/[id]/register
        
        let eventId = id;
        if (params) {
            if (typeof params === 'object' && 'then' in params) {
                const resolvedParams = await params;
                eventId = resolvedParams?.id || id;
            } else {
                eventId = params.id || id;
            }
        }
        
        const data = await request.json();
        
        if (!eventId) {
            return errorResponse('Etkinlik ID gerekli', 400);
        }
        
        const event = getMockEventById(eventId);
        
        if (!event) {
            return errorResponse('Etkinlik bulunamadı', 404);
        }
        
        // Check capacity
        if (event.registeredCount >= event.capacity) {
            return errorResponse('Etkinlik dolu', 400);
        }
        
        // Check registration deadline
        const deadline = new Date(event.registrationDeadline);
        const now = new Date();
        if (now > deadline) {
            return errorResponse('Kayıt son tarihi geçmiştir', 400);
        }
        
        // Create registration
        const registration = {
            id: `reg-${Date.now()}`,
            eventId: eventId,
            userId: 1, // Mock user ID
            registrationDate: new Date().toISOString(),
            qrCode: `EVENT-${eventId}-${Date.now()}`,
            checkedIn: false,
            checkedInAt: null,
            customFields: data
        };
        
        mockRegistrationsStore.push(registration);
        
        // Update event registered count
        event.registeredCount += 1;
        
        return successResponse(registration, 'Etkinliğe başarıyla kayıt oldunuz!');
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

