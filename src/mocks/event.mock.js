/**
 * Event Service Mock Data
 * Event Management için sahte veriler
 * Part 3 - Event Management
 */

// In-memory store
let mockEventsStore = [];

// Örnek etkinlikleri yükle
function initializeMockEvents() {
    if (mockEventsStore.length === 0) {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        mockEventsStore = [
            {
                id: 'event-1',
                title: 'Teknoloji Konferansı 2024',
                description: 'Yapay zeka, blockchain ve bulut bilişim konularında uzman konuşmacılar ile teknoloji dünyasının geleceğini keşfedin.',
                category: 'conference',
                date: nextWeek.toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '17:00',
                location: 'Konferans Salonu A',
                capacity: 200,
                registeredCount: 145,
                registrationDeadline: new Date(nextWeek.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 'event-2',
                title: 'React Workshop',
                description: 'Modern React geliştirme teknikleri, hooks, context API ve state management konularında pratik workshop.',
                category: 'workshop',
                date: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '14:00',
                endTime: '18:00',
                location: 'Bilgisayar Laboratuvarı 1',
                capacity: 30,
                registeredCount: 28,
                registrationDeadline: new Date(nextWeek.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 'event-3',
                title: 'Kampüs Festivali',
                description: 'Müzik, dans, yemek ve eğlence dolu bir gün. Tüm öğrenciler davetlidir!',
                category: 'social',
                date: new Date(nextMonth.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '10:00',
                endTime: '22:00',
                location: 'Kampüs Merkez Alanı',
                capacity: 1000,
                registeredCount: 756,
                registrationDeadline: new Date(nextMonth.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 'event-4',
                title: 'Basketbol Turnuvası',
                description: 'Fakülteler arası basketbol turnuvası. Final maçı ve ödül töreni.',
                category: 'sports',
                date: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '15:00',
                endTime: '19:00',
                location: 'Spor Salonu',
                capacity: 500,
                registeredCount: 423,
                registrationDeadline: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 'event-5',
                title: 'Startup Pitch Day',
                description: 'Öğrenci girişimciler projelerini sunacak. Jüri değerlendirmesi ve ödüller.',
                category: 'conference',
                date: new Date(nextMonth.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '13:00',
                endTime: '17:00',
                location: 'İnovasyon Merkezi',
                capacity: 150,
                registeredCount: 150,
                registrationDeadline: new Date(nextMonth.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 'event-6',
                title: 'Python ile Veri Analizi',
                description: 'Pandas, NumPy ve Matplotlib kullanarak veri analizi workshop\'u.',
                category: 'workshop',
                date: new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '10:00',
                endTime: '16:00',
                location: 'Bilgisayar Laboratuvarı 2',
                capacity: 25,
                registeredCount: 18,
                registrationDeadline: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 'event-7',
                title: 'Öğrenci Konseri',
                description: 'Müzik kulübü öğrencilerinin performansı. Tüm kampüs davetlidir.',
                category: 'social',
                date: new Date(nextWeek.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '19:00',
                endTime: '21:00',
                location: 'Kültür Merkezi',
                capacity: 300,
                registeredCount: 234,
                registrationDeadline: new Date(nextWeek.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            },
            {
                id: 'event-8',
                title: 'Futbol Maçı: Mühendislik vs İşletme',
                description: 'Fakülteler arası dostluk maçı. Seyirciler davetlidir.',
                category: 'sports',
                date: new Date(nextWeek.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: '16:00',
                endTime: '18:00',
                location: 'Futbol Sahası',
                capacity: 800,
                registeredCount: 567,
                registrationDeadline: new Date(nextWeek.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isPaid: false,
                price: 0,
                status: 'upcoming',
                createdAt: new Date().toISOString()
            }
        ];
    }
}

/**
 * Etkinlik listesi getir (mock)
 * @param {object} params - { category, date, search }
 */
export function getMockEvents(params = {}) {
    initializeMockEvents();
    
    let events = [...mockEventsStore];
    
    // Category filter
    if (params.category) {
        events = events.filter(e => e.category === params.category);
    }
    
    // Date filter (upcoming events)
    if (params.date) {
        const filterDate = new Date(params.date);
        filterDate.setHours(0, 0, 0, 0);
        events = events.filter(e => {
            const eventDate = new Date(e.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= filterDate;
        });
    } else {
        // Default: only upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        events = events.filter(e => {
            const eventDate = new Date(e.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
        });
    }
    
    // Search filter
    if (params.search) {
        const searchLower = params.search.toLowerCase();
        events = events.filter(e => 
            e.title.toLowerCase().includes(searchLower) ||
            e.description.toLowerCase().includes(searchLower)
        );
    }
    
    // Sort by date
    events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
    
    return events;
}

/**
 * Etkinlik detayı getir (mock)
 * @param {string} eventId - Etkinlik ID
 */
export function getMockEventById(eventId) {
    initializeMockEvents();
    return mockEventsStore.find(e => e.id === eventId);
}

// In-memory registrations store
let mockRegistrationsStore = [];

/**
 * Kullanıcının kayıt olduğu etkinlikleri getir (mock)
 * @param {number} userId - Kullanıcı ID
 */
export function getMockMyEvents(userId = 1) {
    initializeMockEvents();
    
    // Kullanıcının kayıtlarını bul
    const registrations = mockRegistrationsStore.filter(r => r.userId === userId);
    
    // Her kayıt için etkinlik bilgilerini ekle
    const myEvents = registrations.map(reg => {
        const event = getMockEventById(reg.eventId);
        return {
            ...reg,
            event: event
        };
    });
    
    // Tarihe göre sırala (gelecek etkinlikler önce)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    myEvents.sort((a, b) => {
        if (!a.event || !b.event) return 0;
        const dateA = new Date(a.event.date);
        const dateB = new Date(b.event.date);
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);
        
        // Gelecek etkinlikler önce
        const aIsFuture = dateA >= today;
        const bIsFuture = dateB >= today;
        
        if (aIsFuture && !bIsFuture) return -1;
        if (!aIsFuture && bIsFuture) return 1;
        
        // Aynı kategorideyse tarihe göre sırala
        return dateA - dateB;
    });
    
    return myEvents;
}

/**
 * Kayıt iptal et (mock)
 * @param {string} registrationId - Kayıt ID
 */
export function cancelMockRegistration(registrationId) {
    const registration = mockRegistrationsStore.find(r => r.id === registrationId);
    
    if (!registration) {
        throw new Error('Kayıt bulunamadı');
    }
    
    // Etkinlik kayıt sayısını azalt
    const event = getMockEventById(registration.eventId);
    if (event) {
        event.registeredCount = Math.max(0, event.registeredCount - 1);
    }
    
    // Kaydı sil
    mockRegistrationsStore = mockRegistrationsStore.filter(r => r.id !== registrationId);
    
    return registration;
}

/**
 * QR kod ile kayıt doğrula (mock)
 * @param {string} qrCode - QR kod
 */
export function validateEventRegistration(qrCode) {
    const registration = mockRegistrationsStore.find(r => r.qrCode === qrCode);
    
    if (!registration) {
        throw new Error('Geçersiz QR kod');
    }
    
    const event = getMockEventById(registration.eventId);
    
    if (!event) {
        throw new Error('Etkinlik bulunamadı');
    }
    
    // Etkinlik tarihini kontrol et
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate.getTime() !== today.getTime()) {
        throw new Error('Bu QR kod bugün için geçerli değil');
    }
    
    return {
        registration,
        event,
        user: {
            id: registration.userId,
            fullName: 'Ahmet Yılmaz',
            studentNumber: '2021001234',
            email: 'ahmet.yilmaz@university.edu.tr'
        }
    };
}

/**
 * Check-in yap (mock)
 * @param {string} qrCode - QR kod
 */
export function checkInEvent(qrCode) {
    const registration = mockRegistrationsStore.find(r => r.qrCode === qrCode);
    
    if (!registration) {
        throw new Error('Kayıt bulunamadı');
    }
    
    if (registration.checkedIn) {
        throw new Error('Bu kayıt zaten check-in yapılmış');
    }
    
    registration.checkedIn = true;
    registration.checkedInAt = new Date().toISOString();
    
    return registration;
}

/**
 * Etkinlik katılımcı sayısını getir (mock)
 * @param {string} eventId - Etkinlik ID
 */
export function getEventAttendeeCount(eventId) {
    const checkedInCount = mockRegistrationsStore.filter(
        r => r.eventId === eventId && r.checkedIn
    ).length;
    
    const totalCount = mockRegistrationsStore.filter(
        r => r.eventId === eventId
    ).length;
    
    return {
        checkedIn: checkedInCount,
        total: totalCount
    };
}

// Registration store'u export et (register route'unda kullanılacak)
export { mockRegistrationsStore };

export default {
    getMockEvents,
    getMockEventById,
    getMockMyEvents,
    cancelMockRegistration,
    validateEventRegistration,
    checkInEvent,
    getEventAttendeeCount
};

