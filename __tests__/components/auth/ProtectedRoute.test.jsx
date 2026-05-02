import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

// Mocks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}));

jest.mock('@/stores/auth.store', () => ({
    useAuthStore: jest.fn(),
}));

describe('ProtectedRoute', () => {
    const mockRouter = { push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue(mockRouter);
        usePathname.mockReturnValue('/protected-page');
    });

    it('should show loading initially', () => {
        useAuthStore.mockReturnValue({ isAuthenticated: false, user: null });
        render(<ProtectedRoute>Content</ProtectedRoute>);
        expect(screen.getByText('Yetkilendirme kontrol ediliyor...')).toBeInTheDocument();
    });

    it('should redirect to login if not authenticated', async () => {
        useAuthStore.mockReturnValue({ isAuthenticated: false, user: null });
        render(<ProtectedRoute>Content</ProtectedRoute>);

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=%2Fprotected-page');
        }, { timeout: 1500 });
    });

    it('should redirect to dashboard if authenticated but unauthorized role', async () => {
        useAuthStore.mockReturnValue({
            isAuthenticated: true,
            user: { role: 'Student' }
        });

        render(<ProtectedRoute requiredRoles={['Admin']}>Content</ProtectedRoute>);

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
        }, { timeout: 1500 });
    });

    it('should render children if authenticated and authorized', async () => {
        useAuthStore.mockReturnValue({
            isAuthenticated: true,
            user: { role: 'Student' }
        });

        render(<ProtectedRoute requiredRoles={['Student']}>Secret Content</ProtectedRoute>);

        await waitFor(() => {
            expect(screen.getByText('Secret Content')).toBeInTheDocument();
        }, { timeout: 1500 });
    });

    it('should render children if authenticated and no roles required', async () => {
        useAuthStore.mockReturnValue({
            isAuthenticated: true,
            user: { role: 'Student' }
        });

        render(<ProtectedRoute>Secret Content</ProtectedRoute>);

        await waitFor(() => {
            expect(screen.getByText('Secret Content')).toBeInTheDocument();
        }, { timeout: 1500 });
    });
});
