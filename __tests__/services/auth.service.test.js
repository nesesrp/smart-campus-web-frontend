import authService, { login, register, verifyEmail, forgotPassword, resetPassword, refreshToken, logout, getCurrentUser, isAuthenticated } from '@/services/auth.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
  post: jest.fn(),
}));

describe('Auth Service', () => {
  const mockUser = { id: 1, email: 'test@example.com' };
  const mockTokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should call api and save tokens on success', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const response = { success: true, data: { ...mockTokens, user: mockUser } };
      apiClient.post.mockResolvedValue(response);

      const result = await login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(response);
      expect(localStorage.getItem('accessToken')).toBe(mockTokens.accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(mockTokens.refreshToken);
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
    });

    it('should not save tokens on failure', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const response = { success: false, message: 'Invalid credentials' };
      apiClient.post.mockResolvedValue(response);

      const result = await login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(response);
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('register', () => {
    it('should call register api', async () => {
      const userData = { email: 'test@example.com', password: 'password' };
      apiClient.post.mockResolvedValue({ success: true });

      await register(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
    });
  });

  describe('verifyEmail', () => {
    it('should call verify-email api', async () => {
      const userId = 'user-1';
      const token = 'valid-token';
      const params = new URLSearchParams({ userId, token });
      await verifyEmail(userId, token);
      expect(apiClient.post).toHaveBeenCalledWith(`/auth/verify-email?${params.toString()}`, {});
    });
  });

  describe('forgotPassword', () => {
    it('should call forgot-password api', async () => {
      const email = 'test@example.com';
      await forgotPassword(email);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', { email });
    });
  });

  describe('resetPassword', () => {
    it('should call reset-password api', async () => {
      const data = { token: 'token', newPassword: 'new', confirmPassword: 'new' };
      await resetPassword(data);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', data);
    });
  });

  describe('refreshToken', () => {
    it('should throw error if no refresh token in local storage', async () => {
      await expect(refreshToken()).rejects.toThrow('Refresh token bulunamadı');
    });

    it('should refresh tokens and update local storage on success', async () => {
      localStorage.setItem('refreshToken', 'old-refresh-token');
      const response = { success: true, data: { accessToken: 'new-access', refreshToken: 'new-refresh' } };
      apiClient.post.mockResolvedValue(response);

      await refreshToken();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'old-refresh-token' });
      expect(localStorage.getItem('accessToken')).toBe('new-access');
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh');
    });

    it('should not update tokens on failure', async () => {
      localStorage.setItem('refreshToken', 'old-refresh-token');
      const response = { success: false };
      apiClient.post.mockResolvedValue(response);

      await refreshToken();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'old-refresh-token' });
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call logout api and clear local storage', async () => {
      localStorage.setItem('accessToken', 'token');
      localStorage.setItem('refreshToken', 'ref-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      apiClient.post.mockResolvedValue({ success: true });

      await logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', { token: 'ref-token' });
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should clear local storage even if api fails', async () => {
      localStorage.setItem('accessToken', 'token');
      apiClient.post.mockRejectedValue(new Error('API Error'));

      try {
        await logout();
      } catch (e) {
        // ignore
      }

      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null if no user in local storage', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('should return parsed user object', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      expect(getCurrentUser()).toEqual(mockUser);
    });

    it('should return null if invalid json', () => {
      localStorage.setItem('user', 'invalid-json');
      expect(getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false if no access token', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true if access token exists', () => {
      localStorage.setItem('accessToken', 'some-token');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('default export', () => {
     it('should export all functions', () => {
         expect(authService.login).toBeDefined();
         expect(authService.logout).toBeDefined();
     });
  });
});
