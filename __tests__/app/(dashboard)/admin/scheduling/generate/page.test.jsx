import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GenerateSchedulePage from '@/app/(dashboard)/admin/scheduling/generate/page';
import { toast } from 'sonner';

// Mock ProtectedRoute
jest.mock('@/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }) => <div data-testid="protected-route">{children}</div>,
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

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('GenerateSchedulePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page and loads sections', async () => {
    render(<GenerateSchedulePage />);

    await waitFor(() => {
      expect(screen.getByText('Program Oluşturma')).toBeInTheDocument();
      expect(screen.getByText('Ders Şubeleri Seçimi (0 seçili)')).toBeInTheDocument();
      // Verify mock sections are loaded (CS101, A)
      expect(screen.getAllByText('CS101').length).toBeGreaterThan(0);
    });
  });

  it('selects sections and generates schedule', async () => {
    render(<GenerateSchedulePage />);

    await waitFor(() => expect(screen.getAllByText('CS101').length).toBeGreaterThan(0));

    // Select first section by clicking on it
    const sections = screen.getAllByText('CS101');
    fireEvent.click(sections[0].closest('div[data-testid="motion-div"]') || sections[0].closest('div')); // Click container

    await waitFor(() => expect(screen.getByText('Ders Şubeleri Seçimi (1 seçili)')).toBeInTheDocument());

    // Click Generate
    const generateBtn = screen.getByText('Program Oluştur');
    fireEvent.click(generateBtn);

    // Wait for generation (mock delay 2000ms)
    await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.getByText('Oluşturulan Alternatif Programlar')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('previews and saves schedule', async () => {
    render(<GenerateSchedulePage />);

    // Select and generate
    await waitFor(() => expect(screen.getAllByText('CS101').length).toBeGreaterThan(0));
    const sections = screen.getAllByText('CS101');
    fireEvent.click(sections[0].closest('div[data-testid="motion-div"]') || sections[0].closest('div'));
    fireEvent.click(screen.getByText('Program Oluştur'));

    await waitFor(() => expect(screen.getByText('Oluşturulan Alternatif Programlar')).toBeInTheDocument(), { timeout: 3000 });

    // Click Preview (Eye icon button)
    // Find "Bu Programı Seç" button or Preview button.
    // The Preview button has "Önizle" title.
    const previewBtn = screen.getAllByTitle('Önizle')[0];
    fireEvent.click(previewBtn);

    await waitFor(() => expect(screen.getByText('Program Önizleme')).toBeInTheDocument());

    // Click Save
    const saveBtn = screen.getByText('Kaydet ve Yayınla');
    fireEvent.click(saveBtn);

    await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Program kaydedildi ve yayınlandı');
    });
  });
});
