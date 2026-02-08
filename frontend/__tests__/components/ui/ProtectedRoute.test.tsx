import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ui/ProtectedRoute';

// Mock the modules used in the component
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    getSession: jest.fn().mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' }, session: { id: 'session-1' } },
      error: null,
    }),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when authenticated', async () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('shows loading spinner initially', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Initially, we should see the loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument(); // The spinner div
  });

  it('redirects to login when not authenticated', async () => {
    // Mock authClient to return no session (not authenticated)
    const { authClient } = jest.requireMock('@/lib/auth-client');
    authClient.getSession.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: 'Not authenticated',
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});