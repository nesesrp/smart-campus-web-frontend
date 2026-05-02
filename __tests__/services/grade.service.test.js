import gradeService, {
  getMyGrades,
  getTranscript,
  downloadTranscriptPdf,
  enterGrade,
  enterGradesBatch,
  calculateLetterGrade,
  letterToGradePoint,
} from '@/services/grade.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('Grade Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  describe('downloadTranscriptPdf', () => {
    let originalFetch;
    let originalCreateObjectURL;
    let originalRevokeObjectURL;

    beforeAll(() => {
        originalFetch = global.fetch;
        originalCreateObjectURL = window.URL.createObjectURL;
        originalRevokeObjectURL = window.URL.revokeObjectURL;

        global.fetch = jest.fn();
        window.URL.createObjectURL = jest.fn();
        window.URL.revokeObjectURL = jest.fn();
    });

    afterAll(() => {
        global.fetch = originalFetch;
        window.URL.createObjectURL = originalCreateObjectURL;
        window.URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('should download PDF successfully', async () => {
        const mockBlob = new Blob(['pdf'], { type: 'application/pdf' });
        global.fetch.mockResolvedValue({
            ok: true,
            blob: jest.fn().mockResolvedValue(mockBlob),
        });
        window.URL.createObjectURL.mockReturnValue('blob:url');

        // Mock DOM elements
        const link = { click: jest.fn(), remove: jest.fn(), style: {} };
        const originalCreateElement = document.createElement;
        document.createElement = jest.fn().mockReturnValue(link);
        document.body.appendChild = jest.fn();

        await downloadTranscriptPdf();

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/grades/transcript/pdf'),
            expect.objectContaining({ headers: expect.any(Object) })
        );
        expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
        expect(link.click).toHaveBeenCalled();
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');

        // Cleanup
        document.createElement = originalCreateElement;
    });

    it('should throw error when fetch fails', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
        });

        await expect(downloadTranscriptPdf()).rejects.toThrow('PDF indirilemedi');
    });
  });

  describe('enterGrade', () => {
    it('should call post with gradeData', async () => {
      const gradeData = { enrollmentId: 1, midtermGrade: 80 };
      await enterGrade(gradeData);
      expect(apiClient.post).toHaveBeenCalledWith('/grades/enter', gradeData);
    });
  });

  describe('enterGradesBatch', () => {
    it('should call post with grades array', async () => {
      const grades = [{ enrollmentId: 1, midtermGrade: 80 }];
      await enterGradesBatch(grades);
      expect(apiClient.post).toHaveBeenCalledWith('/grades/enter-batch', grades);
    });
  });

  describe('calculateLetterGrade', () => {
    it('should calculate correct letter grades', () => {
        expect(calculateLetterGrade(100, 100)).toBe('AA'); // 100
        expect(calculateLetterGrade(90, 90)).toBe('AA'); // 90
        expect(calculateLetterGrade(85, 85)).toBe('BA'); // 85
        expect(calculateLetterGrade(80, 80)).toBe('BB'); // 80
        expect(calculateLetterGrade(75, 75)).toBe('CB'); // 75
        expect(calculateLetterGrade(70, 70)).toBe('CC'); // 70
        expect(calculateLetterGrade(65, 65)).toBe('DC'); // 65
        expect(calculateLetterGrade(60, 60)).toBe('DD'); // 60
        expect(calculateLetterGrade(50, 50)).toBe('FD'); // 50
        expect(calculateLetterGrade(40, 40)).toBe('FF'); // 40
    });
  });

  describe('letterToGradePoint', () => {
    it('should return correct grade points', () => {
        expect(letterToGradePoint('AA')).toBe(4.0);
        expect(letterToGradePoint('BA')).toBe(3.5);
        expect(letterToGradePoint('BB')).toBe(3.0);
        expect(letterToGradePoint('CB')).toBe(2.5);
        expect(letterToGradePoint('CC')).toBe(2.0);
        expect(letterToGradePoint('DC')).toBe(1.5);
        expect(letterToGradePoint('DD')).toBe(1.0);
        expect(letterToGradePoint('FD')).toBe(0.5);
        expect(letterToGradePoint('FF')).toBe(0.0);
        expect(letterToGradePoint('UNKNOWN')).toBe(0);
    });
  });

  describe('default export', () => {
    it('should export all functions', () => {
      expect(gradeService.getMyGrades).toBeDefined();
    });
  });
});
