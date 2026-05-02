import * as userService from '@/services/user.service';
import apiClient from '@/services/api-client';

// Mock api-client
// Note: apiClient is default export in user.service source import, but usage is `apiClient.get`.
// So we mock the default export of api-client module.
jest.mock('@/services/api-client', () => ({
    get: jest.fn(),
    put: jest.fn(),
    postFormData: jest.fn(),
}));

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getProfile should call api', async () => {
        await userService.getProfile();
        expect(apiClient.get).toHaveBeenCalledWith('/users/me');
    });

    it('updateProfile should call api', async () => {
        const data = { name: 'Test' };
        await userService.updateProfile(data);
        expect(apiClient.put).toHaveBeenCalledWith('/users/me', data);
    });

    it('uploadProfilePicture should call api with form data', async () => {
        const file = new File(['content'], 'test.png', { type: 'image/png' });
        await userService.uploadProfilePicture(file);

        expect(apiClient.postFormData).toHaveBeenCalled();
        const callArgs = apiClient.postFormData.mock.calls[0];
        expect(callArgs[0]).toBe('/users/me/profile-picture');
        expect(callArgs[1]).toBeInstanceOf(FormData);
    });

    it('getUsers should call api with empty params', async () => {
        await userService.getUsers();
        expect(apiClient.get).toHaveBeenCalledWith('/users');
    });

    it('getUsers should call api with params', async () => {
        const params = { page: 1, pageSize: 10, role: 'Student' };
        await userService.getUsers(params);
        expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('/users?'));
        expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
        expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('role=Student'));
    });
});
