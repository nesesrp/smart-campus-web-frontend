import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';

// Mock the AuthLayout component since we are testing the page integration
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

// Mock the LoginForm component
jest.mock('@/components/auth/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

describe('LoginPage', () => {
  it('renders the auth layout with correct props', () => {
    render(<LoginPage />);

    const layout = screen.getByTestId('auth-layout');
    expect(layout).toBeInTheDocument();

    expect(screen.getByText('Hoş Geldiniz')).toBeInTheDocument();
    expect(screen.getByText('Hesabınıza giriş yapın')).toBeInTheDocument();
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('renders the registration link in footer', () => {
    render(<LoginPage />);
    const link = screen.getByRole('link', { name: /kayıt ol/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });
});
