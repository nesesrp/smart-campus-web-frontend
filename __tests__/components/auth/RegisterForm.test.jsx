import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { register } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Mocks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/services/auth.service', () => ({
    register: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@/components/auth/PasswordStrengthMeter', () => {
    return function MockPasswordStrengthMeter() {
        const React = require('react');
        return React.createElement('div', { 'data-testid': 'strength-meter' }, 'Strength Meter');
    };
});

describe('RegisterForm', () => {
    const mockRouter = { push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue(mockRouter);
    });

    it('should render basic fields initially', () => {
        render(<RegisterForm />);

        expect(screen.getByPlaceholderText('Adınız Soyadınız')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('ornek@smartcampus.edu')).toBeInTheDocument();
        expect(screen.getByText('Kullanıcı Tipi')).toBeInTheDocument();

        expect(screen.getByText('Öğrenci')).toBeInTheDocument();
        expect(screen.getByText('Akademisyen')).toBeInTheDocument();
    });

    it('should show student specific fields when Student is selected', async () => {
        render(<RegisterForm />);

        const studentBtn = screen.getByText('Öğrenci');
        await userEvent.click(studentBtn);

        expect(await screen.findByPlaceholderText('2024001234')).toBeInTheDocument(); // Student Number placeholder
        expect(screen.queryByPlaceholderText('AKD2024001')).not.toBeInTheDocument(); // Employee Number placeholder
    });

    it('should show faculty specific fields when Faculty is selected', async () => {
        render(<RegisterForm />);

        const facultyBtn = screen.getByText('Akademisyen');
        await userEvent.click(facultyBtn);

        expect(await screen.findByPlaceholderText('AKD2024001')).toBeInTheDocument();
        expect(screen.getByText('Ünvan')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('2024001234')).not.toBeInTheDocument();
    });

    it('should call register service with student data', async () => {
        register.mockResolvedValue({ success: true });
        render(<RegisterForm />);

        // Select Student
        await userEvent.click(screen.getByText('Öğrenci'));

        // Fill fields
        await userEvent.type(screen.getByPlaceholderText(/Adınız Soyadınız/i), 'Ali Veli');
        await userEvent.type(screen.getByPlaceholderText(/ornek@smartcampus.edu/i), 'ali@edu.tr');

        // Select Department (id: 1)
        // Need to find the select element. Since we have multiple, and it appears dynamically.
        // It's the one with option "Bilgisayar Mühendisliği" (from mockDb json if imported in component, or real file read)
        // The component uses `import mockDb from '@/mocks/data/db.json';`
        // We verified db.json has "Bilgisayar Mühendisliği" with id 1

        await waitFor(() => expect(screen.queryByText('Bölüm')).toBeInTheDocument());

        // Using fireEvent for Select if userEvent is tricky with "combobox" role in jsdom sometimes
        // But let's try finding by role.
        const selects = screen.getAllByRole('combobox');
        // Filter the one that has Department options.
        // Or just the first one usually.
        // Let's iterate or assume the first one after user type selection.
        const departmentSelect = selects.find(select => select.innerHTML.includes('1'));

        if (departmentSelect) {
            await userEvent.selectOptions(departmentSelect, '1');
        } else {
            // Fallback: try to select on the first visible select
            await userEvent.selectOptions(selects[0], '1');
        }

        // Student Number
        await userEvent.type(screen.getByPlaceholderText('2024001234'), '12345');

        // Password
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        await userEvent.type(passwordInputs[0], 'Password123!');
        await userEvent.type(passwordInputs[1], 'Password123!'); // Confirm

        const submitBtn = screen.getByRole('button', { name: /Kayıt Ol/i });
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith(expect.objectContaining({
                fullName: 'Ali Veli',
                email: 'ali@edu.tr',
                userType: 'Student',
                departmentId: 1,
                studentNumber: '12345',
                password: 'Password123!',
            }));
            expect(mockRouter.push).toHaveBeenCalledWith('/login?registered=true');
        });
    });

    it('should handle registration error', async () => {
        register.mockRejectedValue(new Error('Kayıt başarısız'));
        render(<RegisterForm />);

        // Fill minimum required fields to trigger submit
        await userEvent.click(screen.getByText('Öğrenci'));
        await userEvent.type(screen.getByPlaceholderText(/Adınız Soyadınız/i), 'Ali Veli');
        await userEvent.type(screen.getByPlaceholderText(/ornek@smartcampus.edu/i), 'ali@edu.tr');

        const selects = screen.getAllByRole('combobox');
        const departmentSelect = selects.find(select => select.innerHTML.includes('1')) || selects[0];
        await userEvent.selectOptions(departmentSelect, '1');

        await userEvent.type(screen.getByPlaceholderText('2024001234'), '12345');

        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        await userEvent.type(passwordInputs[0], 'Password123!');
        await userEvent.type(passwordInputs[1], 'Password123!');

        const submitBtn = screen.getByRole('button', { name: /Kayıt Ol/i });
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(register).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Kayıt başarısız', expect.anything());
        });
    });
});
