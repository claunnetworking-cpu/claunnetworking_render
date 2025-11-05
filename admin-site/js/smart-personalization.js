// Sistema de Personalização Inteligente - ClaunNetworking
class SmartPersonalizationSystem {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.behaviorData = this.loadBehaviorData();
        this.preferences = this.loadPreferences();
        this.recommendations = [];
        this.contentFilters = {};
        this.init();
    }

    // Inicializa sistema de personalização
    init() {
        this.detectUserType();
        this.trackUserBehavior();
        this.personalizeContent();
        this.setupRecommendationEngine();
        this.initializeAdaptiveUI();
        this.startLearningLoop();
    }

    // Detecta tipo de usuário
    detectUserType() {
        const currentPage = window.location.pathname;
        const userAgent = navigator.userAgent;
        const timeOfDay = new Date().getHours();
        
        // Detecta contexto baseado na URL
        if (currentPage.includes('candidato')) {
            this.userProfile.type = 'candidate';
            this.userProfile.context = 'job_search';
        } else if (currentPage.includes('empresa') || currentPage.includes('company')) {
            this.userProfile.type = 'company';
            this.userProfile.context = 'recruitment';
        } else if (currentPage.includes('instituicao') || currentPage.includes('institution')) {
            this.userProfile.type = 'institution';
            this.userProfile.context = 'education';
        } else if (currentPage.includes('admin')) {
            this.userProfile.type = 'admin';
            this.userProfile.context = 'management';
        }

        // Detecta dispositivo
        this.userProfile.device = this.detectDevice();
        this.userProfile.timeOfDay = this.getTimeContext(timeOfDay);
        
        this.saveUserProfile();
    }

    // Detecta dispositivo
    detectDevice() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }

    // Obtém contexto temporal
    getTimeContext(hour) {
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    // Rastreia comportamento do usuário
    trackUserBehavior() {
        // Rastreia cliques
        document.addEventListener('click', (e) => {
            this.recordInteraction('click', {
                element: e.target.tagName,
                className: e.target.className,
                id: e.target.id,
                text: e.target.textContent?.substring(0, 50),
                timestamp: Date.now()
            });
        });

        // Rastreia tempo na página
        this.startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.startTime;
            this.recordInteraction('page_time', {
                duration: timeSpent,
                page: window.location.pathname,
                timestamp: Date.now()
            });
        });

        // Rastreia scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                this.recordInteraction('scroll', {
                    percent: Math.round(scrollPercent),
                    timestamp: Date.now()
                });
            }, 100);
        });

        // Rastreia foco em elementos
        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.recordInteraction('focus', {
                    field: e.target.name || e.target.id,
                    type: e.target.type,
                    timestamp: Date.now()
                });
            }
        }, true);

        // Rastreia pesquisas
        const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[placeholder*="pesquis"]');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length > 2) {
                    this.recordInteraction('search', {
                        query: e.target.value,
                        field: e.target.name || e.target.id,
                        timestamp: Date.now()
                    });
                }
            });
        });
    }

    // Registra interação
    recordInteraction(type, data) {
        if (!this.behaviorData.interactions) {
            this.behaviorData.interactions = [];
        }

        this.behaviorData.interactions.push({
            type,
            data,
            sessionId: this.getSessionId(),
            userType: this.userProfile.type
        });

        // Mantém apenas últimas 1000 interações
        if (this.behaviorData.interactions.length > 1000) {
            this.behaviorData.interactions = this.behaviorData.interactions.slice(-1000);
        }

        this.saveBehaviorData();
        this.updatePersonalization();
    }

    // Personaliza conteúdo
    personalizeContent() {
        this.personalizeNavigation();
        this.personalizeCards();
        this.personalizeRecommendations();
        this.personalizeFilters();
        this.personalizeLayout();
    }

    // Personaliza navegação
    personalizeNavigation() {
        const nav = document.querySelector('nav, .navigation');
        if (!nav) return;

        const userType = this.userProfile.type;
        const frequentPages = this.getFrequentPages();

        // Reordena itens de navegação baseado no uso
        const navItems = nav.querySelectorAll('a');
        const itemsArray = Array.from(navItems);
        
        itemsArray.sort((a, b) => {
            const aFreq = frequentPages[a.getAttribute('href')] || 0;
            const bFreq = frequentPages[b.getAttribute('href')] || 0;
            return bFreq - aFreq;
        });

        // Adiciona indicadores de uso frequente
        itemsArray.forEach((item, index) => {
            if (index < 3 && frequentPages[item.getAttribute('href')] > 5) {
                if (!item.querySelector('.frequent-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'frequent-indicator';
                    indicator.innerHTML = '⭐';
                    indicator.title = 'Página frequente';
                    item.appendChild(indicator);
                }
            }
        });

        // Adiciona atalhos personalizados
        this.addPersonalizedShortcuts(nav);
    }

    // Adiciona atalhos personalizados
    addPersonalizedShortcuts(nav) {
        const shortcuts = this.generateShortcuts();
        
        if (shortcuts.length > 0) {
            const shortcutsContainer = document.createElement('div');
            shortcutsContainer.className = 'personalized-shortcuts';
            shortcutsContainer.innerHTML = `
                <div class="shortcuts-header">
                    <span>🚀 Atalhos para você</span>
                    <button onclick="personalization.hideShortcuts()" class="hide-shortcuts">×</button>
                </div>
                <div class="shortcuts-list">
                    ${shortcuts.map(shortcut => `
                        <a href="${shortcut.url}" class="shortcut-item" title="${shortcut.description}">
                            <span class="shortcut-icon">${shortcut.icon}</span>
                            <span class="shortcut-text">${shortcut.text}</span>
                        </a>
                    `).join('')}
                </div>
            `;

            nav.appendChild(shortcutsContainer);
        }
    }

    // Gera atalhos baseados no comportamento
    generateShortcuts() {
        const userType = this.userProfile.type;
        const recentSearches = this.getRecentSearches();
        const shortcuts = [];

        if (userType === 'candidate') {
            if (recentSearches.some(s => s.includes('desenvolvedor'))) {
                shortcuts.push({
                    url: '/vagas.html?area=tecnologia',
                    icon: '💻',
                    text: 'Vagas Tech',
                    description: 'Vagas em tecnologia baseadas no seu interesse'
                });
            }
            
            shortcuts.push({
                url: '/candidato_painel.html#profile',
                icon: '👤',
                text: 'Meu Perfil',
                description: 'Acesso rápido ao seu perfil'
            });
        } else if (userType === 'company') {
            shortcuts.push({
                url: '/buscar_candidatos.html',
                icon: '🔍',
                text: 'Buscar Talentos',
                description: 'Encontre candidatos ideais'
            });
            
            shortcuts.push({
                url: '/company_dashboard.html#analytics',
                icon: '📊',
                text: 'Métricas',
                description: 'Acompanhe suas métricas de recrutamento'
            });
        }

        return shortcuts.slice(0, 4); // Máximo 4 atalhos
    }

    // Personaliza cards
    personalizeCards() {
        const cards = document.querySelectorAll('.card, [class*="card"]');
        
        cards.forEach(card => {
            this.enhanceCard(card);
        });
    }

    // Melhora card individual
    enhanceCard(card) {
        const cardData = this.extractCardData(card);
        const relevanceScore = this.calculateRelevance(cardData);
        
        // Adiciona score de relevância
        if (relevanceScore > 0.7) {
            card.classList.add('high-relevance');
            this.addRelevanceIndicator(card, 'high');
        } else if (relevanceScore > 0.4) {
            card.classList.add('medium-relevance');
            this.addRelevanceIndicator(card, 'medium');
        }

        // Adiciona informações contextuais
        this.addContextualInfo(card, cardData);
        
        // Personaliza ações do card
        this.personalizeCardActions(card, cardData);
    }

    // Extrai dados do card
    extractCardData(card) {
        return {
            title: card.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || '',
            content: card.textContent || '',
            links: Array.from(card.querySelectorAll('a')).map(a => a.href),
            type: this.inferCardType(card)
        };
    }

    // Infere tipo do card
    inferCardType(card) {
        const content = card.textContent.toLowerCase();
        
        if (content.includes('vaga') || content.includes('emprego')) return 'job';
        if (content.includes('empresa') || content.includes('company')) return 'company';
        if (content.includes('curso') || content.includes('educação')) return 'course';
        if (content.includes('candidato') || content.includes('perfil')) return 'candidate';
        
        return 'general';
    }

    // Calcula relevância
    calculateRelevance(cardData) {
        let score = 0;
        const userInterests = this.getUserInterests();
        const recentSearches = this.getRecentSearches();
        
        // Baseado em interesses
        userInterests.forEach(interest => {
            if (cardData.content.toLowerCase().includes(interest.toLowerCase())) {
                score += interest.weight || 0.3;
            }
        });

        // Baseado em pesquisas recentes
        recentSearches.forEach(search => {
            if (cardData.content.toLowerCase().includes(search.toLowerCase())) {
                score += 0.2;
            }
        });

        // Baseado no tipo de usuário
        const userType = this.userProfile.type;
        if (userType === 'candidate' && cardData.type === 'job') score += 0.3;
        if (userType === 'company' && cardData.type === 'candidate') score += 0.3;
        if (userType === 'institution' && cardData.type === 'course') score += 0.3;

        return Math.min(score, 1);
    }

    // Adiciona indicador de relevância
    addRelevanceIndicator(card, level) {
        if (card.querySelector('.relevance-indicator')) return;

        const indicators = {
            high: { icon: '🎯', text: 'Alta compatibilidade', color: '#10b981' },
            medium: { icon: '✨', text: 'Boa compatibilidade', color: '#f59e0b' }
        };

        const indicator = indicators[level];
        const element = document.createElement('div');
        element.className = 'relevance-indicator';
        element.innerHTML = `
            <span class="relevance-icon">${indicator.icon}</span>
            <span class="relevance-text">${indicator.text}</span>
        `;
        element.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: ${indicator.color};
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
            z-index: 10;
        `;

        card.style.position = 'relative';
        card.appendChild(element);
    }

    // Adiciona informações contextuais
    addContextualInfo(card, cardData) {
        const contextInfo = this.generateContextInfo(cardData);
        
        if (contextInfo) {
            const infoElement = document.createElement('div');
            infoElement.className = 'contextual-info';
            infoElement.innerHTML = contextInfo;
            infoElement.style.cssText = `
                background: #f3f4f6;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                color: #6b7280;
                margin-top: 8px;
                border-left: 3px solid #8b5cf6;
            `;

            card.appendChild(infoElement);
        }
    }

    // Gera informações contextuais
    generateContextInfo(cardData) {
        const userType = this.userProfile.type;
        const timeOfDay = this.userProfile.timeOfDay;
        
        if (userType === 'candidate' && cardData.type === 'job') {
            const matchReasons = this.getMatchReasons(cardData);
            if (matchReasons.length > 0) {
                return `💡 Compatível porque: ${matchReasons.join(', ')}`;
            }
        }

        if (timeOfDay === 'morning' && cardData.type === 'course') {
            return '🌅 Ótimo momento para aprender algo novo!';
        }

        if (userType === 'company' && cardData.type === 'candidate') {
            return '🎯 Candidato com perfil alinhado às suas buscas recentes';
        }

        return null;
    }

    // Obtém razões de compatibilidade
    getMatchReasons(cardData) {
        const reasons = [];
        const userSkills = this.getUserSkills();
        const userInterests = this.getUserInterests();

        userSkills.forEach(skill => {
            if (cardData.content.toLowerCase().includes(skill.toLowerCase())) {
                reasons.push(`tem experiência em ${skill}`);
            }
        });

        userInterests.forEach(interest => {
            if (cardData.content.toLowerCase().includes(interest.toLowerCase())) {
                reasons.push(`interesse em ${interest}`);
            }
        });

        return reasons.slice(0, 2); // Máximo 2 razões
    }

    // Personaliza ações do card
    personalizeCardActions(card, cardData) {
        const actionsContainer = card.querySelector('.card-actions, .actions');
        if (!actionsContainer) return;

        // Adiciona ações personalizadas
        const personalizedActions = this.generatePersonalizedActions(cardData);
        
        personalizedActions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'personalized-action';
            button.innerHTML = `${action.icon} ${action.text}`;
            button.onclick = action.handler;
            button.style.cssText = `
                background: #8b5cf6;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                margin-left: 8px;
            `;
            
            actionsContainer.appendChild(button);
        });
    }

    // Gera ações personalizadas
    generatePersonalizedActions(cardData) {
        const actions = [];
        const userType = this.userProfile.type;

        if (userType === 'candidate' && cardData.type === 'job') {
            actions.push({
                icon: '💾',
                text: 'Salvar',
                handler: () => this.saveItem(cardData)
            });
            
            actions.push({
                icon: '📤',
                text: 'Compartilhar',
                handler: () => this.shareItem(cardData)
            });
        }

        if (userType === 'company' && cardData.type === 'candidate') {
            actions.push({
                icon: '⭐',
                text: 'Favoritar',
                handler: () => this.favoriteCandidate(cardData)
            });
        }

        return actions;
    }

    // Configura motor de recomendações
    setupRecommendationEngine() {
        this.generateRecommendations();
        this.displayRecommendations();
        
        // Atualiza recomendações periodicamente
        setInterval(() => {
            this.generateRecommendations();
            this.updateRecommendationDisplay();
        }, 300000); // 5 minutos
    }

    // Gera recomendações
    generateRecommendations() {
        const userType = this.userProfile.type;
        const userInterests = this.getUserInterests();
        const recentActivity = this.getRecentActivity();

        this.recommendations = [];

        if (userType === 'candidate') {
            this.recommendations.push(...this.generateJobRecommendations());
            this.recommendations.push(...this.generateCourseRecommendations());
            this.recommendations.push(...this.generateCompanyRecommendations());
        } else if (userType === 'company') {
            this.recommendations.push(...this.generateCandidateRecommendations());
            this.recommendations.push(...this.generateServiceRecommendations());
        } else if (userType === 'institution') {
            this.recommendations.push(...this.generateStudentRecommendations());
            this.recommendations.push(...this.generatePartnershipRecommendations());
        }

        // Ordena por relevância
        this.recommendations.sort((a, b) => b.relevance - a.relevance);
        this.recommendations = this.recommendations.slice(0, 10); // Top 10
    }

    // Gera recomendações de vagas
    generateJobRecommendations() {
        const userSkills = this.getUserSkills();
        const userLocation = this.getUserLocation();
        
        return [
            {
                type: 'job',
                title: 'Desenvolvedor Frontend React',
                company: 'TechCorp',
                location: userLocation || 'São Paulo, SP',
                relevance: 0.9,
                reason: 'Combina com suas habilidades em React',
                url: '/vaga/123'
            },
            {
                type: 'job',
                title: 'UX/UI Designer',
                company: 'DesignStudio',
                location: userLocation || 'São Paulo, SP',
                relevance: 0.8,
                reason: 'Baseado no seu interesse em design',
                url: '/vaga/124'
            }
        ];
    }

    // Gera recomendações de cursos
    generateCourseRecommendations() {
        return [
            {
                type: 'course',
                title: 'Curso Avançado de React',
                provider: 'TechEducation',
                duration: '40 horas',
                relevance: 0.85,
                reason: 'Para aprimorar suas habilidades atuais',
                url: '/curso/react-avancado'
            }
        ];
    }

    // Gera recomendações de empresas
    generateCompanyRecommendations() {
        return [
            {
                type: 'company',
                title: 'TechCorp',
                sector: 'Tecnologia',
                size: '100-500 funcionários',
                relevance: 0.75,
                reason: 'Empresa com cultura similar ao seu perfil',
                url: '/empresa/techcorp'
            }
        ];
    }

    // Gera recomendações de candidatos
    generateCandidateRecommendations() {
        return [
            {
                type: 'candidate',
                title: 'Ana Silva - Desenvolvedora Frontend',
                skills: ['React', 'JavaScript', 'CSS'],
                experience: '3 anos',
                relevance: 0.9,
                reason: 'Perfil ideal para suas vagas em aberto',
                url: '/candidato/ana-silva'
            }
        ];
    }

    // Gera recomendações de serviços
    generateServiceRecommendations() {
        return [
            {
                type: 'service',
                title: 'Plano Professional',
                features: ['Busca avançada', 'Relatórios detalhados'],
                relevance: 0.7,
                reason: 'Baseado no seu volume de contratações',
                url: '/planos#professional'
            }
        ];
    }

    // Gera recomendações de estudantes
    generateStudentRecommendations() {
        return [
            {
                type: 'student',
                title: 'João Santos - Estudante de Engenharia',
                course: 'Engenharia de Software',
                semester: '6º semestre',
                relevance: 0.8,
                reason: 'Interessado em seus cursos de tecnologia',
                url: '/estudante/joao-santos'
            }
        ];
    }

    // Gera recomendações de parcerias
    generatePartnershipRecommendations() {
        return [
            {
                type: 'partnership',
                title: 'Parceria com TechCorp',
                type: 'Estágio',
                benefits: ['Vagas exclusivas', 'Mentoria'],
                relevance: 0.75,
                reason: 'Empresa alinhada com seu perfil de cursos',
                url: '/parcerias/techcorp'
            }
        ];
    }

    // Exibe recomendações
    displayRecommendations() {
        const container = this.createRecommendationsContainer();
        if (container) {
            document.body.appendChild(container);
        }
    }

    // Cria container de recomendações
    createRecommendationsContainer() {
        if (this.recommendations.length === 0) return null;

        const container = document.createElement('div');
        container.id = 'smart-recommendations';
        container.className = 'smart-recommendations';
        container.innerHTML = `
            <div class="recommendations-header">
                <h3>🎯 Recomendado para você</h3>
                <button onclick="personalization.hideRecommendations()" class="hide-recommendations">×</button>
            </div>
            <div class="recommendations-list">
                ${this.recommendations.slice(0, 5).map(rec => `
                    <div class="recommendation-item" data-type="${rec.type}">
                        <div class="recommendation-content">
                            <h4>${rec.title}</h4>
                            <p class="recommendation-details">
                                ${this.formatRecommendationDetails(rec)}
                            </p>
                            <p class="recommendation-reason">💡 ${rec.reason}</p>
                        </div>
                        <div class="recommendation-actions">
                            <button onclick="personalization.openRecommendation('${rec.url}')" class="rec-action primary">
                                Ver
                            </button>
                            <button onclick="personalization.dismissRecommendation('${rec.type}-${rec.title}')" class="rec-action secondary">
                                Dispensar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="recommendations-footer">
                <button onclick="personalization.showAllRecommendations()" class="show-all-rec">
                    Ver todas as recomendações (${this.recommendations.length})
                </button>
            </div>
        `;

        this.styleRecommendationsContainer(container);
        return container;
    }

    // Formata detalhes da recomendação
    formatRecommendationDetails(rec) {
        switch (rec.type) {
            case 'job':
                return `${rec.company} • ${rec.location}`;
            case 'course':
                return `${rec.provider} • ${rec.duration}`;
            case 'company':
                return `${rec.sector} • ${rec.size}`;
            case 'candidate':
                return `${rec.skills.join(', ')} • ${rec.experience}`;
            case 'service':
                return rec.features.join(', ');
            case 'student':
                return `${rec.course} • ${rec.semester}`;
            case 'partnership':
                return `${rec.type} • ${rec.benefits.join(', ')}`;
            default:
                return '';
        }
    }

    // Estiliza container de recomendações
    styleRecommendationsContainer(container) {
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            max-height: 80vh;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 9999;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        `;
    }

    // Inicializa UI adaptativa
    initializeAdaptiveUI() {
        this.adaptColors();
        this.adaptLayout();
        this.adaptContent();
        this.adaptInteractions();
    }

    // Adapta cores baseado nas preferências
    adaptColors() {
        const colorPreference = this.preferences.colorScheme || 'auto';
        
        if (colorPreference === 'dark' || 
            (colorPreference === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-mode');
        }

        // Adapta cores baseado no tipo de usuário
        const userType = this.userProfile.type;
        const colorSchemes = {
            candidate: '#8b5cf6', // Roxo
            company: '#10b981',   // Verde
            institution: '#f59e0b', // Laranja
            admin: '#ef4444'      // Vermelho
        };

        if (colorSchemes[userType]) {
            document.documentElement.style.setProperty('--primary-color', colorSchemes[userType]);
        }
    }

    // Adapta layout baseado no dispositivo e uso
    adaptLayout() {
        const device = this.userProfile.device;
        const frequentSections = this.getFrequentSections();

        if (device === 'mobile') {
            document.body.classList.add('mobile-optimized');
            this.prioritizeMobileActions();
        }

        // Reordena seções baseado no uso
        this.reorderSections(frequentSections);
    }

    // Prioriza ações mobile
    prioritizeMobileActions() {
        const actionButtons = document.querySelectorAll('button, .btn');
        actionButtons.forEach(button => {
            if (button.textContent.includes('Candidatar') || 
                button.textContent.includes('Contatar') ||
                button.textContent.includes('Ver')) {
                button.style.order = '-1';
            }
        });
    }

    // Reordena seções
    reorderSections(frequentSections) {
        const containers = document.querySelectorAll('.section, .container, [class*="section"]');
        containers.forEach(container => {
            const sections = container.children;
            const sectionsArray = Array.from(sections);
            
            sectionsArray.sort((a, b) => {
                const aFreq = frequentSections[a.id] || 0;
                const bFreq = frequentSections[b.id] || 0;
                return bFreq - aFreq;
            });
        });
    }

    // Adapta conteúdo baseado no contexto
    adaptContent() {
        const timeOfDay = this.userProfile.timeOfDay;
        const userType = this.userProfile.type;

        // Adapta saudações
        this.adaptGreetings(timeOfDay);
        
        // Adapta sugestões de conteúdo
        this.adaptContentSuggestions(userType, timeOfDay);
    }

    // Adapta saudações
    adaptGreetings(timeOfDay) {
        const greetings = {
            morning: 'Bom dia',
            afternoon: 'Boa tarde',
            evening: 'Boa noite',
            night: 'Boa madrugada'
        };

        const greetingElements = document.querySelectorAll('[data-greeting]');
        greetingElements.forEach(element => {
            element.textContent = greetings[timeOfDay] || 'Olá';
        });
    }

    // Adapta sugestões de conteúdo
    adaptContentSuggestions(userType, timeOfDay) {
        const suggestions = this.generateContentSuggestions(userType, timeOfDay);
        this.displayContentSuggestions(suggestions);
    }

    // Gera sugestões de conteúdo
    generateContentSuggestions(userType, timeOfDay) {
        const suggestions = [];

        if (userType === 'candidate') {
            if (timeOfDay === 'morning') {
                suggestions.push('📅 Que tal verificar novas vagas hoje?');
                suggestions.push('☕ Bom momento para atualizar seu perfil');
            } else if (timeOfDay === 'evening') {
                suggestions.push('📚 Hora perfeita para fazer um curso');
                suggestions.push('🎯 Revise suas candidaturas do dia');
            }
        } else if (userType === 'company') {
            if (timeOfDay === 'morning') {
                suggestions.push('📊 Confira as métricas de ontem');
                suggestions.push('👥 Novos candidatos podem ter se cadastrado');
            }
        }

        return suggestions;
    }

    // Exibe sugestões de conteúdo
    displayContentSuggestions(suggestions) {
        if (suggestions.length === 0) return;

        const container = document.querySelector('.suggestions-container') || 
                         this.createSuggestionsContainer();
        
        container.innerHTML = `
            <h4>💡 Sugestões para você</h4>
            <ul>
                ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        `;
    }

    // Cria container de sugestões
    createSuggestionsContainer() {
        const container = document.createElement('div');
        container.className = 'suggestions-container';
        container.style.cssText = `
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
            border-left: 4px solid #8b5cf6;
        `;

        const main = document.querySelector('main, .main-content') || document.body;
        main.insertBefore(container, main.firstChild);
        
        return container;
    }

    // Adapta interações
    adaptInteractions() {
        const device = this.userProfile.device;
        
        if (device === 'mobile') {
            this.enableSwipeGestures();
            this.optimizeTouchTargets();
        }
        
        this.enableKeyboardShortcuts();
        this.enableVoiceCommands();
    }

    // Habilita gestos de swipe
    enableSwipeGestures() {
        // Implementado no mobile-optimization.js
    }

    // Otimiza alvos de toque
    optimizeTouchTargets() {
        const interactiveElements = document.querySelectorAll('button, a, input, select');
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.height < 44) {
                element.style.minHeight = '44px';
                element.style.display = 'flex';
                element.style.alignItems = 'center';
            }
        });
    }

    // Habilita atalhos de teclado
    enableKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.openQuickSearch();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showHelp();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.showRecommendations();
                        break;
                }
            }
        });
    }

    // Habilita comandos de voz
    enableVoiceCommands() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'pt-BR';

            // Adiciona botão de comando de voz
            this.addVoiceCommandButton(recognition);
        }
    }

    // Adiciona botão de comando de voz
    addVoiceCommandButton(recognition) {
        const button = document.createElement('button');
        button.className = 'voice-command-btn';
        button.innerHTML = '🎤';
        button.title = 'Comando de voz (Ctrl+V)';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #8b5cf6;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        button.addEventListener('click', () => {
            recognition.start();
            button.innerHTML = '🔴';
            button.style.background = '#ef4444';
        });

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.processVoiceCommand(command);
            button.innerHTML = '🎤';
            button.style.background = '#8b5cf6';
        };

        recognition.onerror = () => {
            button.innerHTML = '🎤';
            button.style.background = '#8b5cf6';
        };

        document.body.appendChild(button);

        // Atalho de teclado
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                button.click();
            }
        });
    }

    // Processa comando de voz
    processVoiceCommand(command) {
        if (command.includes('buscar') || command.includes('procurar')) {
            this.openQuickSearch();
        } else if (command.includes('perfil')) {
            window.location.href = '/candidato_painel.html';
        } else if (command.includes('vagas')) {
            window.location.href = '/vagas.html';
        } else if (command.includes('empresas')) {
            window.location.href = '/buscar_empresas.html';
        } else if (command.includes('cursos')) {
            window.location.href = '/cursos-gratuitos.html';
        } else if (command.includes('ajuda')) {
            this.showHelp();
        } else {
            alert(`Comando não reconhecido: "${command}"`);
        }
    }

    // Inicia loop de aprendizado
    startLearningLoop() {
        // Atualiza personalização a cada 5 minutos
        setInterval(() => {
            this.updatePersonalization();
        }, 300000);

        // Salva dados a cada minuto
        setInterval(() => {
            this.saveAllData();
        }, 60000);

        // Limpa dados antigos diariamente
        setInterval(() => {
            this.cleanOldData();
        }, 86400000); // 24 horas
    }

    // Atualiza personalização
    updatePersonalization() {
        this.analyzeUserBehavior();
        this.updateUserInterests();
        this.updatePreferences();
        this.generateRecommendations();
        this.updateRecommendationDisplay();
    }

    // Analisa comportamento do usuário
    analyzeUserBehavior() {
        const interactions = this.behaviorData.interactions || [];
        const recentInteractions = interactions.filter(
            interaction => Date.now() - interaction.data.timestamp < 3600000 // Última hora
        );

        // Analisa padrões de clique
        const clickPatterns = this.analyzeClickPatterns(recentInteractions);
        
        // Analisa tempo gasto em seções
        const timePatterns = this.analyzeTimePatterns(recentInteractions);
        
        // Analisa pesquisas
        const searchPatterns = this.analyzeSearchPatterns(recentInteractions);

        // Atualiza perfil baseado na análise
        this.updateUserProfileFromAnalysis({
            clickPatterns,
            timePatterns,
            searchPatterns
        });
    }

    // Analisa padrões de clique
    analyzeClickPatterns(interactions) {
        const clicks = interactions.filter(i => i.type === 'click');
        const patterns = {};

        clicks.forEach(click => {
            const element = click.data.className || click.data.element;
            patterns[element] = (patterns[element] || 0) + 1;
        });

        return patterns;
    }

    // Analisa padrões de tempo
    analyzeTimePatterns(interactions) {
        const timeSpent = interactions.filter(i => i.type === 'page_time');
        const patterns = {};

        timeSpent.forEach(time => {
            const page = time.data.page;
            patterns[page] = (patterns[page] || 0) + time.data.duration;
        });

        return patterns;
    }

    // Analisa padrões de pesquisa
    analyzeSearchPatterns(interactions) {
        const searches = interactions.filter(i => i.type === 'search');
        const patterns = {};

        searches.forEach(search => {
            const query = search.data.query.toLowerCase();
            const words = query.split(' ');
            
            words.forEach(word => {
                if (word.length > 2) {
                    patterns[word] = (patterns[word] || 0) + 1;
                }
            });
        });

        return patterns;
    }

    // Atualiza perfil baseado na análise
    updateUserProfileFromAnalysis(analysis) {
        // Atualiza interesses baseado em pesquisas
        Object.keys(analysis.searchPatterns).forEach(term => {
            const weight = analysis.searchPatterns[term] * 0.1;
            this.addUserInterest(term, weight);
        });

        // Atualiza páginas frequentes
        Object.keys(analysis.timePatterns).forEach(page => {
            this.addFrequentPage(page, analysis.timePatterns[page]);
        });

        this.saveUserProfile();
    }

    // Métodos utilitários
    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    }

    getUserInterests() {
        return this.userProfile.interests || [];
    }

    getUserSkills() {
        return this.userProfile.skills || [];
    }

    getUserLocation() {
        return this.userProfile.location || null;
    }

    getRecentSearches() {
        const searches = this.behaviorData.interactions?.filter(i => i.type === 'search') || [];
        return searches.slice(-10).map(s => s.data.query);
    }

    getRecentActivity() {
        const recent = this.behaviorData.interactions?.filter(
            i => Date.now() - i.data.timestamp < 86400000 // Último dia
        ) || [];
        return recent;
    }

    getFrequentPages() {
        return this.behaviorData.frequentPages || {};
    }

    getFrequentSections() {
        return this.behaviorData.frequentSections || {};
    }

    addUserInterest(interest, weight = 0.1) {
        if (!this.userProfile.interests) {
            this.userProfile.interests = [];
        }

        const existing = this.userProfile.interests.find(i => i.term === interest);
        if (existing) {
            existing.weight = Math.min(existing.weight + weight, 1);
        } else {
            this.userProfile.interests.push({ term: interest, weight });
        }

        // Mantém apenas top 20 interesses
        this.userProfile.interests.sort((a, b) => b.weight - a.weight);
        this.userProfile.interests = this.userProfile.interests.slice(0, 20);
    }

    addFrequentPage(page, time) {
        if (!this.behaviorData.frequentPages) {
            this.behaviorData.frequentPages = {};
        }

        this.behaviorData.frequentPages[page] = 
            (this.behaviorData.frequentPages[page] || 0) + (time / 1000); // Converte para segundos
    }

    // Métodos de interface pública
    openQuickSearch() {
        alert('🔍 Busca rápida seria aberta aqui (Ctrl+K)');
    }

    showHelp() {
        alert('❓ Central de ajuda seria aberta aqui (Ctrl+H)');
    }

    showRecommendations() {
        const container = document.getElementById('smart-recommendations');
        if (container) {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        }
    }

    hideRecommendations() {
        const container = document.getElementById('smart-recommendations');
        if (container) {
            container.style.display = 'none';
        }
    }

    hideShortcuts() {
        const shortcuts = document.querySelector('.personalized-shortcuts');
        if (shortcuts) {
            shortcuts.style.display = 'none';
        }
    }

    openRecommendation(url) {
        window.location.href = url;
    }

    dismissRecommendation(id) {
        if (!this.preferences.dismissedRecommendations) {
            this.preferences.dismissedRecommendations = [];
        }
        this.preferences.dismissedRecommendations.push(id);
        this.savePreferences();
        
        // Remove da lista atual
        this.recommendations = this.recommendations.filter(rec => 
            `${rec.type}-${rec.title}` !== id
        );
        this.updateRecommendationDisplay();
    }

    showAllRecommendations() {
        alert(`📋 Todas as ${this.recommendations.length} recomendações seriam exibidas aqui`);
    }

    saveItem(item) {
        alert(`💾 Item "${item.title}" salvo nos favoritos`);
    }

    shareItem(item) {
        if (navigator.share) {
            navigator.share({
                title: item.title,
                url: window.location.href
            });
        } else {
            alert(`📤 Compartilhar: ${item.title}`);
        }
    }

    favoriteCandidate(candidate) {
        alert(`⭐ Candidato "${candidate.title}" adicionado aos favoritos`);
    }

    updateRecommendationDisplay() {
        const container = document.getElementById('smart-recommendations');
        if (container && this.recommendations.length > 0) {
            const newContainer = this.createRecommendationsContainer();
            if (newContainer) {
                container.replaceWith(newContainer);
            }
        } else if (container) {
            container.remove();
        }
    }

    // Métodos de persistência
    loadUserProfile() {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : {
            type: null,
            context: null,
            device: null,
            timeOfDay: null,
            interests: [],
            skills: [],
            location: null
        };
    }

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    loadBehaviorData() {
        const saved = localStorage.getItem('behaviorData');
        return saved ? JSON.parse(saved) : {
            interactions: [],
            frequentPages: {},
            frequentSections: {}
        };
    }

    saveBehaviorData() {
        localStorage.setItem('behaviorData', JSON.stringify(this.behaviorData));
    }

    loadPreferences() {
        const saved = localStorage.getItem('userPreferences');
        return saved ? JSON.parse(saved) : {
            colorScheme: 'auto',
            language: 'pt-BR',
            notifications: true,
            dismissedRecommendations: []
        };
    }

    savePreferences() {
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    }

    saveAllData() {
        this.saveUserProfile();
        this.saveBehaviorData();
        this.savePreferences();
    }

    cleanOldData() {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        if (this.behaviorData.interactions) {
            this.behaviorData.interactions = this.behaviorData.interactions.filter(
                interaction => interaction.data.timestamp > oneWeekAgo
            );
        }

        this.saveBehaviorData();
    }

    // Método de reset (para desenvolvimento)
    reset() {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('behaviorData');
        localStorage.removeItem('userPreferences');
        location.reload();
    }
}

// CSS adicional para personalização
const smartPersonalizationCSS = `
.high-relevance {
    border: 2px solid #10b981 !important;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
}

.medium-relevance {
    border: 2px solid #f59e0b !important;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2) !important;
}

.frequent-indicator {
    background: #fbbf24;
    color: #92400e;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 10px;
    margin-left: 8px;
}

.personalized-shortcuts {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
    border-left: 4px solid #8b5cf6;
}

.shortcuts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
}

.hide-shortcuts {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #6b7280;
}

.shortcuts-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.shortcut-item {
    display: flex;
    align-items: center;
    gap: 4px;
    background: white;
    padding: 6px 10px;
    border-radius: 6px;
    text-decoration: none;
    color: #374151;
    font-size: 12px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
}

.shortcut-item:hover {
    background: #8b5cf6;
    color: white;
    transform: translateY(-1px);
}

.smart-recommendations {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.recommendations-header {
    background: #8b5cf6;
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.recommendations-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.hide-recommendations {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 20px;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.recommendations-list {
    max-height: 400px;
    overflow-y: auto;
}

.recommendation-item {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
}

.recommendation-item:last-child {
    border-bottom: none;
}

.recommendation-content {
    flex: 1;
}

.recommendation-content h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
}

.recommendation-details {
    margin: 0 0 4px 0;
    font-size: 12px;
    color: #6b7280;
}

.recommendation-reason {
    margin: 0;
    font-size: 11px;
    color: #8b5cf6;
    font-style: italic;
}

.recommendation-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.rec-action {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    transition: all 0.2s;
}

.rec-action.primary {
    background: #8b5cf6;
    color: white;
}

.rec-action.primary:hover {
    background: #7c3aed;
}

.rec-action.secondary {
    background: #f3f4f6;
    color: #6b7280;
}

.rec-action.secondary:hover {
    background: #e5e7eb;
}

.recommendations-footer {
    padding: 12px 16px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
}

.show-all-rec {
    width: 100%;
    background: none;
    border: 1px solid #d1d5db;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    color: #6b7280;
    transition: all 0.2s;
}

.show-all-rec:hover {
    background: #f3f4f6;
    border-color: #8b5cf6;
    color: #8b5cf6;
}

.voice-command-btn:hover {
    transform: scale(1.1);
}

.dark-mode {
    background-color: #1f2937;
    color: #f9fafb;
}

.dark-mode .smart-recommendations {
    background: #374151;
    border-color: #4b5563;
}

.dark-mode .recommendation-item {
    border-color: #4b5563;
}

.dark-mode .recommendation-content h4 {
    color: #f9fafb;
}

.dark-mode .recommendations-footer {
    background: #4b5563;
    border-color: #6b7280;
}

@media (max-width: 768px) {
    .smart-recommendations {
        width: 90%;
        right: 5%;
        top: 10px;
    }
    
    .recommendation-item {
        flex-direction: column;
        align-items: stretch;
    }
    
    .recommendation-actions {
        flex-direction: row;
        justify-content: space-between;
        margin-top: 8px;
    }
    
    .personalized-shortcuts {
        margin: 4px 0;
    }
    
    .shortcuts-list {
        justify-content: center;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('smart-personalization-styles')) {
    const style = document.createElement('style');
    style.id = 'smart-personalization-styles';
    style.textContent = smartPersonalizationCSS;
    document.head.appendChild(style);
}

// Inicializa sistema automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.personalization = new SmartPersonalizationSystem();
});

// Exporta para uso global
window.SmartPersonalizationSystem = SmartPersonalizationSystem;
