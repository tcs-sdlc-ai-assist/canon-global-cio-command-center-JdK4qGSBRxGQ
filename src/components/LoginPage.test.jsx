import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';

const mockUseAuth = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('LoginPage', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null,
      logout: vi.fn(),
    });
  });

  it('renders login form with email and password fields', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the brand name and tagline', () => {
    render(<LoginPage />);
    expect(screen.getByText(/canon cio command center/i)).toBeInTheDocument();
    expect(screen.getByText(/enterprise it operations dashboard/i)).toBeInTheDocument();
  });

  it('shows error when submitting with empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/email and password are required/i);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows error when submitting with invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/please enter a valid email address/i);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login with email and password on valid submission', async () => {
    mockLogin.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'test@canon.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@canon.com', 'password123');
    });
  });

  it('shows loading state while signing in', async () => {
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500)));
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'test@canon.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('displays error message when login fails', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'test@canon.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid credentials/i);
    });
  });

  it('displays generic error when login throws an exception', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'test@canon.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unexpected error/i);
    });
  });

  it('disables inputs and button during loading', async () => {
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500)));
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@canon.com');
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it('shows mock authentication notice', () => {
    render(<LoginPage />);
    expect(screen.getByText(/mock authentication/i)).toBeInTheDocument();
  });

  it('clears error when user starts typing again', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email address/i), 'test@canon.com');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = render(<LoginPage className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});