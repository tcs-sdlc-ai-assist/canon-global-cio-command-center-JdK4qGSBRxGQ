import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

vi.mock('./context/DataContext', () => ({
  DataProvider: ({ children }) => <div data-testid="data-provider">{children}</div>,
  useData: vi.fn(),
}));

vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: vi.fn(),
}));

vi.mock('./context/UIProvider', () => ({
  UIProvider: ({ children }) => <div data-testid="ui-provider">{children}</div>,
  useUI: vi.fn(),
}));

vi.mock('./components/LoginPage', () => ({
  LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('./components/AppShell', () => ({
  AppShell: () => <div data-testid="app-shell">App Shell</div>,
}));

const mockUseAuth = vi.fn();
const mockUseData = vi.fn();
const mockUseUI = vi.fn();

vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => mockUseAuth(),
}));

vi.mock('./context/DataContext', () => ({
  DataProvider: ({ children }) => <div data-testid="data-provider">{children}</div>,
  useData: () => mockUseData(),
}));

vi.mock('./context/UIProvider', () => ({
  UIProvider: ({ children }) => <div data-testid="ui-provider">{children}</div>,
  useUI: () => mockUseUI(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });
    mockUseData.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      retry: vi.fn(),
    });
    mockUseUI.mockReturnValue({
      chatDrawerOpen: false,
      toggleChatDrawer: vi.fn(),
      openChatDrawer: vi.fn(),
      closeChatDrawer: vi.fn(),
      chatInputPrefill: '',
      setChatInputPrefill: vi.fn(),
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });
  });

  it('renders login page when user is not authenticated', () => {
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('app-shell')).not.toBeInTheDocument();
  });

  it('renders app shell when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'CIO' },
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('renders data provider and ui provider when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'CIO' },
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('data-provider')).toBeInTheDocument();
    expect(screen.getByTestId('ui-provider')).toBeInTheDocument();
  });

  it('switches from login to app shell after authentication changes', async () => {
    const { rerender } = render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();

    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'CIO' },
      login: vi.fn(),
      logout: vi.fn(),
    });

    rerender(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('switches from app shell to login after logout', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'CIO' },
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { rerender } = render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();

    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    rerender(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('app-shell')).not.toBeInTheDocument();
  });

  it('renders auth provider wrapper', () => {
    render(<App />);
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('handles login with valid credentials', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handles login failure gracefully', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: false, error: 'Invalid credentials' });
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders without crashing when data context has loading state', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'CIO' },
      login: vi.fn(),
      logout: vi.fn(),
    });

    mockUseData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      retry: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
  });

  it('renders without crashing when data context has error state', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User', role: 'CIO' },
      login: vi.fn(),
      logout: vi.fn(),
    });

    mockUseData.mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Failed to load data',
      retry: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
  });
});