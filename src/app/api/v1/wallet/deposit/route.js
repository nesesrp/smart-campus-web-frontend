import { NextResponse } from 'next/server';
import { createMockDeposit } from '@/mocks/wallet.mock';
import { createdResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/wallet/deposit
 * Para yükleme işlemi başlat
 */
export async function POST(request) {
    try {
        const data = await request.json();
        
        if (!data.amount || !data.paymentMethod) {
            return errorResponse('amount ve paymentMethod alanları zorunludur', 400);
        }
        
        const result = createMockDeposit(data);
        
        return createdResponse(result, 'Ödeme sayfasına yönlendiriliyorsunuz');
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

