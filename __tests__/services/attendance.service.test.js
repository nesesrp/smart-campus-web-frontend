import attendanceService, {
  createSession,
  getSessionById,
  closeSession,
  getMySessions,
  getSessionRecords,
  checkIn,
  getMyAttendance,
  getAttendanceReport,
  createExcuseRequest,
  submitExcuseWithFile,
  getExcuseRequests,
  approveExcuseRequest,
  rejectExcuseRequest,
  calculateDistance,
} from '@/services/attendance.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  postFormData: jest.fn(),
}));

describe('Attendance Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should call post with sessionData', async () => {
      const sessionData = { sectionId: 1, date: '2023-10-10' };
      await createSession(sessionData);
      expect(apiClient.post).toHaveBeenCalledWith('/attendance/sessions', sessionData);
    });
  });

  describe('getSessionById', () => {
    it('should call get with sessionId', async () => {
      await getSessionById(1);
      expect(apiClient.get).toHaveBeenCalledWith('/attendance/sessions/1');
    });
  });

  describe('closeSession', () => {
    it('should call put with sessionId', async () => {
      await closeSession(1);
      expect(apiClient.put).toHaveBeenCalledWith('/attendance/sessions/1/close');
    });
  });

  describe('getMySessions', () => {
    it('should call get with correct endpoint', async () => {
      await getMySessions();
      expect(apiClient.get).toHaveBeenCalledWith('/attendance/sessions/my-sessions');
    });
  });

  describe('getSessionRecords', () => {
    it('should call get with sessionId', async () => {
      await getSessionRecords(1);
      expect(apiClient.get).toHaveBeenCalledWith('/attendance/sessions/1/records');
    });
  });

  describe('checkIn', () => {
    it('should call post with sessionId and locationData', async () => {
      const sessionId = 1;
      const locationData = { latitude: 10, longitude: 20 };
      await checkIn(sessionId, locationData);
      expect(apiClient.post).toHaveBeenCalledWith('/attendance/sessions/1/checkin', locationData);
    });
  });

  describe('getMyAttendance', () => {
    it('should call get with correct endpoint', async () => {
      await getMyAttendance();
      expect(apiClient.get).toHaveBeenCalledWith('/attendance/my-attendance');
    });
  });

  describe('getAttendanceReport', () => {
    it('should call get with sectionId and filters', async () => {
      const sectionId = 1;
      const filters = { startDate: '2023-01-01', endDate: '2023-12-31' };
      await getAttendanceReport(sectionId, filters);
      expect(apiClient.get).toHaveBeenCalledWith('/attendance/sections/1/report?startDate=2023-01-01&endDate=2023-12-31');
    });

    it('should call get without filters', async () => {
        const sectionId = 1;
        await getAttendanceReport(sectionId);
        expect(apiClient.get).toHaveBeenCalledWith('/attendance/sections/1/report');
      });
  });

  describe('createExcuseRequest', () => {
    it('should call post with requestData', async () => {
      const requestData = { sessionId: 1, reason: 'Sick' };
      await createExcuseRequest(requestData);
      expect(apiClient.post).toHaveBeenCalledWith('/attendance/excuse-requests', requestData);
    });
  });

  describe('submitExcuseWithFile', () => {
    it('should call postFormData with FormData', async () => {
      const excuseData = { sessionId: 1, reason: 'Sick', document: new File([''], 'doc.pdf') };
      await submitExcuseWithFile(excuseData);

      expect(apiClient.postFormData).toHaveBeenCalled();
      const formData = apiClient.postFormData.mock.calls[0][1];
      expect(formData.get('sessionId')).toBe("1");
      expect(formData.get('reason')).toBe('Sick');
      expect(formData.get('document')).toBe(excuseData.document);
      expect(apiClient.postFormData.mock.calls[0][0]).toBe('/attendance/excuse-requests');
    });

    it('should call postFormData without document if not provided', async () => {
        const excuseData = { sessionId: 1, reason: 'Sick' };
        await submitExcuseWithFile(excuseData);

        expect(apiClient.postFormData).toHaveBeenCalled();
        const formData = apiClient.postFormData.mock.calls[0][1];
        expect(formData.get('sessionId')).toBe("1");
        expect(formData.get('reason')).toBe('Sick');
        expect(formData.has('document')).toBe(false);
      });
  });

  describe('getExcuseRequests', () => {
    it('should call get with sectionId filter', async () => {
      await getExcuseRequests(1);
      expect(apiClient.get).toHaveBeenCalledWith('/attendance/excuse-requests?sectionId=1');
    });

    it('should call get without filter', async () => {
      await getExcuseRequests();
      expect(apiClient.get).toHaveBeenCalledWith('/attendance/excuse-requests');
    });
  });

  describe('approveExcuseRequest', () => {
    it('should call put with requestId and reviewData', async () => {
      const requestId = 1;
      const reviewData = { notes: 'Ok' };
      await approveExcuseRequest(requestId, reviewData);
      expect(apiClient.put).toHaveBeenCalledWith('/attendance/excuse-requests/1/approve', reviewData);
    });
  });

  describe('rejectExcuseRequest', () => {
    it('should call put with requestId and reviewData', async () => {
      const requestId = 1;
      const reviewData = { notes: 'No' };
      await rejectExcuseRequest(requestId, reviewData);
      expect(apiClient.put).toHaveBeenCalledWith('/attendance/excuse-requests/1/reject', reviewData);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance correctly', () => {
      // 0,0 to 0,0 should be 0
      expect(calculateDistance(0, 0, 0, 0)).toBe(0);

      // Known distance: Lat 1 deg difference approx 111km
      const dist = calculateDistance(0, 0, 1, 0);
      expect(dist).toBeCloseTo(111195, -2); // Approx 111km
    });
  });

  describe('default export', () => {
      it('should export all functions', () => {
          expect(attendanceService.createSession).toBeDefined();
      });
  });
});
