import { NextResponse } from 'next/server';
import { getMockEvents } from '@/mocks/event.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * GET /api/v1/events
 * Etkinlik listesi (filter by category, date)
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const date = searchParams.get('date');
        const search = searchParams.get('search');

        const events = getMockEvents({ category, date, search });
        
        return successResponse(events);
    } catch (error) {
        return errorResponse(error.message, 500);
    }
}

