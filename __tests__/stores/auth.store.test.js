import { act } from '@testing-library/react';
import { useAuthStore } from '@/stores/auth.store';

describe('Auth Store', () => {
    beforeEach(() => {
        localStorage.clear();
        // Reset state merging with initial values (do not replace functions)
        act(() => {
            useAuthStore.setState({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
            });
        });
    });

    it('should have initial state', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(false);
    });

    it('setUser should update user and isAuthenticated', () => {
        const user = { id: 1, name: 'Test User' };

        act(() => {
            useAuthStore.getState().setUser(user);
        });

        const state = useAuthStore.getState();
        expect(state.user).toEqual(user);
        expect(state.isAuthenticated).toBe(true);

        // Reset user
        act(() => {
            useAuthStore.getState().setUser(null);
        });
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('setTokens should update tokens and isAuthenticated', () => {
        const accessToken = 'access';
        const refreshToken = 'refresh';

        act(() => {
            useAuthStore.getState().setTokens(accessToken, refreshToken);
        });

        const state = useAuthStore.getState();
        expect(state.accessToken).toBe(accessToken);
        expect(state.refreshToken).toBe(refreshToken);
        expect(state.isAuthenticated).toBe(true);
    });

    it('login should update all auth state', () => {
        const user = { id: 1 };
        const tokens = { accessToken: 'acc', refreshToken: 'ref' };

        act(() => {
            useAuthStore.getState().login(user, tokens);
        });

        const state = useAuthStore.getState();
        expect(state.user).toEqual(user);
        expect(state.accessToken).toBe('acc');
        expect(state.refreshToken).toBe('ref');
        expect(state.isAuthenticated).toBe(true);
    });

    it('logout should reset state', () => {
        useAuthStore.setState({
            user: { id: 1 },
            accessToken: 'token',
            isAuthenticated: true
        });

        act(() => {
            useAuthStore.getState().logout();
        });

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.accessToken).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('setLoading should update isLoading', () => {
        act(() => {
            useAuthStore.getState().setLoading(true);
        });
        expect(useAuthStore.getState().isLoading).toBe(true);
    });

    it('getters should return correct values', () => {
         const user = { id: 123 };
         useAuthStore.setState({
             user,
             accessToken: 'token',
             isAuthenticated: true
         });

         const state = useAuthStore.getState();
         expect(state.getUser()).toEqual(user);
         expect(state.getAccessToken()).toBe('token');
         expect(state.getIsAuthenticated()).toBe(true);
    });
});
