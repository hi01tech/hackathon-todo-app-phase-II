import { authClient } from './auth-client';

interface ApiClientOptions {
  authenticated?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {}
  ): Promise<T> {
    const { authenticated = true, ...requestOptions } = options;

    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...requestOptions,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...requestOptions.headers,
      },
    };

    // Add authentication header if required
    if (authenticated) {
      try {
        // Get backend-compatible HS256 JWT token from our custom endpoint
        const tokenResponse = await fetch('/api/token', {
          credentials: 'include',
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          if (tokenData.token) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${tokenData.token}`;
          }
        }
      } catch (err) {
        // Token retrieval failed - request will proceed without auth header
        console.error('Failed to get auth token:', err);
      }
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || parsedError.error || errorMessage;
        } catch {
          // If error data is not JSON, use the raw text
          errorMessage = errorData || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Handle responses without body (like DELETE requests)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      authenticated: false,
    });
  }

  async register(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      authenticated: false,
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me', {
      method: 'GET',
    });
  }

  // Task methods
  async getTasks() {
    const response = await this.request<any[]>('/tasks', {
      method: 'GET',
    });

    // Backend returns array directly, not wrapped in { tasks: [] }
    // Normalize to { tasks: [] } format for frontend
    if (Array.isArray(response)) {
      return { tasks: response };
    }

    // If already in correct format
    return response;
  }

  async createTask(task: { title: string; description?: string }) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: { title: string; description?: string }) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string) {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(id: string) {
    return this.request<any>(`/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient();