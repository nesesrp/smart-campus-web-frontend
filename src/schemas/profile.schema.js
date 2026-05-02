import { z } from 'zod';

/**
 * Profile Edit Form Validation Schema
 */
export const profileSchema = z.object({
    fullName: z
        .string({ required_error: 'Ad soyad zorunludur' })
        .min(1, 'Ad soyad zorunludur')
        .min(2, 'Ad soyad en az 2 karakter olmalıdır')
        .max(100, 'Ad soyad en fazla 100 karakter olabilir'),

    phoneNumber: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^(\+90|0)?[0-9]{10}$/.test(val.replace(/\s/g, '')),
            'Geçerli bir telefon numarası giriniz'
        ),

    // Faculty specific fields
    officeLocation: z
        .string()
        .max(100, 'Ofis konumu en fazla 100 karakter olabilir')
        .optional(),
});

/**
 * Profile form default values
 */
export const profileDefaultValues = {
    fullName: '',
    phoneNumber: '',
    officeLocation: '',
};
