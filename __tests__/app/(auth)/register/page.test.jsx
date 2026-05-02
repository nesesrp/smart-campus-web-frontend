import { render, screen } from '@testing-library/react';
import RegisterPage from '@/app/(auth)/register/page';

// Mock the AuthLayout component
jest.mock('@/components/layout/AuthLayout', () => ({
  AuthLayout: ({ children, title, subtitle, footer }) => (
    <div data-testid="auth-layout">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div>{children}</div>
      <footer>{footer}</footer>
    </div>
  ),
}));

// Mock the RegisterForm component
jest.mock('@/components/auth/RegisterForm', () => ({
  RegisterForm: () => <div data-testid="register-form">Register Form</div>,
}));

describe('RegisterPage', () => {
  it('renders the auth layout with correct props', () => {
    render(<RegisterPage />);

    const layout = screen.getByTestId('auth-layout');
    expect(layout).toBeInTheDocument();

    expect(screen.getByText('Hesap Oluştur')).toBeInTheDocument();
    expect(screen.getByText('SmartCampus ailesine katılın')).toBeInTheDocument();
  });

  it('renders the register form', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('renders the login link in footer', () => {
    render(<RegisterPage />);
    const link = screen.getByRole('link', { name: /giriş yap/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
});
