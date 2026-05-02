import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminMealsPage from '@/app/(dashboard)/admin/meals/page';
import * as mealService from '@/services/admin-meal.service';
import { toast } from 'sonner';

// Mock services
jest.mock('@/services/admin-meal.service');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

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
    form: ({ children, onSubmit, className }) => (
      <form onSubmit={onSubmit} className={className} data-testid="motion-form">
        {children}
      </form>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockCafeterias = [
  { id: 1, name: 'Main Hall', location: 'Building A', capacity: 200, isActive: true },
];

const mockFoodItems = [
  { id: 1, name: 'Soup', category: 1, calories: 100, description: 'Hot soup' },
];

const mockMenus = [
  {
    id: 1,
    cafeteriaId: 1,
    cafeteriaName: 'Main Hall',
    date: '2025-01-01',
    mealType: 2,
    price: 50,
    isPublished: false,
    foodItems: ['Soup']
  },
];

describe('AdminMealsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mealService.getCafeterias.mockResolvedValue({ data: mockCafeterias });
    mealService.createCafeteria.mockResolvedValue({ success: true });
    mealService.deleteCafeteria.mockResolvedValue({ success: true });

    mealService.getFoodItems.mockResolvedValue({ data: mockFoodItems });
    mealService.createFoodItem.mockResolvedValue({ success: true });
    mealService.deleteFoodItem.mockResolvedValue({ success: true });

    mealService.getMenus.mockResolvedValue({ data: mockMenus });
    mealService.createMenu.mockResolvedValue({ success: true });
    mealService.deleteMenu.mockResolvedValue({ success: true });
    mealService.publishMenu.mockResolvedValue({ success: true });
    mealService.unpublishMenu.mockResolvedValue({ success: true });

    // Mock Enums
    mealService.MealItemCategoryLabels = { 1: 'Soup', 2: 'Main' };
    mealService.MealTypeLabels = { 1: 'Breakfast', 2: 'Lunch' };

    // Mock confirm
    window.confirm = jest.fn(() => true);
  });

  it('renders admin meals page with tabs', async () => {
    render(<AdminMealsPage />);

    await waitFor(() => {
      expect(screen.getByText('Yemek Yönetimi')).toBeInTheDocument();
      expect(screen.getByText('Yemekhaneler')).toBeInTheDocument();
      expect(screen.getByText('Yemek İçerikleri')).toBeInTheDocument();
      expect(screen.getByText('Menüler')).toBeInTheDocument();
    });
  });

  describe('Cafeterias Tab', () => {
    it('loads and displays cafeterias', async () => {
      render(<AdminMealsPage />);

      await waitFor(() => {
        expect(screen.getByText('Main Hall')).toBeInTheDocument();
        expect(screen.getByText('Building A')).toBeInTheDocument();
      });
    });

    it('creates a new cafeteria', async () => {
      render(<AdminMealsPage />);

      await waitFor(() => expect(screen.getByText('Yeni Yemekhane')).toBeInTheDocument());

      fireEvent.click(screen.getByText('Yeni Yemekhane'));

      await waitFor(() => expect(screen.getByPlaceholderText('Merkez Yemekhane')).toBeInTheDocument());

      fireEvent.change(screen.getByPlaceholderText('Merkez Yemekhane'), { target: { value: 'New Hall' } });
      fireEvent.change(screen.getByPlaceholderText('Ana Bina, Zemin Kat'), { target: { value: 'Building B' } });

      fireEvent.click(screen.getByText('Kaydet'));

      await waitFor(() => {
        expect(mealService.createCafeteria).toHaveBeenCalledWith(expect.objectContaining({ Name: 'New Hall' }));
        expect(toast.success).toHaveBeenCalledWith('Yemekhane oluşturuldu');
      });
    });

    it('deletes a cafeteria', async () => {
      render(<AdminMealsPage />);

      await waitFor(() => expect(screen.getByText('Main Hall')).toBeInTheDocument());

      // Find delete button (trash icon)
      // Since it's inside a button, we can look for the button
      const deleteButtons = screen.getAllByRole('button');
      // The delete button is likely one of the last ones in the card
      // Or we can assume it's the one with specific icon, but icons are SVGs.
      // Let's click the last button in the document, assuming it's the delete button for the item.
      // Actually, tab buttons are first.
      // "Yeni Yemekhane" is next.
      // Then the list items.

      // Better way: find the card, then find button inside.
      // But let's try finding by index if needed or just clicking all buttons that look like delete? No.

      // There is no aria-label on the delete button in source code.
      // Let's modify source to add aria-label if possible? NO, I should assume current code.
      // Code: <Button variant="ghost" size="sm" onClick={() => handleDelete(cafeteria.id)}><Trash2 .../></Button>

      // I can add aria-label to the button in the component if I want to be cleaner,
      // but let's try to query by SVG class if possible or order.

      // Let's assume the button containing the Trash2 icon.
      // But testing library doesn't easily select by icon class unless we querySelector.

      // Let's assume it's the button inside the list item.
      const hallElement = screen.getByText('Main Hall').closest('div').parentElement; // The card div
      const deleteBtn = hallElement.querySelector('button');

      fireEvent.click(deleteBtn);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(mealService.deleteCafeteria).toHaveBeenCalledWith(1);
        expect(toast.success).toHaveBeenCalledWith('Yemekhane silindi');
      });
    });
  });

  describe('Food Items Tab', () => {
    it('loads and displays food items', async () => {
      render(<AdminMealsPage />);

      fireEvent.click(screen.getByText('Yemek İçerikleri'));

      await waitFor(() => {
        // "Soup" appears as title and category label
        expect(screen.getAllByText('Soup').length).toBeGreaterThan(0);
        expect(screen.getByText('Hot soup')).toBeInTheDocument();
      });
    });

    it('creates a new food item', async () => {
      render(<AdminMealsPage />);
      fireEvent.click(screen.getByText('Yemek İçerikleri'));

      await waitFor(() => expect(screen.getByText('Yeni Yemek')).toBeInTheDocument());
      fireEvent.click(screen.getByText('Yeni Yemek'));

      await waitFor(() => expect(screen.getByPlaceholderText('Mercimek Çorbası')).toBeInTheDocument());

      fireEvent.change(screen.getByPlaceholderText('Mercimek Çorbası'), { target: { value: 'New Soup' } });

      fireEvent.click(screen.getByText('Kaydet'));

      await waitFor(() => {
        expect(mealService.createFoodItem).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Yemek içeriği oluşturuldu');
      });
    });
  });

  describe('Menus Tab', () => {
    it('loads and displays menus', async () => {
      render(<AdminMealsPage />);

      fireEvent.click(screen.getByText('Menüler'));

      await waitFor(() => {
        expect(screen.getByText(/Main Hall/)).toBeInTheDocument();
        expect(screen.getByText(/Lunch/)).toBeInTheDocument();
      });
    });

    it('creates a new menu', async () => {
      render(<AdminMealsPage />);
      fireEvent.click(screen.getByText('Menüler'));

      await waitFor(() => expect(screen.getByText('Yeni Menü')).toBeInTheDocument());
      fireEvent.click(screen.getByText('Yeni Menü'));

      // Need to fill form
      // Select cafeteria, date, mealtype, price, food items.

      await waitFor(() => expect(screen.getByText('Yemekler (0 seçili) *')).toBeInTheDocument());

      // Select food item "Soup" - Find the button in the form selection list
      // The form has "Yemekler (...) *" label. We can look for buttons within the form.
      const form = screen.getByTestId('motion-form');
      const soupButton = Array.from(form.querySelectorAll('button')).find(btn => btn.textContent.includes('Soup'));

      fireEvent.click(soupButton);

      fireEvent.click(screen.getByText('Menüyü Kaydet'));

      await waitFor(() => {
        expect(mealService.createMenu).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Menü oluşturuldu');
      });
    });
  });
});
