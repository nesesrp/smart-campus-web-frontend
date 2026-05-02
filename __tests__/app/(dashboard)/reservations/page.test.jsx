import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReservationsPage from '@/app/(dashboard)/reservations/page';
import { getClassrooms, createReservation, getMyReservations } from '@/services/classroom.service';
import { toast } from 'sonner';

// Mock services
jest.mock('@/services/classroom.service');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockClassrooms = [
  { id: 1, building: 'A', roomNumber: '101', capacity: 50, features: { projector: true } },
  { id: 2, building: 'B', roomNumber: '202', capacity: 30, features: { whiteboard: true } }
];

const mockReservations = [
  {
    id: 1,
    classroomId: 1,
    classroom: { building: 'A', roomNumber: '101' },
    date: '2025-12-25',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Meeting',
    status: 'Approved'
  }
];

describe('ReservationsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getClassrooms.mockResolvedValue({ data: mockClassrooms });
    getMyReservations.mockResolvedValue({ data: mockReservations });
  });

  it('renders reservations page with classrooms and my reservations', async () => {
    render(<ReservationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Derslik Rezervasyonları')).toBeInTheDocument();
      // Classrooms - use getAllByText since title and other parts might contain the room number
      expect(screen.getAllByText('A-101').length).toBeGreaterThan(0);
      expect(screen.getAllByText('B-202').length).toBeGreaterThan(0);
      // My Reservations
      expect(screen.getByText('Meeting')).toBeInTheDocument();
      expect(screen.getByText('Onaylandı')).toBeInTheDocument();
    });
  });

  it('opens reservation modal on click', async () => {
    render(<ReservationsPage />);

    await waitFor(() => expect(screen.getAllByText('Rezervasyon Yap').length).toBeGreaterThan(0));

    // There are "Rezervasyon Yap" buttons for each classroom card.
    // Click the first one.
    const reserveButtons = screen.getAllByRole('button').filter(btn => btn.textContent.includes('Rezervasyon Yap'));
    fireEvent.click(reserveButtons[0]);

    await waitFor(() => {
        // Modal title
        const modalTitles = screen.getAllByText('Rezervasyon Yap');
        // One in header, one in modal
        expect(modalTitles.length).toBeGreaterThan(1);
        expect(screen.getByText('Rezervasyon Amacı')).toBeInTheDocument();
    });
  });

  it('handles reservation creation', async () => {
    createReservation.mockResolvedValue({ success: true });
    const { container } = render(<ReservationsPage />);

    await waitFor(() => expect(screen.getAllByText('A-101').length).toBeGreaterThan(0));

    const reserveButtons = screen.getAllByRole('button').filter(btn => btn.textContent.includes('Rezervasyon Yap'));
    fireEvent.click(reserveButtons[0]);

    await waitFor(() => expect(screen.getByText('Rezervasyon Amacı')).toBeInTheDocument());

    // Fill form
    // Since inputs are not easily selectable by label, let's assume defaults are fine or select by placeholder
    fireEvent.change(screen.getByPlaceholderText('Rezervasyon amacınızı açıklayın...'), { target: { value: 'Test Purpose' } });

    // Modal sets default values for Date, StartTime, EndTime so they are not empty.

    // Find the submit button inside the modal
    // It says 'Rezervasyon Yap'
    // Since there are multiple buttons with this text (one for opening modal, one for submitting),
    // and also an H3 title "Rezervasyon Yap", we need to be precise.
    // The submit button is inside a form.
    const submitBtn = screen.getAllByRole('button', { name: 'Rezervasyon Yap' }).pop();
    // .pop() gets the last one, which is likely the one in the modal (rendered last)

    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(createReservation).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Rezervasyon talebi oluşturuldu');
    });
  });

  it('filters classrooms', async () => {
    render(<ReservationsPage />);

    await waitFor(() => expect(screen.getAllByText('A-101').length).toBeGreaterThan(0));

    fireEvent.click(screen.getByText('Filtrele'));

    await waitFor(() => expect(screen.getByText('Minimum Kapasite')).toBeInTheDocument());

    const capacityInput = screen.getByPlaceholderText('Örn: 50');
    fireEvent.change(capacityInput, { target: { value: '40' } });

    fireEvent.click(screen.getByText('Uygula'));

    await waitFor(() => {
        // A-101 (50 cap) should be visible
        // B-202 (30 cap) should NOT be visible
        expect(screen.getAllByText('A-101').length).toBeGreaterThan(0);
        expect(screen.queryByText('B-202')).not.toBeInTheDocument();
    });
  });
});
