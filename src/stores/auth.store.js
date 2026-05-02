/**
 * Auth Store - Zustand
 * Global authentication state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setTokens: (accessToken, refreshToken) => set({
                accessToken,
                refreshToken,
                isAuthenticated: !!accessToken
            }),

            login: (userData, tokens) => set({
                user: userData,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                isAuthenticated: true,
            }),

            logout: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            }),

            setLoading: (isLoading) => set({ isLoading }),

            // Selectors
            getUser: () => get().user,
            getAccessToken: () => get().accessToken,
            getIsAuthenticated: () => get().isAuthenticated,
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
