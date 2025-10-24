/**
 * API client for backend communication
 */
import axios, { AxiosError } from 'axios';

// API URL - Use Render backend in production, localhost in development
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://sql-compiler-1.onrender.com'
  : 'http://localhost:8000';

// Log API URL for debugging
console.log('API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Note: No auth token needed - using Firebase authentication on frontend only
// Backend query execution endpoint doesn't require authentication

// Types
export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  username: string;
}

export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  success: boolean;
  data?: any[];
  columns?: string[];
  row_count?: number;
  error?: string;
  execution_time?: number;
}

export interface TableInfo {
  table_name: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    primary_key: boolean;
  }>;
  sample_data: any[];
  row_count: number;
}

export interface QueryHistory {
  id: number;
  query: string;
  executed_at: string;
  success: boolean;
  error_message?: string;
}

// API functions
export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },
};

export const queryAPI = {
  execute: async (query: string): Promise<QueryResponse> => {
    const response = await api.post('/api/query/execute', { query });
    return response.data;
  },

  getHistory: async (limit: number = 20): Promise<QueryHistory[]> => {
    const response = await api.get(`/api/query/history?limit=${limit}`);
    return response.data.queries;
  },
};

export const tableAPI = {
  list: async (): Promise<string[]> => {
    const response = await api.get('/api/tables');
    return response.data.tables;
  },

  getInfo: async (tableName: string): Promise<TableInfo> => {
    const response = await api.get(`/api/tables/${tableName}`);
    return response.data;
  },
};

// Error handler
export const handleAPIError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail: string }>;
    console.error('API Error:', {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      url: axiosError.config?.url
    });
    return axiosError.response?.data?.detail || axiosError.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

export default api;
