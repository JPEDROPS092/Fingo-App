import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize auth token from localStorage if available
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('financeAppToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    console.log('Auth token loaded from localStorage');
  }
}

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // For debugging purposes
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Get token from localStorage if in browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('financeAppToken');
      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Token ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      console.error('Authentication error, redirecting to login');
      // Clear auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeAppToken');
        localStorage.removeItem('financeAppUser');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
const authService = {
  login: async (username: string, password: string) => {
    try {
      console.log('Attempting login for:', username);
      const response = await api.post('/users/login/', { username, password });
      
      if (response.data && response.data.token) {
        console.log('Login successful, setting token');
        // Store token in localStorage
        localStorage.setItem('financeAppToken', response.data.token);
        
        // Store user info
        localStorage.setItem('financeAppUser', JSON.stringify({
          username: response.data.username,
          id: response.data.user_id,
          email: response.data.email
        }));
        
        // Update Authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        
        return response.data;
      } else {
        console.error('Login response missing token:', response.data);
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    try {
      console.log('Logging out user');
      // Clear localStorage
      localStorage.removeItem('financeAppToken');
      localStorage.removeItem('financeAppUser');
      
      // Clear Authorization header
      delete api.defaults.headers.common['Authorization'];
      
      // Force redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  register: async (username: string, email: string, password: string, password2: string, firstName?: string, lastName?: string) => {
    const response = await api.post('/users/register/', { 
      username, 
      email, 
      password, 
      password2,
      first_name: firstName || '',
      last_name: lastName || ''
    });
    
    if (response.data.token) {
      localStorage.setItem('financeAppToken', response.data.token);
      localStorage.setItem('financeAppUser', JSON.stringify({
        username: response.data.user.username,
        id: response.data.user.id,
        email: response.data.user.email
      }));
    }
    
    return response.data;
  },
  
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('financeAppUser');
      if (userStr) return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('financeAppToken');
    }
    return false;
  },
  
  validateToken: async () => {
    try {
      return await api.get('/users/me/');
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeAppToken');
        localStorage.removeItem('financeAppUser');
      }
      throw error;
    }
  }
};

// Accounts Service
const accountsService = {
  getAll: async () => {
    return await api.get('/accounts/');
  },
  
  getById: async (id: string) => {
    return await api.get(`/accounts/${id}/`);
  },
  
  create: async (accountData: any) => {
    return await api.post('/accounts/', accountData);
  },
  
  update: async (id: string, accountData: any) => {
    return await api.put(`/accounts/${id}/`, accountData);
  },
  
  delete: async (id: string) => {
    return await api.delete(`/accounts/${id}/`);
  },
  
  deposit: async (id: string, amount: number) => {
    return await api.post(`/accounts/${id}/deposit/`, { amount });
  },
  
  withdraw: async (id: string, amount: number) => {
    return await api.post(`/accounts/${id}/withdraw/`, { amount });
  },
  
  getTotalBalance: async () => {
    return await api.get('/accounts/total_balance/');
  }
};

// Transactions Service
const transactionsService = {
  getAll: async (params?: any) => {
    return await api.get('/transactions/', { params });
  },
  
  getById: async (id: string) => {
    return await api.get(`/transactions/${id}/`);
  },
  
  create: async (transactionData: any) => {
    return await api.post('/transactions/', transactionData);
  },
  
  update: async (id: string, transactionData: any) => {
    return await api.put(`/transactions/${id}/`, transactionData);
  },
  
  delete: async (id: string) => {
    return await api.delete(`/transactions/${id}/`);
  },
  
  getRecent: async () => {
    return await api.get('/transactions/recent/');
  },
  
  getStats: async () => {
    return await api.get('/transactions/stats/');
  }
};

// Categories Service
const categoriesService = {
  getAll: async () => {
    return await api.get('/categories/');
  },
  
  getById: async (id: string) => {
    return await api.get(`/categories/${id}/`);
  },
  
  create: async (categoryData: any) => {
    return await api.post('/categories/', categoryData);
  },
  
  update: async (id: string, categoryData: any) => {
    return await api.put(`/categories/${id}/`, categoryData);
  },
  
  delete: async (id: string) => {
    return await api.delete(`/categories/${id}/`);
  }
};

// Goals Service
const goalsService = {
  getAll: async (params?: any) => {
    return await api.get('/goals/', { params });
  },
  
  getById: async (id: string) => {
    return await api.get(`/goals/${id}/`);
  },
  
  create: async (goalData: any) => {
    return await api.post('/goals/', goalData);
  },
  
  update: async (id: string, goalData: any) => {
    return await api.put(`/goals/${id}/`, goalData);
  },
  
  delete: async (id: string) => {
    return await api.delete(`/goals/${id}/`);
  },
  
  contribute: async (id: string, amount: number, updateAccount: boolean = false) => {
    return await api.post(`/goals/${id}/contribute/`, { amount, update_account: updateAccount });
  },
  
  getSummary: async () => {
    return await api.get('/goals/summary/');
  }
};

// Export all services as a default export
const apiServices = {
  api,
  authService,
  accountsService,
  transactionsService,
  categoriesService,
  goalsService
};

export default apiServices;
export { api, authService, accountsService, transactionsService, categoriesService, goalsService };
