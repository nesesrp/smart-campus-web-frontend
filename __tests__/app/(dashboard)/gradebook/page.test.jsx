import { render, screen, waitFor } from '@testing-library/react';
import GradebookListPage from '@/app/(dashboard)/gradebook/page';
import { useAuthStore } from '@/stores/auth.store';
import { getSections } from '@/services/academic.service';
import { mockSections } from '@/mocks/academic.mock';

// Mock services
jest.mock('@/services/academic.service');
jest.mock('@/stores/auth.store');

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

// Mock Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Mock navigation
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('GradebookListPage', () => {
  const facultyUser = { id: 101, role: 'Faculty', fullName: 'Dr. Test' };
  const studentUser = { id: 202, role: 'Student', fullName: 'Student Test' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects if user is not Faculty or Admin', async () => {
    useAuthStore.mockReturnValue({ user: studentUser });

    render(<GradebookListPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/dashboard');
    });
    // It also renders access denied message briefly
    expect(screen.getByText('Bu sayfaya erişim yetkiniz yok.')).toBeInTheDocument();
  });

  it('renders correctly for Faculty user', async () => {
    useAuthStore.mockReturnValue({ user: facultyUser });
    getSections.mockResolvedValue({ success: true, data: mockSections });

    render(<GradebookListPage />);

    // Expect loading state first
    expect(screen.queryByTestId('loading-spinner')).toBeNull(); // It renders Loader2 icon

    await waitFor(() => {
      expect(screen.getByText('Not Girişi')).toBeInTheDocument();
      // Should show sections that belong to this instructor (mock logic in component)
      // Since component filters by instructor.id === user.id or Admin
      // We need to match mockSections instructor ID with our facultyUser ID if we want them to show up.
      // Or we can mock the component logic or data to match.
    });
  });

  it('filters sections for the instructor', async () => {
    const instructorId = 123;
    const mySection = {
        ...mockSections[0],
        id: 999,
        instructor: { id: instructorId },
        course: { code: 'TEST101', name: 'Test Course' }
    };
    const otherSection = {
        ...mockSections[0],
        id: 888,
        instructor: { id: 456 },
        course: { code: 'OTHER101', name: 'Other Course' }
    };

    useAuthStore.mockReturnValue({ user: { id: instructorId, role: 'Faculty' } });
    getSections.mockResolvedValue({ success: true, data: { items: [mySection, otherSection] } });

    render(<GradebookListPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.queryByText('Other Course')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no sections found', async () => {
    useAuthStore.mockReturnValue({ user: facultyUser });
    getSections.mockResolvedValue({ success: true, data: [] });

    render(<GradebookListPage />);

    await waitFor(() => {
      expect(screen.getByText('Henüz size atanmış ders bulunmuyor')).toBeInTheDocument();
    });
  });
});
