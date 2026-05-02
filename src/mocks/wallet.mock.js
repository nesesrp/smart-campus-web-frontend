/**
 * Wallet Service Mock Data
 * Part 3 - Wallet/Payment
 */

// In-memory store
let walletBalance = 150.50; // Başlangıç bakiyesi
let walletTransactions = [
    {
        id: 'txn-1',
        userId: 1,
        type: 'payment',
        amount: -35.00,
        balanceAfter: 115.50,
        description: 'Kafeterya Ödemesi',
        category: 'Yemek',
        paymentMethod: 'wallet',
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 gün önce
    },
    {
        id: 'txn-2',
        userId: 1,
        type: 'payment',
        amount: -25.00,
        balanceAfter: 225.50,
        description: 'Kafeterya Ödemesi',
        category: 'Yemek',
        paymentMethod: 'wallet',
        status: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 gün önce
    },
    {
        id: 'txn-3',
        userId: 1,
        type: 'payment',
        amount: -5.50,
        balanceAfter: 220.00,
        description: 'Kütüphane Baskı',
        category: 'Kırtasiye',
        paymentMethod: 'wallet',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 gün önce
    },
    {
        id: 'txn-4',
        userId: 1,
        type: 'deposit',
        amount: 100.00,
        balanceAfter: 320.00,
        description: 'Bakiye Yükleme',
        category: 'Yükleme',
        paymentMethod: 'credit_card',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 gün önce
    },
    {
        id: 'txn-5',
        userId: 1,
        type: 'payment',
        amount: -12.90,
        balanceAfter: 307.10,
        description: 'Kampüs Market',
        category: 'Alışveriş',
        paymentMethod: 'wallet',
        status: 'completed',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 saat önce
    },
    {
        id: 'txn-6',
        userId: 1,
        type: 'deposit',
        amount: 0.00,
        balanceAfter: 307.10,
        description: 'Yükleme Hatası',
        category: 'Yükleme',
        paymentMethod: 'credit_card',
        status: 'failed',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 saat önce
    },
    {
        id: 'txn-7',
        userId: 1,
        type: 'deposit',
        amount: 75.00,
        balanceAfter: 382.10,
        description: 'Bakiye Yükleme',
        category: 'Yükleme',
        paymentMethod: 'debit_card',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 saat önce
    },
    {
        id: 'txn-8',
        userId: 1,
        type: 'payment',
        amount: -20.00,
        balanceAfter: 362.10,
        description: 'Kantin - İçecek',
        category: 'Yemek',
        paymentMethod: 'wallet',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 saat önce
    }
];

// Güncel bakiyeyi hesapla
function calculateCurrentBalance() {
    const completedTransactions = walletTransactions.filter(t => t.status === 'completed');
    const initialBalance = 150.50;
    return completedTransactions.reduce((balance, txn) => balance + txn.amount, initialBalance);
}

/**
 * Bakiye getir
 */
export function getMockBalance() {
    walletBalance = calculateCurrentBalance();
    return {
        balance: walletBalance,
        currency: 'TRY',
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Para yükleme işlemi başlat
 * @param {object} data - { amount, paymentMethod }
 */
export function createMockDeposit(data) {
    const { amount, paymentMethod } = data;
    
    if (!amount || amount <= 0) {
        throw new Error('Geçerli bir tutar giriniz');
    }
    
    if (amount < 10) {
        throw new Error('Minimum yükleme tutarı 10 TL\'dir');
    }
    
    if (amount > 5000) {
        throw new Error('Maksimum yükleme tutarı 5000 TL\'dir');
    }
    
    // Yeni işlem oluştur
    const newBalance = walletBalance + amount;
    const transaction = {
        id: `txn-${Date.now()}`,
        userId: 1,
        type: 'deposit',
        amount: amount,
        balanceAfter: newBalance,
        description: 'Bakiye Yükleme',
        category: 'Yükleme',
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    walletTransactions.unshift(transaction);
    
    // Simüle edilmiş ödeme gateway yönlendirmesi
    return {
        transactionId: transaction.id,
        amount: amount,
        paymentMethod: paymentMethod,
        redirectUrl: `/payment/process?transactionId=${transaction.id}&amount=${amount}&method=${paymentMethod}`,
        message: 'Ödeme sayfasına yönlendiriliyorsunuz...'
    };
}

/**
 * Ödeme yöntemi adını getir
 */
function getPaymentMethodName(method) {
    const methods = {
        credit_card: 'Kredi Kartı',
        debit_card: 'Banka Kartı',
        bank_transfer: 'Banka Havalesi',
        mobile_payment: 'Mobil Ödeme'
    };
    return methods[method] || method;
}

/**
 * İşlem geçmişini getir
 * @param {object} params - { page, pageSize, type, status }
 */
export function getMockTransactions(params = {}) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const type = params.type; // deposit, payment, withdrawal
    const status = params.status; // completed, pending, failed
    
    let filtered = [...walletTransactions];
    
    // Filtreleme
    if (type) {
        filtered = filtered.filter(t => t.type === type);
    }
    
    if (status) {
        filtered = filtered.filter(t => t.status === status);
    }
    
    // Tarihe göre sırala (yeni -> eski)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Sayfalama
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = filtered.slice(startIndex, endIndex);
    
    return {
        data,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
    };
}

/**
 * Ödeme işlemini tamamla (simülasyon)
 * @param {string} transactionId
 */
export function completeMockPayment(transactionId) {
    const transaction = walletTransactions.find(t => t.id === transactionId);
    
    if (!transaction) {
        throw new Error('İşlem bulunamadı');
    }
    
    if (transaction.status !== 'pending') {
        throw new Error('Bu işlem zaten tamamlanmış');
    }
    
    // İşlemi tamamla
    transaction.status = 'completed';
    walletBalance = transaction.balanceAfter;
    
    return transaction;
}

export default {
    getMockBalance,
    createMockDeposit,
    getMockTransactions,
    completeMockPayment
};

