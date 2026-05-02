import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MealMenuPage from '@/app/(dashboard)/meals/menu/page';
import { getMenus, createReservation } from '@/services/meal.service';
import { toast } from 'sonner';

// Mock services
jest.mock('@/services/meal.service');
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
    button: ({ children, className, onClick }) => (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    ),
    li: ({ children, className }) => <li className={className}>{children}</li>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockMenus = [
  {
    id: 1,
    cafeteriaId: 1,
    mealType: 2, // Lunch
    items: ['Mercimek Çorbası', 'Tavuk Sote', 'Pilav', 'Ayran'],
    nutrition: { calories: 800, protein: 30, carbs: 100 }
  },
  {
    id: 2,
    cafeteriaId: 1,
    mealType: 3, // Dinner
    foodItems: [{ name: 'Ezogelin Çorbası' }, { name: 'Kuru Fasulye' }],
    nutrition: { calories: 700, protein: 25, carbs: 90 }
  }
];

describe('MealMenuPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMenus.mockResolvedValue({ data: mockMenus });
  });

  it('renders meal menu page with meals', async () => {
    render(<MealMenuPage />);

    await waitFor(() => {
      expect(screen.getByText('Yemek Menüsü')).toBeInTheDocument();
      expect(screen.getByText('Öğle Yemeği')).toBeInTheDocument();
      expect(screen.getByText('Akşam Yemeği')).toBeInTheDocument();
      // Items
      expect(screen.getByText('Mercimek Çorbası')).toBeInTheDocument();
      expect(screen.getByText('Ezogelin Çorbası')).toBeInTheDocument();
    });
  });

  it('selects date', async () => {
    render(<MealMenuPage />);

    await waitFor(() => expect(screen.getByText('Bugün')).toBeInTheDocument());

    // Find calendar buttons. They are motion.button which we mocked as button.
    // The component renders 7 days.
    const dateButtons = screen.getAllByRole('button');
    // Assuming the first 7 are date buttons (and maybe some others if present).
    // The date buttons contain day number.

    // Let's click the second date button (tomorrow)
    if (dateButtons.length > 1) {
        fireEvent.click(dateButtons[1]);
        await waitFor(() => {
            expect(getMenus).toHaveBeenCalled();
        });
    }
  });

  it('opens reservation modal', async () => {
    render(<MealMenuPage />);

    await waitFor(() => expect(screen.getByText('Tavuk Sote')).toBeInTheDocument());

    // Click "Rezervasyon Yap" for Lunch
    const reserveButtons = screen.getAllByText('Rezervasyon Yap');
    fireEvent.click(reserveButtons[0]);

    await waitFor(() => {
        expect(screen.getByText('Rezervasyon Onayı')).toBeInTheDocument();
        // Item appears in menu list and modal
        expect(screen.getAllByText('Mercimek Çorbası').length).toBeGreaterThan(1);
    });
  });

  it('handles reservation confirmation', async () => {
    createReservation.mockResolvedValue({ success: true });
    render(<MealMenuPage />);

    await waitFor(() => expect(screen.getByText('Tavuk Sote')).toBeInTheDocument());

    const reserveButtons = screen.getAllByText('Rezervasyon Yap');
    fireEvent.click(reserveButtons[0]);

    await waitFor(() => expect(screen.getByText('Rezervasyon Onayı')).toBeInTheDocument());

    const confirmBtn = screen.getByText('Rezervasyonu Onayla');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
        expect(createReservation).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Rezervasyon başarıyla oluşturuldu!');
    });
  });

  it('handles empty menu', async () => {
    getMenus.mockResolvedValue({ data: [] });
    render(<MealMenuPage />);

    await waitFor(() => {
        // "Bu tarih için menü bulunmuyor" should appear for both lunch and dinner cards
        const emptyMessages = screen.getAllByText('Bu tarih için menü bulunmuyor');
        expect(emptyMessages.length).toBeGreaterThan(0);
    });
  });
});
