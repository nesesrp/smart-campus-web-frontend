/**
 * Wallet Service - Cüzdan servisi için API entegrasyonu
 * Backend endpoint'lerine uygun şekilde yapılandırıldı
 */

import { get, post } from './api-client';

/**
 * Bakiye getir
 * Backend: GET /api/v1/wallet
 */
export async function getBalance() {
    return get('/wallet');
}

/**
 * Para yükleme işlemi başlat (Mock - Test için)
 * Backend: POST /api/v1/wallet/topup
 * @param {object} data - { amount, paymentMethod }
 */
export async function addMoney(data) {
    // Backend WalletTopUpDto formatına dönüştür
    // Test kartı: 1234-5678-1234-5678, CVV: 123, Expiry: 01/26
    return post('/wallet/topup', {
        Amount: data.amount,
        CardNumber: data.cardNumber || '1234567812345678', // Backend test kartı
        CVV: data.cvv || '123',
        ExpiryDate: data.expiryDate || '01/26' // MM/YY format
    });
}

/**
 * Iyzico ile para yükleme işlemi başlat (Gerçek Ödeme)
 * Backend: POST /api/v1/wallet/topup/iyzico
 * @param {object} data - { amount }
 * @returns {Promise} - { paymentPageUrl, htmlContent, conversationId }
 */
export async function addMoneyWithIyzico(data) {
    return post('/wallet/topup/iyzico', {
        Amount: data.amount,
        GsmNumber: data.gsmNumber || '+905000000000',
        Address: data.address || 'Kampüs',
        City: data.city || 'Istanbul',
        Country: data.country || 'Turkey'
    });
}

/**
 * İşlem geçmişini getir
 * Backend: GET /api/v1/wallet/transactions
 * @param {object} params - { page, pageSize }
 */
export async function getTransactions(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const queryString = queryParams.toString();
    return get(`/wallet/transactions${queryString ? `?${queryString}` : ''}`);
}

export default {
    getBalance,
    addMoney,
    addMoneyWithIyzico,
    getTransactions
};
