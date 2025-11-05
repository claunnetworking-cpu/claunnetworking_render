// Sistema de Portfólio Visual Interativo - ClaunNetworking
class PortfolioSystem {
    constructor() {
        this.portfolioData = JSON.parse(localStorage.getItem('userPortfolio') || '{}');
        this.supportedTypes = ['image', 'video', 'document', 'link', 'code'];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.githubIntegration = false;
        this.behanceIntegration = false;
    }

    // Cria interface do portfólio
    createPortfolioInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const portfolioHTML = `
            <div class="portfolio-system">
                <div class="portfolio-header">
                    <h3>🎨 Portfólio Interativo</h3>
                    <div class="portfolio-actions">
                        <button class="portfolio-btn primary" onclick="portfolioSystem.showAddProjectModal()">
                            + Adicionar Projeto
                        </button>
                        <button class="portfolio-btn secondary" onclick="portfolioSystem.showIntegrationsModal()">
                            🔗 Integrações
                        </button>
                        <button class="portfolio-btn secondary" onclick="portfolioSystem.toggleViewMode()">
                            📱 Modo Visualização
                        </button>
                    </div>
                </div>

                <div class="portfolio-stats">
                    <div class="stat-item">
                        <span class="stat-number" id="projects-count">0</span>
                        <span class="stat-label">Projetos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="views-count">0</span>
                        <span class="stat-label">Visualizações</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="likes-count">0</span>
                        <span class="stat-label">Curtidas</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="portfolio-score">0</span>
                        <span class="stat-label">Score</span>
                    </div>
                </div>

                <div class="portfolio-filters">
                    <button class="filter-btn active" data-filter="all">Todos</button>
                    <button class="filter-btn" data-filter="web">Web</button>
                    <button class="filter-btn" data-filter="mobile">Mobile</button>
                    <button class="filter-btn" data-filter="design">Design</button>
                    <button class="filter-btn" data-filter="data">Data Science</button>
                    <button class="filter-btn" data-filter="other">Outros</button>
                </div>

                <div id="portfolio-grid" class="portfolio-grid">
                    <!-- Projects will be loaded here -->
                </div>

                <div class="portfolio-integrations">
                    <h4>🔗 Integrações Externas</h4>
                    <div class="integrations-grid">
                        <div class="integration-item" id="github-integration">
                            <div class="integration-icon">🐙</div>
                            <div class="integration-info">
                                <h5>GitHub</h5>
                                <p>Sincronize seus repositórios automaticamente</p>
                            </div>
                            <button class="integration-btn" onclick="portfolioSystem.connectGitHub()">
                                Conectar
                            </button>
                        </div>
                        <div class="integration-item" id="behance-integration">
                            <div class="integration-icon">🎨</div>
                            <div class="integration-info">
                                <h5>Behance</h5>
                                <p>Importe seus projetos de design</p>
                            </div>
                            <button class="integration-btn" onclick="portfolioSystem.connectBehance()">
                                Conectar
                            </button>
                        </div>
                        <div class="integration-item" id="linkedin-integration">
                            <div class="integration-icon">💼</div>
                            <div class="integration-info">
                                <h5>LinkedIn</h5>
                                <p>Compartilhe projetos no seu perfil</p>
                            </div>
                            <button class="integration-btn" onclick="portfolioSystem.connectLinkedIn()">
                                Conectar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Project Modal -->
            <div id="add-project-modal" class="portfolio-modal" style="display: none;">
                <div class="modal-overlay" onclick="portfolioSystem.closeModal('add-project-modal')"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>📁 Adicionar Projeto</h3>
                        <button onclick="portfolioSystem.closeModal('add-project-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="project-form" class="project-form">
                            <div class="form-group">
                                <label>Título do Projeto *</label>
                                <input type="text" id="project-title" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Categoria *</label>
                                <select id="project-category" required>
                                    <option value="">Selecione uma categoria</option>
                                    <option value="web">Desenvolvimento Web</option>
                                    <option value="mobile">Desenvolvimento Mobile</option>
                                    <option value="design">Design/UI/UX</option>
                                    <option value="data">Data Science/Analytics</option>
                                    <option value="other">Outros</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Descrição *</label>
                                <textarea id="project-description" rows="4" required></textarea>
                            </div>

                            <div class="form-group">
                                <label>Tecnologias Utilizadas</label>
                                <input type="text" id="project-technologies" placeholder="Ex: React, Node.js, MongoDB">
                            </div>

                            <div class="form-group">
                                <label>Link do Projeto</label>
                                <input type="url" id="project-link" placeholder="https://...">
                            </div>

                            <div class="form-group">
                                <label>Repositório GitHub</label>
                                <input type="url" id="project-github" placeholder="https://github.com/...">
                            </div>

                            <div class="form-group">
                                <label>Imagens/Arquivos</label>
                                <div class="file-upload-area" onclick="document.getElementById('project-files').click()">
                                    <div class="upload-icon">📁</div>
                                    <p>Clique para selecionar arquivos</p>
                                    <small>Máximo 10MB por arquivo</small>
                                </div>
                                <input type="file" id="project-files" multiple accept="image/*,video/*,.pdf,.doc,.docx" style="display: none;">
                                <div id="selected-files" class="selected-files"></div>
                            </div>

                            <div class="form-actions">
                                <button type="button" onclick="portfolioSystem.closeModal('add-project-modal')">
                                    Cancelar
                                </button>
                                <button type="submit">Adicionar Projeto</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Project Detail Modal -->
            <div id="project-detail-modal" class="portfolio-modal" style="display: none;">
                <div class="modal-overlay" onclick="portfolioSystem.closeModal('project-detail-modal')"></div>
                <div class="modal-content large">
                    <div class="modal-header">
                        <h3 id="detail-project-title">Título do Projeto</h3>
                        <div class="project-actions">
                            <button onclick="portfolioSystem.likeProject()" id="like-btn">❤️ Curtir</button>
                            <button onclick="portfolioSystem.shareProject()" id="share-btn">📤 Compartilhar</button>
                            <button onclick="portfolioSystem.closeModal('project-detail-modal')">×</button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div id="project-detail-content">
                            <!-- Project details will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Integrations Modal -->
            <div id="integrations-modal" class="portfolio-modal" style="display: none;">
                <div class="modal-overlay" onclick="portfolioSystem.closeModal('integrations-modal')"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🔗 Configurar Integrações</h3>
                        <button onclick="portfolioSystem.closeModal('integrations-modal')">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="integration-setup">
                            <div class="setup-item">
                                <h4>🐙 GitHub</h4>
                                <p>Conecte sua conta do GitHub para importar repositórios automaticamente.</p>
                                <input type="text" id="github-username" placeholder="Seu username do GitHub">
                                <button onclick="portfolioSystem.syncGitHub()">Sincronizar Repositórios</button>
                            </div>
                            
                            <div class="setup-item">
                                <h4>🎨 Behance</h4>
                                <p>Importe seus projetos de design do Behance.</p>
                                <input type="text" id="behance-username" placeholder="Seu username do Behance">
                                <button onclick="portfolioSystem.syncBehance()">Importar Projetos</button>
                            </div>
                            
                            <div class="setup-item">
                                <h4>📊 Analytics</h4>
                                <p>Configure o rastreamento de visualizações e engajamento.</p>
                                <label>
                                    <input type="checkbox" id="enable-analytics" checked>
                                    Habilitar analytics detalhado
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = portfolioHTML;
        this.attachEventListeners();
        this.loadPortfolio();
        this.updateStats();
    }

    // Anexa event listeners
    attachEventListeners() {
        // Form submission
        const form = document.getElementById('project-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProject();
            });
        }

        // File selection
        const fileInput = document.getElementById('project-files');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files);
            });
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterProjects(e.target.dataset.filter);
                
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    // Manipula seleção de arquivos
    handleFileSelection(files) {
        const container = document.getElementById('selected-files');
        if (!container) return;

        container.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            if (file.size > this.maxFileSize) {
                alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
                return;
            }

            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                </div>
                <button type="button" onclick="this.parentElement.remove()">×</button>
            `;
            
            container.appendChild(fileItem);
        });
    }

    // Adiciona projeto
    addProject() {
        const title = document.getElementById('project-title').value;
        const category = document.getElementById('project-category').value;
        const description = document.getElementById('project-description').value;
        const technologies = document.getElementById('project-technologies').value;
        const link = document.getElementById('project-link').value;
        const github = document.getElementById('project-github').value;
        const files = document.getElementById('project-files').files;

        if (!title || !category || !description) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        const project = {
            id: Date.now().toString(),
            title,
            category,
            description,
            technologies: technologies.split(',').map(t => t.trim()).filter(t => t),
            link,
            github,
            files: Array.from(files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file) // Em produção, seria upload para servidor
            })),
            createdAt: new Date().toISOString(),
            views: 0,
            likes: 0,
            featured: false
        };

        // Salva projeto
        if (!this.portfolioData.projects) {
            this.portfolioData.projects = [];
        }
        
        this.portfolioData.projects.push(project);
        this.savePortfolio();
        
        // Atualiza interface
        this.loadPortfolio();
        this.updateStats();
        this.closeModal('add-project-modal');
        
        // Limpa formulário
        document.getElementById('project-form').reset();
        document.getElementById('selected-files').innerHTML = '';
        
        alert('Projeto adicionado com sucesso!');
    }

    // Carrega portfólio
    loadPortfolio() {
        const grid = document.getElementById('portfolio-grid');
        if (!grid) return;

        const projects = this.portfolioData.projects || [];
        
        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="empty-portfolio">
                    <div class="empty-icon">📁</div>
                    <h4>Seu portfólio está vazio</h4>
                    <p>Adicione seus primeiros projetos para mostrar suas habilidades</p>
                    <button onclick="portfolioSystem.showAddProjectModal()">
                        Adicionar Primeiro Projeto
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = projects.map(project => `
            <div class="project-card" data-category="${project.category}" onclick="portfolioSystem.showProjectDetail('${project.id}')">
                <div class="project-image">
                    ${project.files && project.files.length > 0 
                        ? `<img src="${project.files[0].url}" alt="${project.title}" loading="lazy">`
                        : `<div class="project-placeholder">${this.getCategoryIcon(project.category)}</div>`
                    }
                    ${project.featured ? '<div class="featured-badge">⭐ Destaque</div>' : ''}
                </div>
                <div class="project-content">
                    <h4 class="project-title">${project.title}</h4>
                    <p class="project-description">${project.description.substring(0, 100)}...</p>
                    <div class="project-technologies">
                        ${project.technologies.slice(0, 3).map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                        ${project.technologies.length > 3 ? `<span class="tech-more">+${project.technologies.length - 3}</span>` : ''}
                    </div>
                    <div class="project-stats">
                        <span class="stat">👁️ ${project.views}</span>
                        <span class="stat">❤️ ${project.likes}</span>
                        ${project.link ? '<span class="stat">🔗 Link</span>' : ''}
                        ${project.github ? '<span class="stat">🐙 GitHub</span>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Mostra detalhes do projeto
    showProjectDetail(projectId) {
        const project = this.portfolioData.projects?.find(p => p.id === projectId);
        if (!project) return;

        // Incrementa visualizações
        project.views++;
        this.savePortfolio();
        this.updateStats();

        const modal = document.getElementById('project-detail-modal');
        const titleElement = document.getElementById('detail-project-title');
        const contentElement = document.getElementById('project-detail-content');

        titleElement.textContent = project.title;
        
        contentElement.innerHTML = `
            <div class="project-detail-grid">
                <div class="project-media">
                    ${project.files && project.files.length > 0 
                        ? `
                            <div class="media-gallery">
                                ${project.files.map((file, index) => `
                                    <div class="media-item ${index === 0 ? 'active' : ''}" onclick="portfolioSystem.showMedia(${index})">
                                        ${file.type.startsWith('image/') 
                                            ? `<img src="${file.url}" alt="${file.name}">`
                                            : `<div class="file-preview">${this.getFileIcon(file.type)}<span>${file.name}</span></div>`
                                        }
                                    </div>
                                `).join('')}
                            </div>
                        `
                        : `<div class="no-media">Nenhuma mídia disponível</div>`
                    }
                </div>
                <div class="project-info">
                    <div class="info-section">
                        <h5>📝 Descrição</h5>
                        <p>${project.description}</p>
                    </div>
                    
                    ${project.technologies.length > 0 ? `
                        <div class="info-section">
                            <h5>🛠️ Tecnologias</h5>
                            <div class="tech-list">
                                ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="info-section">
                        <h5>🔗 Links</h5>
                        <div class="project-links">
                            ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">🌐 Ver Projeto</a>` : ''}
                            ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">🐙 GitHub</a>` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h5>📊 Estatísticas</h5>
                        <div class="project-metrics">
                            <div class="metric">
                                <span class="metric-value">${project.views}</span>
                                <span class="metric-label">Visualizações</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${project.likes}</span>
                                <span class="metric-label">Curtidas</span>
                            </div>
                            <div class="metric">
                                <span class="metric-value">${this.formatDate(project.createdAt)}</span>
                                <span class="metric-label">Criado em</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    // Filtra projetos
    filterProjects(category) {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Conecta GitHub
    connectGitHub() {
        const username = prompt('Digite seu username do GitHub:');
        if (username) {
            this.githubIntegration = true;
            alert(`GitHub conectado! Username: ${username}`);
            this.updateIntegrationStatus('github', true);
        }
    }

    // Conecta Behance
    connectBehance() {
        const username = prompt('Digite seu username do Behance:');
        if (username) {
            this.behanceIntegration = true;
            alert(`Behance conectado! Username: ${username}`);
            this.updateIntegrationStatus('behance', true);
        }
    }

    // Conecta LinkedIn
    connectLinkedIn() {
        alert('Redirecionando para autenticação do LinkedIn...');
        // Em produção, seria redirecionamento OAuth
        setTimeout(() => {
            alert('LinkedIn conectado com sucesso!');
            this.updateIntegrationStatus('linkedin', true);
        }, 2000);
    }

    // Atualiza status de integração
    updateIntegrationStatus(platform, connected) {
        const element = document.getElementById(`${platform}-integration`);
        if (element) {
            const button = element.querySelector('.integration-btn');
            if (connected) {
                button.textContent = 'Conectado ✓';
                button.style.background = '#10b981';
                button.disabled = true;
            }
        }
    }

    // Sincroniza GitHub
    syncGitHub() {
        const username = document.getElementById('github-username').value;
        if (!username) {
            alert('Digite seu username do GitHub!');
            return;
        }

        alert('Sincronizando repositórios...');
        
        // Simula sincronização
        setTimeout(() => {
            const mockRepos = [
                {
                    title: 'E-commerce React App',
                    category: 'web',
                    description: 'Aplicação de e-commerce completa com React e Node.js',
                    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                    github: `https://github.com/${username}/ecommerce-app`
                },
                {
                    title: 'Task Manager API',
                    category: 'web',
                    description: 'API RESTful para gerenciamento de tarefas',
                    technologies: ['Node.js', 'Express', 'PostgreSQL'],
                    github: `https://github.com/${username}/task-manager-api`
                }
            ];

            mockRepos.forEach(repo => {
                const project = {
                    id: Date.now().toString() + Math.random(),
                    ...repo,
                    files: [],
                    createdAt: new Date().toISOString(),
                    views: Math.floor(Math.random() * 100),
                    likes: Math.floor(Math.random() * 20),
                    featured: false
                };

                if (!this.portfolioData.projects) {
                    this.portfolioData.projects = [];
                }
                this.portfolioData.projects.push(project);
            });

            this.savePortfolio();
            this.loadPortfolio();
            this.updateStats();
            this.closeModal('integrations-modal');
            
            alert(`${mockRepos.length} repositórios importados com sucesso!`);
        }, 2000);
    }

    // Sincroniza Behance
    syncBehance() {
        const username = document.getElementById('behance-username').value;
        if (!username) {
            alert('Digite seu username do Behance!');
            return;
        }

        alert('Importando projetos do Behance...');
        
        // Simula importação
        setTimeout(() => {
            const mockProjects = [
                {
                    title: 'Brand Identity Design',
                    category: 'design',
                    description: 'Identidade visual completa para startup de tecnologia',
                    technologies: ['Photoshop', 'Illustrator', 'Figma'],
                    link: `https://behance.net/${username}/brand-identity`
                }
            ];

            mockProjects.forEach(proj => {
                const project = {
                    id: Date.now().toString() + Math.random(),
                    ...proj,
                    files: [],
                    createdAt: new Date().toISOString(),
                    views: Math.floor(Math.random() * 200),
                    likes: Math.floor(Math.random() * 50),
                    featured: true
                };

                if (!this.portfolioData.projects) {
                    this.portfolioData.projects = [];
                }
                this.portfolioData.projects.push(project);
            });

            this.savePortfolio();
            this.loadPortfolio();
            this.updateStats();
            this.closeModal('integrations-modal');
            
            alert(`${mockProjects.length} projetos importados do Behance!`);
        }, 2000);
    }

    // Atualiza estatísticas
    updateStats() {
        const projects = this.portfolioData.projects || [];
        const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
        const totalLikes = projects.reduce((sum, p) => sum + (p.likes || 0), 0);
        const score = this.calculatePortfolioScore(projects);

        document.getElementById('projects-count').textContent = projects.length;
        document.getElementById('views-count').textContent = totalViews;
        document.getElementById('likes-count').textContent = totalLikes;
        document.getElementById('portfolio-score').textContent = score;
    }

    // Calcula score do portfólio
    calculatePortfolioScore(projects) {
        if (projects.length === 0) return 0;
        
        let score = 0;
        score += projects.length * 10; // 10 pontos por projeto
        score += projects.reduce((sum, p) => sum + (p.views || 0), 0) * 0.1; // 0.1 ponto por visualização
        score += projects.reduce((sum, p) => sum + (p.likes || 0), 0) * 2; // 2 pontos por curtida
        score += projects.filter(p => p.github).length * 5; // 5 pontos por projeto com GitHub
        score += projects.filter(p => p.link).length * 5; // 5 pontos por projeto com link
        
        return Math.round(score);
    }

    // Utilitários
    getCategoryIcon(category) {
        const icons = {
            'web': '🌐',
            'mobile': '📱',
            'design': '🎨',
            'data': '📊',
            'other': '💼'
        };
        return icons[category] || '📁';
    }

    getFileIcon(type) {
        if (type.startsWith('image/')) return '🖼️';
        if (type.startsWith('video/')) return '🎥';
        if (type.includes('pdf')) return '📄';
        return '📁';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    // Modals
    showAddProjectModal() {
        document.getElementById('add-project-modal').style.display = 'flex';
    }

    showIntegrationsModal() {
        document.getElementById('integrations-modal').style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Curtir projeto
    likeProject() {
        // Implementar lógica de curtida
        alert('Projeto curtido!');
    }

    // Compartilhar projeto
    shareProject() {
        if (navigator.share) {
            navigator.share({
                title: 'Confira este projeto',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
    }

    // Toggle modo visualização
    toggleViewMode() {
        const grid = document.getElementById('portfolio-grid');
        grid.classList.toggle('grid-view');
        grid.classList.toggle('list-view');
    }

    // Salva portfólio
    savePortfolio() {
        localStorage.setItem('userPortfolio', JSON.stringify(this.portfolioData));
    }

    // Inicializa sistema
    init() {
        // Sistema será inicializado quando createPortfolioInterface for chamado
    }
}

// CSS para sistema de portfólio
const portfolioCSS = `
.portfolio-system {
    background: #f8fafc;
    border-radius: 16px;
    padding: 24px;
    margin: 20px 0;
}

.portfolio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.portfolio-header h3 {
    margin: 0;
    color: #1f2937;
    font-size: 24px;
}

.portfolio-actions {
    display: flex;
    gap: 12px;
}

.portfolio-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
}

.portfolio-btn.primary {
    background: #8b5cf6;
    color: white;
}

.portfolio-btn.primary:hover {
    background: #7c3aed;
}

.portfolio-btn.secondary {
    background: white;
    color: #6b7280;
    border: 1px solid #d1d5db;
}

.portfolio-btn.secondary:hover {
    background: #f9fafb;
}

.portfolio-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.stat-item {
    background: white;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
    border: 1px solid #e5e7eb;
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #8b5cf6;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
}

.portfolio-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.filter-btn:hover,
.filter-btn.active {
    background: #8b5cf6;
    color: white;
    border-color: #8b5cf6;
}

.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
}

.project-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.project-image {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.project-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: white;
}

.featured-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #f59e0b;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.project-content {
    padding: 20px;
}

.project-title {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 18px;
    font-weight: 600;
}

.project-description {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
}

.project-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
}

.tech-tag {
    background: #f3f4f6;
    color: #374151;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.tech-more {
    background: #8b5cf6;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.project-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #6b7280;
}

.empty-portfolio {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
}

.empty-portfolio h4 {
    margin: 0 0 8px 0;
    color: #374151;
    font-size: 20px;
}

.empty-portfolio button {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 16px;
}

.portfolio-integrations {
    background: white;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #e5e7eb;
}

.portfolio-integrations h4 {
    margin: 0 0 20px 0;
    color: #1f2937;
}

.integrations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
}

.integration-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: border-color 0.2s;
}

.integration-item:hover {
    border-color: #8b5cf6;
}

.integration-icon {
    font-size: 24px;
    width: 40px;
    text-align: center;
}

.integration-info {
    flex: 1;
}

.integration-info h5 {
    margin: 0 0 4px 0;
    color: #1f2937;
    font-size: 14px;
}

.integration-info p {
    margin: 0;
    color: #6b7280;
    font-size: 12px;
}

.integration-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
}

.portfolio-modal {
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

.modal-content {
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content.large {
    max-width: 900px;
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

.project-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #8b5cf6;
}

.file-upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
}

.file-upload-area:hover {
    border-color: #8b5cf6;
    background: #f9fafb;
}

.upload-icon {
    font-size: 32px;
    margin-bottom: 12px;
}

.selected-files {
    margin-top: 12px;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 6px;
    margin-bottom: 8px;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.file-name {
    font-size: 14px;
    color: #374151;
}

.file-size {
    font-size: 12px;
    color: #6b7280;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

.form-actions button {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.form-actions button[type="submit"] {
    background: #8b5cf6;
    color: white;
}

.form-actions button[type="button"] {
    background: #f3f4f6;
    color: #374151;
}

.project-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
}

.media-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
}

.media-item {
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
}

.media-item.active {
    border-color: #8b5cf6;
}

.media-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.file-preview {
    width: 100%;
    height: 100%;
    background: #f3f4f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    text-align: center;
    padding: 8px;
}

.info-section {
    margin-bottom: 24px;
}

.info-section h5 {
    margin: 0 0 12px 0;
    color: #1f2937;
    font-size: 16px;
}

.tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tech-badge {
    background: #8b5cf6;
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
}

.project-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.project-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #8b5cf6;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
}

.project-link:hover {
    text-decoration: underline;
}

.project-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.metric {
    text-align: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
}

.metric-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #8b5cf6;
    margin-bottom: 4px;
}

.metric-label {
    font-size: 12px;
    color: #6b7280;
}

@media (max-width: 768px) {
    .portfolio-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
    
    .portfolio-actions {
        justify-content: center;
    }
    
    .portfolio-grid {
        grid-template-columns: 1fr;
    }
    
    .project-detail-grid {
        grid-template-columns: 1fr;
    }
    
    .integrations-grid {
        grid-template-columns: 1fr;
    }
    
    .project-metrics {
        grid-template-columns: 1fr;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('portfolio-styles')) {
    const style = document.createElement('style');
    style.id = 'portfolio-styles';
    style.textContent = portfolioCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.portfolioSystem = new PortfolioSystem();
