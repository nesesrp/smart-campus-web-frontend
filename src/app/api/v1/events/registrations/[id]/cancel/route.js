import { NextResponse } from 'next/server';
import { cancelMockRegistration } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/events/registrations/:id/cancel
 * Etkinlik kaydını iptal et
 */
export async function POST(request, { params }) {
    try {
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');
        const id = pathParts[pathParts.length - 2]; // registrations/[id]/cancel
        
        let registrationId = id;
        if (params) {
            if (typeof params === 'object' && 'then' in params) {
                const resolvedParams = await params;
                registrationId = resolvedParams?.id || id;
            } else {
                registrationId = params.id || id;
            }
        }
        
        if (!registrationId) {
            return errorResponse('Kayıt ID gerekli', 400);
        }
        
        const cancelledRegistration = cancelMockRegistration(registrationId);
        
        return successResponse(cancelledRegistration, 'Kayıt başarıyla iptal edildi');
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

