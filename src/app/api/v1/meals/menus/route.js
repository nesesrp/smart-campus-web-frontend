/**
 * Mock API Route - Meals Menus
 * Menu Page için mock endpoint
 */

import { NextResponse } from 'next/server';
import { getMockMenus } from '@/mocks/meal.mock';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        
        const menus = getMockMenus(date);
        
        return NextResponse.json({
            success: true,
            message: 'Menüler başarıyla getirildi',
            data: menus,
            errors: null
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Menüler yüklenemedi',
            data: null,
            errors: [error.message]
        }, { status: 500 });
    }
}


