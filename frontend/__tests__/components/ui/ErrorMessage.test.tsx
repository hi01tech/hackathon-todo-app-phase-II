import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '@/components/ui/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message correctly', () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('does not show retry button when showRetry is false', () => {
    render(<ErrorMessage message="Something went wrong" showRetry={false} />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('shows retry button when showRetry is true and onRetry is provided', () => {
    const mockOnRetry = jest.fn();
    render(
      <ErrorMessage
        message="Something went wrong"
        showRetry={true}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Retry')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Retry'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Something went wrong" showRetry={true} />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<ErrorMessage message="Something went wrong" />);

    const errorContainer = screen.getByText('Error').closest('div');
    expect(errorContainer).toHaveClass('bg-red-50', 'border', 'border-red-200', 'text-red-700');
  });
});