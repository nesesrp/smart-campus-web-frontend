import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletPage from '@/app/(dashboard)/wallet/page';
import { getBalance, addMoney, getTransactions } from '@/services/wallet.service';
import { toast } from 'sonner';

// Mock services
jest.mock('@/services/wallet.service');
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

const mockBalance = { balance: 150.50 };
const mockTransactions = {
  data: [
    {
      id: 1,
      createdAt: '2023-12-01T10:00:00',
      description: 'Deposit',
      category: 'Yükleme',
      type: 'deposit',
      amount: 100,
      status: 'completed'
    },
    {
      id: 2,
      createdAt: '2023-12-02T12:00:00',
      description: 'Meal',
      category: 'Yemek',
      type: 'withdraw',
      amount: -25,
      status: 'completed'
    }
  ],
  totalCount: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false
};

describe('WalletPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBalance.mockResolvedValue({ data: mockBalance });
    getTransactions.mockResolvedValue({ data: mockTransactions });
  });

  it('renders wallet page with balance', async () => {
    render(<WalletPage />);

    expect(screen.getByText('Cüzdan')).toBeInTheDocument();

    await waitFor(() => {
      // Balance might be formatted differently based on locale, but checking partial match
      expect(screen.getByText(/150,50/)).toBeInTheDocument();
    });
  });

  it('displays transactions list', async () => {
    render(<WalletPage />);

    await waitFor(() => {
      expect(screen.getByText('Deposit')).toBeInTheDocument();
      expect(screen.getByText('Meal')).toBeInTheDocument();
      expect(screen.getByText('Yükleme')).toBeInTheDocument();
      expect(screen.getByText('Yemek')).toBeInTheDocument();
    });
  });

  it('opens add money modal', async () => {
    render(<WalletPage />);

    // Check loading first if needed, but easier to wait for render
    await waitFor(() => expect(screen.getByText('Para Yükle')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Para Yükle'));

    expect(screen.getAllByText('Para Yükle').length).toBeGreaterThan(1); // One in header, one in modal title
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('handles adding money', async () => {
    addMoney.mockResolvedValue({ success: true });
    render(<WalletPage />);

    await waitFor(() => expect(screen.getByText('Para Yükle')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Para Yükle'));

    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '50' } });

    const submitBtn = screen.getByRole('button', { name: 'Yükle' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(addMoney).toHaveBeenCalledWith(expect.objectContaining({ amount: 50 }));
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('validates amount input', async () => {
    render(<WalletPage />);

    await waitFor(() => expect(screen.getByText('Para Yükle')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Para Yükle'));

    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '5' } }); // Less than min 10

    // In React 19/newer DOM environments, we might need to be careful with form submissions
    // Let's try to submit the form directly if button click isn't triggering it or check button state
    const submitBtn = screen.getByRole('button', { name: 'Yükle' });
    fireEvent.submit(submitBtn.closest('form'));

    // Since validation happens in handleSubmit, it should call toast.error immediately
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      const calls = toast.error.mock.calls;
      const hasMinimumError = calls.some(call => call[0].includes('Minimum yükleme tutarı 10 TL'));
      expect(hasMinimumError).toBe(true);
    });
  });

  it('handles empty state', async () => {
     getTransactions.mockResolvedValue({ data: { data: [], totalCount: 0 } });
     render(<WalletPage />);

     await waitFor(() => {
         expect(screen.getByText('Henüz işlem geçmişiniz yok')).toBeInTheDocument();
     });
  });
});
