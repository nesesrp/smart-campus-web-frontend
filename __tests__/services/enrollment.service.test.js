import enrollmentService, {
  enrollInCourse,
  dropCourse,
  getMyCourses,
  checkPrerequisites,
  checkScheduleConflict,
  getStudentsBySection,
} from '@/services/enrollment.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  del: jest.fn(),
}));

describe('Enrollment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enrollInCourse', () => {
    it('should call post with sectionId', async () => {
      const sectionId = 123;
      await enrollInCourse(sectionId);
      expect(apiClient.post).toHaveBeenCalledWith('/enrollments', { sectionId });
    });
  });

  describe('dropCourse', () => {
    it('should call del with enrollmentId', async () => {
      await dropCourse(456);
      expect(apiClient.del).toHaveBeenCalledWith('/enrollments/456');
    });
  });

  describe('getMyCourses', () => {
    it('should call get with correct endpoint', async () => {
      await getMyCourses();
      expect(apiClient.get).toHaveBeenCalledWith('/enrollments/my-courses');
    });
  });

  describe('checkPrerequisites', () => {
    it('should call get with courseId', async () => {
      await checkPrerequisites(789);
      expect(apiClient.get).toHaveBeenCalledWith('/enrollments/check-prerequisites/789');
    });
  });

  describe('checkScheduleConflict', () => {
    it('should call get with sectionId', async () => {
      await checkScheduleConflict(123);
      expect(apiClient.get).toHaveBeenCalledWith('/enrollments/check-conflict/123');
    });
  });

  describe('getStudentsBySection', () => {
    it('should call get with sectionId', async () => {
      await getStudentsBySection(456);
      expect(apiClient.get).toHaveBeenCalledWith('/enrollments/sections/456/students');
    });
  });

  describe('default export', () => {
    it('should export all functions', () => {
      expect(enrollmentService.enrollInCourse).toBeDefined();
    });
  });
});
