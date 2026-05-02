import { NextResponse } from 'next/server';
import { validateEventRegistration } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/events/checkin/validate
 * QR kod ile kayıt doğrula
 */
export async function POST(request) {
    try {
        const data = await request.json();
        
        if (!data.qrCode) {
            return errorResponse('QR kod gerekli', 400);
        }
        
        const result = validateEventRegistration(data.qrCode);
        
        return successResponse(result, 'QR kod doğrulandı');
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

