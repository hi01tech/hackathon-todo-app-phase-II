import { apiClient } from '@/lib/api-client';

// Mock the auth-client module
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    token: jest.fn().mockResolvedValue({
      data: { token: 'mock-jwt-token' },
      error: null,
    }),
  },
}));

// Mock the global fetch function
global.fetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('login', () => {
    it('makes a POST request to /auth/login', async () => {
      const mockResponse = { user: { id: '1', email: 'test@example.com' }, token: 'jwt-token' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await apiClient.login('test@example.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('makes a POST request to /auth/register', async () => {
      const mockResponse = { user: { id: '1', email: 'new@example.com' }, token: 'jwt-token' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await apiClient.register('new@example.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'new@example.com', password: 'password123' }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTasks', () => {
    it('makes a GET request to /tasks with authentication header', async () => {
      const mockResponse = { tasks: [{ id: '1', title: 'Test Task' }] };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await apiClient.getTasks();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/tasks',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createTask', () => {
    it('makes a POST request to /tasks with authentication header', async () => {
      const taskData = { title: 'New Task', description: 'Task description' };
      const mockResponse = { id: '1', ...taskData, completed: false };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await apiClient.createTask(taskData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/tasks',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(taskData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('toggleTaskCompletion', () => {
    it('makes a PATCH request to /tasks/:id/toggle', async () => {
      const taskId = '123';
      const mockResponse = { id: taskId, title: 'Test Task', completed: true };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await apiClient.toggleTaskCompletion(taskId);

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8000/api/tasks/${taskId}/toggle`,
        expect.objectContaining({
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});