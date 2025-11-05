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
