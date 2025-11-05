// Sistema de Cultura Empresarial Imersiva - ClaunNetworking
class CompanyCultureSystem {
    constructor() {
        this.cultureData = JSON.parse(localStorage.getItem('companyCulture') || '{}');
        this.mediaTypes = ['image', 'video', 'audio', 'document'];
        this.cultureAspects = [
            'ambiente_trabalho', 'beneficios', 'diversidade', 'inovacao',
            'crescimento', 'equilibrio', 'colaboracao', 'lideranca'
        ];
    }

    // Cria interface de cultura empresarial
    createCultureInterface(containerId, companyData = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cultureHTML = `
            <div class="company-culture-system">
                <div class="culture-header">
                    <h3>🏢 Cultura Empresarial</h3>
                    <div class="culture-actions">
                        <button class="culture-btn" onclick="cultureSystem.startVirtualTour()">
                            🏠 Tour Virtual
                        </button>
                        <button class="culture-btn" onclick="cultureSystem.showTeamVideos()">
                            🎥 Conheça o Time
                        </button>
                        <button class="culture-btn" onclick="cultureSystem.showDayInLife()">
                            📅 Um Dia Aqui
                        </button>
                    </div>
                </div>

                <!-- Culture Overview -->
                <div class="culture-overview">
                    <div class="culture-hero">
                        <div class="hero-content">
                            <h4>${companyData.name || 'Nossa Empresa'}</h4>
                            <p class="hero-tagline">${companyData.tagline || 'Transformando o futuro através da tecnologia'}</p>
                            <div class="culture-stats">
                                <div class="stat">
                                    <span class="stat-number">${companyData.employees || '150+'}</span>
                                    <span class="stat-label">Colaboradores</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-number">${companyData.satisfaction || '4.8'}</span>
                                    <span class="stat-label">Satisfação</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-number">${companyData.retention || '92%'}</span>
                                    <span class="stat-label">Retenção</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-number">${companyData.growth || '25%'}</span>
                                    <span class="stat-label">Crescimento</span>
                                </div>
                            </div>
                        </div>
                        <div class="hero-media">
                            <div class="company-video-placeholder" onclick="cultureSystem.playCompanyVideo()">
                                <div class="play-button">▶️</div>
                                <span>Assista nosso vídeo institucional</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Culture Aspects -->
                <div class="culture-aspects">
                    <h4>💫 Nossa Cultura em Detalhes</h4>
                    <div class="aspects-grid">
                        <div class="aspect-card" data-aspect="ambiente_trabalho">
                            <div class="aspect-icon">🏢</div>
                            <h5>Ambiente de Trabalho</h5>
                            <p>Espaços modernos e colaborativos que inspiram criatividade</p>
                            <button onclick="cultureSystem.exploreAspect('ambiente_trabalho')">Explorar</button>
                        </div>
                        <div class="aspect-card" data-aspect="beneficios">
                            <div class="aspect-icon">🎁</div>
                            <h5>Benefícios</h5>
                            <p>Pacote completo de benefícios pensado no seu bem-estar</p>
                            <button onclick="cultureSystem.exploreAspect('beneficios')">Explorar</button>
                        </div>
                        <div class="aspect-card" data-aspect="diversidade">
                            <div class="aspect-icon">🌈</div>
                            <h5>Diversidade & Inclusão</h5>
                            <p>Valorizamos a diversidade e promovemos um ambiente inclusivo</p>
                            <button onclick="cultureSystem.exploreAspect('diversidade')">Explorar</button>
                        </div>
                        <div class="aspect-card" data-aspect="inovacao">
                            <div class="aspect-icon">💡</div>
                            <h5>Inovação</h5>
                            <p>Incentivamos a criatividade e o pensamento fora da caixa</p>
                            <button onclick="cultureSystem.exploreAspect('inovacao')">Explorar</button>
                        </div>
                        <div class="aspect-card" data-aspect="crescimento">
                            <div class="aspect-icon">📈</div>
                            <h5>Crescimento</h5>
                            <p>Investimos no desenvolvimento profissional de cada pessoa</p>
                            <button onclick="cultureSystem.exploreAspect('crescimento')">Explorar</button>
                        </div>
                        <div class="aspect-card" data-aspect="equilibrio">
                            <div class="aspect-icon">⚖️</div>
                            <h5>Work-Life Balance</h5>
                            <p>Promovemos o equilíbrio entre vida pessoal e profissional</p>
                            <button onclick="cultureSystem.exploreAspect('equilibrio')">Explorar</button>
                        </div>
                    </div>
                </div>

                <!-- Team Testimonials -->
                <div class="team-testimonials">
                    <h4>💬 O que nosso time diz</h4>
                    <div class="testimonials-carousel">
                        <div class="testimonial active">
                            <div class="testimonial-content">
                                <p>"Trabalhar aqui mudou minha perspectiva sobre tecnologia. O ambiente é incrível e as oportunidades de crescimento são reais."</p>
                                <div class="testimonial-author">
                                    <div class="author-avatar">👩‍💻</div>
                                    <div class="author-info">
                                        <span class="author-name">Ana Silva</span>
                                        <span class="author-role">Desenvolvedora Frontend</span>
                                        <span class="author-time">2 anos na empresa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial">
                            <div class="testimonial-content">
                                <p>"A cultura de inovação aqui é única. Sempre somos incentivados a propor novas ideias e experimentar tecnologias emergentes."</p>
                                <div class="testimonial-author">
                                    <div class="author-avatar">👨‍💼</div>
                                    <div class="author-info">
                                        <span class="author-name">Carlos Santos</span>
                                        <span class="author-role">Tech Lead</span>
                                        <span class="author-time">3 anos na empresa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="testimonial">
                            <div class="testimonial-content">
                                <p>"O que mais me impressiona é como a empresa valoriza o equilíbrio. Posso trabalhar de casa quando preciso e tenho flexibilidade total."</p>
                                <div class="testimonial-author">
                                    <div class="author-avatar">👩‍🎨</div>
                                    <div class="author-info">
                                        <span class="author-name">Maria Oliveira</span>
                                        <span class="author-role">UX Designer</span>
                                        <span class="author-time">1 ano na empresa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="testimonials-controls">
                        <button onclick="cultureSystem.previousTestimonial()">‹</button>
                        <div class="testimonials-dots">
                            <span class="dot active" onclick="cultureSystem.showTestimonial(0)"></span>
                            <span class="dot" onclick="cultureSystem.showTestimonial(1)"></span>
                            <span class="dot" onclick="cultureSystem.showTestimonial(2)"></span>
                        </div>
                        <button onclick="cultureSystem.nextTestimonial()">›</button>
                    </div>
                </div>

                <!-- Virtual Office Tour -->
                <div class="virtual-tour-preview">
                    <h4>🏠 Tour Virtual do Escritório</h4>
                    <div class="tour-grid">
                        <div class="tour-spot" onclick="cultureSystem.visitSpot('reception')">
                            <div class="spot-image">🏢</div>
                            <h5>Recepção</h5>
                            <p>Primeiro contato com nossa energia</p>
                        </div>
                        <div class="tour-spot" onclick="cultureSystem.visitSpot('workspace')">
                            <div class="spot-image">💻</div>
                            <h5>Área de Trabalho</h5>
                            <p>Espaços colaborativos e individuais</p>
                        </div>
                        <div class="tour-spot" onclick="cultureSystem.visitSpot('recreation')">
                            <div class="spot-image">🎮</div>
                            <h5>Área de Lazer</h5>
                            <p>Relaxe e socialize com o time</p>
                        </div>
                        <div class="tour-spot" onclick="cultureSystem.visitSpot('meeting')">
                            <div class="spot-image">🤝</div>
                            <h5>Salas de Reunião</h5>
                            <p>Espaços para colaboração e criatividade</p>
                        </div>
                    </div>
                </div>

                <!-- Day in Life -->
                <div class="day-in-life">
                    <h4>📅 Um Dia na Nossa Empresa</h4>
                    <div class="timeline">
                        <div class="timeline-item">
                            <div class="timeline-time">09:00</div>
                            <div class="timeline-content">
                                <h5>☕ Chegada e Café</h5>
                                <p>Começamos o dia com um café e conversa informal com o time</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">09:30</div>
                            <div class="timeline-content">
                                <h5>🎯 Daily Standup</h5>
                                <p>Alinhamento rápido sobre as atividades do dia</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">10:00</div>
                            <div class="timeline-content">
                                <h5>💻 Desenvolvimento</h5>
                                <p>Foco total no desenvolvimento de projetos inovadores</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">12:00</div>
                            <div class="timeline-content">
                                <h5>🍽️ Almoço</h5>
                                <p>Pausa para recarregar as energias, muitas vezes em grupo</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">14:00</div>
                            <div class="timeline-content">
                                <h5>🤝 Colaboração</h5>
                                <p>Reuniões de projeto e sessões de brainstorming</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">16:00</div>
                            <div class="timeline-content">
                                <h5>📚 Aprendizado</h5>
                                <p>Tempo dedicado para estudos e desenvolvimento pessoal</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">18:00</div>
                            <div class="timeline-content">
                                <h5>🎉 Encerramento</h5>
                                <p>Retrospectiva do dia e planejamento para amanhã</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Culture Detail Modal -->
            <div id="culture-detail-modal" class="culture-modal" style="display: none;">
                <div class="modal-overlay" onclick="cultureSystem.closeModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="culture-modal-title">Aspecto da Cultura</h3>
                        <button onclick="cultureSystem.closeModal()">×</button>
                    </div>
                    <div class="modal-body" id="culture-modal-body">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            </div>

            <!-- Virtual Tour Modal -->
            <div id="virtual-tour-modal" class="culture-modal fullscreen" style="display: none;">
                <div class="tour-interface">
                    <div class="tour-header">
                        <h3>🏠 Tour Virtual - <span id="current-spot">Recepção</span></h3>
                        <button onclick="cultureSystem.closeTour()">× Sair do Tour</button>
                    </div>
                    <div class="tour-content">
                        <div class="tour-360-view" id="tour-360-view">
                            <!-- 360° view would be implemented here -->
                            <div class="tour-placeholder">
                                <div class="tour-icon">🏢</div>
                                <p>Vista 360° do ambiente</p>
                                <small>Arraste para explorar</small>
                            </div>
                        </div>
                        <div class="tour-navigation">
                            <button onclick="cultureSystem.visitSpot('reception')" class="nav-spot active">Recepção</button>
                            <button onclick="cultureSystem.visitSpot('workspace')" class="nav-spot">Trabalho</button>
                            <button onclick="cultureSystem.visitSpot('recreation')" class="nav-spot">Lazer</button>
                            <button onclick="cultureSystem.visitSpot('meeting')" class="nav-spot">Reuniões</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = cultureHTML;
        this.initializeCarousel();
        this.loadCultureData();
    }

    // Inicializa carousel de depoimentos
    initializeCarousel() {
        this.currentTestimonial = 0;
        this.totalTestimonials = 3;
        
        // Auto-rotate testimonials
        setInterval(() => {
            this.nextTestimonial();
        }, 5000);
    }

    // Navega pelos depoimentos
    nextTestimonial() {
        this.currentTestimonial = (this.currentTestimonial + 1) % this.totalTestimonials;
        this.showTestimonial(this.currentTestimonial);
    }

    previousTestimonial() {
        this.currentTestimonial = (this.currentTestimonial - 1 + this.totalTestimonials) % this.totalTestimonials;
        this.showTestimonial(this.currentTestimonial);
    }

    showTestimonial(index) {
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.testimonials-dots .dot');
        
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentTestimonial = index;
    }

    // Explora aspecto da cultura
    exploreAspect(aspect) {
        const aspectData = this.getAspectData(aspect);
        const modal = document.getElementById('culture-detail-modal');
        const title = document.getElementById('culture-modal-title');
        const body = document.getElementById('culture-modal-body');

        title.textContent = aspectData.title;
        body.innerHTML = `
            <div class="aspect-detail">
                <div class="aspect-hero">
                    <div class="aspect-icon-large">${aspectData.icon}</div>
                    <p class="aspect-description">${aspectData.description}</p>
                </div>
                
                <div class="aspect-highlights">
                    <h4>✨ Destaques</h4>
                    <div class="highlights-grid">
                        ${aspectData.highlights.map(highlight => `
                            <div class="highlight-item">
                                <div class="highlight-icon">${highlight.icon}</div>
                                <div class="highlight-content">
                                    <h5>${highlight.title}</h5>
                                    <p>${highlight.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${aspectData.metrics ? `
                    <div class="aspect-metrics">
                        <h4>📊 Métricas</h4>
                        <div class="metrics-grid">
                            ${aspectData.metrics.map(metric => `
                                <div class="metric-card">
                                    <span class="metric-value">${metric.value}</span>
                                    <span class="metric-label">${metric.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="aspect-testimonials">
                    <h4>💬 Experiências do Time</h4>
                    ${aspectData.testimonials.map(testimonial => `
                        <div class="mini-testimonial">
                            <p>"${testimonial.text}"</p>
                            <div class="testimonial-author">
                                <span class="author-name">${testimonial.author}</span>
                                <span class="author-role">${testimonial.role}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    // Obtém dados do aspecto
    getAspectData(aspect) {
        const aspectsData = {
            ambiente_trabalho: {
                title: '🏢 Ambiente de Trabalho',
                icon: '🏢',
                description: 'Nossos espaços são projetados para inspirar criatividade, promover colaboração e garantir o conforto de todos.',
                highlights: [
                    {
                        icon: '🪑',
                        title: 'Mobiliário Ergonômico',
                        description: 'Cadeiras e mesas ajustáveis para máximo conforto'
                    },
                    {
                        icon: '🌱',
                        title: 'Ambiente Verde',
                        description: 'Plantas e luz natural em todos os espaços'
                    },
                    {
                        icon: '🔇',
                        title: 'Acústica Otimizada',
                        description: 'Espaços silenciosos para concentração'
                    },
                    {
                        icon: '☕',
                        title: 'Café Premium',
                        description: 'Café especial disponível 24/7'
                    }
                ],
                metrics: [
                    { value: '95%', label: 'Satisfação com o ambiente' },
                    { value: '24°C', label: 'Temperatura ideal' },
                    { value: '100%', label: 'Iluminação natural' }
                ],
                testimonials: [
                    {
                        text: 'O ambiente aqui é incrível! Me sinto motivada todos os dias.',
                        author: 'Ana Silva',
                        role: 'Desenvolvedora'
                    }
                ]
            },
            beneficios: {
                title: '🎁 Benefícios',
                icon: '🎁',
                description: 'Oferecemos um pacote completo de benefícios pensado no bem-estar e qualidade de vida de nossos colaboradores.',
                highlights: [
                    {
                        icon: '🏥',
                        title: 'Plano de Saúde Premium',
                        description: 'Cobertura completa para você e sua família'
                    },
                    {
                        icon: '🍽️',
                        title: 'Vale Refeição',
                        description: 'R$ 35/dia para suas refeições'
                    },
                    {
                        icon: '🏋️',
                        title: 'Gympass',
                        description: 'Acesso a mais de 50.000 academias'
                    },
                    {
                        icon: '📚',
                        title: 'Educação',
                        description: 'R$ 3.000/ano para cursos e certificações'
                    }
                ],
                metrics: [
                    { value: 'R$ 8.500', label: 'Valor médio em benefícios' },
                    { value: '15+', label: 'Tipos de benefícios' },
                    { value: '100%', label: 'Cobertura do plano de saúde' }
                ],
                testimonials: [
                    {
                        text: 'Os benefícios aqui são realmente diferenciados. Sinto que a empresa se importa comigo.',
                        author: 'Carlos Santos',
                        role: 'Tech Lead'
                    }
                ]
            },
            diversidade: {
                title: '🌈 Diversidade & Inclusão',
                icon: '🌈',
                description: 'Acreditamos que a diversidade é nossa força. Promovemos um ambiente inclusivo onde todos podem ser autênticos.',
                highlights: [
                    {
                        icon: '👥',
                        title: 'Equipe Diversa',
                        description: '50% mulheres em posições de liderança'
                    },
                    {
                        icon: '🏳️‍🌈',
                        title: 'LGBTQIA+ Friendly',
                        description: 'Políticas inclusivas e grupos de apoio'
                    },
                    {
                        icon: '♿',
                        title: 'Acessibilidade',
                        description: 'Escritório 100% acessível'
                    },
                    {
                        icon: '🌍',
                        title: 'Multiculturalismo',
                        description: 'Time de 12 nacionalidades diferentes'
                    }
                ],
                metrics: [
                    { value: '50%', label: 'Mulheres na liderança' },
                    { value: '12', label: 'Nacionalidades' },
                    { value: '95%', label: 'Índice de inclusão' }
                ],
                testimonials: [
                    {
                        text: 'Aqui posso ser eu mesma sem medo. A diversidade é celebrada todos os dias.',
                        author: 'Maria Oliveira',
                        role: 'UX Designer'
                    }
                ]
            },
            inovacao: {
                title: '💡 Inovação',
                icon: '💡',
                description: 'Incentivamos a experimentação, criatividade e o pensamento fora da caixa em todos os projetos.',
                highlights: [
                    {
                        icon: '🚀',
                        title: 'Innovation Days',
                        description: '20% do tempo para projetos pessoais'
                    },
                    {
                        icon: '🧪',
                        title: 'Lab de Experimentação',
                        description: 'Espaço dedicado para testar novas ideias'
                    },
                    {
                        icon: '💰',
                        title: 'Fundo de Inovação',
                        description: 'R$ 50.000 anuais para projetos inovadores'
                    },
                    {
                        icon: '🏆',
                        title: 'Hackathons',
                        description: 'Eventos mensais de inovação'
                    }
                ],
                metrics: [
                    { value: '25', label: 'Projetos inovadores/ano' },
                    { value: '20%', label: 'Tempo para inovação' },
                    { value: '8', label: 'Patentes registradas' }
                ],
                testimonials: [
                    {
                        text: 'Minhas ideias são sempre ouvidas e apoiadas. É incrível ver projetos saindo do papel.',
                        author: 'João Pedro',
                        role: 'Desenvolvedor Senior'
                    }
                ]
            },
            crescimento: {
                title: '📈 Crescimento',
                icon: '📈',
                description: 'Investimos no desenvolvimento profissional e pessoal de cada colaborador através de programas estruturados.',
                highlights: [
                    {
                        icon: '🎯',
                        title: 'Plano de Carreira',
                        description: 'Trilhas claras de desenvolvimento'
                    },
                    {
                        icon: '👨‍🏫',
                        title: 'Mentoria',
                        description: 'Programa de mentoria com líderes'
                    },
                    {
                        icon: '📜',
                        title: 'Certificações',
                        description: 'Apoio financeiro para certificações'
                    },
                    {
                        icon: '🌟',
                        title: 'Promoções Internas',
                        description: '80% das vagas preenchidas internamente'
                    }
                ],
                metrics: [
                    { value: '80%', label: 'Promoções internas' },
                    { value: '40h', label: 'Treinamento/mês' },
                    { value: '95%', label: 'Satisfação com crescimento' }
                ],
                testimonials: [
                    {
                        text: 'Em 2 anos fui promovida duas vezes. O crescimento aqui é real e baseado em mérito.',
                        author: 'Fernanda Costa',
                        role: 'Product Manager'
                    }
                ]
            },
            equilibrio: {
                title: '⚖️ Work-Life Balance',
                icon: '⚖️',
                description: 'Promovemos o equilíbrio saudável entre vida pessoal e profissional através de políticas flexíveis.',
                highlights: [
                    {
                        icon: '🏠',
                        title: 'Home Office',
                        description: 'Flexibilidade total para trabalho remoto'
                    },
                    {
                        icon: '⏰',
                        title: 'Horário Flexível',
                        description: 'Escolha seu horário de trabalho'
                    },
                    {
                        icon: '🏖️',
                        title: 'Férias Ilimitadas',
                        description: 'Tire férias quando precisar'
                    },
                    {
                        icon: '🧘',
                        title: 'Bem-estar Mental',
                        description: 'Apoio psicológico e meditação'
                    }
                ],
                metrics: [
                    { value: '4.9/5', label: 'Satisfação com equilíbrio' },
                    { value: '30 dias', label: 'Férias médias/ano' },
                    { value: '2%', label: 'Taxa de burnout' }
                ],
                testimonials: [
                    {
                        text: 'Consigo conciliar perfeitamente minha vida pessoal com o trabalho. A flexibilidade é real.',
                        author: 'Roberto Lima',
                        role: 'DevOps Engineer'
                    }
                ]
            }
        };

        return aspectsData[aspect] || aspectsData.ambiente_trabalho;
    }

    // Inicia tour virtual
    startVirtualTour() {
        const modal = document.getElementById('virtual-tour-modal');
        modal.style.display = 'flex';
        this.visitSpot('reception');
    }

    // Visita local específico no tour
    visitSpot(spotId) {
        const spots = {
            reception: {
                name: 'Recepção',
                description: 'Nossa recepção acolhedora com design moderno',
                icon: '🏢'
            },
            workspace: {
                name: 'Área de Trabalho',
                description: 'Espaços colaborativos e individuais',
                icon: '💻'
            },
            recreation: {
                name: 'Área de Lazer',
                description: 'Espaço para relaxar e socializar',
                icon: '🎮'
            },
            meeting: {
                name: 'Salas de Reunião',
                description: 'Ambientes para colaboração criativa',
                icon: '🤝'
            }
        };

        const spot = spots[spotId];
        if (!spot) return;

        // Atualiza interface do tour
        document.getElementById('current-spot').textContent = spot.name;
        
        // Atualiza vista 360°
        const tourView = document.getElementById('tour-360-view');
        tourView.innerHTML = `
            <div class="tour-placeholder">
                <div class="tour-icon">${spot.icon}</div>
                <h4>${spot.name}</h4>
                <p>${spot.description}</p>
                <small>Vista 360° - Arraste para explorar</small>
            </div>
        `;

        // Atualiza navegação
        const navSpots = document.querySelectorAll('.nav-spot');
        navSpots.forEach(nav => {
            nav.classList.remove('active');
        });
        
        const activeNav = Array.from(navSpots).find(nav => 
            nav.textContent.toLowerCase().includes(spot.name.toLowerCase().split(' ')[0])
        );
        if (activeNav) {
            activeNav.classList.add('active');
        }
    }

    // Fecha tour virtual
    closeTour() {
        document.getElementById('virtual-tour-modal').style.display = 'none';
    }

    // Mostra vídeos do time
    showTeamVideos() {
        alert('🎥 Abrindo galeria de vídeos do time...\n\nAqui você encontraria vídeos de apresentação dos membros da equipe, depoimentos e momentos especiais da empresa.');
    }

    // Mostra "Um dia na empresa"
    showDayInLife() {
        const timeline = document.querySelector('.day-in-life');
        timeline.scrollIntoView({ behavior: 'smooth' });
        
        // Anima timeline
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            }, index * 200);
        });
    }

    // Reproduz vídeo da empresa
    playCompanyVideo() {
        alert('▶️ Reproduzindo vídeo institucional...\n\nAqui seria exibido um vídeo apresentando a empresa, seus valores, equipe e projetos.');
    }

    // Fecha modal
    closeModal() {
        document.getElementById('culture-detail-modal').style.display = 'none';
    }

    // Carrega dados da cultura
    loadCultureData() {
        // Carrega dados salvos ou usa dados padrão
        if (Object.keys(this.cultureData).length === 0) {
            this.cultureData = {
                lastUpdated: new Date().toISOString(),
                viewCount: Math.floor(Math.random() * 1000) + 500,
                engagementRate: 0.85
            };
            this.saveCultureData();
        }
    }

    // Salva dados da cultura
    saveCultureData() {
        localStorage.setItem('companyCulture', JSON.stringify(this.cultureData));
    }

    // Inicializa sistema
    init() {
        // Sistema será inicializado quando createCultureInterface for chamado
    }
}

// CSS para sistema de cultura empresarial
const companyCultureCSS = `
.company-culture-system {
    background: #f8fafc;
    border-radius: 16px;
    padding: 24px;
    margin: 20px 0;
}

.culture-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.culture-header h3 {
    margin: 0;
    color: #1f2937;
    font-size: 24px;
}

.culture-actions {
    display: flex;
    gap: 12px;
}

.culture-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: background-color 0.2s;
}

.culture-btn:hover {
    background: #7c3aed;
}

.culture-overview {
    margin-bottom: 40px;
}

.culture-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 32px;
    color: white;
}

.hero-content h4 {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
}

.hero-tagline {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 24px;
}

.culture-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.stat {
    text-align: center;
    background: rgba(255,255,255,0.1);
    padding: 16px;
    border-radius: 12px;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    opacity: 0.8;
}

.hero-media {
    display: flex;
    align-items: center;
    justify-content: center;
}

.company-video-placeholder {
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 2px dashed rgba(255,255,255,0.3);
}

.company-video-placeholder:hover {
    background: rgba(255,255,255,0.2);
}

.play-button {
    font-size: 48px;
    margin-bottom: 12px;
}

.culture-aspects {
    margin-bottom: 40px;
}

.culture-aspects h4 {
    margin: 0 0 24px 0;
    color: #1f2937;
    font-size: 20px;
}

.aspects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.aspect-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    cursor: pointer;
}

.aspect-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    border-color: #8b5cf6;
}

.aspect-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.aspect-card h5 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 18px;
}

.aspect-card p {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
}

.aspect-card button {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.aspect-card button:hover {
    background: #7c3aed;
}

.team-testimonials {
    margin-bottom: 40px;
}

.team-testimonials h4 {
    margin: 0 0 24px 0;
    color: #1f2937;
    font-size: 20px;
}

.testimonials-carousel {
    position: relative;
    background: white;
    border-radius: 12px;
    padding: 32px;
    border: 1px solid #e5e7eb;
    min-height: 200px;
}

.testimonial {
    display: none;
    animation: fadeIn 0.5s ease;
}

.testimonial.active {
    display: block;
}

.testimonial-content p {
    font-size: 18px;
    line-height: 1.6;
    color: #374151;
    margin-bottom: 24px;
    font-style: italic;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 16px;
}

.author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #8b5cf6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.author-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.author-name {
    font-weight: 600;
    color: #1f2937;
}

.author-role {
    color: #6b7280;
    font-size: 14px;
}

.author-time {
    color: #9ca3af;
    font-size: 12px;
}

.testimonials-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
}

.testimonials-controls button {
    background: #f3f4f6;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    color: #6b7280;
    transition: all 0.2s;
}

.testimonials-controls button:hover {
    background: #8b5cf6;
    color: white;
}

.testimonials-dots {
    display: flex;
    gap: 8px;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #d1d5db;
    cursor: pointer;
    transition: background-color 0.2s;
}

.dot.active {
    background: #8b5cf6;
}

.virtual-tour-preview {
    margin-bottom: 40px;
}

.virtual-tour-preview h4 {
    margin: 0 0 24px 0;
    color: #1f2937;
    font-size: 20px;
}

.tour-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.tour-spot {
    background: white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tour-spot:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border-color: #8b5cf6;
}

.spot-image {
    font-size: 32px;
    margin-bottom: 12px;
}

.tour-spot h5 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 16px;
}

.tour-spot p {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
}

.day-in-life h4 {
    margin: 0 0 24px 0;
    color: #1f2937;
    font-size: 20px;
}

.timeline {
    position: relative;
    padding-left: 40px;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #8b5cf6;
}

.timeline-item {
    position: relative;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: -28px;
    top: 8px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #8b5cf6;
    border: 3px solid white;
    box-shadow: 0 0 0 3px #8b5cf6;
}

.timeline-time {
    font-weight: 600;
    color: #8b5cf6;
    font-size: 14px;
    margin-bottom: 8px;
}

.timeline-content {
    background: white;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #e5e7eb;
}

.timeline-content h5 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 16px;
}

.timeline-content p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;
}

.culture-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.culture-modal.fullscreen {
    background: #1f2937;
}

.modal-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: #1f2937;
}

.modal-header button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
}

.modal-body {
    padding: 24px;
}

.aspect-detail {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.aspect-hero {
    text-align: center;
    padding: 32px;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border-radius: 12px;
}

.aspect-icon-large {
    font-size: 64px;
    margin-bottom: 16px;
}

.aspect-description {
    font-size: 16px;
    color: #374151;
    line-height: 1.6;
    margin: 0;
}

.highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.highlight-item {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
}

.highlight-icon {
    font-size: 24px;
    width: 40px;
    text-align: center;
}

.highlight-content h5 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 16px;
}

.highlight-content p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
}

.metric-card {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border: 1px solid #e5e7eb;
}

.metric-value {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #8b5cf6;
    margin-bottom: 4px;
}

.metric-label {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
}

.mini-testimonial {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    border-left: 4px solid #8b5cf6;
}

.mini-testimonial p {
    margin: 0 0 12px 0;
    color: #374151;
    font-style: italic;
    line-height: 1.5;
}

.mini-testimonial .testimonial-author {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.mini-testimonial .author-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
}

.mini-testimonial .author-role {
    color: #6b7280;
    font-size: 12px;
}

.tour-interface {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.tour-header {
    background: #374151;
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tour-header h3 {
    margin: 0;
    font-size: 20px;
}

.tour-header button {
    background: #ef4444;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.tour-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.tour-360-view {
    flex: 1;
    background: #1f2937;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.tour-placeholder {
    text-align: center;
    padding: 40px;
}

.tour-icon {
    font-size: 64px;
    margin-bottom: 16px;
}

.tour-placeholder h4 {
    margin: 0 0 8px 0;
    font-size: 24px;
}

.tour-placeholder p {
    margin: 0 0 8px 0;
    opacity: 0.8;
}

.tour-placeholder small {
    opacity: 0.6;
    font-size: 12px;
}

.tour-navigation {
    background: #374151;
    padding: 20px;
    display: flex;
    justify-content: center;
    gap: 16px;
}

.nav-spot {
    background: #4b5563;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.nav-spot:hover,
.nav-spot.active {
    background: #8b5cf6;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .culture-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
    
    .culture-actions {
        justify-content: center;
    }
    
    .culture-hero {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .culture-stats {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .aspects-grid {
        grid-template-columns: 1fr;
    }
    
    .tour-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .highlights-grid {
        grid-template-columns: 1fr;
    }
    
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .tour-navigation {
        flex-wrap: wrap;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('company-culture-styles')) {
    const style = document.createElement('style');
    style.id = 'company-culture-styles';
    style.textContent = companyCultureCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.cultureSystem = new CompanyCultureSystem();
