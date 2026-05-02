import { z } from 'zod';

/**
 * Forgot Password Form Validation Schema
 */
export const forgotPasswordSchema = z.object({
    email: z
        .string({ required_error: 'Email zorunludur' })
        .min(1, 'Email zorunludur')
        .email('Geçerli bir email adresi giriniz'),
});

/**
 * Forgot password form default values
 */
export const forgotPasswordDefaultValues = {
    email: '',
};
