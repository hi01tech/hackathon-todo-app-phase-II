import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '@/components/ui/TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for creating a new task', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('renders correctly for editing an existing task', () => {
    const task = {
      id: '1',
      title: 'Existing Task',
      description: 'Existing Description',
      completed: false,
    };

    render(
      <TaskForm
        task={task}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
  });

  it('submits the form with correct data', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const titleInput = screen.getByLabelText(/Title \*/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByText('Create Task');

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task Title',
      description: 'New Task Description',
    });
  });

  it('validates required title field', () => {
    // Mock alert to capture the validation message
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Create Task');
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Title is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('handles cancel action', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});