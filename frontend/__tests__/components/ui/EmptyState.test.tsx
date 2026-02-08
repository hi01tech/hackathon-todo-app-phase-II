import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders title correctly', () => {
    render(<EmptyState title="No items found" />);

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="No items found" description="There are no items to display" />);

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="No items found" />);

    expect(screen.queryByText('There are no items to display')).not.toBeInTheDocument();
  });

  it('renders default icon when no icon is provided', () => {
    render(<EmptyState title="No items found" />);

    // Check if the default mail icon SVG is present
    const icon = screen.getByRole('img'); // The SVG should have role="img" or be contained in an element with aria-label
    expect(icon).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">Custom Icon</span>;
    render(<EmptyState title="No items found" icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    const action = <button data-testid="empty-state-action">Create Item</button>;
    render(<EmptyState title="No items found" action={action} />);

    expect(screen.getByTestId('empty-state-action')).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<EmptyState title="No items found" />);

    expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<EmptyState title="No items found" />);

    const container = screen.getByText('No items found').closest('div');
    expect(container).toHaveClass('text-center', 'py-12');
  });
});