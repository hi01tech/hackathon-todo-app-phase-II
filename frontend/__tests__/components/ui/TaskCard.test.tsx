import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '@/components/ui/TaskCard';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('TaskCard', () => {
  const mockOnToggleComplete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays completed task with strikethrough', () => {
    const completedTask = { ...mockTask, completed: true };

    render(
      <TaskCard
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const titleElement = screen.getByText('Test Task');
    expect(titleElement).toHaveClass('line-through');
  });

  it('calls onToggleComplete when toggle button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const toggleButton = screen.getByLabelText(/Mark as complete/i);
    fireEvent.click(toggleButton);

    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByLabelText(/Edit task/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);

    render(
      <TaskCard
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText(/Delete task/i);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});