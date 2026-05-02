/**
 * Academic Mock Data
 * API bağlantısı yapılana kadar kullanılacak sahte veriler
 */

export const mockDepartments = [
    { id: 1, name: 'Bilgisayar Mühendisliği', code: 'CENG', facultyName: 'Mühendislik Fakültesi' },
    { id: 2, name: 'Elektrik-Elektronik Mühendisliği', code: 'EEE', facultyName: 'Mühendislik Fakültesi' },
    { id: 3, name: 'Endüstri Mühendisliği', code: 'IE', facultyName: 'Mühendislik Fakültesi' },
    { id: 4, name: 'Makine Mühendisliği', code: 'ME', facultyName: 'Mühendislik Fakültesi' },
    { id: 5, name: 'İnşaat Mühendisliği', code: 'CE', facultyName: 'Mühendislik Fakültesi' },
];

export const mockCourses = [
    {
        id: 1,
        code: 'CENG101',
        name: 'Programlamaya Giriş',
        description: 'Temel programlama kavramları ve algoritma geliştirme',
        credits: 4,
        ects: 6,
        department: mockDepartments[0],
        prerequisites: [],
    },
    {
        id: 2,
        code: 'CENG201',
        name: 'Veri Yapıları ve Algoritmalar',
        description: 'Veri yapıları, algoritma analizi ve karmaşıklık',
        credits: 4,
        ects: 6,
        department: mockDepartments[0],
        prerequisites: [{ id: 1, code: 'CENG101', name: 'Programlamaya Giriş' }],
    },
    {
        id: 3,
        code: 'CENG301',
        name: 'Veritabanı Sistemleri',
        description: 'İlişkisel veritabanı tasarımı ve SQL',
        credits: 3,
        ects: 5,
        department: mockDepartments[0],
        prerequisites: [],
    },
    {
        id: 4,
        code: 'EEE201',
        name: 'Devre Analizi',
        description: 'Elektrik devrelerinin analizi ve tasarımı',
        credits: 4,
        ects: 6,
        department: mockDepartments[1],
        prerequisites: [],
    },
    {
        id: 5,
        code: 'IE301',
        name: 'Yöneylem Araştırması',
        description: 'Optimizasyon teknikleri ve karar verme',
        credits: 3,
        ects: 5,
        department: mockDepartments[2],
        prerequisites: [],
    },
    {
        id: 6,
        code: 'ME201',
        name: 'Termodinamik',
        description: 'Enerji ve ısı transferi prensipleri',
        credits: 4,
        ects: 6,
        department: mockDepartments[3],
        prerequisites: [],
    },
];

export const mockSections = [
    {
        id: 1,
        courseId: 1,
        course: mockCourses[0],
        sectionNumber: 1,
        semester: 'Güz',
        year: 2024,
        instructor: { id: 1, fullName: 'Prof. Dr. Ahmet Yılmaz', email: 'ahmet.yilmaz@smartcampus.edu' },
        capacity: 50,
        enrolledCount: 35,
        schedule: { day: 'Pazartesi', time: '09:00-11:00', room: 'A-101' },
    },
    {
        id: 2,
        courseId: 1,
        course: mockCourses[0],
        sectionNumber: 2,
        semester: 'Güz',
        year: 2024,
        instructor: { id: 2, fullName: 'Doç. Dr. Ayşe Demir', email: 'ayse.demir@smartcampus.edu' },
        capacity: 50,
        enrolledCount: 48,
        schedule: { day: 'Çarşamba', time: '14:00-16:00', room: 'A-102' },
    },
    {
        id: 3,
        courseId: 2,
        course: mockCourses[1],
        sectionNumber: 1,
        semester: 'Güz',
        year: 2024,
        instructor: { id: 3, fullName: 'Prof. Dr. Mehmet Kaya', email: 'mehmet.kaya@smartcampus.edu' },
        capacity: 40,
        enrolledCount: 32,
        schedule: { day: 'Salı', time: '10:00-12:00', room: 'B-201' },
    },
];

export const mockEnrollments = [
    {
        id: 1,
        student: { id: 1, fullName: 'Ali Veli', studentNumber: '2023001' },
        section: mockSections[0],
        course: mockCourses[0],
        status: 'Kayıtlı',
        enrollmentDate: '2024-09-15',
        attendancePercentage: 85.5,
        midtermGrade: 75,
        finalGrade: 80,
        letterGrade: 'B',
        gradePoint: 3.0,
    },
    {
        id: 2,
        student: { id: 1, fullName: 'Ali Veli', studentNumber: '2023001' },
        section: mockSections[2],
        course: mockCourses[1],
        status: 'Kayıtlı',
        enrollmentDate: '2024-09-15',
        attendancePercentage: 92.0,
        midtermGrade: 88,
        finalGrade: 90,
        letterGrade: 'A',
        gradePoint: 4.0,
    },
    {
        id: 3,
        student: { id: 1, fullName: 'Ali Veli', studentNumber: '2023001' },
        section: { ...mockSections[1], course: mockCourses[3] },
        course: mockCourses[3],
        status: 'Kayıtlı',
        enrollmentDate: '2024-09-15',
        attendancePercentage: 78.0,
        midtermGrade: 70,
        finalGrade: 75,
        letterGrade: 'C',
        gradePoint: 2.0,
    },
];

export const mockGrades = mockEnrollments.map((enrollment) => ({
    id: enrollment.id,
    course: enrollment.course,
    section: {
        ...enrollment.section,
        sectionNumber: enrollment.section?.sectionNumber || 1,
        semester: enrollment.section?.semester || 'Güz',
        year: enrollment.section?.year || 2024,
        instructor: enrollment.section?.instructor || { fullName: 'Prof. Dr. Öğretim Üyesi' },
    },
    midtermGrade: enrollment.midtermGrade,
    finalGrade: enrollment.finalGrade,
    letterGrade: enrollment.letterGrade,
    gradePoint: enrollment.gradePoint,
}));

export const mockAttendance = [
    {
        id: 1,
        course: mockCourses[0],
        section: mockSections[0],
        totalSessions: 14,
        attendedSessions: 12,
        excusedAbsences: 1,
        attendancePercentage: 85.7,
        // Haftalık yoklama trendi (son 8 hafta)
        attendanceTrend: [
            { week: 1, date: '2024-09-15', percentage: 100 },
            { week: 2, date: '2024-09-22', percentage: 100 },
            { week: 3, date: '2024-09-29', percentage: 100 },
            { week: 4, date: '2024-10-06', percentage: 50 },
            { week: 5, date: '2024-10-13', percentage: 100 },
            { week: 6, date: '2024-10-20', percentage: 100 },
            { week: 7, date: '2024-10-27', percentage: 50 },
            { week: 8, date: '2024-11-03', percentage: 100 },
        ],
    },
    {
        id: 2,
        course: mockCourses[1],
        section: mockSections[2],
        totalSessions: 14,
        attendedSessions: 13,
        excusedAbsences: 0,
        attendancePercentage: 92.9,
        // Haftalık yoklama trendi (son 8 hafta)
        attendanceTrend: [
            { week: 1, date: '2024-09-15', percentage: 100 },
            { week: 2, date: '2024-09-22', percentage: 100 },
            { week: 3, date: '2024-09-29', percentage: 100 },
            { week: 4, date: '2024-10-06', percentage: 100 },
            { week: 5, date: '2024-10-13', percentage: 100 },
            { week: 6, date: '2024-10-20', percentage: 100 },
            { week: 7, date: '2024-10-27', percentage: 50 },
            { week: 8, date: '2024-11-03', percentage: 100 },
        ],
    },
    {
        id: 3,
        course: mockCourses[3],
        totalSessions: 12,
        attendedSessions: 9,
        excusedAbsences: 1,
        attendancePercentage: 75.0,
        // Haftalık yoklama trendi (son 8 hafta)
        attendanceTrend: [
            { week: 1, date: '2024-09-15', percentage: 100 },
            { week: 2, date: '2024-09-22', percentage: 50 },
            { week: 3, date: '2024-09-29', percentage: 100 },
            { week: 4, date: '2024-10-06', percentage: 50 },
            { week: 5, date: '2024-10-13', percentage: 100 },
            { week: 6, date: '2024-10-20', percentage: 50 },
            { week: 7, date: '2024-10-27', percentage: 100 },
            { week: 8, date: '2024-11-03', percentage: 50 },
        ],
    },
];

export const mockAttendanceSessions = [
    {
        id: 1,
        section: mockSections[0],
        instructor: { id: 1, fullName: 'Prof. Dr. Ahmet Yılmaz' },
        date: '2024-12-10',
        startTime: '09:00',
        endTime: '11:00',
        latitude: 41.0082,
        longitude: 28.9784,
        geofenceRadius: 15,
        status: 'Aktif',
        classroom: { building: 'A', roomNumber: '101' },
    },
    {
        id: 2,
        section: mockSections[0],
        instructor: { id: 1, fullName: 'Prof. Dr. Ahmet Yılmaz' },
        date: '2024-12-12',
        startTime: '09:00',
        endTime: '11:00',
        latitude: 41.0082,
        longitude: 28.9784,
        geofenceRadius: 15,
        status: 'Kapatıldı',
        classroom: { building: 'A', roomNumber: '101' },
    },
];

export const mockAttendanceReport = {
    section: mockSections[0],
    totalStudents: 35,
    goodAttendance: 25,
    warningAttendance: 7,
    criticalAttendance: 3,
    students: [
        { id: 1, fullName: 'Ali Veli', studentNumber: '2023001', totalSessions: 14, attendedSessions: 12, attendancePercentage: 85.7 },
        { id: 2, fullName: 'Ayşe Yılmaz', studentNumber: '2023002', totalSessions: 14, attendedSessions: 10, attendancePercentage: 71.4 },
        { id: 3, fullName: 'Mehmet Demir', studentNumber: '2023003', totalSessions: 14, attendedSessions: 8, attendancePercentage: 57.1 },
    ],
};

export const mockExcuseRequests = [
    {
        id: 1,
        student: { id: 1, fullName: 'Ali Veli', studentNumber: '2023001' },
        session: mockAttendanceSessions[1],
        reason: 'Hastalık nedeniyle devamsızlık',
        documentUrl: '/documents/excuse1.pdf',
        status: 'Beklemede',
        createdAt: '2024-12-13',
    },
    {
        id: 2,
        student: { id: 2, fullName: 'Ayşe Yılmaz', studentNumber: '2023002' },
        session: mockAttendanceSessions[1],
        reason: 'Ailevi nedenler',
        documentUrl: '/documents/excuse2.pdf',
        status: 'Onaylandı',
        createdAt: '2024-12-12',
    },
];

