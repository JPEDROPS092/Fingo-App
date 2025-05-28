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
    // Tratar erros de autenticação
    if (error.response) {
      const status = error.response.status;
      
      // Erro de autenticação (401) ou autorização (403)
      if (status === 401) {
        console.error('Erro de autenticação, redirecionando para login');
        
        // Limpar dados de autenticação
        if (typeof window !== 'undefined') {
          localStorage.removeItem('financeAppToken');
          localStorage.removeItem('financeAppUser');
          // Redirecionar para página de login
          window.location.href = '/login';
        }
      } 
      else if (status === 403) {
        console.error('Acesso negado');
        // Tratar erros de permissão
      }
      else if (status === 500) {
        console.error('Erro interno do servidor');
        // Mostrar mensagem amigável para o usuário
      }
      
      // Extrair mensagem de erro da resposta
      let errorMessage = 'Ocorreu um erro na solicitação';
      
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } 
        else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        }
      }
      
      // Adicionar informações de erro ao objeto de erro
      error.userMessage = errorMessage;
    } 
    else if (error.request) {
      // Requisição feita, mas não recebeu resposta
      error.userMessage = 'O servidor não respondeu. Verifique sua conexão.';
      console.error('Sem resposta do servidor:', error.request);
    } 
    else {
      // Algo aconteceu ao configurar a requisição
      error.userMessage = 'Erro ao fazer a solicitação.';
      console.error('Erro de requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Formatador de resposta comum para todos os serviços
const formatResponse = (promise) => {
  return promise
    .then(response => ({ 
      data: response.data, 
      success: true, 
      error: null 
    }))
    .catch(error => ({
      data: null,
      success: false,
      error: error.userMessage || 'Erro desconhecido'
    }));
};

// Auth Service
const authService = {
  login: async (username: string, password: string) => {
    try {
      console.log('Tentando login para:', username);
      const response = await api.post('/users/login/', { username, password });
      
      if (response.data && response.data.token) {
        console.log('Login bem-sucedido, configurando token');
        // Armazenar token no localStorage
        localStorage.setItem('financeAppToken', response.data.token);
        
        // Armazenar informações do usuário
        localStorage.setItem('financeAppUser', JSON.stringify({
          username: response.data.username,
          id: response.data.user_id,
          email: response.data.email
        }));
        
        // Atualizar cabeçalho Authorization para requisições futuras
        api.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        
        return response.data;
      } else {
        console.error('Resposta de login sem token:', response.data);
        throw new Error('Resposta de login inválida');
      }
    } catch (error) {
      console.error('Erro de login:', error);
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
      console.error('Validação de token falhou:', error);
      // Limpar token inválido
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
  getAll: async () => formatResponse(api.get('/accounts/')),
  
  getById: async (id: string) => formatResponse(api.get(`/accounts/${id}/`)),
  
  create: async (accountData: any) => formatResponse(api.post('/accounts/', accountData)),
  
  update: async (id: string, accountData: any) => formatResponse(api.put(`/accounts/${id}/`, accountData)),
  
  delete: async (id: string) => formatResponse(api.delete(`/accounts/${id}/`)),
  
  deposit: async (id: string, amount: number) => formatResponse(api.post(`/accounts/${id}/deposit/`, { amount })),
  
  withdraw: async (id: string, amount: number) => formatResponse(api.post(`/accounts/${id}/withdraw/`, { amount })),
  
  getTotalBalance: async () => formatResponse(api.get('/accounts/total_balance/')),
  
  getStats: async () => formatResponse(api.get('/accounts/stats/'))
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
