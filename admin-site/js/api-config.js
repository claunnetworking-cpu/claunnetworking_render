/**
 * Configuração da API para comunicação com o backend
 */

// Configuração base da API
const API_CONFIG = {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
};

// Classe para gerenciar chamadas à API
class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.timeout = API_CONFIG.timeout;
        this.headers = API_CONFIG.headers;
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: { ...this.headers },
            credentials: 'include', // Para incluir cookies de sessão
            ...options
        };

        // Adicionar body se for POST/PUT/PATCH
        if (options.data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = JSON.stringify(options.data);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Métodos de autenticação
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            data: userData
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            data: credentials
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST'
        });
    }

    // Métodos para vagas
    async getJobs(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/jobs?${queryParams}` : '/jobs';
        return this.request(endpoint);
    }

    async createJob(jobData) {
        return this.request('/jobs', {
            method: 'POST',
            data: jobData
        });
    }

    async applyToJob(applicationData) {
        return this.request('/jobs/apply', {
            method: 'POST',
            data: applicationData
        });
    }

    // Métodos para cursos
    async getCourses(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/courses?${queryParams}` : '/courses';
        return this.request(endpoint);
    }

    async createCourse(courseData) {
        return this.request('/courses', {
            method: 'POST',
            data: courseData
        });
    }
}

// Instância global da API
const api = new APIClient();

// Funções utilitárias para o frontend
const APIUtils = {
    // Mostrar mensagens de erro
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.textContent = message;
        
        // Adicionar ao topo da página
        document.body.insertBefore(errorDiv, document.body.firstChild);
        
        // Remover após 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    },

    // Mostrar mensagens de sucesso
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        
        // Adicionar ao topo da página
        document.body.insertBefore(successDiv, document.body.firstChild);
        
        // Remover após 3 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    },

    // Verificar se o usuário está logado
    isLoggedIn() {
        return localStorage.getItem('user') !== null;
    },

    // Obter dados do usuário logado
    getCurrentUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },

    // Salvar dados do usuário
    setCurrentUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    },

    // Limpar dados do usuário
    clearCurrentUser() {
        localStorage.removeItem('user');
    },

    // Redirecionar para login se não estiver autenticado
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    }
};

// Exportar para uso global
window.api = api;
window.APIUtils = APIUtils;
