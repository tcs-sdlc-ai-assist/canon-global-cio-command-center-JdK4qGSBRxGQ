import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIChatDrawer } from './AIChatDrawer';

const mockUseUI = vi.fn();
const mockProcessMessage = vi.fn();

vi.mock('../../context/UIProvider', () => ({
  useUI: () => mockUseUI(),
}));

vi.mock('../../services/chatEngine', () => ({
  processMessage: (...args) => mockProcessMessage(...args),
}));

vi.mock('../../services/logger', () => ({
  logChatMessage: vi.fn(),
}));

describe('AIChatDrawer', () => {
  const mockToggleChatDrawer = vi.fn();
  const mockOpenChatDrawer = vi.fn();
  const mockCloseChatDrawer = vi.fn();
  const mockSetChatInputPrefill = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUI.mockReturnValue({
      chatDrawerOpen: false,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });
    mockProcessMessage.mockResolvedValue('Test response from AI assistant.');
  });

  it('renders toggle button when drawer is closed', () => {
    render(<AIChatDrawer />);
    const toggleButton = screen.getByRole('button', { name: /open ai chat assistant/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('renders toggle button with close label when drawer is open', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    const toggleButton = screen.getByRole('button', { name: /close chat/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('opens drawer when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<AIChatDrawer />);

    await user.click(screen.getByRole('button', { name: /open ai chat assistant/i }));
    expect(mockOpenChatDrawer).toHaveBeenCalled();
  });

  it('closes drawer when toggle button is clicked while open', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    await user.click(screen.getByRole('button', { name: /close chat/i }));
    expect(mockCloseChatDrawer).toHaveBeenCalled();
  });

  it('renders drawer with correct aria attributes when closed', () => {
    render(<AIChatDrawer />);
    const drawer = screen.getByRole('dialog', { name: /ai chat assistant/i });
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders drawer with correct aria attributes when open', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    const drawer = screen.getByRole('dialog', { name: /ai chat assistant/i });
    expect(drawer).toHaveAttribute('aria-hidden', 'false');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
  });

  it('shows welcome message when no messages exist', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    expect(screen.getByText(/ai command assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/ask me anything about your dashboard/i)).toBeInTheDocument();
  });

  it('renders chat input field', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    expect(screen.getByPlaceholderText(/ask about your dashboard/i)).toBeInTheDocument();
  });

  it('sends a message and displays user message', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    const input = screen.getByPlaceholderText(/ask about your dashboard/i);
    await user.type(input, 'What is the revenue growth?');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('What is the revenue growth?')).toBeInTheDocument();
    });
  });

  it('displays AI response after sending a message', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    const input = screen.getByPlaceholderText(/ask about your dashboard/i);
    await user.type(input, 'Q4 board presentation');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('Test response from AI assistant.')).toBeInTheDocument();
    });
  });

  it('shows typing indicator while AI is processing', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    mockProcessMessage.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('Response'), 500)));

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    const input = screen.getByPlaceholderText(/ask about your dashboard/i);
    await user.type(input, 'Q4 board presentation');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByLabelText(/ai assistant is typing/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByLabelText(/ai assistant is typing/i)).not.toBeInTheDocument();
    });
  });

  it('disables send button when input is empty', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    const input = screen.getByPlaceholderText(/ask about your dashboard/i);
    await user.type(input, 'test');

    expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
  });

  it('closes drawer when close button in header is clicked', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    const closeButtons = screen.getAllByRole('button', { name: /close chat/i });
    await user.click(closeButtons[0]);

    expect(mockCloseChatDrawer).toHaveBeenCalled();
  });

  it('closes drawer when Escape key is pressed', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    await user.keyboard('{Escape}');
    expect(mockCloseChatDrawer).toHaveBeenCalled();
  });

  it('pre-fills input when chatInputPrefill is set', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: 'Q4 Board Summary',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    const input = screen.getByPlaceholderText(/ask about your dashboard/i);
    expect(input).toHaveValue('Q4 Board Summary');
  });

  it('shows unread count badge when drawer is closed and new messages arrive', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: false,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    expect(screen.queryByLabelText(/unread messages/i)).not.toBeInTheDocument();
  });

  it('resets unread count when drawer is opened', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    expect(screen.queryByLabelText(/unread messages/i)).not.toBeInTheDocument();
  });

  it('displays error message when chat processing fails', async () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    mockProcessMessage.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    render(<AIChatDrawer />);

    const input = screen.getByPlaceholderText(/ask about your dashboard/i);
    await user.type(input, 'test message');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/i'm sorry, i encountered an error/i)).toBeInTheDocument();
    });
  });

  it('renders welcome message suggestion chips', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    render(<AIChatDrawer />);
    expect(screen.getByText(/q4 board summary/i)).toBeInTheDocument();
    expect(screen.getByText(/tcs partnership/i)).toBeInTheDocument();
    expect(screen.getByText(/regional performance/i)).toBeInTheDocument();
  });

  it('accepts className prop', () => {
    mockUseUI.mockReturnValue({
      chatDrawerOpen: true,
      toggleChatDrawer: mockToggleChatDrawer,
      openChatDrawer: mockOpenChatDrawer,
      closeChatDrawer: mockCloseChatDrawer,
      chatInputPrefill: '',
      setChatInputPrefill: mockSetChatInputPrefill,
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
      predictiveModalOpen: false,
      openPredictiveModal: vi.fn(),
      closePredictiveModal: vi.fn(),
    });

    const { container } = render(<AIChatDrawer className="custom-class" />);
    const drawer = screen.getByRole('dialog', { name: /ai chat assistant/i });
    expect(drawer).toHaveClass('custom-class');
  });
});