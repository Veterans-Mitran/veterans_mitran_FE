const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
  meta: any;
}

interface LoginData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  created_on: string;
  modified_on: string | null;
  is_deleted: boolean;
  is_archived: boolean;
}

export const api = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result: ApiResponse<LoginData> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || result.errors || 'Login failed');
    }

    return result.data;
  },

  createUser: async (username: string, email: string, password: string, role: string = 'user') => {
    const response = await fetch(`${API_BASE_URL}/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    const result: ApiResponse<UserData> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || result.errors || 'Registration failed');
    }

    return result.data;
  },

  getCurrentUserProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<UserData> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch user profile');
    }

    return result.data;
  },
};
