import { z } from 'zod';

/**
 * Login Form Validation Schema
 * Backend'deki LoginDto yapısına uygun
 */
export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email zorunludur' })
        .min(1, 'Email zorunludur')
        .email('Geçerli bir email adresi giriniz'),

    password: z
        .string({ required_error: 'Şifre zorunludur' })
        .min(1, 'Şifre zorunludur')
        .min(8, 'Şifre en az 8 karakter olmalıdır'),
});

/**
 * Login form default values
 */
export const loginDefaultValues = {
    email: '',
    password: '',
};
