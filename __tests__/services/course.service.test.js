import courseService, {
  getCourses,
  getCourseById,
  getPrerequisites,
  createCourse,
  updateCourse,
  deleteCourse,
} from '@/services/course.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

describe('Course Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should call api with default params', async () => {
      await getCourses();
      expect(apiClient.get).toHaveBeenCalledWith('/courses?page=1&pageSize=10');
    });

    it('should call api with provided params', async () => {
      const params = { page: 2, pageSize: 20, departmentId: 5, search: 'math' };
      await getCourses(params);
      expect(apiClient.get).toHaveBeenCalledWith('/courses?page=2&pageSize=20&departmentId=5&search=math');
    });
  });

  describe('getCourseById', () => {
    it('should call api with courseId', async () => {
      await getCourseById(123);
      expect(apiClient.get).toHaveBeenCalledWith('/courses/123');
    });
  });

  describe('getPrerequisites', () => {
    it('should call api with courseId', async () => {
      await getPrerequisites(123);
      expect(apiClient.get).toHaveBeenCalledWith('/courses/123/prerequisites');
    });
  });

  describe('createCourse', () => {
    it('should call post with courseData', async () => {
      const courseData = { name: 'Math' };
      await createCourse(courseData);
      expect(apiClient.post).toHaveBeenCalledWith('/courses', courseData);
    });
  });

  describe('updateCourse', () => {
    it('should call put with courseId and courseData', async () => {
      const courseId = 123;
      const courseData = { name: 'Math Advanced' };
      await updateCourse(courseId, courseData);
      expect(apiClient.put).toHaveBeenCalledWith('/courses/123', courseData);
    });
  });

  describe('deleteCourse', () => {
    it('should call del with courseId', async () => {
      await deleteCourse(123);
      expect(apiClient.del).toHaveBeenCalledWith('/courses/123');
    });
  });

  describe('default export', () => {
    it('should export all functions', () => {
      expect(courseService.getCourses).toBeDefined();
    });
  });
});
