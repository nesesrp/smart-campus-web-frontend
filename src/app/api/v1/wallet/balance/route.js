import { NextResponse } from 'next/server';
import { getMockBalance } from '@/mocks/wallet.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/wallet/balance
 * Kullanıcının bakiyesini getir
 */
export async function GET(request) {
    try {
        const balance = getMockBalance();
        return successResponse(balance);
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

