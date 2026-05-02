import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/auth/LoginForm';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Mocks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/services/auth.service', () => ({
    login: jest.fn(),
}));

jest.mock('@/stores/auth.store', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('LoginForm', () => {
    const mockRouter = { push: jest.fn() };
    const mockAuthStore = { login: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue(mockRouter);
        useAuthStore.mockReturnValue(mockAuthStore);
    });

    it('should render login form', () => {
        render(<LoginForm />);

        expect(screen.getByPlaceholderText(/ornek@smartcampus.edu/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Giriş Yap/i })).toBeInTheDocument();
    });

    it('should toggle password visibility', async () => {
        render(<LoginForm />);
        const passwordInput = screen.getByPlaceholderText(/••••••••/);

        expect(passwordInput).toHaveAttribute('type', 'password');

        const buttons = screen.getAllByRole('button');
        const toggleBtn = buttons.find(btn => !btn.textContent?.includes('Giriş Yap'));

        if (toggleBtn) {
             await userEvent.click(toggleBtn);
             expect(passwordInput).toHaveAttribute('type', 'text');

             await userEvent.click(toggleBtn);
             expect(passwordInput).toHaveAttribute('type', 'password');
        }
    });

    it('should call login service on valid submission', async () => {
        login.mockResolvedValue({
            success: true,
            data: {
                user: { fullName: 'John Doe' },
                accessToken: 'token',
                refreshToken: 'refresh'
            }
        });

        render(<LoginForm />);

        const emailInput = screen.getByPlaceholderText(/ornek@smartcampus.edu/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/);

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');

        const submitBtn = screen.getByRole('button', { name: /Giriş Yap/i });
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
        });

        await waitFor(() => {
            expect(mockAuthStore.login).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should handle login error', async () => {
        login.mockRejectedValue(new Error('Login failed'));

        render(<LoginForm />);

        const emailInput = screen.getByPlaceholderText(/ornek@smartcampus.edu/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/);

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');

        await userEvent.click(screen.getByRole('button', { name: /Giriş Yap/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
            expect(mockAuthStore.login).not.toHaveBeenCalled();
            expect(mockRouter.push).not.toHaveBeenCalled();
        });
    });
});
