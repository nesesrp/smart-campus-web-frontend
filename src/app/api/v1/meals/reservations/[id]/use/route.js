import { NextResponse } from 'next/server';
import { useMockReservation } from '@/mocks/meal.mock';
import { validateMockQRCode } from '@/mocks/meal.mock';
import { successResponse, errorResponse } from '@/mocks/helpers/response';

/**
 * POST /api/v1/meals/reservations/:id/use
 * Yemek kullanımı (cafeteria staff)
 * Dokümantasyona göre: Validate QR code, Check if today's date matches, 
 * Check if already used, Mark as used, If paid complete transaction
 */
export async function POST(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();
        
        // Backend implementasyonunda QR code'u da kabul edebilir
        // Şimdilik ID ile rezervasyonu bulup kullanıyoruz
        if (!id) {
            return errorResponse('Rezervasyon ID gerekli', 400);
        }
        
        // Mock: ID ile rezervasyonu bul (gerçek backend'de DB'den çekilecek)
        // Şimdilik QR code ile validate edip kullanıyoruz
        // Backend'de ID ile direkt rezervasyonu bulup kullanacak
        
        // Eğer QR code gönderilmişse, onu kullan
        if (data.qrCode) {
            // Önce validate et
            const validationResult = validateMockQRCode(data.qrCode);
            const reservation = validationResult.reservation;
            
            // Rezervasyonu kullan
            const usedReservation = useMockReservation(data.qrCode);
            
            return successResponse(usedReservation, 'Rezervasyon başarıyla kullanıldı');
        }
        
        // ID ile kullan (gerçek backend'de bu şekilde olacak)
        // Şimdilik mock'ta ID ile rezervasyonu bulamıyoruz, QR code gerekli
        // Backend implementasyonunda ID ile direkt DB'den çekilecek
        return errorResponse('QR kod gerekli (backend implementasyonunda ID ile çalışacak)', 400);
        
    } catch (error) {
        return errorResponse(error.message, 400);
    }
}

