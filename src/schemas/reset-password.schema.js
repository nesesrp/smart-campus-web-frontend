import { z } from 'zod';

/**
 * Reset Password Form Validation Schema
 */
export const resetPasswordSchema = z.object({
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
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
});

/**
 * Reset password form default values
 */
export const resetPasswordDefaultValues = {
    password: '',
    confirmPassword: '',
};
