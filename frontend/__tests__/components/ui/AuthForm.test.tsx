import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/ui/AuthForm';

// Mock the apiClient module
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AuthForm', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<AuthForm type="login" />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders signup form correctly', () => {
    render(<AuthForm type="signup" />);

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('handles login submission', async () => {
    const mockLoginResponse = { token: 'mock-jwt-token', user: { id: '1', email: 'test@example.com' } };
    const { apiClient } = require('@/lib/api-client');
    apiClient.login.mockResolvedValue(mockLoginResponse);

    render(<AuthForm type="login" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(apiClient.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles signup submission', async () => {
    const mockRegisterResponse = { token: 'mock-jwt-token', user: { id: '2', email: 'new@example.com' } };
    const { apiClient } = require('@/lib/api-client');
    apiClient.register.mockResolvedValue(mockRegisterResponse);

    render(<AuthForm type="signup" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(apiClient.register).toHaveBeenCalledWith('new@example.com', 'password123');
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('shows error message on failed login', async () => {
    const { apiClient } = require('@/lib/api-client');
    apiClient.login.mockRejectedValue(new Error('Invalid credentials'));

    render(<AuthForm type="login" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Failed to login')).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    const { apiClient } = require('@/lib/api-client');
    apiClient.login.mockResolvedValue({ token: 'mock-jwt-token' });

    render(<AuthForm type="login" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } }); // Less than 6 chars
    fireEvent.click(screen.getByText('Sign In'));

    // Check if form validation prevented submission
    expect(apiClient.login).not.toHaveBeenCalled();
  });
});