import academicService, {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getSections,
  getSectionById,
  createSection,
  updateSection,
  enrollInCourse,
  dropCourse,
  getMyCourses,
  getSectionStudents,
  getMyGrades,
  getTranscript,
  getTranscriptPDF,
  submitGrade,
  updateGrade,
  getDepartments,
} from '@/services/academic.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

describe('Academic Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should call api with correct query params', async () => {
      const params = { page: 1, limit: 10, search: 'math', departmentId: 5 };
      await getCourses(params);
      expect(apiClient.get).toHaveBeenCalledWith('/courses?page=1&limit=10&search=math&departmentId=5');
    });

    it('should call api without params', async () => {
      await getCourses();
      expect(apiClient.get).toHaveBeenCalledWith('/courses');
    });
  });

  describe('getCourseById', () => {
    it('should call api with courseId', async () => {
      await getCourseById(123);
      expect(apiClient.get).toHaveBeenCalledWith('/courses/123');
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

  describe('getSections', () => {
    it('should call api with correct query params', async () => {
        const params = { semester: 'Fall', year: 2023, instructorId: 101, courseId: 202 };
        await getSections(params);
        expect(apiClient.get).toHaveBeenCalledWith('/sections?semester=Fall&year=2023&instructorId=101&courseId=202');
    });

    it('should call api without params', async () => {
        await getSections();
        expect(apiClient.get).toHaveBeenCalledWith('/sections');
    });
  });

  describe('getSectionById', () => {
    it('should call api with sectionId', async () => {
      await getSectionById(456);
      expect(apiClient.get).toHaveBeenCalledWith('/sections/456');
    });
  });

  describe('createSection', () => {
    it('should call post with sectionData', async () => {
      const sectionData = { courseId: 123, room: 'A101' };
      await createSection(sectionData);
      expect(apiClient.post).toHaveBeenCalledWith('/sections', sectionData);
    });
  });

  describe('updateSection', () => {
    it('should call put with sectionId and sectionData', async () => {
      const sectionId = 456;
      const sectionData = { room: 'B202' };
      await updateSection(sectionId, sectionData);
      expect(apiClient.put).toHaveBeenCalledWith('/sections/456', sectionData);
    });
  });

  describe('enrollInCourse', () => {
    it('should call post with enrollmentData', async () => {
      const enrollmentData = { sectionId: 456 };
      await enrollInCourse(enrollmentData);
      expect(apiClient.post).toHaveBeenCalledWith('/enrollments', enrollmentData);
    });
  });

  describe('dropCourse', () => {
    it('should call del with enrollmentId', async () => {
      await dropCourse(789);
      expect(apiClient.del).toHaveBeenCalledWith('/enrollments/789');
    });
  });

  describe('getMyCourses', () => {
    it('should call get with correct endpoint', async () => {
      await getMyCourses();
      expect(apiClient.get).toHaveBeenCalledWith('/enrollments/my-courses');
    });
  });

  describe('getSectionStudents', () => {
    it('should call get with sectionId', async () => {
      await getSectionStudents(456);
      expect(apiClient.get).toHaveBeenCalledWith('/enrollments/students/456');
    });
  });

  describe('getMyGrades', () => {
    it('should call get with correct endpoint', async () => {
      await getMyGrades();
      expect(apiClient.get).toHaveBeenCalledWith('/grades/my-grades');
    });
  });

  describe('getTranscript', () => {
    it('should call get with correct endpoint', async () => {
      await getTranscript();
      expect(apiClient.get).toHaveBeenCalledWith('/grades/transcript');
    });
  });

  describe('getTranscriptPDF', () => {
    let originalFetch;

    beforeAll(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn();
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    it('should fetch PDF successfully', async () => {
        const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
        global.fetch.mockResolvedValue({
            ok: true,
            blob: jest.fn().mockResolvedValue(mockBlob),
        });
        localStorage.setItem('accessToken', 'mock-token');

        const result = await getTranscriptPDF();

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/grades/transcript/pdf'), expect.objectContaining({
             headers: { Authorization: 'Bearer mock-token' }
        }));
        expect(result).toBe(mockBlob);
    });

    it('should throw error when fetch fails', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValue({ message: 'Error' }),
        });

        await expect(getTranscriptPDF()).rejects.toThrow('Error');
    });
     it('should throw default error when fetch fails without message', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValue({}),
        });

        await expect(getTranscriptPDF()).rejects.toThrow('PDF indirilemedi');
    });
  });

  describe('submitGrade', () => {
    it('should call post with gradeData', async () => {
      const gradeData = { enrollmentId: 1, midtermGrade: 80 };
      await submitGrade(gradeData);
      expect(apiClient.post).toHaveBeenCalledWith('/grades', gradeData);
    });
  });

  describe('updateGrade', () => {
    it('should call put with enrollmentId and gradeData', async () => {
      const enrollmentId = 1;
      const gradeData = { midtermGrade: 90 };
      await updateGrade(enrollmentId, gradeData);
      expect(apiClient.put).toHaveBeenCalledWith('/grades/1', gradeData);
    });
  });

  describe('getDepartments', () => {
    it('should call get with correct endpoint', async () => {
      await getDepartments();
      expect(apiClient.get).toHaveBeenCalledWith('/departments');
    });
  });

  describe('default export', () => {
      it('should export all functions', () => {
          expect(academicService.getCourses).toBeDefined();
          expect(academicService.getCourseById).toBeDefined();
      });
   });
});
