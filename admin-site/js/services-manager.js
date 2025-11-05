/**
 * Sistema Centralizado de Gerenciamento de Serviços
 * Sincroniza automaticamente entre painel admin, candidato e empresa
 */

class ServicesManager {
    constructor() {
        this.storageKey = 'claunnetworking_services';
        this.listeners = [];
        this.initializeDefaultServices();
        this.setupStorageListener();
    }

    // Inicializar serviços padrão se não existirem
    initializeDefaultServices() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultServices = {
                candidate: [
                    {
                        id: 'curriculo-revisao',
                        title: 'Revisão de Currículo',
                        description: 'Análise completa e otimização do seu currículo por especialistas em RH.',
                        price: 89.90,
                        features: [
                            'Análise detalhada do currículo',
                            'Sugestões de melhorias',
                            'Formatação profissional',
                            'Palavras-chave otimizadas'
                        ],
                        category: 'premium',
                        active: true,
                        partnerUrl: 'https://parceiro.com.br/curriculo-revisao',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'mentoria-carreira',
                        title: 'Mentoria de Carreira',
                        description: 'Sessão individual com mentor especializado para acelerar sua carreira.',
                        price: 199.90,
                        features: [
                            'Sessão de 1h com mentor',
                            'Plano de carreira personalizado',
                            'Networking estratégico',
                            'Acompanhamento por 30 dias'
                        ],
                        category: 'premium',
                        active: true,
                        partnerUrl: 'https://parceiro.com.br/mentoria-carreira',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'simulacao-entrevista',
                        title: 'Simulação de Entrevista',
                        description: 'Treinamento prático com feedback detalhado para entrevistas de emprego.',
                        price: 149.90,
                        features: [
                            'Simulação realística',
                            'Feedback detalhado',
                            'Dicas de postura e comunicação',
                            'Gravação da sessão'
                        ],
                        category: 'premium',
                        active: true,
                        partnerUrl: 'https://parceiro.com.br/simulacao-entrevista',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ],
                company: [
                    {
                        id: 'divulgacao-premium',
                        title: 'Divulgação Premium de Vagas',
                        description: 'Destaque suas vagas no topo da plataforma e alcance mais candidatos qualificados.',
                        price: 299.90,
                        features: [
                            'Posição de destaque por 30 dias',
                            'Alcance 5x maior',
                            'Badge "Vaga Premium"',
                            'Relatório de performance'
                        ],
                        category: 'premium',
                        active: true,
                        partnerUrl: 'https://parceiro.com.br/divulgacao-premium',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'analise-candidatos',
                        title: 'Análise de Perfil de Candidatos',
                        description: 'Receba análises detalhadas dos perfis dos candidatos com scoring automático.',
                        price: 199.90,
                        features: [
                            'Scoring automático de candidatos',
                            'Análise de compatibilidade',
                            'Relatório de soft skills',
                            'Recomendações de contratação'
                        ],
                        category: 'premium',
                        active: true,
                        partnerUrl: 'https://parceiro.com.br/analise-candidatos',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'consultoria-rh',
                        title: 'Consultoria em Recrutamento',
                        description: 'Consultoria especializada para otimizar seus processos de recrutamento e seleção.',
                        price: 499.90,
                        features: [
                            'Sessão de 2h com especialista',
                            'Análise do processo atual',
                            'Plano de melhoria personalizado',
                            'Suporte por 30 dias'
                        ],
                        category: 'premium',
                        active: true,
                        partnerUrl: 'https://parceiro.com.br/consultoria-rh',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        id: 'entrevistas-video',
                        title: 'Entrevistas por Vídeo',
                        description: 'Plataforma integrada para realizar entrevistas por vídeo com candidatos.',
                        price: 149.90,
                        features: [
                            'Sala de entrevista virtual',
                            'Gravação das entrevistas',
                            'Compartilhamento com equipe',
                            'Agendamento automático'
                        ],
                        category: 'premium',
                        active: true,
                        partnerUrl: 'https://parceiro.com.br/entrevistas-video',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ]
            };
            
            this.saveServices(defaultServices);
        }
    }

    // Configurar listener para mudanças no localStorage
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.notifyListeners();
            }
        });

        // Para mudanças na mesma aba
        window.addEventListener('services-updated', () => {
            this.notifyListeners();
        });
    }

    // Salvar serviços no localStorage
    saveServices(services) {
        localStorage.setItem(this.storageKey, JSON.stringify(services));
        this.dispatchUpdateEvent();
    }

    // Carregar serviços do localStorage
    loadServices() {
        const services = localStorage.getItem(this.storageKey);
        return services ? JSON.parse(services) : { candidate: [], company: [] };
    }

    // Disparar evento de atualização
    dispatchUpdateEvent() {
        window.dispatchEvent(new CustomEvent('services-updated'));
    }

    // Adicionar listener para mudanças
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Remover listener
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    // Notificar todos os listeners
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.loadServices()));
    }

    // CRUD Operations

    // Obter todos os serviços
    getAllServices() {
        return this.loadServices();
    }

    // Obter serviços por tipo (candidate/company)
    getServicesByType(type) {
        const services = this.loadServices();
        return services[type] || [];
    }

    // Obter serviço por ID
    getServiceById(id, type = null) {
        const services = this.loadServices();
        
        if (type) {
            return services[type]?.find(service => service.id === id);
        }
        
        // Buscar em ambos os tipos se não especificado
        const candidateService = services.candidate?.find(service => service.id === id);
        const companyService = services.company?.find(service => service.id === id);
        
        return candidateService || companyService;
    }

    // Adicionar novo serviço
    addService(type, serviceData) {
        const services = this.loadServices();
        
        const newService = {
            id: this.generateId(),
            ...serviceData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            active: true
        };
        
        if (!services[type]) {
            services[type] = [];
        }
        
        services[type].push(newService);
        this.saveServices(services);
        
        return newService;
    }

    // Atualizar serviço existente
    updateService(id, type, updateData) {
        const services = this.loadServices();
        
        if (!services[type]) {
            return null;
        }
        
        const serviceIndex = services[type].findIndex(service => service.id === id);
        
        if (serviceIndex === -1) {
            return null;
        }
        
        services[type][serviceIndex] = {
            ...services[type][serviceIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        this.saveServices(services);
        return services[type][serviceIndex];
    }

    // Remover serviço
    removeService(id, type) {
        const services = this.loadServices();
        
        if (!services[type]) {
            return false;
        }
        
        const serviceIndex = services[type].findIndex(service => service.id === id);
        
        if (serviceIndex === -1) {
            return false;
        }
        
        services[type].splice(serviceIndex, 1);
        this.saveServices(services);
        
        return true;
    }

    // Ativar/Desativar serviço
    toggleServiceStatus(id, type) {
        const services = this.loadServices();
        
        if (!services[type]) {
            return null;
        }
        
        const serviceIndex = services[type].findIndex(service => service.id === id);
        
        if (serviceIndex === -1) {
            return null;
        }
        
        services[type][serviceIndex].active = !services[type][serviceIndex].active;
        services[type][serviceIndex].updatedAt = new Date().toISOString();
        
        this.saveServices(services);
        return services[type][serviceIndex];
    }

    // Gerar ID único
    generateId() {
        return 'service_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obter apenas serviços ativos
    getActiveServices(type) {
        return this.getServicesByType(type).filter(service => service.active);
    }

    // Buscar serviços por termo
    searchServices(term, type = null) {
        const services = type ? this.getServicesByType(type) : this.getAllServices();
        const searchTerm = term.toLowerCase();
        
        const searchInServices = (servicesList) => {
            return servicesList.filter(service => 
                service.title.toLowerCase().includes(searchTerm) ||
                service.description.toLowerCase().includes(searchTerm) ||
                service.features.some(feature => feature.toLowerCase().includes(searchTerm))
            );
        };
        
        if (type) {
            return searchInServices(services);
        }
        
        return {
            candidate: searchInServices(services.candidate || []),
            company: searchInServices(services.company || [])
        };
    }

    // Exportar dados para backup
    exportServices() {
        return {
            services: this.loadServices(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Importar dados de backup
    importServices(backupData) {
        if (backupData.services) {
            this.saveServices(backupData.services);
            return true;
        }
        return false;
    }
}

// Instância global do gerenciador de serviços
window.servicesManager = new ServicesManager();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServicesManager;
}
