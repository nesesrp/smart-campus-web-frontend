import { NextResponse } from 'next/server';
import { getMockEventById } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/events/:id
 * Etkinlik detayı
 */
export async function GET(request, { params }) {
    try {
        // URL'den ID'yi al
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        
        // Alternatif: params'dan al (Next.js versiyonuna göre)
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
        
        const event = getMockEventById(eventId);
        
        if (!event) {
            return errorResponse('Etkinlik bulunamadı', 404);
        }
        
        return successResponse(event);
    } catch (error) {
        console.error('Event detail error:', error);
        return errorResponse(error.message || 'Sunucu hatası', 500);
    }
}

