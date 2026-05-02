import { NextResponse } from 'next/server';
import { getMockTransactions } from '@/mocks/wallet.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/wallet/transactions
 * İşlem geçmişini getir
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        
        const result = getMockTransactions({
            page,
            pageSize,
            type,
            status
        });
        
        return successResponse(result);
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

