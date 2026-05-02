import { z } from 'zod';

/**
 * Register Form Validation Schema
 * Backend'deki RegisterUserDto yapısına uygun
 * Conditional validation: Student vs Faculty
 */
export const registerSchema = z.object({
    fullName: z
        .string({ required_error: 'Ad soyad zorunludur' })
        .min(1, 'Ad soyad zorunludur')
        .min(2, 'Ad soyad en az 2 karakter olmalıdır')
        .max(100, 'Ad soyad en fazla 100 karakter olabilir'),

    email: z
        .string({ required_error: 'Email zorunludur' })
        .min(1, 'Email zorunludur')
        .email('Geçerli bir email adresi giriniz'),

    password: z
        .string({ required_error: 'Şifre zorunludur' })
        .min(1, 'Şifre zorunludur')
        .min(8, 'Şifre en az 8 karakter olmalıdır')
        .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
        .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
        .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),

    confirmPassword: z
        .string({ required_error: 'Şifre tekrarı zorunludur' })
        .min(1, 'Şifre tekrarı zorunludur'),

    userType: z.enum(['Student', 'Faculty'], {
        required_error: 'Kullanıcı tipi seçiniz',
        message: 'Lütfen Öğrenci veya Akademisyen seçiniz',
    }),

    // Student fields (conditional)
    studentNumber: z
        .string()
        .optional(),

    // Faculty fields (conditional)
    employeeNumber: z
        .string()
        .optional(),

    title: z
        .string()
        .optional(),

    officeLocation: z
        .string()
        .optional(),

    // Common - Backend int bekliyor
    departmentId: z
        .coerce.number()
        .optional(),

}).superRefine((data, ctx) => {
    // Password confirmation check
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Şifreler eşleşmiyor',
            path: ['confirmPassword'],
        });
    }

    // Student validation
    if (data.userType === 'Student') {
        if (!data.studentNumber || data.studentNumber.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Öğrenci numarası zorunludur',
                path: ['studentNumber'],
            });
        }
        if (!data.departmentId || data.departmentId <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Bölüm seçimi zorunludur',
                path: ['departmentId'],
            });
        }
    }

    // Faculty validation
    if (data.userType === 'Faculty') {
        if (!data.employeeNumber || data.employeeNumber.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Personel numarası zorunludur',
                path: ['employeeNumber'],
            });
        }
        if (!data.title || data.title.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Ünvan zorunludur',
                path: ['title'],
            });
        }
        if (!data.departmentId || data.departmentId <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Bölüm seçimi zorunludur',
                path: ['departmentId'],
            });
        }
    }
});

/**
 * Register form default values
 */
export const registerDefaultValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: undefined,
    studentNumber: '',
    employeeNumber: '',
    title: '',
    officeLocation: '',
    departmentId: 0,
};

/**
 * User type options
 */
export const userTypeOptions = [
    { value: 'Student', label: 'Öğrenci' },
    { value: 'Faculty', label: 'Akademisyen' },
];

/**
 * Faculty title options
 */
export const facultyTitleOptions = [
    { value: 'Araştırma Görevlisi', label: 'Araştırma Görevlisi' },
    { value: 'Öğretim Görevlisi', label: 'Öğretim Görevlisi' },
    { value: 'Doktor Öğretim Üyesi', label: 'Dr. Öğr. Üyesi' },
    { value: 'Doçent', label: 'Doçent' },
    { value: 'Profesör', label: 'Profesör' },
];
