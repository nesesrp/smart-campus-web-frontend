import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CoursesPage from '@/app/(dashboard)/courses/page';
import { getCourses, getDepartments } from '@/services/academic.service';
import { mockCourses, mockDepartments } from '@/mocks/academic.mock';

// Mock the services
jest.mock('@/services/academic.service');

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

describe('CoursesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCourses.mockResolvedValue({ success: true, data: { items: mockCourses } });
    getDepartments.mockResolvedValue({ success: true, data: { items: mockDepartments } });
  });

  it('renders courses page with title', async () => {
    render(<CoursesPage />);

    expect(screen.getByText('Ders Kataloğu')).toBeInTheDocument();
    expect(screen.getByText('Tüm dersleri görüntüleyin ve detaylarına ulaşın')).toBeInTheDocument();

    await waitFor(() => {
      expect(getCourses).toHaveBeenCalled();
    });
  });

  it('loads and displays departments in filter', async () => {
    render(<CoursesPage />);

    await waitFor(() => {
        const options = screen.getAllByRole('option');
        // "Tüm Bölümler" + departments
        expect(options.length).toBeGreaterThan(1);
    });
  });

  it('displays courses list', async () => {
    render(<CoursesPage />);

    await waitFor(() => {
      expect(screen.getByText(mockCourses[0].name)).toBeInTheDocument();
    });
  });

  it('handles search', async () => {
    render(<CoursesPage />);

    const searchInput = screen.getByPlaceholderText('Ders kodu veya adı ile ara...');
    fireEvent.change(searchInput, { target: { value: 'Test Course' } });

    const searchButton = screen.getByRole('button', { name: /ara/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(getCourses).toHaveBeenCalledWith(expect.objectContaining({ search: 'Test Course' }));
    });
  });

  it('handles department filter', async () => {
    render(<CoursesPage />);

    await waitFor(() => {
        expect(getDepartments).toHaveBeenCalled();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: mockDepartments[0].id.toString() } });

    await waitFor(() => {
      expect(getCourses).toHaveBeenCalledWith(expect.objectContaining({ departmentId: mockDepartments[0].id.toString() }));
    });
  });

  it('toggles view mode', async () => {
    render(<CoursesPage />);
    await waitFor(() => expect(getCourses).toHaveBeenCalled());

    // Switch to list view
    const listBtn = screen.getAllByRole('button').find(btn => btn.querySelector('.lucide-list'));
    fireEvent.click(listBtn);

    // Check if view changed (implementation detail: layout structure changes)
    // Here we assume basic rendering is still successful.
    expect(screen.getByText(mockCourses[0].name)).toBeInTheDocument();
  });
});
