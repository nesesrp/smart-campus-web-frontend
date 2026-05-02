import { NextResponse } from 'next/server';
import { validateMockQRCode } from '@/mocks/meal.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/meals/scan
 * QR kod doğrula ve rezervasyon bilgilerini getir
 */
export async function POST(request) {
    try {
        const data = await request.json();
        
        if (!data.qrCode) {
            return errorResponse('QR kod gerekli', 400);
        }
        
        const result = validateMockQRCode(data.qrCode);
        
        return successResponse(result, 'QR kod doğrulandı');
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

