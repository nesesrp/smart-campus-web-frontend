import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@/app/(dashboard)/profile/page';
import { updateProfile, getProfile } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

// Mock services
jest.mock('@/services/user.service');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock auth store
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock ProfilePictureUpload component
jest.mock('@/components/profile/ProfilePictureUpload', () => ({
  ProfilePictureUpload: () => <div data-testid="profile-picture-upload">Upload Component</div>,
}));

const mockUser = {
  id: 1,
  fullName: 'Test User',
  email: 'test@example.com',
  phoneNumber: '05551234567',
  role: 'Student',
  student: {
    studentNumber: '12345',
    enrollmentDate: '2023-01-01',
  },
};

describe('ProfilePage', () => {
  const setUserMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: mockUser,
      setUser: setUserMock,
    });
    getProfile.mockResolvedValue({ success: true, data: mockUser });
    updateProfile.mockResolvedValue({ success: true });
  });

  it('renders profile page with user data', async () => {
    render(<ProfilePage />);

    // Initially it might be loading, so wait for profile text to appear
    await waitFor(() => {
        expect(screen.getByText('Profilim')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('05551234567')).toBeInTheDocument();
  });

  it('fetches profile data on mount', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(getProfile).toHaveBeenCalled();
      expect(setUserMock).toHaveBeenCalled();
    });
  });

  it('handles form submission successfully', async () => {
    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByDisplayValue('Test User')).toBeInTheDocument());

    const nameInput = screen.getByDisplayValue('Test User');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const submitBtn = screen.getByRole('button', { name: /değişiklikleri kaydet/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'Updated Name' }));
      expect(toast.success).toHaveBeenCalledWith('Profil güncellendi');
    });
  });

  it('renders faculty specific fields', async () => {
    const facultyUser = {
      ...mockUser,
      role: 'Faculty',
      userType: 'Faculty',
      student: null,
      faculty: {
        employeeNumber: 'EMP123',
        title: 'Professor',
        officeLocation: 'Room 101'
      }
    };
    useAuthStore.mockReturnValue({ user: facultyUser, setUser: setUserMock });
    getProfile.mockResolvedValue({ success: true, data: facultyUser });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Ofis Konumu')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Room 101')).toBeInTheDocument();
      expect(screen.getByDisplayValue('EMP123')).toBeInTheDocument();
    });
  });
});
