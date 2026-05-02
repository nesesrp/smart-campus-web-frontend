import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(dashboard)/dashboard/page';
import { useAuthStore } from '@/stores/auth.store';

// Mock the auth store
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

// Mock framer-motion since it's used heavily
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    // Default mock implementation
    useAuthStore.mockImplementation(() => ({
      user: { fullName: 'Test User' },
    }));
  });

  it('renders welcome banner with user name', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Hoş Geldiniz, Test! 👋')).toBeInTheDocument();
  });

  it('renders default greeting if user name is missing', () => {
    useAuthStore.mockImplementation(() => ({
      user: null,
    }));
    render(<DashboardPage />);
    expect(screen.getByText('Hoş Geldiniz, Kullanıcı! 👋')).toBeInTheDocument();
  });

  it('renders all stats cards', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Aktif Dersler')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();

    expect(screen.getByText('Bugünkü Etkinlik')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Toplam Öğrenci')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();

    expect(screen.getByText('Bildirimler')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders recent activities', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Son Aktiviteler')).toBeInTheDocument();
    expect(screen.getByText('Matematik dersi notu yüklendi')).toBeInTheDocument();
    expect(screen.getByText('Yeni duyuru: Sınav tarihleri')).toBeInTheDocument();
  });
});
