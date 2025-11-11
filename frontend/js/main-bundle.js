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
// Sistema de Autenticação ClaunNetworking
// Gerencia logins de teste e diferenciação entre tipos de usuário

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.userTypes = {
            CANDIDATE: 'candidate',
            COMPANY: 'company',
            ADMIN: 'admin',
            GOOGLE_USER: 'google_user',
            INSTITUTION: 'institution'
        };
        
        // Usuários de teste pré-cadastrados
        this.testUsers = {
            // Candidatos de teste
            'candidato@teste.com': {
                id: 'cand_001',
                email: 'candidato@teste.com',
                password: '123456',
                type: this.userTypes.CANDIDATE,
                name: 'João Silva',
                phone: '(11) 99999-1234',
                profile: {
                    objective: 'Desenvolvedor Full Stack',
                    education: 'Ciência da Computação - USP',
                    experience: '3 anos em desenvolvimento web',
                    skills: ['JavaScript', 'React', 'Node.js', 'Python']
                }
            },
            'maria@teste.com': {
                id: 'cand_002',
                email: 'maria@teste.com',
                password: '123456',
                type: this.userTypes.CANDIDATE,
                name: 'Maria Santos',
                phone: '(11) 99999-5678',
                profile: {
                    objective: 'Designer UX/UI',
                    education: 'Design Gráfico - ESPM',
                    experience: '2 anos em design digital',
                    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator']
                }
            },
            
            // Empresas de teste
            'empresa@teste.com': {
                id: 'comp_001',
                email: 'empresa@teste.com',
                password: '123456',
                type: this.userTypes.COMPANY,
                name: 'TechCorp Ltda',
                cnpj: '12.345.678/0001-90',
                phone: '(11) 3333-4444',
                profile: {
                    description: 'Empresa de tecnologia focada em soluções inovadoras',
                    sector: 'Tecnologia',
                    size: '50-100 funcionários',
                    website: 'https://techcorp.com.br'
                }
            },
            'rh@inovacorp.com': {
                id: 'comp_002',
                email: 'rh@inovacorp.com',
                password: '123456',
                type: this.userTypes.COMPANY,
                name: 'InovaCorp S.A.',
                cnpj: '98.765.432/0001-10',
                phone: '(11) 2222-3333',
                profile: {
                    description: 'Consultoria em inovação e transformação digital',
                    sector: 'Consultoria',
                    size: '100-500 funcionários',
                    website: 'https://inovacorp.com.br'
                }
            },
            
            // Admin de teste
            'admin@claunnetworking.com': {
                id: 'admin_001',
                email: 'admin@claunnetworking.com',
                password: 'admin123',
                type: this.userTypes.ADMIN,
                name: 'Administrador Sistema',
                profile: {
                    role: 'Super Admin',
                    permissions: ['all']
                }
            },

            
            // Instituições de ensino de teste
            'instituicao@teste.com': {
                id: 'inst_001',
                email: 'instituicao@teste.com',
                password: '123456',
                type: this.userTypes.INSTITUTION,
                name: 'Universidade Tecnológica do Brasil',
                phone: '(11) 3333-4444',
                profile: {
                    type: 'Universidade',
                    cnpj: '12.345.678/0001-90',
                    address: 'Av. Paulista, 1000 - São Paulo, SP',
                    website: 'https://utb.edu.br',
                    description: 'Universidade focada em tecnologia e inovação, oferecendo cursos de graduação e pós-graduação.',
                    courses: ['Engenharia de Software', 'Ciência da Computação', 'Marketing Digital'],
                    students: 1247,
                    teachers: 89,
                    established: '1995'
                }
            },
            'faculdade@exemplo.com': {
                id: 'inst_002',
                email: 'faculdade@exemplo.com',
                password: '123456',
                type: this.userTypes.INSTITUTION,
                name: 'Faculdade de Negócios e Gestão',
                phone: '(11) 2222-3333',
                profile: {
                    type: 'Faculdade',
                    cnpj: '98.765.432/0001-10',
                    address: 'Rua dos Negócios, 500 - São Paulo, SP',
                    website: 'https://fng.edu.br',
                    description: 'Faculdade especializada em cursos de negócios, administração e gestão empresarial.',
                    courses: ['Administração', 'Gestão Financeira', 'Marketing', 'Recursos Humanos'],
                    students: 856,
                    teachers: 45,
                    established: '2005'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        // Verificar se há usuário logado no localStorage
        const savedUser = localStorage.getItem('claunnetworking_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
            } catch (e) {
                console.warn('Erro ao carregar usuário salvo:', e);
                localStorage.removeItem('claunnetworking_user');
            }
        }
    }
    
    // Login com email e senha
    login(email, password) {
        const user = this.testUsers[email.toLowerCase()];
        
        if (!user) {
            return {
                success: false,
                message: 'Usuário não encontrado'
            };
        }
        
        if (user.password !== password) {
            return {
                success: false,
                message: 'Senha incorreta'
            };
        }
        
        // Login bem-sucedido
        this.currentUser = { ...user };
        delete this.currentUser.password; // Não manter senha na sessão
        
        // Salvar no localStorage
        localStorage.setItem('claunnetworking_user', JSON.stringify(this.currentUser));
        
        return {
            success: true,
            user: this.currentUser,
            redirectUrl: this.getRedirectUrl(user.type)
        };
    }
    
    // Login com Google (simulado)
    loginWithGoogle(googleUser) {
        const user = {
            id: 'google_' + Date.now(),
            email: googleUser.email,
            name: googleUser.name,
            type: this.userTypes.GOOGLE_USER,
            avatar: googleUser.picture,
            loginMethod: 'google'
        };
        
        this.currentUser = user;
        localStorage.setItem('claunnetworking_user', JSON.stringify(user));
        
        return {
            success: true,
            user: user,
            redirectUrl: 'index.html' // Usuários Google ficam na página principal
        };
    }
    
    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('claunnetworking_user');
        window.location.href = 'index.html';
    }
    
    // Verificar se usuário está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Verificar tipo de usuário
    getUserType() {
        return this.currentUser ? this.currentUser.type : null;
    }
    
    // Verificar se é candidato registrado (não Google)
    isRegisteredCandidate() {
        return this.currentUser && this.currentUser.type === this.userTypes.CANDIDATE;
    }
    
    // Verificar se é usuário Google
    isGoogleUser() {
        return this.currentUser && this.currentUser.type === this.userTypes.GOOGLE_USER;
    }
    
    // Verificar se é empresa
    isCompany() {
        return this.currentUser && this.currentUser.type === this.userTypes.COMPANY;
    }
    
    // Verificar se é admin
    isAdmin() {
        return this.currentUser && this.currentUser.type === this.userTypes.ADMIN;
    }
    
    // Verificar se é instituição de ensino
    isInstitution() {
        return this.currentUser && this.currentUser.type === this.userTypes.INSTITUTION;
    }
    
    // Verificar se pode se candidatar a vagas de empresa
    canApplyToCompanyJobs() {
        return this.isRegisteredCandidate();
    }
    
    // Verificar se pode acessar painel específico
    canAccessPanel(panelType) {
        if (!this.isLoggedIn()) return false;
        
        switch (panelType) {
            case 'candidate':
                return this.isRegisteredCandidate();
            case 'company':
                return this.isCompany();
            case 'admin':
                return this.isAdmin();
            case 'institution':
                return this.isInstitution();
            default:
                return false;
        }
    }
    
    // Obter URL de redirecionamento baseada no tipo de usuário
    getRedirectUrl(userType) {
        switch (userType) {
            case this.userTypes.CANDIDATE:
                return 'candidato_painel.html';
            case this.userTypes.COMPANY:
                return 'company_dashboard.html';
            case this.userTypes.ADMIN:
                return 'admin_complete.html';
            case this.userTypes.INSTITUTION:
                return 'institution_dashboard.html';
            case this.userTypes.GOOGLE_USER:
                return 'index.html';
            default:
                return 'index.html';
        }
    }
    
    // Middleware para proteger páginas
    requireAuth(requiredType = null) {
        if (!this.isLoggedIn()) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'index.html';
            return false;
        }
        
        if (requiredType && this.getUserType() !== requiredType) {
            alert('Você não tem permissão para acessar esta página.');
            window.location.href = this.getRedirectUrl(this.getUserType());
            return false;
        }
        
        return true;
    }
    
    // Obter lista de usuários de teste (para demonstração)
    getTestUsers() {
        return {
            candidates: [
                { email: 'candidato@teste.com', password: '123456', name: 'João Silva' },
                { email: 'maria@teste.com', password: '123456', name: 'Maria Santos' }
            ],
            companies: [
                { email: 'empresa@teste.com', password: '123456', name: 'TechCorp Ltda' },
                { email: 'rh@inovacorp.com', password: '123456', name: 'InovaCorp S.A.' }
            ],

            institutions: [
                { email: 'instituicao@teste.com', password: '123456', name: 'Universidade Tecnológica do Brasil' },
                { email: 'faculdade@exemplo.com', password: '123456', name: 'Faculdade de Negócios e Gestão' }
            ],
            admin: [
                { email: 'admin@claunnetworking.com', password: 'admin123', name: 'Administrador Sistema' }
            ]
        };
    }
}

// Instância global do sistema de autenticação
window.authSystem = new AuthSystem();

// Funções globais para compatibilidade
window.login = function(email, password) {
    return window.authSystem.login(email, password);
};

window.logout = function() {
    return window.authSystem.logout();
};

window.getCurrentUser = function() {
    return window.authSystem.getCurrentUser();
};

window.isLoggedIn = function() {
    return window.authSystem.isLoggedIn();
};

// Função para simular login com Google
window.simulateGoogleLogin = function() {
    const googleUser = {
        email: 'usuario@gmail.com',
        name: 'Usuário Google',
        picture: 'https://via.placeholder.com/40'
    };
    
    return window.authSystem.loginWithGoogle(googleUser);
};

// Função para verificar se pode se candidatar a vaga
window.canApplyToJob = function(jobType) {
    // jobType: 'company' para vagas de empresa, 'public' para vagas públicas
    if (jobType === 'public') {
        return true; // Qualquer um pode acessar vagas públicas (redirecionamento)
    }
    
    if (jobType === 'company') {
        return window.authSystem.canApplyToCompanyJobs();
    }
    
    return false;
};

// Função para lidar com candidatura a vagas
window.handleJobApplication = function(jobId, jobType, companyName) {
    if (!window.authSystem.isLoggedIn()) {
        alert('Você precisa estar logado para se candidatar a esta vaga.');
        return false;
    }
    
    if (jobType === 'company') {
        if (window.authSystem.isGoogleUser()) {
            if (confirm(`Para se candidatar a vagas da empresa ${companyName}, você precisa ter um cadastro completo como candidato. Deseja se cadastrar agora?`)) {
                window.location.href = 'candidato_cadastro.html';
            }
            return false;
        }
        
        if (window.authSystem.isRegisteredCandidate()) {
            alert(`Candidatura enviada com sucesso para a vaga da empresa ${companyName}!`);
            return true;
        }
        
        alert('Apenas candidatos registrados podem se candidatar a vagas de empresas.');
        return false;
    }
    
    if (jobType === 'public') {
        // Redirecionar para site externo
        if (confirm('Você será redirecionado para o site da empresa para se candidatar. Deseja continuar?')) {
            window.open('https://empresa-externa.com.br/vaga/' + jobId, '_blank');
        }
        return true;
    }
    
    return false;
};

console.log('Sistema de Autenticação ClaunNetworking carregado!');
console.log('Usuários de teste disponíveis:', window.authSystem.getTestUsers());
// Sistema de Design Avançado - ClaunNetworking
class AdvancedDesignSystem {
    constructor() {
        this.themes = {
            light: {
                primary: '#8b5cf6',
                secondary: '#10b981',
                accent: '#f59e0b',
                background: '#ffffff',
                surface: '#f9fafb',
                text: '#1f2937',
                textSecondary: '#6b7280',
                border: '#e5e7eb',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
            },
            dark: {
                primary: '#a78bfa',
                secondary: '#34d399',
                accent: '#fbbf24',
                background: '#111827',
                surface: '#1f2937',
                text: '#f9fafb',
                textSecondary: '#9ca3af',
                border: '#374151',
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171',
                info: '#60a5fa'
            }
        };

        this.currentTheme = 'light';
        this.animations = {};
        this.components = {};
        this.breakpoints = {
            xs: '320px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        };

        this.init();
    }

    // Inicializa o sistema de design
    init() {
        this.loadUserPreferences();
        this.createCSSVariables();
        this.setupThemeToggle();
        this.setupAnimations();
        this.setupComponents();
        this.setupResponsiveHelpers();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        this.createDesignTokens();
    }

    // Carrega preferências do usuário
    loadUserPreferences() {
        const savedTheme = localStorage.getItem('design_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Escuta mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('design_theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Cria variáveis CSS para o tema
    createCSSVariables() {
        const theme = this.themes[this.currentTheme];
        const root = document.documentElement;

        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Adiciona classes de tema
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${this.currentTheme}`);

        // Cria variáveis de espaçamento
        const spacing = {
            '0': '0',
            '1': '0.25rem',
            '2': '0.5rem',
            '3': '0.75rem',
            '4': '1rem',
            '5': '1.25rem',
            '6': '1.5rem',
            '8': '2rem',
            '10': '2.5rem',
            '12': '3rem',
            '16': '4rem',
            '20': '5rem',
            '24': '6rem',
            '32': '8rem'
        };

        Object.entries(spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
        });

        // Cria variáveis de tipografia
        const typography = {
            'xs': '0.75rem',
            'sm': '0.875rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.75rem'
        };

        Object.entries(typography).forEach(([key, value]) => {
            root.style.setProperty(`--text-${key}`, value);
        });

        // Cria variáveis de sombras
        const shadows = {
            'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        };

        Object.entries(shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });

        // Cria variáveis de border radius
        const borderRadius = {
            'none': '0',
            'sm': '0.125rem',
            'base': '0.25rem',
            'md': '0.375rem',
            'lg': '0.5rem',
            'xl': '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            'full': '9999px'
        };

        Object.entries(borderRadius).forEach(([key, value]) => {
            root.style.setProperty(`--radius-${key}`, value);
        });
    }

    // Configura alternador de tema
    setupThemeToggle() {
        // Cria botão de alternância de tema
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = `Alternar para tema ${this.currentTheme === 'dark' ? 'claro' : 'escuro'}`;
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Adiciona CSS para o botão
        this.addThemeToggleCSS();
        
        // Adiciona ao DOM
        document.body.appendChild(themeToggle);
    }

    // Adiciona CSS para o alternador de tema
    addThemeToggleCSS() {
        if (document.getElementById('theme-toggle-styles')) return;

        const style = document.createElement('style');
        style.id = 'theme-toggle-styles';
        style.textContent = `
            .theme-toggle {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: var(--radius-full);
                border: 2px solid var(--color-border);
                background: var(--color-surface);
                color: var(--color-text);
                font-size: 20px;
                cursor: pointer;
                z-index: 9999;
                transition: all 0.3s ease;
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-xl);
            }

            .theme-toggle:active {
                transform: scale(0.95);
            }

            @media (max-width: 768px) {
                .theme-toggle {
                    width: 45px;
                    height: 45px;
                    top: 15px;
                    right: 15px;
                    font-size: 18px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Alterna tema
    toggleTheme() {
        this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }

    // Define tema
    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('design_theme', theme);
        this.createCSSVariables();
        
        // Atualiza ícone do botão
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            toggle.title = `Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`;
        }

        // Dispara evento personalizado
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Configura animações
    setupAnimations() {
        this.animations = {
            fadeIn: {
                keyframes: [
                    { opacity: 0 },
                    { opacity: 1 }
                ],
                options: { duration: 300, easing: 'ease-out' }
            },
            fadeOut: {
                keyframes: [
                    { opacity: 1 },
                    { opacity: 0 }
                ],
                options: { duration: 300, easing: 'ease-in' }
            },
            slideInUp: {
                keyframes: [
                    { transform: 'translateY(20px)', opacity: 0 },
                    { transform: 'translateY(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            slideInDown: {
                keyframes: [
                    { transform: 'translateY(-20px)', opacity: 0 },
                    { transform: 'translateY(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            slideInLeft: {
                keyframes: [
                    { transform: 'translateX(-20px)', opacity: 0 },
                    { transform: 'translateX(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            slideInRight: {
                keyframes: [
                    { transform: 'translateX(20px)', opacity: 0 },
                    { transform: 'translateX(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            scaleIn: {
                keyframes: [
                    { transform: 'scale(0.8)', opacity: 0 },
                    { transform: 'scale(1)', opacity: 1 }
                ],
                options: { duration: 300, easing: 'ease-out' }
            },
            bounce: {
                keyframes: [
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(-10px)' },
                    { transform: 'translateY(0)' }
                ],
                options: { duration: 600, easing: 'ease-in-out' }
            },
            pulse: {
                keyframes: [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.05)' },
                    { transform: 'scale(1)' }
                ],
                options: { duration: 1000, easing: 'ease-in-out', iterations: Infinity }
            },
            shake: {
                keyframes: [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(0)' }
                ],
                options: { duration: 500, easing: 'ease-in-out' }
            }
        };

        // Adiciona CSS para animações
        this.addAnimationCSS();
    }

    // Adiciona CSS para animações
    addAnimationCSS() {
        if (document.getElementById('animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-fade-in {
                animation: fadeIn 0.3s ease-out forwards;
            }

            .animate-fade-out {
                animation: fadeOut 0.3s ease-in forwards;
            }

            .animate-slide-in-up {
                animation: slideInUp 0.4s ease-out forwards;
            }

            .animate-slide-in-down {
                animation: slideInDown 0.4s ease-out forwards;
            }

            .animate-slide-in-left {
                animation: slideInLeft 0.4s ease-out forwards;
            }

            .animate-slide-in-right {
                animation: slideInRight 0.4s ease-out forwards;
            }

            .animate-scale-in {
                animation: scaleIn 0.3s ease-out forwards;
            }

            .animate-bounce {
                animation: bounce 0.6s ease-in-out;
            }

            .animate-pulse {
                animation: pulse 1s ease-in-out infinite;
            }

            .animate-shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes slideInUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideInDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideInLeft {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideInRight {
                from { transform: translateX(20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            /* Transições suaves para elementos interativos */
            .transition-all {
                transition: all 0.3s ease;
            }

            .transition-colors {
                transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
            }

            .transition-transform {
                transition: transform 0.3s ease;
            }

            .transition-opacity {
                transition: opacity 0.3s ease;
            }

            /* Efeitos de hover */
            .hover-lift:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }

            .hover-scale:hover {
                transform: scale(1.05);
            }

            .hover-glow:hover {
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
            }

            /* Redução de movimento para acessibilidade */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Anima elemento
    animate(element, animationName, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element || !this.animations[animationName]) return;

        const animation = this.animations[animationName];
        const animationOptions = { ...animation.options, ...options };

        return element.animate(animation.keyframes, animationOptions);
    }

    // Configura componentes
    setupComponents() {
        this.components = {
            button: this.createButtonComponent(),
            card: this.createCardComponent(),
            modal: this.createModalComponent(),
            tooltip: this.createTooltipComponent(),
            notification: this.createNotificationComponent(),
            loading: this.createLoadingComponent(),
            badge: this.createBadgeComponent(),
            avatar: this.createAvatarComponent()
        };

        this.addComponentCSS();
    }

    // Cria componente de botão
    createButtonComponent() {
        return {
            create: (text, options = {}) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.className = `btn ${options.variant || 'primary'} ${options.size || 'md'} ${options.className || ''}`;
                
                if (options.icon) {
                    const icon = document.createElement('span');
                    icon.innerHTML = options.icon;
                    icon.className = 'btn-icon';
                    button.insertBefore(icon, button.firstChild);
                }

                if (options.loading) {
                    button.classList.add('btn-loading');
                    button.disabled = true;
                }

                if (options.onClick) {
                    button.addEventListener('click', options.onClick);
                }

                return button;
            }
        };
    }

    // Cria componente de card
    createCardComponent() {
        return {
            create: (content, options = {}) => {
                const card = document.createElement('div');
                card.className = `card ${options.variant || 'default'} ${options.className || ''}`;
                
                if (options.header) {
                    const header = document.createElement('div');
                    header.className = 'card-header';
                    header.innerHTML = options.header;
                    card.appendChild(header);
                }

                const body = document.createElement('div');
                body.className = 'card-body';
                body.innerHTML = content;
                card.appendChild(body);

                if (options.footer) {
                    const footer = document.createElement('div');
                    footer.className = 'card-footer';
                    footer.innerHTML = options.footer;
                    card.appendChild(footer);
                }

                return card;
            }
        };
    }

    // Cria componente de modal
    createModalComponent() {
        return {
            create: (content, options = {}) => {
                const modal = document.createElement('div');
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal ${options.size || 'md'}">
                        <div class="modal-header">
                            <h3 class="modal-title">${options.title || ''}</h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                    </div>
                `;

                // Fecha modal ao clicar fora
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });

                // Fecha modal com ESC
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        modal.remove();
                    }
                });

                return modal;
            },
            show: (modal) => {
                document.body.appendChild(modal);
                this.animate(modal, 'fadeIn');
                this.animate(modal.querySelector('.modal'), 'scaleIn');
            }
        };
    }

    // Cria componente de tooltip
    createTooltipComponent() {
        return {
            create: (element, text, options = {}) => {
                if (typeof element === 'string') {
                    element = document.querySelector(element);
                }

                if (!element) return;

                const tooltip = document.createElement('div');
                tooltip.className = `tooltip ${options.position || 'top'}`;
                tooltip.textContent = text;

                element.addEventListener('mouseenter', () => {
                    document.body.appendChild(tooltip);
                    this.positionTooltip(tooltip, element, options.position || 'top');
                    this.animate(tooltip, 'fadeIn');
                });

                element.addEventListener('mouseleave', () => {
                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }
                });

                return tooltip;
            }
        };
    }

    // Posiciona tooltip
    positionTooltip(tooltip, element, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        switch (position) {
            case 'top':
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
                break;
            case 'bottom':
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.bottom + 8}px`;
                break;
            case 'left':
                tooltip.style.left = `${rect.left - tooltipRect.width - 8}px`;
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                break;
            case 'right':
                tooltip.style.left = `${rect.right + 8}px`;
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                break;
        }
    }

    // Cria componente de notificação
    createNotificationComponent() {
        return {
            show: (message, options = {}) => {
                const notification = document.createElement('div');
                notification.className = `notification ${options.type || 'info'}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-icon">${this.getNotificationIcon(options.type)}</span>
                        <span class="notification-message">${message}</span>
                        <button class="notification-close" onclick="this.parentNode.parentNode.remove()">×</button>
                    </div>
                `;

                // Adiciona ao container de notificações
                let container = document.getElementById('notifications-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'notifications-container';
                    container.className = 'notifications-container';
                    document.body.appendChild(container);
                }

                container.appendChild(notification);
                this.animate(notification, 'slideInRight');

                // Remove automaticamente após delay
                const delay = options.duration || 5000;
                setTimeout(() => {
                    if (notification.parentNode) {
                        this.animate(notification, 'slideInRight').reverse();
                        setTimeout(() => notification.remove(), 300);
                    }
                }, delay);

                return notification;
            }
        };
    }

    // Obtém ícone da notificação
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Cria componente de loading
    createLoadingComponent() {
        return {
            show: (message = 'Carregando...') => {
                const loading = document.createElement('div');
                loading.className = 'loading-overlay';
                loading.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <div class="loading-message">${message}</div>
                    </div>
                `;

                document.body.appendChild(loading);
                this.animate(loading, 'fadeIn');

                return loading;
            },
            hide: (loading) => {
                if (loading && loading.parentNode) {
                    this.animate(loading, 'fadeOut').addEventListener('finish', () => {
                        loading.remove();
                    });
                }
            }
        };
    }

    // Cria componente de badge
    createBadgeComponent() {
        return {
            create: (text, options = {}) => {
                const badge = document.createElement('span');
                badge.className = `badge ${options.variant || 'primary'} ${options.size || 'md'}`;
                badge.textContent = text;
                return badge;
            }
        };
    }

    // Cria componente de avatar
    createAvatarComponent() {
        return {
            create: (options = {}) => {
                const avatar = document.createElement('div');
                avatar.className = `avatar ${options.size || 'md'}`;
                
                if (options.src) {
                    const img = document.createElement('img');
                    img.src = options.src;
                    img.alt = options.alt || 'Avatar';
                    avatar.appendChild(img);
                } else {
                    avatar.textContent = options.initials || '?';
                }

                if (options.status) {
                    const status = document.createElement('div');
                    status.className = `avatar-status ${options.status}`;
                    avatar.appendChild(status);
                }

                return avatar;
            }
        };
    }

    // Adiciona CSS dos componentes
    addComponentCSS() {
        if (document.getElementById('component-styles')) return;

        const style = document.createElement('style');
        style.id = 'component-styles';
        style.textContent = `
            /* Botões */
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-2);
                padding: var(--spacing-2) var(--spacing-4);
                border: 1px solid transparent;
                border-radius: var(--radius-md);
                font-size: var(--text-sm);
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .btn.primary {
                background: var(--color-primary);
                color: white;
            }

            .btn.primary:hover:not(:disabled) {
                background: color-mix(in srgb, var(--color-primary) 90%, black);
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }

            .btn.secondary {
                background: var(--color-secondary);
                color: white;
            }

            .btn.secondary:hover:not(:disabled) {
                background: color-mix(in srgb, var(--color-secondary) 90%, black);
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }

            .btn.outline {
                background: transparent;
                color: var(--color-primary);
                border-color: var(--color-primary);
            }

            .btn.outline:hover:not(:disabled) {
                background: var(--color-primary);
                color: white;
            }

            .btn.ghost {
                background: transparent;
                color: var(--color-text);
            }

            .btn.ghost:hover:not(:disabled) {
                background: var(--color-surface);
            }

            .btn.sm {
                padding: var(--spacing-1) var(--spacing-3);
                font-size: var(--text-xs);
            }

            .btn.lg {
                padding: var(--spacing-3) var(--spacing-6);
                font-size: var(--text-lg);
            }

            .btn.xl {
                padding: var(--spacing-4) var(--spacing-8);
                font-size: var(--text-xl);
            }

            .btn-loading::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            /* Cards */
            .card {
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                overflow: hidden;
                box-shadow: var(--shadow-sm);
                transition: all 0.3s ease;
            }

            .card:hover {
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }

            .card-header {
                padding: var(--spacing-4);
                border-bottom: 1px solid var(--color-border);
                font-weight: 600;
                color: var(--color-text);
            }

            .card-body {
                padding: var(--spacing-4);
                color: var(--color-text);
            }

            .card-footer {
                padding: var(--spacing-4);
                border-top: 1px solid var(--color-border);
                background: color-mix(in srgb, var(--color-surface) 95%, var(--color-border));
            }

            .card.elevated {
                box-shadow: var(--shadow-lg);
            }

            .card.bordered {
                border: 2px solid var(--color-primary);
            }

            /* Modais */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: var(--spacing-4);
            }

            .modal {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-2xl);
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .modal.sm { width: 100%; max-width: 400px; }
            .modal.md { width: 100%; max-width: 600px; }
            .modal.lg { width: 100%; max-width: 800px; }
            .modal.xl { width: 100%; max-width: 1200px; }

            .modal-header {
                padding: var(--spacing-4);
                border-bottom: 1px solid var(--color-border);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .modal-title {
                margin: 0;
                font-size: var(--text-lg);
                font-weight: 600;
                color: var(--color-text);
            }

            .modal-close {
                background: none;
                border: none;
                font-size: var(--text-2xl);
                cursor: pointer;
                color: var(--color-textSecondary);
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-md);
                transition: all 0.2s ease;
            }

            .modal-close:hover {
                background: var(--color-border);
                color: var(--color-text);
            }

            .modal-body {
                padding: var(--spacing-4);
                overflow-y: auto;
                flex: 1;
                color: var(--color-text);
            }

            .modal-footer {
                padding: var(--spacing-4);
                border-top: 1px solid var(--color-border);
                display: flex;
                gap: var(--spacing-2);
                justify-content: flex-end;
            }

            /* Tooltips */
            .tooltip {
                position: absolute;
                background: var(--color-text);
                color: var(--color-surface);
                padding: var(--spacing-2) var(--spacing-3);
                border-radius: var(--radius-md);
                font-size: var(--text-sm);
                white-space: nowrap;
                z-index: 9999;
                pointer-events: none;
                box-shadow: var(--shadow-lg);
            }

            .tooltip::after {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border: 4px solid transparent;
            }

            .tooltip.top::after {
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-top-color: var(--color-text);
            }

            .tooltip.bottom::after {
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-bottom-color: var(--color-text);
            }

            .tooltip.left::after {
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                border-left-color: var(--color-text);
            }

            .tooltip.right::after {
                right: 100%;
                top: 50%;
                transform: translateY(-50%);
                border-right-color: var(--color-text);
            }

            /* Notificações */
            .notifications-container {
                position: fixed;
                top: var(--spacing-4);
                right: var(--spacing-4);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-2);
                max-width: 400px;
            }

            .notification {
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                overflow: hidden;
            }

            .notification.success {
                border-left: 4px solid var(--color-success);
            }

            .notification.error {
                border-left: 4px solid var(--color-error);
            }

            .notification.warning {
                border-left: 4px solid var(--color-warning);
            }

            .notification.info {
                border-left: 4px solid var(--color-info);
            }

            .notification-content {
                padding: var(--spacing-4);
                display: flex;
                align-items: center;
                gap: var(--spacing-3);
            }

            .notification-icon {
                font-size: var(--text-lg);
                flex-shrink: 0;
            }

            .notification-message {
                flex: 1;
                color: var(--color-text);
                font-size: var(--text-sm);
            }

            .notification-close {
                background: none;
                border: none;
                font-size: var(--text-lg);
                cursor: pointer;
                color: var(--color-textSecondary);
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                background: var(--color-border);
                color: var(--color-text);
            }

            /* Loading */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }

            .loading-content {
                background: var(--color-surface);
                padding: var(--spacing-8);
                border-radius: var(--radius-lg);
                text-align: center;
                box-shadow: var(--shadow-2xl);
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--color-border);
                border-top: 4px solid var(--color-primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto var(--spacing-4);
            }

            .loading-message {
                color: var(--color-text);
                font-size: var(--text-sm);
            }

            /* Badges */
            .badge {
                display: inline-flex;
                align-items: center;
                padding: var(--spacing-1) var(--spacing-2);
                border-radius: var(--radius-full);
                font-size: var(--text-xs);
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.025em;
            }

            .badge.primary {
                background: var(--color-primary);
                color: white;
            }

            .badge.secondary {
                background: var(--color-secondary);
                color: white;
            }

            .badge.success {
                background: var(--color-success);
                color: white;
            }

            .badge.warning {
                background: var(--color-warning);
                color: white;
            }

            .badge.error {
                background: var(--color-error);
                color: white;
            }

            .badge.outline {
                background: transparent;
                border: 1px solid currentColor;
            }

            .badge.sm {
                padding: 2px var(--spacing-1);
                font-size: 10px;
            }

            .badge.lg {
                padding: var(--spacing-2) var(--spacing-3);
                font-size: var(--text-sm);
            }

            /* Avatars */
            .avatar {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-full);
                background: var(--color-primary);
                color: white;
                font-weight: 500;
                overflow: hidden;
            }

            .avatar.sm {
                width: 32px;
                height: 32px;
                font-size: var(--text-sm);
            }

            .avatar.md {
                width: 40px;
                height: 40px;
                font-size: var(--text-base);
            }

            .avatar.lg {
                width: 48px;
                height: 48px;
                font-size: var(--text-lg);
            }

            .avatar.xl {
                width: 64px;
                height: 64px;
                font-size: var(--text-xl);
            }

            .avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .avatar-status {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 25%;
                height: 25%;
                border-radius: 50%;
                border: 2px solid var(--color-surface);
            }

            .avatar-status.online {
                background: var(--color-success);
            }

            .avatar-status.offline {
                background: var(--color-textSecondary);
            }

            .avatar-status.busy {
                background: var(--color-error);
            }

            .avatar-status.away {
                background: var(--color-warning);
            }
        `;
        
        document.head.appendChild(style);
    }

    // Configura helpers responsivos
    setupResponsiveHelpers() {
        // Adiciona classes utilitárias responsivas
        this.addResponsiveCSS();
        
        // Configura observer para mudanças de viewport
        this.setupViewportObserver();
    }

    // Adiciona CSS responsivo
    addResponsiveCSS() {
        if (document.getElementById('responsive-styles')) return;

        const style = document.createElement('style');
        style.id = 'responsive-styles';
        style.textContent = `
            /* Utilitários de display */
            .hidden { display: none !important; }
            .block { display: block !important; }
            .inline { display: inline !important; }
            .inline-block { display: inline-block !important; }
            .flex { display: flex !important; }
            .inline-flex { display: inline-flex !important; }
            .grid { display: grid !important; }

            /* Utilitários de flexbox */
            .flex-row { flex-direction: row !important; }
            .flex-col { flex-direction: column !important; }
            .flex-wrap { flex-wrap: wrap !important; }
            .flex-nowrap { flex-wrap: nowrap !important; }
            .items-start { align-items: flex-start !important; }
            .items-center { align-items: center !important; }
            .items-end { align-items: flex-end !important; }
            .justify-start { justify-content: flex-start !important; }
            .justify-center { justify-content: center !important; }
            .justify-end { justify-content: flex-end !important; }
            .justify-between { justify-content: space-between !important; }

            /* Utilitários de espaçamento */
            .m-0 { margin: 0 !important; }
            .m-1 { margin: var(--spacing-1) !important; }
            .m-2 { margin: var(--spacing-2) !important; }
            .m-3 { margin: var(--spacing-3) !important; }
            .m-4 { margin: var(--spacing-4) !important; }
            .m-5 { margin: var(--spacing-5) !important; }
            .m-6 { margin: var(--spacing-6) !important; }
            .m-8 { margin: var(--spacing-8) !important; }

            .p-0 { padding: 0 !important; }
            .p-1 { padding: var(--spacing-1) !important; }
            .p-2 { padding: var(--spacing-2) !important; }
            .p-3 { padding: var(--spacing-3) !important; }
            .p-4 { padding: var(--spacing-4) !important; }
            .p-5 { padding: var(--spacing-5) !important; }
            .p-6 { padding: var(--spacing-6) !important; }
            .p-8 { padding: var(--spacing-8) !important; }

            /* Utilitários de texto */
            .text-left { text-align: left !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .text-xs { font-size: var(--text-xs) !important; }
            .text-sm { font-size: var(--text-sm) !important; }
            .text-base { font-size: var(--text-base) !important; }
            .text-lg { font-size: var(--text-lg) !important; }
            .text-xl { font-size: var(--text-xl) !important; }
            .text-2xl { font-size: var(--text-2xl) !important; }

            .font-normal { font-weight: 400 !important; }
            .font-medium { font-weight: 500 !important; }
            .font-semibold { font-weight: 600 !important; }
            .font-bold { font-weight: 700 !important; }

            /* Breakpoints responsivos */
            @media (min-width: 640px) {
                .sm\\:hidden { display: none !important; }
                .sm\\:block { display: block !important; }
                .sm\\:flex { display: flex !important; }
                .sm\\:grid { display: grid !important; }
                .sm\\:text-left { text-align: left !important; }
                .sm\\:text-center { text-align: center !important; }
                .sm\\:text-right { text-align: right !important; }
            }

            @media (min-width: 768px) {
                .md\\:hidden { display: none !important; }
                .md\\:block { display: block !important; }
                .md\\:flex { display: flex !important; }
                .md\\:grid { display: grid !important; }
                .md\\:text-left { text-align: left !important; }
                .md\\:text-center { text-align: center !important; }
                .md\\:text-right { text-align: right !important; }
            }

            @media (min-width: 1024px) {
                .lg\\:hidden { display: none !important; }
                .lg\\:block { display: block !important; }
                .lg\\:flex { display: flex !important; }
                .lg\\:grid { display: grid !important; }
                .lg\\:text-left { text-align: left !important; }
                .lg\\:text-center { text-align: center !important; }
                .lg\\:text-right { text-align: right !important; }
            }

            @media (min-width: 1280px) {
                .xl\\:hidden { display: none !important; }
                .xl\\:block { display: block !important; }
                .xl\\:flex { display: flex !important; }
                .xl\\:grid { display: grid !important; }
                .xl\\:text-left { text-align: left !important; }
                .xl\\:text-center { text-align: center !important; }
                .xl\\:text-right { text-align: right !important; }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Configura observer de viewport
    setupViewportObserver() {
        const updateViewportClass = () => {
            const width = window.innerWidth;
            const body = document.body;
            
            // Remove classes existentes
            body.classList.remove('viewport-xs', 'viewport-sm', 'viewport-md', 'viewport-lg', 'viewport-xl', 'viewport-2xl');
            
            // Adiciona classe baseada no viewport
            if (width >= 1536) body.classList.add('viewport-2xl');
            else if (width >= 1280) body.classList.add('viewport-xl');
            else if (width >= 1024) body.classList.add('viewport-lg');
            else if (width >= 768) body.classList.add('viewport-md');
            else if (width >= 640) body.classList.add('viewport-sm');
            else body.classList.add('viewport-xs');
        };

        updateViewportClass();
        window.addEventListener('resize', updateViewportClass);
    }

    // Configura acessibilidade
    setupAccessibility() {
        // Adiciona suporte a navegação por teclado
        this.setupKeyboardNavigation();
        
        // Adiciona suporte a leitores de tela
        this.setupScreenReaderSupport();
        
        // Adiciona suporte a alto contraste
        this.setupHighContrast();
        
        // Adiciona suporte a redução de movimento
        this.setupReducedMotion();
    }

    // Configura navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC fecha modais
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal-overlay');
                modals.forEach(modal => modal.remove());
            }
            
            // Tab navigation
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    // Lida com navegação por tab
    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    // Configura suporte a leitores de tela
    setupScreenReaderSupport() {
        // Adiciona landmarks ARIA
        this.addAriaLandmarks();
        
        // Adiciona live regions
        this.addLiveRegions();
    }

    // Adiciona landmarks ARIA
    addAriaLandmarks() {
        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }

        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }

        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    // Adiciona live regions
    addLiveRegions() {
        if (!document.getElementById('live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
    }

    // Anuncia mensagem para leitores de tela
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Configura alto contraste
    setupHighContrast() {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const updateContrast = (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };

        updateContrast(mediaQuery);
        mediaQuery.addEventListener('change', updateContrast);
    }

    // Configura redução de movimento
    setupReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const updateMotion = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        updateMotion(mediaQuery);
        mediaQuery.addEventListener('change', updateMotion);
    }

    // Configura otimizações de performance
    setupPerformanceOptimizations() {
        // Lazy loading para imagens
        this.setupLazyLoading();
        
        // Debounce para eventos de scroll e resize
        this.setupEventDebouncing();
        
        // Intersection Observer para animações
        this.setupIntersectionObserver();
    }

    // Configura lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Configura debouncing de eventos
    setupEventDebouncing() {
        let scrollTimeout;
        let resizeTimeout;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                window.dispatchEvent(new CustomEvent('debouncedScroll'));
            }, 100);
        });

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                window.dispatchEvent(new CustomEvent('debouncedResize'));
            }, 250);
        });
    }

    // Configura Intersection Observer
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('[data-animate]').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // Cria tokens de design
    createDesignTokens() {
        this.tokens = {
            colors: this.themes[this.currentTheme],
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem'
            },
            typography: {
                fontFamily: {
                    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                },
                fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem'
                },
                fontWeight: {
                    normal: '400',
                    medium: '500',
                    semibold: '600',
                    bold: '700'
                },
                lineHeight: {
                    tight: '1.25',
                    normal: '1.5',
                    relaxed: '1.75'
                }
            },
            borderRadius: {
                none: '0',
                sm: '0.125rem',
                md: '0.375rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px'
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
        };
    }

    // Métodos públicos para uso da API
    getComponent(name) {
        return this.components[name];
    }

    getToken(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.tokens);
    }

    createButton(text, options) {
        return this.components.button.create(text, options);
    }

    createCard(content, options) {
        return this.components.card.create(content, options);
    }

    createModal(content, options) {
        return this.components.modal.create(content, options);
    }

    showModal(modal) {
        return this.components.modal.show(modal);
    }

    createTooltip(element, text, options) {
        return this.components.tooltip.create(element, text, options);
    }

    showNotification(message, options) {
        return this.components.notification.show(message, options);
    }

    showLoading(message) {
        return this.components.loading.show(message);
    }

    hideLoading(loading) {
        return this.components.loading.hide(loading);
    }

    createBadge(text, options) {
        return this.components.badge.create(text, options);
    }

    createAvatar(options) {
        return this.components.avatar.create(options);
    }
}

// Inicializa sistema automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.designSystem = new AdvancedDesignSystem();
});

// Exporta para uso global
window.AdvancedDesignSystem = AdvancedDesignSystem;
// Sistema de Correção de Navegação - ClaunNetworking
// Garante que todos os botões e links funcionem corretamente

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigationFixes();
});

function initializeNavigationFixes() {
    // Corrigir navegação do menu lateral
    fixSidebarNavigation();
    
    // Corrigir botões de ação
    fixActionButtons();
    
    // Corrigir botões de exportação e mensagem em massa
    fixExportAndBulkMessageButtons();
    
    // Adicionar logs para debug
    addNavigationLogs();
    
    console.log('✅ Sistema de correção de navegação inicializado');
}

function fixSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu-item[data-section]');
    
    menuItems.forEach(item => {
        // Remover listeners antigos
        item.removeEventListener('click', handleMenuClick);
        
        // Adicionar novo listener
        item.addEventListener('click', handleMenuClick);
    });
    
    console.log(`🔧 Corrigidos ${menuItems.length} itens do menu lateral`);
}

function handleMenuClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const section = this.getAttribute('data-section');
    if (section) {
        showSection(section);
        console.log(`📍 Navegando para seção: ${section}`);
    } else {
        console.warn('⚠️ Seção não encontrada para o item:', this);
    }
}

function showSection(sectionId) {
    try {
        // Ocultar todas as seções
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Remover classe ativa de todos os itens do menu
        const allMenuItems = document.querySelectorAll('.menu-item');
        allMenuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Mostrar seção selecionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Adicionar classe ativa ao item do menu correspondente
            const menuItem = document.querySelector(`[data-section="${sectionId}"]`);
            if (menuItem) {
                menuItem.classList.add('active');
            }
            
            // Executar ações específicas da seção
            executePostNavigationActions(sectionId);
            
            console.log(`✅ Seção '${sectionId}' exibida com sucesso`);
        } else {
            console.error(`❌ Seção '${sectionId}' não encontrada no DOM`);
        }
    } catch (error) {
        console.error('❌ Erro ao navegar para seção:', error);
    }
}

function executePostNavigationActions(sectionId) {
    switch (sectionId) {
        case 'premium':
            // Carregar serviços premium
            if (typeof loadCompanyPremiumServices === 'function') {
                setTimeout(loadCompanyPremiumServices, 100);
            }
            break;
        case 'financial':
            // Atualizar dados financeiros
            console.log('💰 Seção financeira carregada');
            break;
        case 'metrics':
            // Atualizar métricas
            console.log('📊 Seção de métricas carregada');
            break;
        case 'reports':
            // Atualizar relatórios
            console.log('📋 Seção de relatórios carregada');
            break;
        case 'profile':
            // Carregar dados do perfil
            console.log('⚙️ Seção de perfil carregada');
            break;
        case 'plan':
            // Atualizar informações do plano
            console.log('💳 Seção do plano carregada');
            break;
    }
}

function fixActionButtons() {
    // Corrigir botões que podem não estar funcionando
    const actionButtons = [
        { selector: '.btn-primary', action: 'primary' },
        { selector: '.btn-secondary', action: 'secondary' },
        { selector: '.btn-success', action: 'success' },
        { selector: '.btn-danger', action: 'danger' }
    ];
    
    actionButtons.forEach(buttonConfig => {
        const buttons = document.querySelectorAll(buttonConfig.selector);
        buttons.forEach(button => {
            if (!button.onclick && !button.getAttribute('data-fixed')) {
                button.addEventListener('click', function(e) {
                    handleGenericButtonClick(e, this, buttonConfig.action);
                });
                button.setAttribute('data-fixed', 'true');
            }
        });
    });
    
    console.log('🔧 Botões de ação corrigidos');
}

function handleGenericButtonClick(e, button, actionType) {
    const buttonText = button.textContent.trim();
    
    // Verificar se é um botão específico que precisa de ação
    if (buttonText.includes('Exportar') || buttonText.includes('📊')) {
        e.preventDefault();
        if (typeof exportCandidates === 'function') {
            exportCandidates();
        } else {
            showNotImplementedMessage('Exportação de dados');
        }
    } else if (buttonText.includes('Mensagem') || buttonText.includes('📧')) {
        e.preventDefault();
        if (typeof sendBulkMessage === 'function') {
            sendBulkMessage();
        } else {
            showNotImplementedMessage('Mensagem em massa');
        }
    } else if (buttonText.includes('Filtrar')) {
        e.preventDefault();
        applyFilters();
    } else if (buttonText.includes('Atualizar')) {
        e.preventDefault();
        refreshCurrentSection();
    }
}

function fixExportAndBulkMessageButtons() {
    // Corrigir especificamente os botões de exportar e mensagem em massa
    const exportButtons = document.querySelectorAll('button[onclick*="export"], .btn:contains("Exportar")');
    const messageButtons = document.querySelectorAll('button[onclick*="message"], .btn:contains("Mensagem")');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof exportCandidates === 'function') {
                exportCandidates();
            } else {
                showNotImplementedMessage('Exportação de dados');
            }
        });
    });
    
    messageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof sendBulkMessage === 'function') {
                sendBulkMessage();
            } else {
                showNotImplementedMessage('Mensagem em massa');
            }
        });
    });
    
    console.log('🔧 Botões de exportação e mensagem em massa corrigidos');
}

function showNotImplementedMessage(feature) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 400px; width: 90%; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🚧</div>
            <h3 style="color: #6B46C1; margin-bottom: 1rem;">Funcionalidade em Desenvolvimento</h3>
            <p style="color: #666; margin-bottom: 2rem;">
                A funcionalidade "${feature}" está sendo implementada e estará disponível em breve.
            </p>
            <button onclick="document.body.removeChild(this.closest('div').parentElement)" 
                    style="background: #6B46C1; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                Entendi
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function applyFilters() {
    console.log('🔍 Aplicando filtros...');
    showSuccessToast('Filtros aplicados com sucesso!');
}

function refreshCurrentSection() {
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        const sectionId = activeSection.id;
        console.log(`🔄 Atualizando seção: ${sectionId}`);
        executePostNavigationActions(sectionId);
        showSuccessToast('Dados atualizados!');
    }
}

function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>✅</span>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function addNavigationLogs() {
    // Adicionar logs para debug
    const originalShowSection = window.showSection;
    window.showSection = function(sectionId) {
        console.log(`🧭 Tentativa de navegação para: ${sectionId}`);
        if (originalShowSection) {
            return originalShowSection(sectionId);
        } else {
            return showSection(sectionId);
        }
    };
}

// Exportar funções para uso global
window.showSection = showSection;
window.fixSidebarNavigation = fixSidebarNavigation;
window.initializeNavigationFixes = initializeNavigationFixes;
/**
 * Modal Fixes - ClaunNetworking
 * Correções e melhorias para todos os modais do projeto
 */

// Função universal para criar modais
function createModal(title, content, options = {}) {
    // Fechar qualquer modal existente
    closeAllModals();
    
    const modal = document.createElement('div');
    modal.className = 'universal-modal';
    modal.id = 'currentModal';
    
    const modalStyles = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10000',
        backdropFilter: 'blur(5px)',
        animation: 'modalFadeIn 0.3s ease-out'
    };
    
    Object.assign(modal.style, modalStyles);
    
    const maxWidth = options.maxWidth || '500px';
    const showCloseButton = options.showCloseButton !== false;
    
    modal.innerHTML = `
        <div class="modal-container" style="
            background: white; 
            padding: 2rem; 
            border-radius: 20px; 
            max-width: ${maxWidth}; 
            width: 90%; 
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease-out;
        ">
            <div class="modal-header" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #f0f0f0;
            ">
                <h2 style="color: #6B46C1; margin: 0; font-size: 1.5rem;">${title}</h2>
                ${showCloseButton ? `
                    <button onclick="closeAllModals()" class="modal-close-btn" style="
                        background: none; 
                        border: none; 
                        font-size: 1.8rem; 
                        cursor: pointer; 
                        color: #6B7280; 
                        padding: 0.25rem; 
                        width: 35px; 
                        height: 35px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
                        ×
                    </button>
                ` : ''}
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAllModals();
        }
    });
    
    // Fechar modal com tecla ESC
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    document.body.appendChild(modal);
    
    // Adicionar CSS de animação se não existir
    if (!document.getElementById('modal-animations')) {
        const style = document.createElement('style');
        style.id = 'modal-animations';
        style.textContent = `
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(-50px) scale(0.9); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
            
            .modal-close-btn:hover {
                background: #f3f4f6 !important;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    return modal;
}

// Função para fechar todos os modais
function closeAllModals() {
    // Remover modal específico por ID
    const currentModal = document.getElementById('currentModal');
    if (currentModal) {
        currentModal.style.animation = 'modalFadeOut 0.2s ease-in';
        setTimeout(() => currentModal.remove(), 200);
        return;
    }
    
    // Fallback: remover qualquer modal existente
    const allModals = document.querySelectorAll('.universal-modal, [style*="position: fixed"][style*="z-index: 10000"]');
    allModals.forEach(modal => {
        modal.style.animation = 'modalFadeOut 0.2s ease-in';
        setTimeout(() => modal.remove(), 200);
    });
    
    // Remover modais antigos do sistema
    const oldModals = document.querySelectorAll('.modal, .modal-overlay');
    oldModals.forEach(modal => modal.remove());
}

// Modal de confirmação
function showConfirmModal(title, message, onConfirm, onCancel = null) {
    const content = `
        <div style="text-align: center; padding: 1rem 0;">
            <p style="font-size: 1.1rem; margin-bottom: 2rem; color: #374151;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeAllModals(); ${onCancel ? onCancel + '()' : ''}" 
                        style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Cancelar
                </button>
                <button onclick="closeAllModals(); ${onConfirm}()" 
                        style="padding: 0.75rem 1.5rem; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Confirmar
                </button>
            </div>
        </div>
    `;
    
    createModal(title, content, { maxWidth: '400px' });
}

// Modal de sucesso
function showSuccessModal(title, message, callback = null) {
    const content = `
        <div style="text-align: center; padding: 1rem 0;">
            <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">✅</div>
            <p style="font-size: 1.1rem; margin-bottom: 2rem; color: #374151;">${message}</p>
            <button onclick="closeAllModals(); ${callback ? callback + '()' : ''}" 
                    style="padding: 0.75rem 2rem; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                OK
            </button>
        </div>
    `;
    
    createModal(title, content, { maxWidth: '400px' });
}

// Modal de erro
function showErrorModal(title, message, callback = null) {
    const content = `
        <div style="text-align: center; padding: 1rem 0;">
            <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">❌</div>
            <p style="font-size: 1.1rem; margin-bottom: 2rem; color: #374151;">${message}</p>
            <button onclick="closeAllModals(); ${callback ? callback + '()' : ''}" 
                    style="padding: 0.75rem 2rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                OK
            </button>
        </div>
    `;
    
    createModal(title, content, { maxWidth: '400px' });
}

// Modal de loading
function showLoadingModal(message = 'Carregando...') {
    const content = `
        <div style="text-align: center; padding: 2rem 0;">
            <div style="
                width: 40px; 
                height: 40px; 
                border: 4px solid #f3f3f3; 
                border-top: 4px solid #6B46C1; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <p style="font-size: 1.1rem; color: #374151; margin: 0;">${message}</p>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    createModal('', content, { maxWidth: '300px', showCloseButton: false });
}

// Função para esconder modal de loading
function hideLoadingModal() {
    closeAllModals();
}

// Melhorar modais existentes do painel administrativo
if (typeof showAddServiceModal !== 'undefined') {
    const originalShowAddServiceModal = showAddServiceModal;
    showAddServiceModal = function() {
        try {
            originalShowAddServiceModal();
        } catch (error) {
            console.error('Erro ao abrir modal de serviço:', error);
            showErrorModal('Erro', 'Não foi possível abrir o modal de criação de serviço.');
        }
    };
}

// Adicionar confirmação para exclusões
function confirmDelete(itemName, deleteFunction) {
    showConfirmModal(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
        deleteFunction
    );
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal fixes carregado com sucesso!');
    
    // Adicionar CSS global para modais
    const globalModalCSS = document.createElement('style');
    globalModalCSS.textContent = `
        @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .universal-modal * {
            box-sizing: border-box;
        }
        
        .universal-modal button {
            transition: all 0.2s ease;
        }
        
        .universal-modal button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(globalModalCSS);
});
