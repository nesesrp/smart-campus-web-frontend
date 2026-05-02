import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventsPage from '@/app/(dashboard)/events/page';
import { getEvents } from '@/services/event.service';
import { useRouter } from 'next/navigation';

// Mock the services
jest.mock('@/services/event.service');

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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockEvents = [
  {
    id: 1,
    title: 'Test Event 1',
    description: 'Description 1',
    category: 'conference',
    date: '2023-12-01',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Hall A',
    registeredCount: 10,
    capacity: 100,
    isPaid: false
  },
  {
    id: 2,
    title: 'Test Event 2',
    description: 'Description 2',
    category: 'workshop',
    date: '2023-12-02',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Lab B',
    registeredCount: 5,
    capacity: 20,
    isPaid: true,
    price: 50
  }
];

describe('EventsPage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock });
    getEvents.mockResolvedValue({ success: true, data: mockEvents });
  });

  it('renders events page with title', async () => {
    render(<EventsPage />);

    expect(screen.getByText('Etkinlikler')).toBeInTheDocument();
    expect(screen.getByText('Yaklaşan etkinlikleri görüntüleyin ve kayıt olun')).toBeInTheDocument();

    await waitFor(() => {
      expect(getEvents).toHaveBeenCalled();
    });
  });

  it('displays events list', async () => {
    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });
  });

  it('handles search', async () => {
    render(<EventsPage />);

    const searchInput = screen.getByPlaceholderText('Etkinlik adı ile ara...');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(getEvents).toHaveBeenCalledWith(expect.objectContaining({ search: 'Test' }));
    });
  });

  it('handles category filter', async () => {
    render(<EventsPage />);

    // Find category button "Workshop"
    const workshopBtn = screen.getByText('Workshop');
    fireEvent.click(workshopBtn);

    await waitFor(() => {
      expect(getEvents).toHaveBeenCalledWith(expect.objectContaining({ category: 'workshop' }));
    });
  });

  it('navigates to event details on click', async () => {
    render(<EventsPage />);
    await waitFor(() => expect(screen.getByText('Test Event 1')).toBeInTheDocument());

    const eventCard = screen.getByText('Test Event 1').closest('div[data-testid="motion-div"]');
    fireEvent.click(eventCard);

    expect(pushMock).toHaveBeenCalledWith('/events/1');
  });

  it('shows empty state when no events found', async () => {
    getEvents.mockResolvedValue({ success: true, data: [] });
    render(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Etkinlik bulunamadı')).toBeInTheDocument();
    });
  });
});
