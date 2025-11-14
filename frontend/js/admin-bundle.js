// Funcionalidades Avançadas do Painel Administrativo
// ClaunNetworking - Sistema de Gestão Completo

class AdminFunctions {
    constructor() {
        this.apiBaseUrl = '/api'; // URL base da API (simulada)
        this.currentFilters = {};
        this.selectedItems = new Set();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Checkbox "Selecionar Todos"
        const selectAllCheckbox = document.getElementById('select-all');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Checkboxes individuais
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('row-checkbox')) {
                this.handleRowSelection(e.target);
            }
        });

        // Filtros
        document.addEventListener('change', (e) => {
            if (e.target.id.includes('-filter')) {
                this.applyFilters();
            }
        });
    }

    loadInitialData() {
        // Carregar dados iniciais das tabelas
        this.loadPendingData();
        this.loadOpportunitiesData();
        this.loadCoursesData();
        this.loadCompaniesData();
        this.loadUsersData();
        this.loadAuditData();
        this.loadNotificationsData();
    }

    // Gestão de Cadastros Pendentes
    loadPendingData() {
        const pendingData = [
            {
                id: 'pend_001',
                type: 'Vaga',
                title: 'Desenvolvedor Frontend React',
                company: 'TechCorp Brasil',
                area: 'Tecnologia',
                date: '2025-10-03',
                status: 'Pendente',
                details: {
                    description: 'Vaga para desenvolvedor React com experiência em TypeScript',
                    salary: 'R$ 8.000 - R$ 12.000',
                    location: 'São Paulo, SP',
                    requirements: ['React', 'TypeScript', 'Node.js']
                }
            },
            {
                id: 'pend_002',
                type: 'Curso',
                title: 'Marketing Digital Avançado',
                company: 'InnovateEdu',
                area: 'Marketing',
                date: '2025-10-02',
                status: 'Pendente',
                details: {
                    description: 'Curso completo de marketing digital com certificação',
                    duration: '40 horas',
                    price: 'R$ 499,00',
                    modules: ['SEO', 'Google Ads', 'Social Media', 'Analytics']
                }
            },
            {
                id: 'pend_003',
                type: 'Premium',
                title: 'Plano Empresarial - StartupXYZ',
                company: 'StartupXYZ',
                area: 'Tecnologia',
                date: '2025-10-01',
                status: 'Pendente',
                details: {
                    plan: 'Empresarial',
                    value: 'R$ 999,00/mês',
                    features: ['Vagas ilimitadas', 'Destaque premium', 'Analytics avançado']
                }
            }
        ];

        this.populateTable('pending-table-body', pendingData, this.renderPendingRow.bind(this));
    }

    renderPendingRow(item) {
        return `
            <tr data-id="${item.id}">
                <td><input type="checkbox" class="row-checkbox" data-id="${item.id}"></td>
                <td><span class="type-badge type-${item.type.toLowerCase()}">${item.type}</span></td>
                <td><strong>${item.title}</strong></td>
                <td>${item.company}</td>
                <td><span class="area-tag area-${item.area.toLowerCase()}">${item.area}</span></td>
                <td>${this.formatDate(item.date)}</td>
                <td><span class="status-badge status-pending">${item.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminFunctions.viewDetails('${item.id}', 'pending')">👁️ Ver</button>
                    <button class="btn btn-sm btn-success" onclick="adminFunctions.approveItem('${item.id}')">✅ Aprovar</button>
                    <button class="btn btn-sm btn-danger" onclick="adminFunctions.rejectItem('${item.id}')">❌ Reprovar</button>
                </td>
            </tr>
        `;
    }

    // Gestão de Oportunidades
    loadOpportunitiesData() {
        const opportunitiesData = [
            {
                id: 'opp_001',
                type: 'Vaga',
                title: 'Engenheiro de Software Senior',
                company: 'DevSolutions',
                status: 'Ativa',
                likes: 120,
                views: 1500,
                date: '2025-09-28',
                applications: 45
            },
            {
                id: 'opp_002',
                type: 'Vaga',
                title: 'Analista de Marketing Digital',
                company: 'MarketMinds',
                status: 'Fechada',
                likes: 80,
                views: 950,
                date: '2025-09-15',
                applications: 32
            },
            {
                id: 'opp_003',
                type: 'Curso',
                title: 'Bootcamp Full Stack',
                company: 'CodeAcademy',
                status: 'Ativa',
                likes: 200,
                views: 2800,
                date: '2025-09-20',
                enrollments: 150
            }
        ];

        this.populateTable('opportunities-table-body', opportunitiesData, this.renderOpportunityRow.bind(this));
    }

    renderOpportunityRow(item) {
        const statusClass = item.status === 'Ativa' ? 'status-approved' : 'status-rejected';
        const metric = item.type === 'Vaga' ? item.applications : item.enrollments;
        const metricLabel = item.type === 'Vaga' ? 'candidaturas' : 'inscrições';

        return `
            <tr data-id="${item.id}">
                <td><span class="type-badge type-${item.type.toLowerCase()}">${item.type}</span></td>
                <td><strong>${item.title}</strong></td>
                <td>${item.company}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>❤️ ${item.likes}</td>
                <td>👁️ ${item.views}</td>
                <td>${this.formatDate(item.date)}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminFunctions.viewDetails('${item.id}', 'opportunity')">👁️ Ver</button>
                    <button class="btn btn-sm btn-primary" onclick="adminFunctions.editItem('${item.id}', 'opportunity')">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="adminFunctions.deleteItem('${item.id}', 'opportunity')">🗑️ Excluir</button>
                </td>
            </tr>
        `;
    }

    // Gestão de Cursos
    loadCoursesData() {
        const coursesData = [
            {
                id: 'course_001',
                title: 'Introdução ao React',
                institution: 'CodeAcademy',
                students: 1500,
                status: 'Ativo',
                price: 'Grátis',
                rating: 4.8,
                duration: '20 horas'
            },
            {
                id: 'course_002',
                title: 'Especialização em UX/UI',
                institution: 'DesignSchool',
                students: 800,
                status: 'Ativo',
                price: 'R$ 499',
                rating: 4.9,
                duration: '60 horas'
            },
            {
                id: 'course_003',
                title: 'Python para Data Science',
                institution: 'DataInstitute',
                students: 1200,
                status: 'Pausado',
                price: 'R$ 299',
                rating: 4.7,
                duration: '40 horas'
            }
        ];

        this.populateTable('courses-table-body', coursesData, this.renderCourseRow.bind(this));
    }

    renderCourseRow(item) {
        const statusClass = item.status === 'Ativo' ? 'status-approved' : 'status-warning';
        const priceDisplay = item.price === 'Grátis' ? '<span class="price-free">Grátis</span>' : `<span class="price-paid">${item.price}</span>`;

        return `
            <tr data-id="${item.id}">
                <td><strong>${item.title}</strong><br><small>⭐ ${item.rating} • ${item.duration}</small></td>
                <td>${item.institution}</td>
                <td>👥 ${item.students.toLocaleString()}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>${priceDisplay}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminFunctions.viewDetails('${item.id}', 'course')">👁️ Ver</button>
                    <button class="btn btn-sm btn-primary" onclick="adminFunctions.editItem('${item.id}', 'course')">✏️ Editar</button>
                    <button class="btn btn-sm btn-warning" onclick="adminFunctions.toggleCourseStatus('${item.id}')">⏸️ Pausar</button>
                    <button class="btn btn-sm btn-danger" onclick="adminFunctions.deleteItem('${item.id}', 'course')">🗑️ Excluir</button>
                </td>
            </tr>
        `;
    }

    // Gestão de Empresas
    loadCompaniesData() {
        const companiesData = [
            {
                id: 'comp_001',
                name: 'TechCorp Brasil',
                cnpj: '12.345.678/0001-99',
                plan: 'Profissional',
                balance: 'R$ 599,00',
                jobs: 5,
                likes: 1200,
                views: 15000,
                status: 'Ativo'
            },
            {
                id: 'comp_002',
                name: 'Innovate Solutions',
                cnpj: '98.765.432/0001-11',
                plan: 'Básico',
                balance: 'R$ 299,00',
                jobs: 2,
                likes: 500,
                views: 7000,
                status: 'Ativo'
            },
            {
                id: 'comp_003',
                name: 'StartupXYZ',
                cnpj: '11.222.333/0001-44',
                plan: 'Empresarial',
                balance: 'R$ 0,00',
                jobs: 0,
                likes: 50,
                views: 800,
                status: 'Suspenso'
            }
        ];

        this.populateTable('companies-table-body', companiesData, this.renderCompanyRow.bind(this));
    }

    renderCompanyRow(item) {
        const statusClass = item.status === 'Ativo' ? 'status-approved' : 'status-rejected';
        const planClass = `plan-${item.plan.toLowerCase()}`;

        return `
            <tr data-id="${item.id}">
                <td><strong>${item.name}</strong></td>
                <td>${item.cnpj}</td>
                <td><span class="plan-badge ${planClass}">${item.plan}</span></td>
                <td>${item.balance}</td>
                <td>💼 ${item.jobs}</td>
                <td>❤️ ${item.likes}</td>
                <td>👁️ ${item.views.toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminFunctions.viewDetails('${item.id}', 'company')">👁️ Ver</button>
                    <button class="btn btn-sm btn-warning" onclick="adminFunctions.suspendCompany('${item.id}')">⏸️ Suspender</button>
                    <button class="btn btn-sm btn-primary" onclick="adminFunctions.editCompanyPlan('${item.id}')">💰 Plano</button>
                </td>
            </tr>
        `;
    }

    // Gestão de Usuários
    loadUsersData() {
        const usersData = [
            {
                id: 'user_001',
                name: 'João da Silva',
                email: 'joao.silva@example.com',
                type: 'Candidato',
                registered: '2025-09-01',
                lastAccess: '2025-10-03',
                status: 'Ativo'
            },
            {
                id: 'user_002',
                name: 'Maria Oliveira',
                email: 'maria.oliveira@example.com',
                type: 'Recrutador',
                registered: '2025-08-15',
                lastAccess: '2025-10-02',
                status: 'Ativo'
            },
            {
                id: 'user_003',
                name: 'Carlos Santos',
                email: 'carlos.santos@example.com',
                type: 'Candidato',
                registered: '2025-07-20',
                lastAccess: '2025-09-15',
                status: 'Inativo'
            }
        ];

        this.populateTable('users-table-body', usersData, this.renderUserRow.bind(this));
    }

    renderUserRow(item) {
        const statusClass = item.status === 'Ativo' ? 'status-approved' : 'status-warning';
        const typeClass = `type-${item.type.toLowerCase()}`;

        return `
            <tr data-id="${item.id}">
                <td><strong>${item.name}</strong></td>
                <td>${item.email}</td>
                <td><span class="type-badge ${typeClass}">${item.type}</span></td>
                <td>${this.formatDate(item.registered)}</td>
                <td>${this.formatDate(item.lastAccess)}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminFunctions.viewDetails('${item.id}', 'user')">👁️ Ver</button>
                    <button class="btn btn-sm btn-primary" onclick="adminFunctions.editUser('${item.id}')">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="adminFunctions.deleteUser('${item.id}')">🗑️ Excluir</button>
                </td>
            </tr>
        `;
    }

    // Logs de Auditoria
    loadAuditData() {
        const auditData = [
            {
                id: 'audit_001',
                datetime: '2025-10-03 14:30:15',
                user: 'admin@claunnetworkingworkingworking.com',
                action: 'Aprovação',
                resource: 'Vaga',
                resourceId: 'vaga_123',
                details: 'Vaga "Desenvolvedor React" aprovada'
            },
            {
                id: 'audit_002',
                datetime: '2025-10-03 13:45:22',
                user: 'admin@claunnetworkingworkingworking.com',
                action: 'Criação',
                resource: 'Curso',
                resourceId: 'curso_456',
                details: 'Novo curso "Python Básico" criado'
            },
            {
                id: 'audit_003',
                datetime: '2025-10-03 12:15:08',
                user: 'admin@claunnetworkingworkingworking.com',
                action: 'Exclusão',
                resource: 'Usuário',
                resourceId: 'user_789',
                details: 'Usuário spam removido do sistema'
            }
        ];

        this.populateTable('audit-table-body', auditData, this.renderAuditRow.bind(this));
    }

    renderAuditRow(item) {
        const actionClass = `action-${item.action.toLowerCase()}`;

        return `
            <tr data-id="${item.id}">
                <td>${this.formatDateTime(item.datetime)}</td>
                <td>${item.user}</td>
                <td><span class="action-badge ${actionClass}">${item.action}</span></td>
                <td>${item.resource}</td>
                <td><code>${item.resourceId}</code></td>
                <td>${item.details}</td>
            </tr>
        `;
    }

    // Notificações
    loadNotificationsData() {
        const notificationsData = [
            {
                id: 'notif_001',
                datetime: '2025-10-03 15:20:30',
                type: 'Email',
                recipient: 'empresa@teste.com',
                status: 'Enviado',
                message: 'Confirmação de pagamento do plano Profissional'
            },
            {
                id: 'notif_002',
                datetime: '2025-10-03 14:15:45',
                type: 'Webhook',
                recipient: 'api.payment.com',
                status: 'Falhou',
                message: 'Erro ao processar webhook de pagamento'
            },
            {
                id: 'notif_003',
                datetime: '2025-10-03 13:30:12',
                type: 'SMS',
                recipient: '+55 11 99999-1234',
                status: 'Enviado',
                message: 'Código de verificação para login'
            }
        ];

        this.populateTable('notifications-table-body', notificationsData, this.renderNotificationRow.bind(this));
    }

    renderNotificationRow(item) {
        const statusClass = item.status === 'Enviado' ? 'status-approved' : 'status-rejected';
        const typeClass = `type-${item.type.toLowerCase()}`;

        return `
            <tr data-id="${item.id}">
                <td>${this.formatDateTime(item.datetime)}</td>
                <td><span class="type-badge ${typeClass}">${item.type}</span></td>
                <td>${item.recipient}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>${item.message}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="adminFunctions.viewNotificationDetails('${item.id}')">👁️ Ver</button>
                    ${item.status === 'Falhou' ? '<button class="btn btn-sm btn-warning" onclick="adminFunctions.retryNotification(\'' + item.id + '\')">🔄 Reenviar</button>' : ''}
                </td>
            </tr>
        `;
    }

    // Funções de Ação
    approveItem(itemId) {
        if (confirm('Tem certeza que deseja aprovar este item?')) {
            this.showSuccessMessage('Item aprovado com sucesso!');
            this.updateItemStatus(itemId, 'Aprovado');
        }
    }

    rejectItem(itemId) {
        const reason = prompt('Motivo da rejeição (opcional):');
        if (reason !== null) {
            this.showSuccessMessage('Item rejeitado com sucesso!');
            this.updateItemStatus(itemId, 'Rejeitado');
        }
    }

    bulkApprove() {
        if (this.selectedItems.size === 0) {
            alert('Nenhum item selecionado.');
            return;
        }

        if (confirm(`Aprovar ${this.selectedItems.size} itens selecionados?`)) {
            this.selectedItems.forEach(itemId => {
                this.updateItemStatus(itemId, 'Aprovado');
            });
            this.showSuccessMessage(`${this.selectedItems.size} itens aprovados com sucesso!`);
            this.clearSelection();
        }
    }

    bulkReject() {
        if (this.selectedItems.size === 0) {
            alert('Nenhum item selecionado.');
            return;
        }

        const reason = prompt('Motivo da rejeição em lote (opcional):');
        if (reason !== null) {
            this.selectedItems.forEach(itemId => {
                this.updateItemStatus(itemId, 'Rejeitado');
            });
            this.showSuccessMessage(`${this.selectedItems.size} itens rejeitados com sucesso!`);
            this.clearSelection();
        }
    }

    // Funções de Seleção
    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            this.handleRowSelection(checkbox);
        });
    }

    handleRowSelection(checkbox) {
        const itemId = checkbox.dataset.id;
        if (checkbox.checked) {
            this.selectedItems.add(itemId);
        } else {
            this.selectedItems.delete(itemId);
        }

        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulk-actions');
        const selectedCount = document.getElementById('selected-count');

        if (bulkActions && selectedCount) {
            if (this.selectedItems.size > 0) {
                bulkActions.classList.add('show');
                selectedCount.textContent = `${this.selectedItems.size} itens selecionados`;
            } else {
                bulkActions.classList.remove('show');
            }
        }
    }

    clearSelection() {
        this.selectedItems.clear();
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        document.getElementById('select-all').checked = false;
        this.updateBulkActions();
    }

    // Funções de Exportação
    exportMetrics() {
        this.showSuccessMessage('Dados de métricas exportados com sucesso!');
        // Simular download
        this.simulateDownload('metricas_' + this.getCurrentDate() + '.xlsx');
    }

    exportTransactions() {
        this.showSuccessMessage('Transações exportadas com sucesso!');
        this.simulateDownload('transacoes_' + this.getCurrentDate() + '.csv');
    }

    exportReport(format) {
        this.showSuccessMessage(`Relatório exportado em formato ${format.toUpperCase()}!`);
        this.simulateDownload(`relatorio_${this.getCurrentDate()}.${format}`);
    }

    // Funções de Modal
    viewDetails(itemId, type) {
        alert(`Visualizando detalhes do ${type} ID: ${itemId}`);
        // Aqui seria aberto um modal com os detalhes completos
    }

    editItem(itemId, type) {
        alert(`Editando ${type} ID: ${itemId}`);
        // Aqui seria aberto um modal de edição
    }

    deleteItem(itemId, type) {
        if (confirm(`Tem certeza que deseja excluir este ${type}?`)) {
            this.showSuccessMessage(`${type} excluído com sucesso!`);
            this.removeTableRow(itemId);
        }
    }

    // Funções Utilitárias
    populateTable(tableId, data, renderFunction) {
        const tableBody = document.getElementById(tableId);
        if (tableBody) {
            tableBody.innerHTML = data.map(renderFunction).join('');
        }
    }

    updateItemStatus(itemId, newStatus) {
        const row = document.querySelector(`tr[data-id="${itemId}"]`);
        if (row) {
            const statusCell = row.querySelector('.status-badge');
            if (statusCell) {
                statusCell.textContent = newStatus;
                statusCell.className = `status-badge status-${newStatus.toLowerCase()}`;
            }
        }
    }

    removeTableRow(itemId) {
        const row = document.querySelector(`tr[data-id="${itemId}"]`);
        if (row) {
            row.remove();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('pt-BR');
    }

    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    showSuccessMessage(message) {
        // Criar notificação toast
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✅</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Remover após 3 segundos
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    simulateDownload(filename) {
        console.log(`Download simulado: ${filename}`);
        // Em uma implementação real, aqui seria feito o download do arquivo
    }

    // Filtros
    applyFilters() {
        // Implementar lógica de filtros
        console.log('Aplicando filtros...');
    }

    // Métricas em tempo real
    updateMetricsPeriod() {
        const period = document.getElementById('metrics-period').value;
        console.log(`Atualizando métricas para período: ${period} dias`);
        this.showSuccessMessage(`Métricas atualizadas para os últimos ${period} dias`);
    }
}

// Instanciar as funcionalidades administrativas
window.adminFunctions = new AdminFunctions();

// Funções globais para compatibilidade
window.showPage = function(pageId) {
    // Hide all page content
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page content
    const newPage = document.getElementById(pageId + '-page');
    if (newPage) {
        newPage.classList.add('active');
    }

    // Update the page title
    const pageTitle = document.getElementById('page-title');
    const navLink = document.querySelector(`.sidebar-nav a[href="#${pageId}"]`);
    if (pageTitle && navLink) {
        pageTitle.textContent = navLink.textContent.replace(/\S+\s/, '');
    }

    // Update the active nav link
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (navLink) {
        navLink.classList.add('active');
    }
};

window.logout = function() {
    if (confirm('Tem certeza que deseja sair?')) {
        alert('Logout efetuado com sucesso!');
        window.location.href = 'index.html';
    }
};

// Funções específicas do painel
window.bulkApprove = () => adminFunctions.bulkApprove();
window.bulkReject = () => adminFunctions.bulkReject();
window.toggleSelectAll = () => adminFunctions.toggleSelectAll();
window.filterPending = () => adminFunctions.applyFilters();
window.updateMetricsPeriod = () => adminFunctions.updateMetricsPeriod();
window.exportMetrics = () => adminFunctions.exportMetrics();
window.exportTransactions = () => adminFunctions.exportTransactions();
window.exportReport = (format) => adminFunctions.exportReport(format);

console.log('Funcionalidades Administrativas Avançadas carregadas!');
// Sistema de Analytics Avançados - ClaunNetworking
class AdvancedAnalyticsSystem {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.events = [];
        this.metrics = {};
        this.heatmapData = [];
        this.performanceData = {};
        this.userJourney = [];
        this.conversionFunnels = {};
        this.realTimeData = {};
        this.init();
    }

    // Inicializa sistema de analytics
    init() {
        this.setupEventTracking();
        this.setupPerformanceTracking();
        this.setupHeatmapTracking();
        this.setupUserJourneyTracking();
        this.setupConversionTracking();
        this.setupRealTimeTracking();
        this.setupErrorTracking();
        this.startDataCollection();
        this.createAnalyticsDashboard();
    }

    // Gera ID de sessão único
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obtém ID do usuário
    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    // Configura rastreamento de eventos
    setupEventTracking() {
        // Rastreia cliques
        document.addEventListener('click', (e) => {
            this.trackEvent('click', {
                element: e.target.tagName.toLowerCase(),
                className: e.target.className,
                id: e.target.id,
                text: e.target.textContent?.substring(0, 100),
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                url: window.location.href
            });
        });

        // Rastreia submissões de formulário
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = new FormData(form);
            const fields = {};
            
            for (let [key, value] of formData.entries()) {
                fields[key] = typeof value === 'string' ? value.substring(0, 50) : 'file';
            }

            this.trackEvent('form_submit', {
                formId: form.id,
                formClass: form.className,
                fields: Object.keys(fields),
                fieldCount: Object.keys(fields).length,
                timestamp: Date.now(),
                url: window.location.href
            });
        });

        // Rastreia mudanças de input
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.trackEvent('input_change', {
                    fieldName: e.target.name || e.target.id,
                    fieldType: e.target.type,
                    valueLength: e.target.value.length,
                    timestamp: Date.now()
                });
            }
        });

        // Rastreia scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                this.trackEvent('scroll', {
                    scrollPercent,
                    scrollY: window.scrollY,
                    timestamp: Date.now()
                });
            }, 100);
        });

        // Rastreia tempo na página
        this.pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.pageStartTime;
            this.trackEvent('page_exit', {
                timeOnPage,
                url: window.location.href,
                timestamp: Date.now()
            });
        });

        // Rastreia mudanças de visibilidade
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                hidden: document.hidden,
                timestamp: Date.now()
            });
        });
    }

    // Configura rastreamento de performance
    setupPerformanceTracking() {
        // Performance da página
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                this.performanceData = {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    firstPaint: this.getFirstPaint(),
                    firstContentfulPaint: this.getFirstContentfulPaint(),
                    largestContentfulPaint: this.getLargestContentfulPaint(),
                    cumulativeLayoutShift: this.getCumulativeLayoutShift(),
                    firstInputDelay: this.getFirstInputDelay(),
                    timestamp: Date.now()
                };

                this.trackEvent('performance', this.performanceData);
            }, 1000);
        });

        // Rastreia recursos lentos
        this.trackSlowResources();
        
        // Rastreia erros de JavaScript
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack?.substring(0, 500),
                timestamp: Date.now()
            });
        });
    }

    // Obtém First Paint
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    // Obtém First Contentful Paint
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    // Obtém Largest Contentful Paint
    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
                
                setTimeout(() => resolve(null), 5000); // Timeout após 5s
            } else {
                resolve(null);
            }
        });
    }

    // Obtém Cumulative Layout Shift
    getCumulativeLayoutShift() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });
                
                setTimeout(() => resolve(clsValue), 5000);
            } else {
                resolve(null);
            }
        });
    }

    // Obtém First Input Delay
    getFirstInputDelay() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const firstEntry = list.getEntries()[0];
                    resolve(firstEntry.processingStart - firstEntry.startTime);
                });
                observer.observe({ entryTypes: ['first-input'] });
                
                setTimeout(() => resolve(null), 10000); // Timeout após 10s
            } else {
                resolve(null);
            }
        });
    }

    // Rastreia recursos lentos
    trackSlowResources() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(resource => resource.duration > 1000);
            
            slowResources.forEach(resource => {
                this.trackEvent('slow_resource', {
                    name: resource.name,
                    duration: resource.duration,
                    size: resource.transferSize,
                    type: resource.initiatorType,
                    timestamp: Date.now()
                });
            });
        });
    }

    // Configura rastreamento de heatmap
    setupHeatmapTracking() {
        document.addEventListener('click', (e) => {
            this.heatmapData.push({
                x: e.clientX,
                y: e.clientY,
                element: e.target.tagName.toLowerCase(),
                timestamp: Date.now(),
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
        });

        document.addEventListener('mousemove', (e) => {
            // Throttle mousemove events
            if (Math.random() < 0.01) { // 1% sampling
                this.heatmapData.push({
                    x: e.clientX,
                    y: e.clientY,
                    type: 'mousemove',
                    timestamp: Date.now(),
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                });
            }
        });
    }

    // Configura rastreamento de jornada do usuário
    setupUserJourneyTracking() {
        // Rastreia entrada na página
        this.userJourney.push({
            action: 'page_enter',
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });

        // Rastreia navegação
        window.addEventListener('beforeunload', () => {
            this.userJourney.push({
                action: 'page_exit',
                url: window.location.href,
                timeOnPage: Date.now() - this.pageStartTime,
                timestamp: Date.now()
            });
        });

        // Rastreia cliques em links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.userJourney.push({
                    action: 'link_click',
                    url: window.location.href,
                    targetUrl: e.target.href,
                    linkText: e.target.textContent?.substring(0, 50),
                    timestamp: Date.now()
                });
            }
        });
    }

    // Configura rastreamento de conversão
    setupConversionTracking() {
        // Define funis de conversão
        this.conversionFunnels = {
            job_application: [
                'page_enter:/vagas.html',
                'click:ver-detalhes',
                'click:candidatar',
                'form_submit:application-form'
            ],
            user_registration: [
                'page_enter:/',
                'click:cadastro',
                'form_submit:registration-form'
            ],
            company_signup: [
                'page_enter:/solucoes-empresas.html',
                'click:escolher-plano',
                'form_submit:company-form'
            ]
        };

        // Rastreia progresso nos funis
        this.trackFunnelProgress();
    }

    // Rastreia progresso nos funis de conversão
    trackFunnelProgress() {
        Object.keys(this.conversionFunnels).forEach(funnelName => {
            const steps = this.conversionFunnels[funnelName];
            const userEvents = this.getUserEvents();
            
            let currentStep = 0;
            const funnelProgress = [];

            userEvents.forEach(event => {
                const eventSignature = this.getEventSignature(event);
                
                if (currentStep < steps.length && steps[currentStep] === eventSignature) {
                    funnelProgress.push({
                        step: currentStep,
                        stepName: steps[currentStep],
                        timestamp: event.timestamp,
                        completed: true
                    });
                    currentStep++;
                }
            });

            if (funnelProgress.length > 0) {
                this.trackEvent('funnel_progress', {
                    funnelName,
                    stepsCompleted: currentStep,
                    totalSteps: steps.length,
                    conversionRate: currentStep / steps.length,
                    progress: funnelProgress,
                    timestamp: Date.now()
                });
            }
        });
    }

    // Obtém assinatura do evento
    getEventSignature(event) {
        switch (event.type) {
            case 'page_enter':
                return `page_enter:${new URL(event.data.url).pathname}`;
            case 'click':
                return `click:${event.data.id || event.data.className}`;
            case 'form_submit':
                return `form_submit:${event.data.formId}`;
            default:
                return `${event.type}:${event.data.element || 'unknown'}`;
        }
    }

    // Configura rastreamento em tempo real
    setupRealTimeTracking() {
        // Atualiza métricas em tempo real
        setInterval(() => {
            this.updateRealTimeMetrics();
        }, 5000); // A cada 5 segundos

        // Rastreia usuários ativos
        this.trackActiveUser();
        
        // Rastreia engagement
        this.trackEngagement();
    }

    // Atualiza métricas em tempo real
    updateRealTimeMetrics() {
        this.realTimeData = {
            activeUsers: this.getActiveUsersCount(),
            pageViews: this.getPageViewsCount(),
            bounceRate: this.getBounceRate(),
            averageSessionDuration: this.getAverageSessionDuration(),
            topPages: this.getTopPages(),
            topEvents: this.getTopEvents(),
            deviceBreakdown: this.getDeviceBreakdown(),
            trafficSources: this.getTrafficSources(),
            timestamp: Date.now()
        };

        // Atualiza dashboard se estiver visível
        this.updateDashboard();
    }

    // Rastreia usuário ativo
    trackActiveUser() {
        const heartbeat = () => {
            this.trackEvent('heartbeat', {
                timestamp: Date.now(),
                url: window.location.href
            });
        };

        // Heartbeat inicial
        heartbeat();
        
        // Heartbeat a cada 30 segundos
        setInterval(heartbeat, 30000);
    }

    // Rastreia engagement
    trackEngagement() {
        let engagementScore = 0;
        let lastActivity = Date.now();

        // Incrementa score por atividade
        const activityEvents = ['click', 'scroll', 'input_change', 'form_submit'];
        
        document.addEventListener('click', () => this.updateEngagement());
        document.addEventListener('scroll', () => this.updateEngagement());
        document.addEventListener('input', () => this.updateEngagement());
        document.addEventListener('submit', () => this.updateEngagement());

        setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivity;
            
            if (timeSinceLastActivity > 60000) { // 1 minuto sem atividade
                engagementScore = Math.max(0, engagementScore - 10);
            }

            this.trackEvent('engagement_score', {
                score: engagementScore,
                timeSinceLastActivity,
                timestamp: Date.now()
            });
        }, 30000);
    }

    // Atualiza engagement
    updateEngagement() {
        this.lastActivity = Date.now();
        this.engagementScore = Math.min(100, (this.engagementScore || 0) + 5);
    }

    // Configura rastreamento de erros
    setupErrorTracking() {
        // Erros JavaScript
        window.addEventListener('error', (e) => {
            this.trackEvent('error', {
                type: 'javascript',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack,
                timestamp: Date.now()
            });
        });

        // Promises rejeitadas
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('error', {
                type: 'promise_rejection',
                reason: e.reason?.toString(),
                timestamp: Date.now()
            });
        });

        // Erros de recursos
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.trackEvent('error', {
                    type: 'resource',
                    element: e.target.tagName,
                    source: e.target.src || e.target.href,
                    timestamp: Date.now()
                });
            }
        }, true);
    }

    // Inicia coleta de dados
    startDataCollection() {
        // Salva dados periodicamente
        setInterval(() => {
            this.saveData();
        }, 30000); // A cada 30 segundos

        // Salva dados antes de sair
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });

        // Limpa dados antigos
        setInterval(() => {
            this.cleanOldData();
        }, 3600000); // A cada hora
    }

    // Rastreia evento
    trackEvent(type, data) {
        const event = {
            id: this.generateEventId(),
            type,
            data,
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.events.push(event);

        // Mantém apenas últimos 1000 eventos na memória
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }

        // Processa evento para métricas
        this.processEventForMetrics(event);
    }

    // Gera ID único para evento
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Processa evento para métricas
    processEventForMetrics(event) {
        const eventType = event.type;
        
        if (!this.metrics[eventType]) {
            this.metrics[eventType] = {
                count: 0,
                firstSeen: event.timestamp,
                lastSeen: event.timestamp
            };
        }

        this.metrics[eventType].count++;
        this.metrics[eventType].lastSeen = event.timestamp;
    }

    // Cria dashboard de analytics
    createAnalyticsDashboard() {
        // Dashboard desabilitado para não sobrepor a interface principal
        // O analytics funciona em background sem interface visual
        console.log('Analytics system initialized in background mode');
        return;
    }

    // Obtém HTML do dashboard
    getDashboardHTML() {
        return `
            <div class="dashboard-header">
                <h2>📊 Analytics em Tempo Real</h2>
                <div class="dashboard-controls">
                    <button onclick="analytics.toggleDashboard()" class="toggle-btn">−</button>
                    <button onclick="analytics.exportData()" class="export-btn">📥 Exportar</button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <!-- Métricas principais -->
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value" id="active-users">0</div>
                        <div class="metric-label">Usuários Ativos</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="page-views">0</div>
                        <div class="metric-label">Visualizações</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="bounce-rate">0%</div>
                        <div class="metric-label">Taxa de Rejeição</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="avg-session">0s</div>
                        <div class="metric-label">Sessão Média</div>
                    </div>
                </div>

                <!-- Gráficos -->
                <div class="charts-grid">
                    <div class="chart-container">
                        <h3>📈 Eventos por Tipo</h3>
                        <canvas id="events-chart" width="300" height="200"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>🔥 Heatmap de Cliques</h3>
                        <div id="heatmap-container"></div>
                    </div>
                </div>

                <!-- Tabelas de dados -->
                <div class="tables-grid">
                    <div class="table-container">
                        <h3>📄 Páginas Mais Visitadas</h3>
                        <div id="top-pages-table"></div>
                    </div>
                    <div class="table-container">
                        <h3>🎯 Eventos Mais Frequentes</h3>
                        <div id="top-events-table"></div>
                    </div>
                </div>

                <!-- Performance -->
                <div class="performance-section">
                    <h3>⚡ Performance</h3>
                    <div class="performance-metrics">
                        <div class="perf-metric">
                            <span class="perf-label">Tempo de Carregamento:</span>
                            <span class="perf-value" id="load-time">-</span>
                        </div>
                        <div class="perf-metric">
                            <span class="perf-label">First Contentful Paint:</span>
                            <span class="perf-value" id="fcp-time">-</span>
                        </div>
                        <div class="perf-metric">
                            <span class="perf-label">Largest Contentful Paint:</span>
                            <span class="perf-value" id="lcp-time">-</span>
                        </div>
                    </div>
                </div>

                <!-- Funis de conversão -->
                <div class="funnels-section">
                    <h3>🎯 Funis de Conversão</h3>
                    <div id="conversion-funnels"></div>
                </div>
            </div>
        `;
    }

    // Adiciona CSS do dashboard
    addDashboardCSS() {
        if (document.getElementById('analytics-dashboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'analytics-dashboard-styles';
        style.textContent = `
            .analytics-dashboard {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 400px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                overflow: hidden;
                border: 1px solid #e5e7eb;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .dashboard-header {
                background: #1f2937;
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .dashboard-header h2 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .dashboard-controls {
                display: flex;
                gap: 8px;
            }

            .toggle-btn, .export-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }

            .dashboard-content {
                padding: 16px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .metrics-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 20px;
            }

            .metric-card {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                text-align: center;
                border: 1px solid #e5e7eb;
            }

            .metric-value {
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 4px;
            }

            .metric-label {
                font-size: 11px;
                color: #6b7280;
                text-transform: uppercase;
                font-weight: 600;
            }

            .charts-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin-bottom: 20px;
            }

            .chart-container {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .chart-container h3 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #1f2937;
            }

            .tables-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin-bottom: 20px;
            }

            .table-container {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .table-container h3 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #1f2937;
            }

            .performance-section,
            .funnels-section {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                margin-bottom: 16px;
            }

            .performance-section h3,
            .funnels-section h3 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #1f2937;
            }

            .performance-metrics {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .perf-metric {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }

            .perf-label {
                color: #6b7280;
            }

            .perf-value {
                font-weight: 600;
                color: #1f2937;
            }

            #heatmap-container {
                height: 150px;
                background: #e5e7eb;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6b7280;
                font-size: 12px;
            }

            .dashboard-collapsed .dashboard-content {
                display: none;
            }

            @media (max-width: 768px) {
                .analytics-dashboard {
                    width: 90%;
                    left: 5%;
                    top: 10px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Inicializa gráficos
    initializeCharts() {
        // Gráfico de eventos (usando canvas simples)
        this.createEventsChart();
        this.createHeatmap();
    }

    // Cria gráfico de eventos
    createEventsChart() {
        const canvas = document.getElementById('events-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const eventTypes = Object.keys(this.metrics);
        const eventCounts = eventTypes.map(type => this.metrics[type].count);

        // Gráfico de barras simples
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const maxCount = Math.max(...eventCounts, 1);
        const barWidth = canvas.width / eventTypes.length;
        const barMaxHeight = canvas.height - 40;

        eventTypes.forEach((type, index) => {
            const count = eventCounts[index];
            const barHeight = (count / maxCount) * barMaxHeight;
            const x = index * barWidth;
            const y = canvas.height - barHeight - 20;

            // Barra
            ctx.fillStyle = '#8b5cf6';
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

            // Label
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(type.substring(0, 8), x + barWidth/2, canvas.height - 5);
            
            // Valor
            ctx.fillText(count.toString(), x + barWidth/2, y - 5);
        });
    }

    // Cria heatmap
    createHeatmap() {
        const container = document.getElementById('heatmap-container');
        if (!container || this.heatmapData.length === 0) {
            if (container) {
                container.innerHTML = 'Coletando dados de cliques...';
            }
            return;
        }

        // Cria visualização simples do heatmap
        const clicks = this.heatmapData.filter(point => point.type !== 'mousemove');
        const clickCounts = {};

        clicks.forEach(click => {
            const gridX = Math.floor(click.x / 50) * 50;
            const gridY = Math.floor(click.y / 50) * 50;
            const key = `${gridX},${gridY}`;
            clickCounts[key] = (clickCounts[key] || 0) + 1;
        });

        const maxClicks = Math.max(...Object.values(clickCounts), 1);
        
        container.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
                ${Object.entries(clickCounts).map(([key, count]) => {
                    const [x, y] = key.split(',').map(Number);
                    const intensity = count / maxClicks;
                    const size = 10 + (intensity * 20);
                    const opacity = 0.3 + (intensity * 0.7);
                    
                    return `
                        <div style="
                            position: absolute;
                            left: ${(x / window.innerWidth) * 100}%;
                            top: ${(y / window.innerHeight) * 100}%;
                            width: ${size}px;
                            height: ${size}px;
                            background: radial-gradient(circle, rgba(239,68,68,${opacity}) 0%, transparent 70%);
                            border-radius: 50%;
                            pointer-events: none;
                        "></div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Atualiza dashboard
    updateDashboard() {
        if (!document.getElementById('analytics-dashboard')) return;

        // Atualiza métricas principais
        this.updateElement('active-users', this.getActiveUsersCount());
        this.updateElement('page-views', this.getPageViewsCount());
        this.updateElement('bounce-rate', this.getBounceRate() + '%');
        this.updateElement('avg-session', this.formatDuration(this.getAverageSessionDuration()));

        // Atualiza performance
        if (this.performanceData.loadTime) {
            this.updateElement('load-time', this.formatDuration(this.performanceData.loadTime));
        }
        if (this.performanceData.firstContentfulPaint) {
            this.updateElement('fcp-time', this.formatDuration(this.performanceData.firstContentfulPaint));
        }

        // Atualiza gráficos
        this.createEventsChart();
        this.createHeatmap();

        // Atualiza tabelas
        this.updateTopPagesTable();
        this.updateTopEventsTable();
        this.updateConversionFunnels();
    }

    // Atualiza elemento
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Atualiza tabela de páginas mais visitadas
    updateTopPagesTable() {
        const container = document.getElementById('top-pages-table');
        if (!container) return;

        const topPages = this.getTopPages();
        
        container.innerHTML = `
            <div style="font-size: 12px;">
                ${topPages.slice(0, 5).map(page => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">${page.url}</span>
                        <span style="color: #6b7280; font-weight: 600;">${page.views}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Atualiza tabela de eventos mais frequentes
    updateTopEventsTable() {
        const container = document.getElementById('top-events-table');
        if (!container) return;

        const topEvents = this.getTopEvents();
        
        container.innerHTML = `
            <div style="font-size: 12px;">
                ${topEvents.slice(0, 5).map(event => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: #374151;">${event.type}</span>
                        <span style="color: #6b7280; font-weight: 600;">${event.count}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Atualiza funis de conversão
    updateConversionFunnels() {
        const container = document.getElementById('conversion-funnels');
        if (!container) return;

        const funnels = Object.keys(this.conversionFunnels);
        
        container.innerHTML = `
            <div style="font-size: 12px;">
                ${funnels.map(funnelName => {
                    const conversionRate = this.getFunnelConversionRate(funnelName);
                    return `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="color: #374151; font-weight: 600;">${funnelName.replace('_', ' ')}</span>
                                <span style="color: #6b7280;">${conversionRate}%</span>
                            </div>
                            <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="background: #8b5cf6; height: 100%; width: ${conversionRate}%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Métodos de cálculo de métricas
    getActiveUsersCount() {
        const oneHourAgo = Date.now() - 3600000;
        const recentEvents = this.events.filter(event => event.timestamp > oneHourAgo);
        const uniqueUsers = new Set(recentEvents.map(event => event.userId));
        return uniqueUsers.size;
    }

    getPageViewsCount() {
        return this.events.filter(event => event.type === 'page_enter').length;
    }

    getBounceRate() {
        const sessions = this.getSessionData();
        const bouncedSessions = sessions.filter(session => session.pageViews === 1);
        return sessions.length > 0 ? Math.round((bouncedSessions.length / sessions.length) * 100) : 0;
    }

    getAverageSessionDuration() {
        const sessions = this.getSessionData();
        if (sessions.length === 0) return 0;
        
        const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
        return totalDuration / sessions.length;
    }

    getSessionData() {
        const sessions = {};
        
        this.events.forEach(event => {
            if (!sessions[event.sessionId]) {
                sessions[event.sessionId] = {
                    startTime: event.timestamp,
                    endTime: event.timestamp,
                    pageViews: 0,
                    events: []
                };
            }
            
            const session = sessions[event.sessionId];
            session.endTime = Math.max(session.endTime, event.timestamp);
            session.events.push(event);
            
            if (event.type === 'page_enter') {
                session.pageViews++;
            }
        });

        return Object.values(sessions).map(session => ({
            ...session,
            duration: session.endTime - session.startTime
        }));
    }

    getTopPages() {
        const pageViews = {};
        
        this.events.filter(event => event.type === 'page_enter').forEach(event => {
            const url = new URL(event.data.url).pathname;
            pageViews[url] = (pageViews[url] || 0) + 1;
        });

        return Object.entries(pageViews)
            .map(([url, views]) => ({ url, views }))
            .sort((a, b) => b.views - a.views);
    }

    getTopEvents() {
        return Object.entries(this.metrics)
            .map(([type, data]) => ({ type, count: data.count }))
            .sort((a, b) => b.count - a.count);
    }

    getDeviceBreakdown() {
        const devices = {};
        
        this.events.forEach(event => {
            const userAgent = event.userAgent;
            let deviceType = 'desktop';
            
            if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
                deviceType = 'mobile';
            } else if (/Tablet|iPad/.test(userAgent)) {
                deviceType = 'tablet';
            }
            
            devices[deviceType] = (devices[deviceType] || 0) + 1;
        });

        return devices;
    }

    getTrafficSources() {
        const sources = {};
        
        this.userJourney.filter(event => event.action === 'page_enter').forEach(event => {
            const referrer = event.referrer;
            let source = 'direct';
            
            if (referrer) {
                try {
                    const domain = new URL(referrer).hostname;
                    if (domain.includes('google')) source = 'google';
                    else if (domain.includes('facebook')) source = 'facebook';
                    else if (domain.includes('linkedin')) source = 'linkedin';
                    else source = 'referral';
                } catch (e) {
                    source = 'unknown';
                }
            }
            
            sources[source] = (sources[source] || 0) + 1;
        });

        return sources;
    }

    getFunnelConversionRate(funnelName) {
        // Implementação simplificada
        const totalUsers = this.getActiveUsersCount();
        const completedUsers = Math.floor(totalUsers * Math.random() * 0.3); // Simulado
        return totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;
    }

    getUserEvents() {
        return this.events.concat(this.userJourney.map(journey => ({
            type: journey.action,
            data: journey,
            timestamp: journey.timestamp
        })));
    }

    formatDuration(ms) {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        return `${(ms / 60000).toFixed(1)}m`;
    }

    // Métodos de interface pública
    toggleDashboard() {
        const dashboard = document.getElementById('analytics-dashboard');
        if (dashboard) {
            dashboard.classList.toggle('dashboard-collapsed');
        }
    }

    exportData() {
        const data = {
            events: this.events,
            metrics: this.metrics,
            heatmapData: this.heatmapData,
            performanceData: this.performanceData,
            userJourney: this.userJourney,
            realTimeData: this.realTimeData,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Métodos de persistência
    saveData() {
        try {
            localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(-500))); // Últimos 500 eventos
            localStorage.setItem('analytics_metrics', JSON.stringify(this.metrics));
            localStorage.setItem('analytics_heatmap', JSON.stringify(this.heatmapData.slice(-1000))); // Últimos 1000 pontos
        } catch (e) {
            console.warn('Erro ao salvar dados de analytics:', e);
        }
    }

    loadData() {
        try {
            const events = localStorage.getItem('analytics_events');
            const metrics = localStorage.getItem('analytics_metrics');
            const heatmap = localStorage.getItem('analytics_heatmap');

            if (events) this.events = JSON.parse(events);
            if (metrics) this.metrics = JSON.parse(metrics);
            if (heatmap) this.heatmapData = JSON.parse(heatmap);
        } catch (e) {
            console.warn('Erro ao carregar dados de analytics:', e);
        }
    }

    cleanOldData() {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        this.events = this.events.filter(event => event.timestamp > oneWeekAgo);
        this.heatmapData = this.heatmapData.filter(point => point.timestamp > oneWeekAgo);
        this.userJourney = this.userJourney.filter(journey => journey.timestamp > oneWeekAgo);
    }

    // Método de reset (para desenvolvimento)
    reset() {
        localStorage.removeItem('analytics_events');
        localStorage.removeItem('analytics_metrics');
        localStorage.removeItem('analytics_heatmap');
        localStorage.removeItem('analytics_user_id');
        location.reload();
    }
}

// Inicializa sistema automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new AdvancedAnalyticsSystem();
});

// Exporta para uso global
window.AdvancedAnalyticsSystem = AdvancedAnalyticsSystem;
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
// Sistema de Compatibilidade Inteligente - ClaunNetworking
class CompatibilitySystem {
    constructor() {
        this.weights = {
            skills: 0.35,
            experience: 0.25,
            location: 0.15,
            education: 0.15,
            salary: 0.10
        };
    }

    // Calcula score de compatibilidade entre candidato e vaga
    calculateCompatibility(candidate, job) {
        let totalScore = 0;

        // Score de habilidades (35%)
        const skillsScore = this.calculateSkillsMatch(candidate.skills, job.requiredSkills);
        totalScore += skillsScore * this.weights.skills;

        // Score de experiência (25%)
        const experienceScore = this.calculateExperienceMatch(candidate.experience, job.requiredExperience);
        totalScore += experienceScore * this.weights.experience;

        // Score de localização (15%)
        const locationScore = this.calculateLocationMatch(candidate.location, job.location, job.remote);
        totalScore += locationScore * this.weights.location;

        // Score de educação (15%)
        const educationScore = this.calculateEducationMatch(candidate.education, job.requiredEducation);
        totalScore += educationScore * this.weights.education;

        // Score de salário (10%)
        const salaryScore = this.calculateSalaryMatch(candidate.expectedSalary, job.salaryRange);
        totalScore += salaryScore * this.weights.salary;

        return Math.round(totalScore * 100);
    }

    calculateSkillsMatch(candidateSkills, requiredSkills) {
        if (!candidateSkills || !requiredSkills) return 0;
        
        const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
        const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
        
        let matches = 0;
        requiredSet.forEach(skill => {
            if (candidateSet.has(skill)) matches++;
        });
        
        return matches / requiredSet.size;
    }

    calculateExperienceMatch(candidateExp, requiredExp) {
        if (!candidateExp || !requiredExp) return 0.5;
        
        if (candidateExp >= requiredExp) return 1;
        if (candidateExp >= requiredExp * 0.7) return 0.8;
        if (candidateExp >= requiredExp * 0.5) return 0.6;
        return 0.3;
    }

    calculateLocationMatch(candidateLocation, jobLocation, isRemote) {
        if (isRemote) return 1;
        if (!candidateLocation || !jobLocation) return 0.5;
        
        const candidateCity = candidateLocation.city?.toLowerCase();
        const jobCity = jobLocation.city?.toLowerCase();
        const candidateState = candidateLocation.state?.toLowerCase();
        const jobState = jobLocation.state?.toLowerCase();
        
        if (candidateCity === jobCity) return 1;
        if (candidateState === jobState) return 0.7;
        return 0.3;
    }

    calculateEducationMatch(candidateEdu, requiredEdu) {
        if (!requiredEdu) return 1;
        if (!candidateEdu) return 0.3;
        
        const eduLevels = {
            'fundamental': 1,
            'medio': 2,
            'tecnico': 3,
            'superior': 4,
            'pos': 5,
            'mestrado': 6,
            'doutorado': 7
        };
        
        const candidateLevel = eduLevels[candidateEdu.toLowerCase()] || 0;
        const requiredLevel = eduLevels[requiredEdu.toLowerCase()] || 0;
        
        if (candidateLevel >= requiredLevel) return 1;
        return candidateLevel / requiredLevel;
    }

    calculateSalaryMatch(expectedSalary, salaryRange) {
        if (!expectedSalary || !salaryRange) return 0.8;
        
        const { min, max } = salaryRange;
        if (expectedSalary >= min && expectedSalary <= max) return 1;
        if (expectedSalary <= min * 1.2) return 0.8;
        if (expectedSalary <= min * 1.5) return 0.6;
        return 0.3;
    }

    // Gera badge de compatibilidade
    getCompatibilityBadge(score) {
        if (score >= 90) return { text: 'Match Perfeito', class: 'perfect-match', color: '#10B981' };
        if (score >= 75) return { text: 'Alta Compatibilidade', class: 'high-match', color: '#3B82F6' };
        if (score >= 60) return { text: 'Boa Compatibilidade', class: 'good-match', color: '#8B5CF6' };
        if (score >= 40) return { text: 'Potencial Interessante', class: 'potential-match', color: '#F59E0B' };
        return { text: 'Baixa Compatibilidade', class: 'low-match', color: '#EF4444' };
    }

    // Renderiza badge no HTML
    renderCompatibilityBadge(score, container) {
        const badge = this.getCompatibilityBadge(score);
        const badgeHTML = `
            <div class="compatibility-badge ${badge.class}" style="background-color: ${badge.color}">
                <span class="badge-icon">🎯</span>
                <span class="badge-text">${badge.text}</span>
                <span class="badge-score">${score}%</span>
            </div>
        `;
        
        if (container) {
            container.innerHTML = badgeHTML;
        }
        
        return badgeHTML;
    }

    // Analisa perfil e sugere melhorias
    suggestProfileImprovements(candidate, topJobs) {
        const suggestions = [];
        
        // Analisa skills mais demandadas
        const demandedSkills = this.getMostDemandedSkills(topJobs);
        const candidateSkills = candidate.skills?.map(s => s.toLowerCase()) || [];
        
        demandedSkills.forEach(skill => {
            if (!candidateSkills.includes(skill.toLowerCase())) {
                suggestions.push({
                    type: 'skill',
                    message: `Considere adicionar "${skill}" às suas habilidades`,
                    impact: 'high'
                });
            }
        });
        
        // Analisa experiência
        const avgRequiredExp = this.getAverageRequiredExperience(topJobs);
        if (candidate.experience < avgRequiredExp * 0.8) {
            suggestions.push({
                type: 'experience',
                message: `Destaque projetos que demonstrem ${avgRequiredExp} anos de experiência`,
                impact: 'medium'
            });
        }
        
        return suggestions;
    }

    getMostDemandedSkills(jobs) {
        const skillCount = {};
        jobs.forEach(job => {
            job.requiredSkills?.forEach(skill => {
                skillCount[skill] = (skillCount[skill] || 0) + 1;
            });
        });
        
        return Object.entries(skillCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([skill]) => skill);
    }

    getAverageRequiredExperience(jobs) {
        const experiences = jobs.map(job => job.requiredExperience || 0);
        return experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length;
    }
}

// CSS para badges de compatibilidade
const compatibilityCSS = `
.compatibility-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin: 8px 0;
    animation: fadeInScale 0.3s ease-out;
}

.compatibility-badge .badge-icon {
    font-size: 16px;
}

.compatibility-badge .badge-score {
    background: rgba(255,255,255,0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.compatibility-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 12px;
    color: white;
    margin: 20px 0;
}

.compatibility-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.compatibility-metric {
    background: rgba(255,255,255,0.1);
    padding: 12px;
    border-radius: 8px;
    text-align: center;
}

.compatibility-metric .metric-label {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 4px;
}

.compatibility-metric .metric-value {
    font-size: 18px;
    font-weight: 700;
}

.suggestions-list {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

.suggestion-icon.high { background: #ef4444; color: white; }
.suggestion-icon.medium { background: #f59e0b; color: white; }
.suggestion-icon.low { background: #10b981; color: white; }
`;

// Adiciona CSS ao documento
if (!document.getElementById('compatibility-styles')) {
    const style = document.createElement('style');
    style.id = 'compatibility-styles';
    style.textContent = compatibilityCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.compatibilitySystem = new CompatibilitySystem();
// Lógica condicional para preços de cursos baseada no tipo de usuário

class CoursePricingLogic {
    constructor() {
        this.init();
    }

    init() {
        // Verificar tipo de usuário ao carregar a página
        this.checkUserTypeAndAdjustPricing();
        
        // Adicionar listeners para mudanças no tipo de preço
        this.addPriceTypeListeners();
    }

    checkUserTypeAndAdjustPricing() {
        const userType = this.getCurrentUserType();
        const paidOption = document.querySelector('input[value="paid"]');
        const paidOptionContainer = paidOption ? paidOption.closest('.radio-option') : null;
        
        if (!paidOptionContainer) return;

        switch (userType) {
            case 'candidate':
                this.restrictToPaidCourses(paidOptionContainer);
                break;
            case 'company':
                this.allowPaidCourses(paidOptionContainer);
                break;
            case 'admin':
                this.allowPaidCourses(paidOptionContainer);
                break;
            default:
                // Usuário não logado - permitir apenas gratuito
                this.restrictToPaidCourses(paidOptionContainer);
                break;
        }
    }

    getCurrentUserType() {
        // Verificar se há sistema de autenticação disponível
        if (window.authSystem && window.authSystem.isLoggedIn()) {
            const user = window.authSystem.getCurrentUser();
            return user.type;
        }

        // Fallback para localStorage (compatibilidade)
        const userType = localStorage.getItem('claunnetworkingworkingworking_user_type');
        return userType || 'guest';
    }

    restrictToPaidCourses(paidOptionContainer) {
        // Desabilitar opção paga
        paidOptionContainer.style.opacity = '0.5';
        paidOptionContainer.style.pointerEvents = 'none';
        
        const paidInput = paidOptionContainer.querySelector('input[type="radio"]');
        const paidLabel = paidOptionContainer.querySelector('label');
        
        if (paidInput) {
            paidInput.disabled = true;
        }
        
        if (paidLabel) {
            paidLabel.innerHTML = '💳 Pago <small style="color: #ef4444;">(Indisponível)</small>';
        }

        // Adicionar aviso
        this.addRestrictedPricingWarning();

        // Forçar seleção de gratuito se pago estava selecionado
        const freeOption = document.querySelector('input[value="free"]');
        if (freeOption && paidInput && paidInput.checked) {
            freeOption.checked = true;
            freeOption.closest('.radio-option').click();
        }
    }

    allowPaidCourses(paidOptionContainer) {
        // Habilitar opção paga
        paidOptionContainer.style.opacity = '1';
        paidOptionContainer.style.pointerEvents = 'auto';
        
        const paidInput = paidOptionContainer.querySelector('input[type="radio"]');
        const paidLabel = paidOptionContainer.querySelector('label');
        
        if (paidInput) {
            paidInput.disabled = false;
        }
        
        if (paidLabel) {
            paidLabel.innerHTML = '💳 Pago';
        }

        // Remover aviso se existir
        this.removeRestrictedPricingWarning();
    }

    addRestrictedPricingWarning() {
        // Verificar se já existe
        if (document.querySelector('.pricing-restriction-warning')) return;

        const warning = document.createElement('div');
        warning.className = 'alert alert-warning pricing-restriction-warning';
        warning.innerHTML = `
            <strong>ℹ️ Informação:</strong> Apenas empresas com planos ativos e administradores podem publicar cursos pagos. 
            Como candidato ou usuário não logado, você pode cadastrar apenas cursos gratuitos.
        `;

        // Inserir após o título da seção de preço
        const priceSection = document.querySelector('.form-section h3').parentElement;
        const firstFormGroup = priceSection.querySelector('.form-group');
        priceSection.insertBefore(warning, firstFormGroup);
    }

    removeRestrictedPricingWarning() {
        const warning = document.querySelector('.pricing-restriction-warning');
        if (warning) {
            warning.remove();
        }
    }

    addPriceTypeListeners() {
        const radioOptions = document.querySelectorAll('.radio-option');
        radioOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const input = option.querySelector('input[type="radio"]');
                if (input && input.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showPaidCourseRestrictionAlert();
                }
            });
        });
    }

    showPaidCourseRestrictionAlert() {
        const userType = this.getCurrentUserType();
        let message = '';

        switch (userType) {
            case 'candidate':
                message = 'Como candidato, você pode cadastrar apenas cursos gratuitos. Para publicar cursos pagos, é necessário ter uma conta empresarial com plano ativo.';
                break;
            default:
                message = 'Para publicar cursos pagos, é necessário fazer login como empresa com plano ativo ou como administrador.';
                break;
        }

        alert(message);
    }

    // Método para verificar se empresa tem plano ativo
    hasActivePlan() {
        if (window.authSystem && window.authSystem.isLoggedIn()) {
            const user = window.authSystem.getCurrentUser();
            // Verificar se há informação sobre plano ativo no perfil
            return user.profile && user.profile.activePlan === true;
        }

        // Fallback para localStorage
        return localStorage.getItem('claunnetworkingworkingworking_active_plan') === 'true';
    }

    // Método para empresas sem plano ativo
    checkCompanyPlanStatus() {
        const userType = this.getCurrentUserType();
        if (userType === 'company' && !this.hasActivePlan()) {
            this.restrictToPaidCourses(document.querySelector('input[value="paid"]').closest('.radio-option'));
            
            // Adicionar aviso específico para empresas sem plano
            const warning = document.createElement('div');
            warning.className = 'alert alert-warning';
            warning.innerHTML = `
                <strong>⚠️ Plano Necessário:</strong> Para publicar cursos pagos, sua empresa precisa ter um plano ativo. 
                <a href="servicos-premium.html" style="color: #6B46C1;">Conheça nossos planos</a> e ative o seu para desbloquear esta funcionalidade.
            `;

            const priceSection = document.querySelector('.form-section h3').parentElement;
            const firstFormGroup = priceSection.querySelector('.form-group');
            priceSection.insertBefore(warning, firstFormGroup);
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    new CoursePricingLogic();
});

// Exportar para uso global se necessário
window.CoursePricingLogic = CoursePricingLogic;
/**
 * Integração dos formulários com a API do backend
 */

// Aguardar o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    
    // Integração do formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await api.login(credentials);
                APIUtils.setCurrentUser(response.user);
                APIUtils.showSuccess('Login realizado com sucesso!');
                
                // Redirecionar baseado no tipo de usuário
                setTimeout(() => {
                    switch(response.user.type) {
                        case 'candidato':
                            window.location.href = '/candidato_painel.html';
                            break;
                        case 'empresa':
                            window.location.href = '/company_dashboard.html';
                            break;
                        case 'instituicao':
                            window.location.href = '/institution_dashboard.html';
                            break;
                        case 'admin':
                            window.location.href = '/admin_complete.html';
                            break;
                        default:
                            window.location.href = '/index.html';
                    }
                }, 1500);
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                user_type: formData.get('user_type'),
                phone: formData.get('phone')
            };

            try {
                const response = await api.register(userData);
                APIUtils.showSuccess('Cadastro realizado com sucesso!');
                
                // Limpar formulário
                registerForm.reset();
                
                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de criação de vaga
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(jobForm);
            const jobData = {
                title: formData.get('title'),
                description: formData.get('description'),
                requirements: formData.get('requirements'),
                benefits: formData.get('benefits'),
                salary_range: formData.get('salary_range'),
                location: formData.get('location'),
                work_modality: formData.get('work_modality'),
                job_type: formData.get('job_type'),
                area: formData.get('area'),
                level: formData.get('level')
            };

            try {
                const response = await api.createJob(jobData);
                APIUtils.showSuccess('Vaga criada com sucesso!');
                
                // Limpar formulário
                jobForm.reset();
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de candidatura
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(applicationForm);
            const applicationData = {
                job_id: formData.get('job_id'),
                message: formData.get('message')
            };

            try {
                const response = await api.applyToJob(applicationData);
                APIUtils.showSuccess('Candidatura enviada com sucesso!');
                
                // Fechar modal se existir
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                }
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de criação de curso
    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(courseForm);
            const courseData = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                level: formData.get('level'),
                modality: formData.get('modality'),
                duration: formData.get('duration'),
                price: parseFloat(formData.get('price')) || 0,
                is_free: formData.get('is_free') === 'on'
            };

            try {
                const response = await api.createCourse(courseData);
                APIUtils.showSuccess('Curso criado com sucesso!');
                
                // Limpar formulário
                courseForm.reset();
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                await api.logout();
                APIUtils.clearCurrentUser();
                APIUtils.showSuccess('Logout realizado com sucesso!');
                
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }
});

// Função para carregar vagas dinamicamente
async function loadJobs(filters = {}) {
    try {
        const jobs = await api.getJobs(filters);
        const jobsContainer = document.getElementById('jobsContainer');
        
        if (jobsContainer) {
            jobsContainer.innerHTML = '';
            
            jobs.forEach(job => {
                const jobCard = createJobCard(job);
                jobsContainer.appendChild(jobCard);
            });
        }
        
    } catch (error) {
        APIUtils.showError('Erro ao carregar vagas: ' + error.message);
    }
}

// Função para carregar cursos dinamicamente
async function loadCourses(filters = {}) {
    try {
        const courses = await api.getCourses(filters);
        const coursesContainer = document.getElementById('coursesContainer');
        
        if (coursesContainer) {
            coursesContainer.innerHTML = '';
            
            courses.forEach(course => {
                const courseCard = createCourseCard(course);
                coursesContainer.appendChild(courseCard);
            });
        }
        
    } catch (error) {
        APIUtils.showError('Erro ao carregar cursos: ' + error.message);
    }
}

// Função para criar card de vaga
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-4';
    
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${job.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${job.company_name}</h6>
                <p class="card-text">${job.description.substring(0, 100)}...</p>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-map-marker-alt"></i> ${job.location}
                    </small>
                </div>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-briefcase"></i> ${job.work_modality}
                    </small>
                </div>
                ${job.salary_range ? `
                <div class="mb-2">
                    <small class="text-success">
                        <i class="fas fa-dollar-sign"></i> ${job.salary_range}
                    </small>
                </div>
                ` : ''}
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-sm" onclick="showJobDetails(${job.id})">
                    Ver Detalhes
                </button>
                <button class="btn btn-success btn-sm" onclick="applyToJob(${job.id})">
                    Candidatar-se
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Função para criar card de curso
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-4';
    
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${course.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${course.institution_name}</h6>
                <p class="card-text">${course.description.substring(0, 100)}...</p>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-clock"></i> ${course.duration}
                    </small>
                </div>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-graduation-cap"></i> ${course.level}
                    </small>
                </div>
                <div class="mb-2">
                    ${course.is_free ? 
                        '<span class="badge bg-success">Gratuito</span>' : 
                        `<span class="badge bg-primary">R$ ${course.price}</span>`
                    }
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-sm" onclick="showCourseDetails(${course.id})">
                    Ver Detalhes
                </button>
                <button class="btn btn-success btn-sm" onclick="enrollInCourse(${course.id})">
                    Inscrever-se
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Funções auxiliares para interação
function showJobDetails(jobId) {
    // Implementar modal de detalhes da vaga
    console.log('Mostrar detalhes da vaga:', jobId);
}

function applyToJob(jobId) {
    // Verificar se está logado
    if (!APIUtils.isLoggedIn()) {
        APIUtils.showError('Você precisa estar logado para se candidatar.');
        return;
    }
    
    // Implementar modal de candidatura
    console.log('Candidatar-se à vaga:', jobId);
}

function showCourseDetails(courseId) {
    // Implementar modal de detalhes do curso
    console.log('Mostrar detalhes do curso:', courseId);
}

function enrollInCourse(courseId) {
    // Verificar se está logado
    if (!APIUtils.isLoggedIn()) {
        APIUtils.showError('Você precisa estar logado para se inscrever.');
        return;
    }
    
    // Implementar inscrição no curso
    console.log('Inscrever-se no curso:', courseId);
}

// Carregar dados ao inicializar páginas específicas
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    // Carregar vagas na página de vagas
    if (currentPage.includes('vagas.html') || currentPage.includes('buscar_')) {
        loadJobs();
    }
    
    // Carregar cursos na página de cursos
    if (currentPage.includes('cursos') || currentPage.includes('buscar_')) {
        loadCourses();
    }
});
/**
 * Form Modals - ClaunNetworking
 * Modais para formulários de cadastro e edição
 */

// Modal de confirmação de cadastro
function showRegistrationConfirmModal(userType, userData) {
    const typeLabels = {
        'candidato': 'Candidato',
        'empresa': 'Empresa',
        'instituicao': 'Instituição de Ensino'
    };
    
    const content = `
        <div style="padding: 1rem 0;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">🎉</div>
                <h3 style="color: #10b981; margin-bottom: 0.5rem;">Cadastro Realizado com Sucesso!</h3>
                <p style="color: #6b7280; margin: 0;">Bem-vindo(a) à ClaunNetworking!</p>
            </div>
            
            <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                <h4 style="color: #374151; margin-bottom: 1rem;">📋 Resumo do Cadastro:</h4>
                <div style="display: grid; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">Tipo de Perfil:</span>
                        <strong style="color: #374151;">${typeLabels[userType]}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">Email:</span>
                        <strong style="color: #374151;">${userData.email || 'Não informado'}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6b7280;">Status:</span>
                        <span style="color: #f59e0b; font-weight: bold;">⏳ Aguardando Aprovação</span>
                    </div>
                </div>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="color: #f59e0b; font-size: 1.2rem;">⚠️</span>
                    <strong style="color: #92400e;">Próximos Passos:</strong>
                </div>
                <ul style="color: #92400e; margin: 0; padding-left: 1.5rem;">
                    <li>Seu cadastro será analisado pela nossa equipe</li>
                    <li>Você receberá um email de confirmação em até 24 horas</li>
                    <li>Após aprovação, poderá acessar todas as funcionalidades</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeAllModals(); window.location.href='index.html'" 
                        style="padding: 0.75rem 1.5rem; background: #6B46C1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    🏠 Voltar ao Início
                </button>
                <button onclick="closeAllModals(); showLoginModal('${userType}')" 
                        style="padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    🔑 Fazer Login
                </button>
            </div>
        </div>
    `;
    
    createModal('Cadastro Concluído', content, { maxWidth: '600px' });
}

// Modal de validação de dados
function showValidationModal(errors) {
    const errorList = errors.map(error => `<li style="margin-bottom: 0.5rem;">${error}</li>`).join('');
    
    const content = `
        <div style="padding: 1rem 0;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: #ef4444; margin-bottom: 0.5rem;">Dados Incompletos</h3>
                <p style="color: #6b7280; margin: 0;">Por favor, corrija os seguintes campos:</p>
            </div>
            
            <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
                <ul style="color: #dc2626; margin: 0; padding-left: 1.5rem;">
                    ${errorList}
                </ul>
            </div>
            
            <div style="text-align: center;">
                <button onclick="closeAllModals()" 
                        style="padding: 0.75rem 2rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    OK, Entendi
                </button>
            </div>
        </div>
    `;
    
    createModal('Erro de Validação', content, { maxWidth: '500px' });
}

// Modal de termos e condições
function showTermsModal(onAccept, onDecline) {
    const content = `
        <div style="padding: 1rem 0;">
            <div style="max-height: 400px; overflow-y: auto; background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h4 style="color: #374151; margin-bottom: 1rem;">📋 Termos de Uso e Política de Privacidade</h4>
                
                <h5 style="color: #6B46C1; margin-top: 1.5rem; margin-bottom: 0.5rem;">1. Aceitação dos Termos</h5>
                <p style="color: #6b7280; line-height: 1.6;">
                    Ao se cadastrar na ClaunNetworking, você concorda com todos os termos e condições aqui estabelecidos.
                </p>
                
                <h5 style="color: #6B46C1; margin-top: 1.5rem; margin-bottom: 0.5rem;">2. Uso da Plataforma</h5>
                <p style="color: #6b7280; line-height: 1.6;">
                    A plataforma destina-se exclusivamente para fins profissionais de networking, busca de oportunidades e desenvolvimento de carreira.
                </p>
                
                <h5 style="color: #6B46C1; margin-top: 1.5rem; margin-bottom: 0.5rem;">3. Privacidade dos Dados</h5>
                <p style="color: #6b7280; line-height: 1.6;">
                    Seus dados pessoais são protegidos conforme a LGPD. Utilizamos suas informações apenas para melhorar sua experiência na plataforma.
                </p>
                
                <h5 style="color: #6B46C1; margin-top: 1.5rem; margin-bottom: 0.5rem;">4. Responsabilidades</h5>
                <p style="color: #6b7280; line-height: 1.6;">
                    Você é responsável pela veracidade das informações fornecidas e pelo uso adequado da plataforma.
                </p>
                
                <h5 style="color: #6B46C1; margin-top: 1.5rem; margin-bottom: 0.5rem;">5. Modificações</h5>
                <p style="color: #6b7280; line-height: 1.6;">
                    Reservamo-nos o direito de modificar estes termos a qualquer momento, com notificação prévia aos usuários.
                </p>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="acceptTerms" style="margin-right: 0.5rem;">
                    <label for="acceptTerms" style="color: #92400e; font-weight: bold;">
                        Li e aceito os Termos de Uso e Política de Privacidade
                    </label>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeAllModals(); ${onDecline ? onDecline + '()' : ''}" 
                        style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Cancelar
                </button>
                <button onclick="acceptTerms('${onAccept}')" 
                        style="padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Aceitar e Continuar
                </button>
            </div>
        </div>
    `;
    
    createModal('Termos e Condições', content, { maxWidth: '700px' });
}

// Função para aceitar termos
function acceptTerms(onAcceptFunction) {
    const checkbox = document.getElementById('acceptTerms');
    if (!checkbox.checked) {
        showErrorModal('Erro', 'Você deve aceitar os termos para continuar.');
        return;
    }
    
    closeAllModals();
    if (onAcceptFunction) {
        eval(onAcceptFunction + '()');
    }
}

// Modal de upload de arquivo
function showFileUploadModal(title, acceptedTypes, onUpload) {
    const content = `
        <div style="padding: 1rem 0;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; color: #6B46C1; margin-bottom: 1rem;">📁</div>
                <p style="color: #6b7280; margin: 0;">Selecione o arquivo que deseja enviar</p>
            </div>
            
            <div style="border: 2px dashed #d1d5db; border-radius: 12px; padding: 2rem; text-align: center; margin-bottom: 2rem; background: #f9fafb;">
                <input type="file" id="fileInput" accept="${acceptedTypes}" style="display: none;" onchange="handleFileSelect(this, '${onUpload}')">
                <button onclick="document.getElementById('fileInput').click()" 
                        style="padding: 1rem 2rem; background: #6B46C1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; margin-bottom: 1rem;">
                    📎 Escolher Arquivo
                </button>
                <p style="color: #6b7280; margin: 0; font-size: 0.9rem;">
                    Tipos aceitos: ${acceptedTypes.replace(/\./g, '').toUpperCase()}
                </p>
                <div id="filePreview" style="margin-top: 1rem; display: none;">
                    <p style="color: #10b981; font-weight: bold;">✅ Arquivo selecionado:</p>
                    <p id="fileName" style="color: #374151; margin: 0;"></p>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeAllModals()" 
                        style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Cancelar
                </button>
                <button id="uploadBtn" onclick="processFileUpload('${onUpload}')" disabled
                        style="padding: 0.75rem 1.5rem; background: #d1d5db; color: #9ca3af; border: none; border-radius: 8px; cursor: not-allowed; font-size: 1rem;">
                    Enviar Arquivo
                </button>
            </div>
        </div>
    `;
    
    createModal(title, content, { maxWidth: '500px' });
}

// Função para lidar com seleção de arquivo
function handleFileSelect(input, onUploadFunction) {
    const file = input.files[0];
    if (file) {
        document.getElementById('filePreview').style.display = 'block';
        document.getElementById('fileName').textContent = file.name;
        
        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = false;
        uploadBtn.style.background = '#10b981';
        uploadBtn.style.color = 'white';
        uploadBtn.style.cursor = 'pointer';
    }
}

// Função para processar upload
function processFileUpload(onUploadFunction) {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        showErrorModal('Erro', 'Nenhum arquivo selecionado.');
        return;
    }
    
    showLoadingModal('Enviando arquivo...');
    
    // Simular upload (substituir por lógica real)
    setTimeout(() => {
        hideLoadingModal();
        showSuccessModal('Sucesso', 'Arquivo enviado com sucesso!');
        
        if (onUploadFunction) {
            eval(onUploadFunction + '(file)');
        }
    }, 2000);
}

// Modal de edição de perfil
function showEditProfileModal(currentData, onSave) {
    const content = `
        <div style="padding: 1rem 0;">
            <form id="editProfileForm" style="display: grid; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">Nome:</label>
                    <input type="text" name="name" value="${currentData.name || ''}" required
                           style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">Email:</label>
                    <input type="email" name="email" value="${currentData.email || ''}" required
                           style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">Telefone:</label>
                    <input type="tel" name="phone" value="${currentData.phone || ''}"
                           style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">Sobre:</label>
                    <textarea name="about" rows="4" placeholder="Conte um pouco sobre você..."
                              style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; resize: vertical;">${currentData.about || ''}</textarea>
                </div>
            </form>
            
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                <button onclick="closeAllModals()" 
                        style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Cancelar
                </button>
                <button onclick="saveProfileChanges('${onSave}')" 
                        style="padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Salvar Alterações
                </button>
            </div>
        </div>
    `;
    
    createModal('Editar Perfil', content, { maxWidth: '600px' });
}

// Função para salvar alterações do perfil
function saveProfileChanges(onSaveFunction) {
    const form = document.getElementById('editProfileForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    showLoadingModal('Salvando alterações...');
    
    // Simular salvamento (substituir por lógica real)
    setTimeout(() => {
        hideLoadingModal();
        showSuccessModal('Sucesso', 'Perfil atualizado com sucesso!');
        
        if (onSaveFunction) {
            eval(onSaveFunction + '(data)');
        }
    }, 1500);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Form modals carregado com sucesso!');
});
// Sistema de Verificação de Identidade - ClaunNetworking
class IdentityVerificationSystem {
    constructor() {
        this.verificationLevels = {
            'basic': { name: 'Básico', color: '#6b7280', icon: '📧' },
            'email': { name: 'Email Verificado', color: '#3b82f6', icon: '✉️' },
            'phone': { name: 'Telefone Verificado', color: '#8b5cf6', icon: '📱' },
            'document': { name: 'Documento Verificado', color: '#10b981', icon: '🆔' },
            'professional': { name: 'Profissional Verificado', color: '#f59e0b', icon: '💼' },
            'premium': { name: 'Verificação Premium', color: '#ef4444', icon: '⭐' }
        };
        
        this.verificationSteps = [
            { id: 'email', name: 'Verificar Email', required: true },
            { id: 'phone', name: 'Verificar Telefone', required: false },
            { id: 'document', name: 'Enviar Documento', required: false },
            { id: 'professional', name: 'Verificação Profissional', required: false },
            { id: 'social', name: 'Redes Sociais', required: false }
        ];
    }

    // Cria modal de verificação
    createVerificationModal() {
        const modalHTML = `
            <div id="verification-modal" class="verification-modal" style="display: none;">
                <div class="modal-overlay" onclick="this.parentElement.style.display='none'"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🔒 Verificação de Identidade</h2>
                        <button class="close-btn" onclick="document.getElementById('verification-modal').style.display='none'">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="verification-intro">
                            <p>Aumente sua credibilidade na plataforma verificando sua identidade. Perfis verificados recebem mais visualizações e oportunidades.</p>
                        </div>
                        <div class="verification-steps">
                            ${this.verificationSteps.map(step => `
                                <div class="verification-step" data-step="${step.id}">
                                    <div class="step-icon">
                                        <span class="step-status" id="status-${step.id}">⏳</span>
                                    </div>
                                    <div class="step-content">
                                        <h4>${step.name}</h4>
                                        <p class="step-description" id="desc-${step.id}">Clique para iniciar</p>
                                        ${step.required ? '<span class="required-badge">Obrigatório</span>' : ''}
                                    </div>
                                    <button class="step-action" onclick="verificationSystem.startVerification('${step.id}')">
                                        Verificar
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="verification-benefits">
                            <h3>Benefícios da Verificação</h3>
                            <div class="benefits-grid">
                                <div class="benefit-item">
                                    <span class="benefit-icon">👁️</span>
                                    <span>+70% mais visualizações</span>
                                </div>
                                <div class="benefit-item">
                                    <span class="benefit-icon">🎯</span>
                                    <span>Prioridade em buscas</span>
                                </div>
                                <div class="benefit-item">
                                    <span class="benefit-icon">🛡️</span>
                                    <span>Selo de confiança</span>
                                </div>
                                <div class="benefit-item">
                                    <span class="benefit-icon">💼</span>
                                    <span>Acesso a vagas premium</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove modal existente se houver
        const existingModal = document.getElementById('verification-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Adiciona novo modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Inicia processo de verificação
    startVerification(stepId) {
        switch(stepId) {
            case 'email':
                this.verifyEmail();
                break;
            case 'phone':
                this.verifyPhone();
                break;
            case 'document':
                this.verifyDocument();
                break;
            case 'professional':
                this.verifyProfessional();
                break;
            case 'social':
                this.verifySocial();
                break;
        }
    }

    // Verificação de email
    verifyEmail() {
        const email = prompt('Digite seu email para verificação:');
        if (email && this.isValidEmail(email)) {
            this.updateStepStatus('email', 'loading', 'Enviando código de verificação...');
            
            // Simula envio de email
            setTimeout(() => {
                const code = prompt('Digite o código de 6 dígitos enviado para seu email:');
                if (code && code.length === 6) {
                    this.updateStepStatus('email', 'success', 'Email verificado com sucesso!');
                    this.saveVerificationStatus('email', true);
                } else {
                    this.updateStepStatus('email', 'error', 'Código inválido. Tente novamente.');
                }
            }, 2000);
        } else {
            alert('Email inválido!');
        }
    }

    // Verificação de telefone
    verifyPhone() {
        const phone = prompt('Digite seu telefone (com DDD):');
        if (phone && this.isValidPhone(phone)) {
            this.updateStepStatus('phone', 'loading', 'Enviando SMS...');
            
            setTimeout(() => {
                const code = prompt('Digite o código de 4 dígitos enviado por SMS:');
                if (code && code.length === 4) {
                    this.updateStepStatus('phone', 'success', 'Telefone verificado com sucesso!');
                    this.saveVerificationStatus('phone', true);
                } else {
                    this.updateStepStatus('phone', 'error', 'Código inválido. Tente novamente.');
                }
            }, 2000);
        } else {
            alert('Telefone inválido!');
        }
    }

    // Verificação de documento
    verifyDocument() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.updateStepStatus('document', 'loading', 'Analisando documento...');
                
                // Simula análise de documento
                setTimeout(() => {
                    this.updateStepStatus('document', 'success', 'Documento verificado com sucesso!');
                    this.saveVerificationStatus('document', true);
                }, 3000);
            }
        };
        input.click();
    }

    // Verificação profissional
    verifyProfessional() {
        const linkedin = prompt('Digite o link do seu perfil LinkedIn:');
        if (linkedin && linkedin.includes('linkedin.com')) {
            this.updateStepStatus('professional', 'loading', 'Verificando perfil profissional...');
            
            setTimeout(() => {
                this.updateStepStatus('professional', 'success', 'Perfil profissional verificado!');
                this.saveVerificationStatus('professional', true);
            }, 2500);
        } else {
            alert('Link do LinkedIn inválido!');
        }
    }

    // Verificação de redes sociais
    verifySocial() {
        const social = prompt('Digite o link de uma rede social (Instagram, Twitter, etc.):');
        if (social && (social.includes('instagram.com') || social.includes('twitter.com'))) {
            this.updateStepStatus('social', 'loading', 'Verificando rede social...');
            
            setTimeout(() => {
                this.updateStepStatus('social', 'success', 'Rede social verificada!');
                this.saveVerificationStatus('social', true);
            }, 2000);
        } else {
            alert('Link de rede social inválido!');
        }
    }

    // Atualiza status do step
    updateStepStatus(stepId, status, message) {
        const statusElement = document.getElementById(`status-${stepId}`);
        const descElement = document.getElementById(`desc-${stepId}`);
        
        if (statusElement && descElement) {
            switch(status) {
                case 'loading':
                    statusElement.textContent = '⏳';
                    statusElement.className = 'step-status loading';
                    break;
                case 'success':
                    statusElement.textContent = '✅';
                    statusElement.className = 'step-status success';
                    break;
                case 'error':
                    statusElement.textContent = '❌';
                    statusElement.className = 'step-status error';
                    break;
            }
            descElement.textContent = message;
        }
    }

    // Salva status de verificação
    saveVerificationStatus(type, verified) {
        let verifications = JSON.parse(localStorage.getItem('userVerifications') || '{}');
        verifications[type] = {
            verified: verified,
            date: new Date().toISOString()
        };
        localStorage.setItem('userVerifications', JSON.stringify(verifications));
        
        // Atualiza badge no perfil
        this.updateProfileBadge();
    }

    // Obtém nível de verificação do usuário
    getUserVerificationLevel() {
        const verifications = JSON.parse(localStorage.getItem('userVerifications') || '{}');
        const verifiedCount = Object.values(verifications).filter(v => v.verified).length;
        
        if (verifiedCount >= 4) return 'premium';
        if (verifications.professional?.verified) return 'professional';
        if (verifications.document?.verified) return 'document';
        if (verifications.phone?.verified) return 'phone';
        if (verifications.email?.verified) return 'email';
        return 'basic';
    }

    // Cria badge de verificação
    createVerificationBadge(level = null) {
        const userLevel = level || this.getUserVerificationLevel();
        const levelData = this.verificationLevels[userLevel];
        
        return `
            <div class="verification-badge ${userLevel}" style="background-color: ${levelData.color}">
                <span class="badge-icon">${levelData.icon}</span>
                <span class="badge-text">${levelData.name}</span>
            </div>
        `;
    }

    // Atualiza badge no perfil
    updateProfileBadge() {
        const badgeContainers = document.querySelectorAll('.verification-badge-container');
        const level = this.getUserVerificationLevel();
        
        badgeContainers.forEach(container => {
            container.innerHTML = this.createVerificationBadge(level);
        });
    }

    // Validações
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone) || /^\d{10,11}$/.test(phone.replace(/\D/g, ''));
    }

    // Inicializa sistema
    init() {
        this.createVerificationModal();
        this.updateProfileBadge();
    }
}

// CSS para sistema de verificação
const verificationCSS = `
.verification-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 16px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
    margin: 0;
    color: #1f2937;
    font-size: 24px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.close-btn:hover {
    background-color: #f3f4f6;
}

.modal-body {
    padding: 24px;
}

.verification-intro {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
}

.verification-intro p {
    margin: 0;
    color: #0c4a6e;
}

.verification-steps {
    margin-bottom: 32px;
}

.verification-step {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
}

.verification-step:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
}

.step-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.step-status.loading {
    animation: spin 1s linear infinite;
}

.step-status.success {
    color: #10b981;
}

.step-status.error {
    color: #ef4444;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.step-content {
    flex: 1;
}

.step-content h4 {
    margin: 0 0 4px 0;
    color: #1f2937;
    font-size: 16px;
}

.step-description {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
}

.required-badge {
    background: #ef4444;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-left: 8px;
}

.step-action {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.step-action:hover {
    background: #7c3aed;
}

.verification-benefits {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
}

.verification-benefits h3 {
    margin: 0 0 16px 0;
    color: #1f2937;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.benefit-item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.benefit-icon {
    font-size: 20px;
}

.verification-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 16px;
    color: white;
    font-weight: 600;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.verification-badge .badge-icon {
    font-size: 14px;
}

.verification-trigger {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: background-color 0.2s;
}

.verification-trigger:hover {
    background: #7c3aed;
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 20px;
    }
    
    .verification-step {
        flex-direction: column;
        text-align: center;
    }
    
    .benefits-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('verification-styles')) {
    const style = document.createElement('style');
    style.id = 'verification-styles';
    style.textContent = verificationCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.verificationSystem = new IdentityVerificationSystem();
// Sistema de Chat Interno - ClaunNetworking
class InternalChatSystem {
    constructor() {
        this.conversations = JSON.parse(localStorage.getItem('chatConversations') || '{}');
        this.currentConversation = null;
        this.currentUser = this.getCurrentUser();
        this.messageTemplates = this.initializeTemplates();
        this.isOpen = false;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || '{"id": "user1", "name": "Usuário Atual", "type": "candidate"}');
    }

    initializeTemplates() {
        return {
            'candidate_to_company': [
                'Olá! Tenho interesse na vaga de {position}. Gostaria de saber mais detalhes sobre a oportunidade.',
                'Bom dia! Vi que vocês estão contratando para {position}. Meu perfil se encaixa perfeitamente na vaga.',
                'Olá! Gostaria de me candidatar à vaga de {position}. Quando podemos conversar?'
            ],
            'company_to_candidate': [
                'Olá {name}! Seu perfil chamou nossa atenção. Gostaria de agendar uma conversa?',
                'Oi {name}! Temos uma oportunidade que pode interessar você. Vamos conversar?',
                'Olá! Gostaríamos de conhecer melhor seu trabalho. Tem disponibilidade para uma call?'
            ],
            'institution_to_candidate': [
                'Olá {name}! Temos cursos que podem acelerar sua carreira. Gostaria de saber mais?',
                'Oi! Nossos cursos de {area} estão com inscrições abertas. Interesse?',
                'Olá! Que tal investir em sua capacitação? Temos ótimas opções para você.'
            ]
        };
    }

    // Cria interface do chat
    createChatInterface() {
        const chatHTML = `
            <div id="chat-system" class="chat-system">
                <!-- Chat Toggle Button -->
                <button id="chat-toggle" class="chat-toggle" onclick="chatSystem.toggleChat()">
                    <span class="chat-icon">💬</span>
                    <span class="chat-badge" id="chat-badge" style="display: none;">0</span>
                </button>

                <!-- Chat Window -->
                <div id="chat-window" class="chat-window" style="display: none;">
                    <div class="chat-header">
                        <h3>💬 Mensagens</h3>
                        <div class="chat-actions">
                            <button class="chat-action-btn" onclick="chatSystem.showTemplates()" title="Templates">
                                📝
                            </button>
                            <button class="chat-action-btn" onclick="chatSystem.toggleChat()" title="Fechar">
                                ×
                            </button>
                        </div>
                    </div>

                    <div class="chat-body">
                        <!-- Conversations List -->
                        <div id="conversations-list" class="conversations-list">
                            <div class="conversations-header">
                                <h4>Conversas</h4>
                                <button class="new-chat-btn" onclick="chatSystem.showNewChatModal()">
                                    + Nova Conversa
                                </button>
                            </div>
                            <div id="conversations-container" class="conversations-container">
                                <!-- Conversations will be loaded here -->
                            </div>
                        </div>

                        <!-- Chat Messages -->
                        <div id="chat-messages" class="chat-messages" style="display: none;">
                            <div class="messages-header">
                                <button class="back-btn" onclick="chatSystem.showConversationsList()">
                                    ← Voltar
                                </button>
                                <div class="conversation-info">
                                    <span id="conversation-name">Nome da Conversa</span>
                                    <span id="conversation-status" class="status-online">Online</span>
                                </div>
                                <button class="schedule-btn" onclick="chatSystem.showScheduleModal()" title="Agendar Reunião">
                                    📅
                                </button>
                            </div>
                            <div id="messages-container" class="messages-container">
                                <!-- Messages will be loaded here -->
                            </div>
                            <div class="message-input-container">
                                <input type="text" id="message-input" placeholder="Digite sua mensagem..." 
                                       onkeypress="chatSystem.handleKeyPress(event)">
                                <button onclick="chatSystem.sendMessage()">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- New Chat Modal -->
                <div id="new-chat-modal" class="chat-modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Nova Conversa</h3>
                            <button onclick="chatSystem.closeModal('new-chat-modal')">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="contact-search">
                                <input type="text" id="contact-search" placeholder="Buscar contatos...">
                                <div id="contact-results" class="contact-results">
                                    <!-- Search results will appear here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Templates Modal -->
                <div id="templates-modal" class="chat-modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Templates de Mensagem</h3>
                            <button onclick="chatSystem.closeModal('templates-modal')">×</button>
                        </div>
                        <div class="modal-body">
                            <div id="templates-container" class="templates-container">
                                <!-- Templates will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Schedule Modal -->
                <div id="schedule-modal" class="chat-modal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>📅 Agendar Reunião</h3>
                            <button onclick="chatSystem.closeModal('schedule-modal')">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="schedule-form">
                                <div class="form-group">
                                    <label>Título da Reunião:</label>
                                    <input type="text" id="meeting-title" placeholder="Ex: Entrevista para vaga de Desenvolvedor">
                                </div>
                                <div class="form-group">
                                    <label>Data:</label>
                                    <input type="date" id="meeting-date">
                                </div>
                                <div class="form-group">
                                    <label>Horário:</label>
                                    <input type="time" id="meeting-time">
                                </div>
                                <div class="form-group">
                                    <label>Duração:</label>
                                    <select id="meeting-duration">
                                        <option value="30">30 minutos</option>
                                        <option value="60">1 hora</option>
                                        <option value="90">1h 30min</option>
                                        <option value="120">2 horas</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Tipo:</label>
                                    <select id="meeting-type">
                                        <option value="video">Videochamada</option>
                                        <option value="phone">Telefone</option>
                                        <option value="presential">Presencial</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Observações:</label>
                                    <textarea id="meeting-notes" placeholder="Informações adicionais sobre a reunião..."></textarea>
                                </div>
                                <button class="schedule-confirm-btn" onclick="chatSystem.scheduleMeeting()">
                                    Agendar Reunião
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove chat existente se houver
        const existingChat = document.getElementById('chat-system');
        if (existingChat) {
            existingChat.remove();
        }

        // Adiciona novo chat
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        
        // Carrega conversas
        this.loadConversations();
        this.updateUnreadBadge();
    }

    // Toggle do chat
    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatToggle = document.getElementById('chat-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.style.display = 'block';
            chatToggle.classList.add('active');
            this.loadConversations();
        } else {
            chatWindow.style.display = 'none';
            chatToggle.classList.remove('active');
        }
    }

    // Carrega lista de conversas
    loadConversations() {
        const container = document.getElementById('conversations-container');
        if (!container) return;

        const conversations = Object.values(this.conversations);
        
        if (conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-conversations">
                    <p>Nenhuma conversa ainda</p>
                    <button onclick="chatSystem.showNewChatModal()">Iniciar primeira conversa</button>
                </div>
            `;
            return;
        }

        container.innerHTML = conversations.map(conv => `
            <div class="conversation-item" onclick="chatSystem.openConversation('${conv.id}')">
                <div class="conversation-avatar">
                    ${conv.participant.avatar || conv.participant.name.charAt(0)}
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">${conv.participant.name}</div>
                    <div class="conversation-last-message">${conv.lastMessage?.text || 'Sem mensagens'}</div>
                </div>
                <div class="conversation-meta">
                    <div class="conversation-time">${this.formatTime(conv.lastMessage?.timestamp)}</div>
                    ${conv.unreadCount > 0 ? `<div class="unread-count">${conv.unreadCount}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Abre conversa específica
    openConversation(conversationId) {
        this.currentConversation = conversationId;
        const conversation = this.conversations[conversationId];
        
        if (!conversation) return;

        // Mostra área de mensagens
        document.getElementById('conversations-list').style.display = 'none';
        document.getElementById('chat-messages').style.display = 'block';
        
        // Atualiza header da conversa
        document.getElementById('conversation-name').textContent = conversation.participant.name;
        document.getElementById('conversation-status').textContent = 'Online';
        
        // Carrega mensagens
        this.loadMessages(conversationId);
        
        // Marca como lida
        conversation.unreadCount = 0;
        this.saveConversations();
        this.updateUnreadBadge();
    }

    // Carrega mensagens da conversa
    loadMessages(conversationId) {
        const container = document.getElementById('messages-container');
        const conversation = this.conversations[conversationId];
        
        if (!conversation || !container) return;

        container.innerHTML = conversation.messages.map(msg => `
            <div class="message ${msg.sender === this.currentUser.id ? 'sent' : 'received'}">
                <div class="message-content">${msg.text}</div>
                <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                ${msg.type === 'meeting' ? `
                    <div class="meeting-info">
                        📅 Reunião agendada: ${msg.meetingData.title}
                        <br>📍 ${msg.meetingData.date} às ${msg.meetingData.time}
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Scroll para última mensagem
        container.scrollTop = container.scrollHeight;
    }

    // Envia mensagem
    sendMessage() {
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        
        if (!text || !this.currentConversation) return;

        const message = {
            id: Date.now().toString(),
            text: text,
            sender: this.currentUser.id,
            timestamp: new Date().toISOString(),
            type: 'text'
        };

        // Adiciona mensagem à conversa
        this.conversations[this.currentConversation].messages.push(message);
        this.conversations[this.currentConversation].lastMessage = message;
        
        // Simula resposta automática (para demonstração)
        setTimeout(() => {
            const autoReply = {
                id: (Date.now() + 1).toString(),
                text: 'Obrigado pela mensagem! Vou analisar e retorno em breve.',
                sender: this.conversations[this.currentConversation].participant.id,
                timestamp: new Date().toISOString(),
                type: 'text'
            };
            
            this.conversations[this.currentConversation].messages.push(autoReply);
            this.conversations[this.currentConversation].lastMessage = autoReply;
            this.conversations[this.currentConversation].unreadCount++;
            
            this.saveConversations();
            this.loadMessages(this.currentConversation);
            this.updateUnreadBadge();
        }, 2000);

        this.saveConversations();
        this.loadMessages(this.currentConversation);
        input.value = '';
    }

    // Handle key press
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    // Mostra modal de nova conversa
    showNewChatModal() {
        document.getElementById('new-chat-modal').style.display = 'flex';
        this.loadContacts();
    }

    // Carrega contatos disponíveis
    loadContacts() {
        const container = document.getElementById('contact-results');
        
        // Dados simulados de contatos
        const contacts = [
            { id: 'company1', name: 'TechCorp Brasil', type: 'company', avatar: '🏢' },
            { id: 'company2', name: 'Innovate Solutions', type: 'company', avatar: '🏢' },
            { id: 'candidate1', name: 'Ana Silva', type: 'candidate', avatar: '👩' },
            { id: 'candidate2', name: 'Carlos Santos', type: 'candidate', avatar: '👨' },
            { id: 'institution1', name: 'TechAcademy', type: 'institution', avatar: '🎓' }
        ];

        container.innerHTML = contacts.map(contact => `
            <div class="contact-item" onclick="chatSystem.startConversation('${contact.id}', '${contact.name}', '${contact.type}')">
                <div class="contact-avatar">${contact.avatar}</div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-type">${this.getTypeLabel(contact.type)}</div>
                </div>
            </div>
        `).join('');
    }

    // Inicia nova conversa
    startConversation(participantId, participantName, participantType) {
        const conversationId = `conv_${Date.now()}`;
        
        this.conversations[conversationId] = {
            id: conversationId,
            participant: {
                id: participantId,
                name: participantName,
                type: participantType
            },
            messages: [],
            lastMessage: null,
            unreadCount: 0,
            createdAt: new Date().toISOString()
        };

        this.saveConversations();
        this.closeModal('new-chat-modal');
        this.loadConversations();
        this.openConversation(conversationId);
    }

    // Mostra templates
    showTemplates() {
        const modal = document.getElementById('templates-modal');
        const container = document.getElementById('templates-container');
        
        const userType = this.currentUser.type;
        const templates = this.messageTemplates[`${userType}_to_company`] || 
                         this.messageTemplates[`${userType}_to_candidate`] || 
                         this.messageTemplates[`${userType}_to_institution`] || [];

        container.innerHTML = templates.map((template, index) => `
            <div class="template-item" onclick="chatSystem.useTemplate('${template}')">
                <div class="template-text">${template}</div>
            </div>
        `).join('');

        modal.style.display = 'flex';
    }

    // Usa template
    useTemplate(template) {
        const input = document.getElementById('message-input');
        if (input) {
            input.value = template.replace('{name}', 'Nome').replace('{position}', 'Posição').replace('{area}', 'Área');
            input.focus();
        }
        this.closeModal('templates-modal');
    }

    // Mostra modal de agendamento
    showScheduleModal() {
        document.getElementById('schedule-modal').style.display = 'flex';
        
        // Define data mínima como hoje
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('meeting-date').min = today;
    }

    // Agenda reunião
    scheduleMeeting() {
        const title = document.getElementById('meeting-title').value;
        const date = document.getElementById('meeting-date').value;
        const time = document.getElementById('meeting-time').value;
        const duration = document.getElementById('meeting-duration').value;
        const type = document.getElementById('meeting-type').value;
        const notes = document.getElementById('meeting-notes').value;

        if (!title || !date || !time) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        const meetingMessage = {
            id: Date.now().toString(),
            text: `📅 Reunião agendada: ${title}`,
            sender: this.currentUser.id,
            timestamp: new Date().toISOString(),
            type: 'meeting',
            meetingData: { title, date, time, duration, type, notes }
        };

        this.conversations[this.currentConversation].messages.push(meetingMessage);
        this.conversations[this.currentConversation].lastMessage = meetingMessage;
        
        this.saveConversations();
        this.loadMessages(this.currentConversation);
        this.closeModal('schedule-modal');
        
        // Limpa formulário
        document.getElementById('meeting-title').value = '';
        document.getElementById('meeting-date').value = '';
        document.getElementById('meeting-time').value = '';
        document.getElementById('meeting-notes').value = '';
    }

    // Volta para lista de conversas
    showConversationsList() {
        document.getElementById('chat-messages').style.display = 'none';
        document.getElementById('conversations-list').style.display = 'block';
        this.currentConversation = null;
    }

    // Fecha modal
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Atualiza badge de não lidas
    updateUnreadBadge() {
        const badge = document.getElementById('chat-badge');
        const totalUnread = Object.values(this.conversations)
            .reduce((total, conv) => total + (conv.unreadCount || 0), 0);
        
        if (totalUnread > 0) {
            badge.textContent = totalUnread;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    // Salva conversas
    saveConversations() {
        localStorage.setItem('chatConversations', JSON.stringify(this.conversations));
    }

    // Utilitários
    formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Ontem';
        } else if (diffDays < 7) {
            return `${diffDays} dias`;
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    }

    getTypeLabel(type) {
        const labels = {
            'company': 'Empresa',
            'candidate': 'Candidato',
            'institution': 'Instituição'
        };
        return labels[type] || type;
    }

    // Inicializa sistema
    init() {
        this.createChatInterface();
        
        // Adiciona conversas de exemplo se não houver nenhuma
        if (Object.keys(this.conversations).length === 0) {
            this.addSampleConversations();
        }
    }

    // Adiciona conversas de exemplo
    addSampleConversations() {
        const sampleConversations = {
            'conv_1': {
                id: 'conv_1',
                participant: { id: 'company1', name: 'TechCorp Brasil', type: 'company' },
                messages: [
                    {
                        id: '1',
                        text: 'Olá! Seu perfil chamou nossa atenção para a vaga de Desenvolvedor Frontend.',
                        sender: 'company1',
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        type: 'text'
                    }
                ],
                lastMessage: {
                    text: 'Olá! Seu perfil chamou nossa atenção para a vaga de Desenvolvedor Frontend.',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                unreadCount: 1,
                createdAt: new Date(Date.now() - 3600000).toISOString()
            }
        };
        
        this.conversations = sampleConversations;
        this.saveConversations();
    }
}

// CSS para sistema de chat
const chatCSS = `
.chat-system {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0,0,0,0.2);
}

.chat-toggle.active {
    background: #ef4444;
}

.chat-icon {
    font-size: 24px;
}

.chat-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.chat-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 400px;
    height: 600px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h3 {
    margin: 0;
    font-size: 18px;
}

.chat-actions {
    display: flex;
    gap: 8px;
}

.chat-action-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.chat-action-btn:hover {
    background: rgba(255,255,255,0.3);
}

.chat-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.conversations-list {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.conversations-header {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.conversations-header h4 {
    margin: 0;
    color: #1f2937;
}

.new-chat-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
}

.conversations-container {
    flex: 1;
    overflow-y: auto;
}

.conversation-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background-color 0.2s;
}

.conversation-item:hover {
    background: #f9fafb;
}

.conversation-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #8b5cf6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
}

.conversation-info {
    flex: 1;
}

.conversation-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
}

.conversation-last-message {
    color: #6b7280;
    font-size: 12px;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.conversation-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.conversation-time {
    color: #9ca3af;
    font-size: 11px;
}

.unread-count {
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
}

.chat-messages {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.messages-header {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
}

.conversation-info {
    flex: 1;
}

.conversation-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 14px;
}

.status-online {
    color: #10b981;
    font-size: 12px;
}

.schedule-btn {
    background: #f59e0b;
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message {
    max-width: 80%;
    display: flex;
    flex-direction: column;
}

.message.sent {
    align-self: flex-end;
    align-items: flex-end;
}

.message.received {
    align-self: flex-start;
    align-items: flex-start;
}

.message-content {
    background: #f3f4f6;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.4;
}

.message.sent .message-content {
    background: #8b5cf6;
    color: white;
}

.message-time {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 4px;
}

.meeting-info {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 8px;
    margin-top: 4px;
    font-size: 12px;
    color: #92400e;
}

.message-input-container {
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
}

.message-input-container input {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    outline: none;
}

.message-input-container input:focus {
    border-color: #8b5cf6;
}

.message-input-container button {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.chat-modal {
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
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    padding: 20px;
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
    padding: 20px;
}

.contact-search input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    margin-bottom: 16px;
}

.contact-results {
    max-height: 300px;
    overflow-y: auto;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.contact-item:hover {
    background: #f9fafb;
}

.contact-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #8b5cf6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.contact-info {
    flex: 1;
}

.contact-name {
    font-weight: 600;
    color: #1f2937;
}

.contact-type {
    color: #6b7280;
    font-size: 12px;
}

.templates-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.template-item {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.template-item:hover {
    background: #f3f4f6;
    border-color: #8b5cf6;
}

.template-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.4;
}

.schedule-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
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
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #8b5cf6;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.schedule-confirm-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    margin-top: 8px;
}

.empty-conversations {
    padding: 40px 20px;
    text-align: center;
    color: #6b7280;
}

.empty-conversations button {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 12px;
}

@media (max-width: 768px) {
    .chat-window {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0;
    }
    
    .chat-toggle {
        bottom: 20px;
        right: 20px;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('chat-styles')) {
    const style = document.createElement('style');
    style.id = 'chat-styles';
    style.textContent = chatCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.chatSystem = new InternalChatSystem();
// Sistema de engajamento para vagas

class JobEngagement {
    constructor() {
        this.engagementData = this.loadEngagementData();
        this.init();
    }

    init() {
        // Adicionar listeners para botões de engajamento
        this.addEngagementListeners();
    }

    loadEngagementData() {
        // Carregar dados de engajamento do localStorage
        const saved = localStorage.getItem('claunnetworkingworkingworking_job_engagement');
        return saved ? JSON.parse(saved) : {};
    }

    saveEngagementData() {
        localStorage.setItem('claunnetworkingworkingworking_job_engagement', JSON.stringify(this.engagementData));
    }

    addEngagementListeners() {
        // Adicionar listeners quando os cards são renderizados
        document.addEventListener('click', (e) => {
            if (e.target.closest('.engagement-item')) {
                const engagementItem = e.target.closest('.engagement-item');
                const jobCard = engagementItem.closest('.job-card');
                const jobId = this.getJobIdFromCard(jobCard);
                const engagementType = this.getEngagementType(engagementItem);

                if (jobId && engagementType) {
                    this.handleEngagement(jobId, engagementType, engagementItem);
                }
            }
        });
    }

    getJobIdFromCard(jobCard) {
        // Extrair ID da vaga do botão "Ver Detalhes"
        const detailsButton = jobCard.querySelector('.btn-details');
        if (detailsButton && detailsButton.onclick) {
            const onclickStr = detailsButton.getAttribute('onclick');
            const match = onclickStr.match(/viewJobDetails\((\d+)\)/);
            return match ? parseInt(match[1]) : null;
        }
        return null;
    }

    getEngagementType(engagementItem) {
        const icon = engagementItem.querySelector('span:first-child').textContent;
        switch (icon) {
            case '❤️': return 'likes';
            case '👁️': return 'views';
            case '🔗': return 'shares';
            default: return null;
        }
    }

    handleEngagement(jobId, type, element) {
        if (!this.engagementData[jobId]) {
            this.engagementData[jobId] = {
                likes: false,
                views: false,
                shares: false
            };
        }

        switch (type) {
            case 'likes':
                this.toggleLike(jobId, element);
                break;
            case 'views':
                this.incrementViews(jobId, element);
                break;
            case 'shares':
                this.incrementShares(jobId, element);
                break;
        }

        this.saveEngagementData();
    }

    toggleLike(jobId, element) {
        const isLiked = this.engagementData[jobId].likes;
        this.engagementData[jobId].likes = !isLiked;

        // Atualizar visual
        const icon = element.querySelector('span:first-child');
        const counter = element.querySelector('span:last-child');
        
        if (!isLiked) {
            icon.textContent = '💖';
            element.style.color = '#ef4444';
            this.animateEngagement(element, '+1');
        } else {
            icon.textContent = '❤️';
            element.style.color = '';
        }

        // Atualizar contador global
        this.updateGlobalCounter(jobId, 'likes', !isLiked ? 1 : -1);
    }

    incrementViews(jobId, element) {
        // Views são incrementadas automaticamente ao visualizar detalhes
        // Aqui apenas mostramos feedback visual
        this.animateEngagement(element, '+1 view');
        this.updateGlobalCounter(jobId, 'views', 1);
    }

    incrementShares(jobId, element) {
        // Shares são incrementadas ao compartilhar
        this.animateEngagement(element, '+1 share');
        this.updateGlobalCounter(jobId, 'shares', 1);
    }

    updateGlobalCounter(jobId, type, increment) {
        // Atualizar contador global da vaga
        const jobData = window.jobsData || [];
        const job = jobData.find(j => j.id === jobId);
        if (job && job.engagement) {
            job.engagement[type] += increment;
            
            // Atualizar display se a vaga estiver visível
            this.updateDisplayCounter(jobId, type, job.engagement[type]);
        }
    }

    updateDisplayCounter(jobId, type, newValue) {
        // Encontrar e atualizar o contador na interface
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const cardJobId = this.getJobIdFromCard(card);
            if (cardJobId === jobId) {
                const engagementItems = card.querySelectorAll('.engagement-item');
                engagementItems.forEach(item => {
                    const itemType = this.getEngagementType(item);
                    if (itemType === type) {
                        const counter = item.querySelector('span:last-child');
                        if (type === 'views') {
                            counter.textContent = `${newValue} visualizações`;
                        } else {
                            counter.textContent = newValue.toString();
                        }
                    }
                });
            }
        });
    }

    animateEngagement(element, text) {
        // Criar animação de feedback
        const feedback = document.createElement('div');
        feedback.textContent = text;
        feedback.style.cssText = `
            position: absolute;
            background: #10B981;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            z-index: 1000;
            pointer-events: none;
            animation: engagementFeedback 1.5s ease-out forwards;
        `;

        // Adicionar CSS da animação se não existir
        if (!document.querySelector('#engagement-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'engagement-animation-styles';
            style.textContent = `
                @keyframes engagementFeedback {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translateY(-10px) scale(1.1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.9);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Posicionar feedback
        const rect = element.getBoundingClientRect();
        feedback.style.left = rect.left + 'px';
        feedback.style.top = (rect.top - 30) + 'px';
        feedback.style.position = 'fixed';

        document.body.appendChild(feedback);

        // Remover após animação
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1500);
    }

    // Método para incrementar views ao visualizar detalhes
    incrementViewsOnDetails(jobId) {
        if (!this.engagementData[jobId]) {
            this.engagementData[jobId] = {
                likes: false,
                views: false,
                shares: false
            };
        }

        this.updateGlobalCounter(jobId, 'views', 1);
        this.saveEngagementData();
    }

    // Método para incrementar shares ao compartilhar
    incrementSharesOnShare(jobId) {
        if (!this.engagementData[jobId]) {
            this.engagementData[jobId] = {
                likes: false,
                views: false,
                shares: false
            };
        }

        this.updateGlobalCounter(jobId, 'shares', 1);
        this.saveEngagementData();
    }

    // Método para restaurar estado dos likes
    restoreLikeStates() {
        Object.keys(this.engagementData).forEach(jobId => {
            const jobIdNum = parseInt(jobId);
            const isLiked = this.engagementData[jobId].likes;
            
            if (isLiked) {
                const jobCards = document.querySelectorAll('.job-card');
                jobCards.forEach(card => {
                    const cardJobId = this.getJobIdFromCard(card);
                    if (cardJobId === jobIdNum) {
                        const likeElement = card.querySelector('.engagement-item');
                        if (likeElement) {
                            const icon = likeElement.querySelector('span:first-child');
                            if (icon && icon.textContent === '❤️') {
                                icon.textContent = '💖';
                                likeElement.style.color = '#ef4444';
                            }
                        }
                    }
                });
            }
        });
    }
}

// Inicializar sistema de engajamento
let jobEngagement;

document.addEventListener('DOMContentLoaded', function() {
    jobEngagement = new JobEngagement();
    
    // Restaurar estados após renderização inicial
    setTimeout(() => {
        jobEngagement.restoreLikeStates();
    }, 100);
});

// Sobrescrever funções globais para incluir engajamento
const originalViewJobDetails = window.viewJobDetails;
window.viewJobDetails = function(jobId) {
    if (jobEngagement) {
        jobEngagement.incrementViewsOnDetails(jobId);
    }
    if (originalViewJobDetails) {
        originalViewJobDetails(jobId);
    }
};

const originalShareJob = window.shareJob;
window.shareJob = function(jobId) {
    if (jobEngagement) {
        jobEngagement.incrementSharesOnShare(jobId);
    }
    if (originalShareJob) {
        originalShareJob(jobId);
    }
};

// Exportar para uso global
window.JobEngagement = JobEngagement;
// Sistema de Otimização Mobile - ClaunNetworking
class MobileOptimizationSystem {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchSupport = 'ontouchstart' in window;
        this.orientation = this.getOrientation();
        this.init();
    }

    // Detecta dispositivos móveis
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    // Detecta tablets
    detectTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && 
               window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    // Obtém orientação do dispositivo
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    // Inicializa otimizações mobile
    init() {
        this.addMobileClasses();
        this.optimizeViewport();
        this.optimizeForms();
        this.optimizeNavigation();
        this.optimizeModals();
        this.optimizeCards();
        this.optimizeButtons();
        this.addTouchGestures();
        this.optimizeImages();
        this.addOrientationHandler();
        this.optimizePerformance();
    }

    // Adiciona classes CSS baseadas no dispositivo
    addMobileClasses() {
        const body = document.body;
        
        if (this.isMobile) {
            body.classList.add('mobile-device');
        }
        
        if (this.isTablet) {
            body.classList.add('tablet-device');
        }
        
        if (this.touchSupport) {
            body.classList.add('touch-device');
        }
        
        body.classList.add(`orientation-${this.orientation}`);
    }

    // Otimiza viewport
    optimizeViewport() {
        // Adiciona meta viewport se não existir
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }

        // Previne zoom em inputs no iOS
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }
    }

    // Otimiza formulários para mobile
    optimizeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Adiciona classe mobile
            if (this.isMobile) {
                form.classList.add('mobile-form');
            }

            // Otimiza inputs
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                this.optimizeInput(input);
            });

            // Adiciona botão de scroll para próximo campo
            if (this.isMobile) {
                this.addFieldNavigation(form);
            }
        });
    }

    // Otimiza input individual
    optimizeInput(input) {
        // Adiciona atributos mobile-friendly
        if (input.type === 'email') {
            input.setAttribute('inputmode', 'email');
        } else if (input.type === 'tel') {
            input.setAttribute('inputmode', 'tel');
        } else if (input.type === 'number') {
            input.setAttribute('inputmode', 'numeric');
        }

        // Adiciona autocomplete apropriado
        if (input.name.includes('name')) {
            input.setAttribute('autocomplete', 'name');
        } else if (input.name.includes('email')) {
            input.setAttribute('autocomplete', 'email');
        } else if (input.name.includes('phone') || input.name.includes('tel')) {
            input.setAttribute('autocomplete', 'tel');
        }

        // Adiciona eventos touch-friendly
        if (this.touchSupport) {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        }
    }

    // Adiciona navegação entre campos
    addFieldNavigation(form) {
        const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
        
        inputs.forEach((input, index) => {
            // Adiciona botões de navegação
            const navContainer = document.createElement('div');
            navContainer.className = 'mobile-field-nav';
            navContainer.innerHTML = `
                <button type="button" class="field-nav-btn prev" ${index === 0 ? 'disabled' : ''}>
                    ← Anterior
                </button>
                <span class="field-counter">${index + 1} de ${inputs.length}</span>
                <button type="button" class="field-nav-btn next" ${index === inputs.length - 1 ? 'disabled' : ''}>
                    Próximo →
                </button>
            `;

            // Insere após o input
            input.parentNode.insertBefore(navContainer, input.nextSibling);

            // Adiciona eventos
            const prevBtn = navContainer.querySelector('.prev');
            const nextBtn = navContainer.querySelector('.next');

            prevBtn.addEventListener('click', () => {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            // Esconde navegação por padrão
            navContainer.style.display = 'none';

            // Mostra navegação quando campo está focado
            input.addEventListener('focus', () => {
                document.querySelectorAll('.mobile-field-nav').forEach(nav => {
                    nav.style.display = 'none';
                });
                navContainer.style.display = 'flex';
            });
        });
    }

    // Otimiza navegação
    optimizeNavigation() {
        if (!this.isMobile) return;

        // Converte menu horizontal em hamburger
        const navs = document.querySelectorAll('nav, .navigation');
        
        navs.forEach(nav => {
            if (!nav.classList.contains('mobile-optimized')) {
                this.createMobileMenu(nav);
                nav.classList.add('mobile-optimized');
            }
        });
    }

    // Cria menu mobile
    createMobileMenu(nav) {
        const menuItems = nav.querySelectorAll('a, button');
        
        if (menuItems.length > 3) {
            // Cria botão hamburger
            const hamburger = document.createElement('button');
            hamburger.className = 'mobile-hamburger';
            hamburger.innerHTML = '☰';
            hamburger.setAttribute('aria-label', 'Menu');

            // Cria overlay do menu
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            
            const menuContainer = document.createElement('div');
            menuContainer.className = 'mobile-menu-container';
            
            // Move itens para o menu mobile
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            
            menuItems.forEach(item => {
                const mobileItem = item.cloneNode(true);
                mobileItem.classList.add('mobile-menu-item');
                mobileMenu.appendChild(mobileItem);
            });

            // Adiciona botão de fechar
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-menu-close';
            closeBtn.innerHTML = '×';
            closeBtn.setAttribute('aria-label', 'Fechar menu');

            menuContainer.appendChild(closeBtn);
            menuContainer.appendChild(mobileMenu);
            overlay.appendChild(menuContainer);

            // Adiciona ao DOM
            nav.appendChild(hamburger);
            document.body.appendChild(overlay);

            // Eventos
            hamburger.addEventListener('click', () => {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            closeBtn.addEventListener('click', () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Esconde itens originais no mobile
            menuItems.forEach(item => {
                item.style.display = 'none';
            });
        }
    }

    // Otimiza modais para mobile
    optimizeModals() {
        const modals = document.querySelectorAll('.modal, [class*="modal"]');
        
        modals.forEach(modal => {
            if (this.isMobile) {
                modal.classList.add('mobile-modal');
                
                // Adiciona swipe para fechar
                this.addSwipeToClose(modal);
                
                // Otimiza altura
                const content = modal.querySelector('.modal-content, [class*="modal-content"]');
                if (content) {
                    content.style.maxHeight = '90vh';
                    content.style.overflow = 'auto';
                }
            }
        });
    }

    // Adiciona swipe para fechar modal
    addSwipeToClose(modal) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        modal.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
        });

        modal.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) {
                modal.style.transform = `translateY(${deltaY}px)`;
                modal.style.opacity = Math.max(0.5, 1 - deltaY / 300);
            }
        });

        modal.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaY = currentY - startY;
            
            if (deltaY > 100) {
                // Fecha modal
                modal.style.display = 'none';
            } else {
                // Volta à posição original
                modal.style.transform = '';
                modal.style.opacity = '';
            }
            
            isDragging = false;
        });
    }

    // Otimiza cards
    optimizeCards() {
        if (!this.isMobile) return;

        const cards = document.querySelectorAll('.card, [class*="card"]');
        
        cards.forEach(card => {
            card.classList.add('mobile-card');
            
            // Adiciona ripple effect
            this.addRippleEffect(card);
            
            // Otimiza layout interno
            const content = card.querySelector('.card-content, .card-body');
            if (content) {
                content.classList.add('mobile-card-content');
            }
        });
    }

    // Adiciona efeito ripple
    addRippleEffect(element) {
        element.addEventListener('touchstart', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.touches[0].clientX - rect.left - size / 2;
            const y = e.touches[0].clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Otimiza botões
    optimizeButtons() {
        const buttons = document.querySelectorAll('button, .btn, [role="button"]');
        
        buttons.forEach(button => {
            if (this.isMobile) {
                button.classList.add('mobile-button');
                
                // Aumenta área de toque
                const currentPadding = window.getComputedStyle(button).padding;
                if (currentPadding === '0px' || !currentPadding) {
                    button.style.padding = '12px 16px';
                }
                
                // Adiciona feedback tátil
                this.addTactileFeedback(button);
            }
        });
    }

    // Adiciona feedback tátil
    addTactileFeedback(element) {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.95)';
            element.style.opacity = '0.8';
            
            // Vibração se disponível
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });

        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.style.transform = '';
                element.style.opacity = '';
            }, 100);
        });
    }

    // Adiciona gestos touch
    addTouchGestures() {
        if (!this.touchSupport) return;

        // Swipe para navegação
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Detecta swipe horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });

        // Pull to refresh
        this.addPullToRefresh();
    }

    // Manipula swipe para direita
    handleSwipeRight() {
        // Volta página se possível
        if (window.history.length > 1) {
            const event = new CustomEvent('swipeRight');
            document.dispatchEvent(event);
        }
    }

    // Manipula swipe para esquerda
    handleSwipeLeft() {
        // Avança página se possível
        const event = new CustomEvent('swipeLeft');
        document.dispatchEvent(event);
    }

    // Adiciona pull to refresh
    addPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        let isPulling = false;
        
        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-refresh-indicator';
        refreshIndicator.innerHTML = '↓ Puxe para atualizar';
        refreshIndicator.style.display = 'none';
        document.body.insertBefore(refreshIndicator, document.body.firstChild);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            pullDistance = e.touches[0].clientY - startY;
            
            if (pullDistance > 0 && pullDistance < 100) {
                refreshIndicator.style.display = 'block';
                refreshIndicator.style.transform = `translateY(${pullDistance}px)`;
                refreshIndicator.style.opacity = pullDistance / 100;
                
                if (pullDistance > 60) {
                    refreshIndicator.innerHTML = '↑ Solte para atualizar';
                    refreshIndicator.classList.add('ready');
                } else {
                    refreshIndicator.innerHTML = '↓ Puxe para atualizar';
                    refreshIndicator.classList.remove('ready');
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (isPulling && pullDistance > 60) {
                refreshIndicator.innerHTML = '🔄 Atualizando...';
                refreshIndicator.classList.add('loading');
                
                // Simula refresh
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                refreshIndicator.style.display = 'none';
                refreshIndicator.style.transform = '';
                refreshIndicator.classList.remove('ready', 'loading');
            }
            
            isPulling = false;
            pullDistance = 0;
        });
    }

    // Otimiza imagens
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Responsive images
            if (this.isMobile && !img.hasAttribute('srcset')) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
            
            // Placeholder enquanto carrega
            if (!img.complete) {
                img.style.backgroundColor = '#f3f4f6';
                img.style.minHeight = '100px';
            }
        });
    }

    // Adiciona handler de orientação
    addOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.orientation = this.getOrientation();
                document.body.classList.remove('orientation-portrait', 'orientation-landscape');
                document.body.classList.add(`orientation-${this.orientation}`);
                
                // Reajusta viewport
                this.optimizeViewport();
                
                // Dispara evento customizado
                const event = new CustomEvent('orientationChanged', {
                    detail: { orientation: this.orientation }
                });
                document.dispatchEvent(event);
            }, 100);
        });
    }

    // Otimiza performance
    optimizePerformance() {
        if (!this.isMobile) return;

        // Debounce scroll events
        let scrollTimeout;
        const originalScroll = window.onscroll;
        
        window.onscroll = function(e) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (originalScroll) originalScroll.call(this, e);
            }, 16); // ~60fps
        };

        // Lazy load de componentes pesados
        const heavyComponents = document.querySelectorAll('[data-lazy-load]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    const loadFunction = component.dataset.lazyLoad;
                    
                    if (window[loadFunction]) {
                        window[loadFunction](component);
                    }
                    
                    observer.unobserve(component);
                }
            });
        });

        heavyComponents.forEach(component => {
            observer.observe(component);
        });

        // Preload de recursos críticos
        this.preloadCriticalResources();
    }

    // Preload de recursos críticos
    preloadCriticalResources() {
        const criticalCSS = [
            '/css/mobile.css',
            '/css/critical.css'
        ];

        const criticalJS = [
            '/js/mobile-core.js'
        ];

        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });

        criticalJS.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Utilitários públicos
    isMobileDevice() {
        return this.isMobile;
    }

    isTabletDevice() {
        return this.isTablet;
    }

    hasTouchSupport() {
        return this.touchSupport;
    }

    getCurrentOrientation() {
        return this.orientation;
    }

    // Força reotimização
    reoptimize() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.orientation = this.getOrientation();
        this.addMobileClasses();
    }
}

// CSS para otimizações mobile
const mobileOptimizationCSS = `
/* Mobile Device Styles */
.mobile-device {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
}

.mobile-device * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

.mobile-device input,
.mobile-device textarea,
.mobile-device [contenteditable] {
    -webkit-user-select: text;
    user-select: text;
}

/* Touch Device Styles */
.touch-device button,
.touch-device .btn,
.touch-device [role="button"] {
    min-height: 44px;
    min-width: 44px;
    position: relative;
    overflow: hidden;
}

/* Mobile Forms */
.mobile-form {
    padding: 16px;
}

.mobile-form input,
.mobile-form select,
.mobile-form textarea {
    font-size: 16px !important;
    padding: 12px 16px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 16px;
}

.mobile-form input:focus,
.mobile-form select:focus,
.mobile-form textarea:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.mobile-field-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-bottom: 16px;
    background: #f9fafb;
    border-radius: 8px;
    padding: 8px 16px;
}

.field-nav-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
}

.field-nav-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
}

.field-counter {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
}

/* Mobile Navigation */
.mobile-hamburger {
    display: block;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    color: #374151;
}

.mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.mobile-menu-overlay.active {
    opacity: 1;
    visibility: visible;
}

.mobile-menu-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 80%;
    max-width: 300px;
    height: 100%;
    background: white;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
}

.mobile-menu-overlay.active .mobile-menu-container {
    transform: translateX(0);
}

.mobile-menu-close {
    align-self: flex-end;
    background: none;
    border: none;
    font-size: 32px;
    padding: 16px;
    cursor: pointer;
    color: #6b7280;
}

.mobile-menu {
    flex: 1;
    padding: 0 16px;
    overflow-y: auto;
}

.mobile-menu-item {
    display: block;
    padding: 16px 0;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    text-decoration: none;
    font-weight: 500;
}

.mobile-menu-item:hover {
    color: #8b5cf6;
}

/* Mobile Modals */
.mobile-modal {
    padding: 16px;
}

.mobile-modal .modal-content {
    margin: 0;
    border-radius: 16px 16px 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 90vh;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.mobile-modal.active .modal-content {
    transform: translateY(0);
}

/* Mobile Cards */
.mobile-card {
    margin-bottom: 16px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

.mobile-card-content {
    padding: 16px;
}

/* Ripple Effect */
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Mobile Buttons */
.mobile-button {
    min-height: 44px;
    padding: 12px 20px;
    font-size: 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

/* Pull to Refresh */
.pull-refresh-indicator {
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: #8b5cf6;
    color: white;
    padding: 12px 20px;
    border-radius: 0 0 12px 12px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999;
    transition: all 0.3s ease;
}

.pull-refresh-indicator.ready {
    background: #10b981;
}

.pull-refresh-indicator.loading {
    background: #f59e0b;
}

/* Orientation Styles */
.orientation-portrait {
    /* Estilos específicos para modo retrato */
}

.orientation-landscape {
    /* Estilos específicos para modo paisagem */
}

.orientation-landscape .mobile-menu-container {
    width: 60%;
}

/* Tablet Optimizations */
.tablet-device .mobile-menu-container {
    width: 40%;
    max-width: 400px;
}

.tablet-device .mobile-form {
    max-width: 600px;
    margin: 0 auto;
}

/* Responsive Grid for Mobile */
@media (max-width: 768px) {
    .grid,
    .row,
    [class*="grid"] {
        display: block !important;
    }
    
    .grid > *,
    .row > *,
    [class*="grid"] > * {
        width: 100% !important;
        margin-bottom: 16px;
    }
    
    .container {
        padding: 16px;
    }
    
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }
    h4 { font-size: 16px; }
    h5 { font-size: 14px; }
    h6 { font-size: 12px; }
    
    .btn,
    button {
        width: 100%;
        margin-bottom: 8px;
    }
    
    .btn:last-child,
    button:last-child {
        margin-bottom: 0;
    }
    
    table {
        font-size: 12px;
    }
    
    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
}

/* Very Small Screens */
@media (max-width: 480px) {
    .mobile-menu-container {
        width: 90%;
    }
    
    .mobile-form {
        padding: 12px;
    }
    
    .mobile-button {
        min-height: 48px;
        font-size: 18px;
    }
    
    .field-nav-btn {
        padding: 8px 12px;
        font-size: 12px;
    }
}

/* High DPI Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .mobile-device img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .mobile-device {
        background-color: #1f2937;
        color: #f9fafb;
    }
    
    .mobile-form input,
    .mobile-form select,
    .mobile-form textarea {
        background: #374151;
        border-color: #4b5563;
        color: #f9fafb;
    }
    
    .mobile-menu-container {
        background: #1f2937;
    }
    
    .mobile-menu-item {
        color: #f9fafb;
        border-color: #374151;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .mobile-modal .modal-content,
    .mobile-menu-container,
    .ripple-effect {
        transition: none;
        animation: none;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('mobile-optimization-styles')) {
    const style = document.createElement('style');
    style.id = 'mobile-optimization-styles';
    style.textContent = mobileOptimizationCSS;
    document.head.appendChild(style);
}

// Inicializa sistema automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimization = new MobileOptimizationSystem();
});

// Exporta para uso global
window.MobileOptimizationSystem = MobileOptimizationSystem;
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
// Sistema de Alerta de Responsabilidade de Conteúdo
// ClaunNetworking - 2024

function showResponsibilityAlert() {
    const modal = document.createElement('div');
    modal.id = 'responsibilityModal';
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
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2.5rem; border-radius: 20px; max-width: 600px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h2 style="color: #DC2626; margin-bottom: 1rem; font-size: 1.5rem;">Responsabilidade sobre o Conteúdo</h2>
            </div>
            
            <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
                <h3 style="color: #991B1B; margin-bottom: 1rem; font-size: 1.1rem;">📋 Termos de Responsabilidade</h3>
                <div style="color: #7F1D1D; line-height: 1.6; font-size: 0.95rem;">
                    <p style="margin-bottom: 1rem;"><strong>Ao publicar conteúdo na plataforma ClaunNetworking, você declara que:</strong></p>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
                        <li>O conteúdo é de sua autoria ou você possui autorização para publicá-lo</li>
                        <li>As informações fornecidas são verdadeiras e precisas</li>
                        <li>O conteúdo não viola direitos autorais, marcas registradas ou propriedade intelectual</li>
                        <li>Não há conteúdo ofensivo, discriminatório ou inadequado</li>
                        <li>Você assume total responsabilidade pelo conteúdo publicado</li>
                    </ul>
                    <p style="margin-bottom: 1rem;"><strong>A ClaunNetworking se reserva o direito de:</strong></p>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
                        <li>Revisar e moderar todo conteúdo publicado</li>
                        <li>Remover conteúdo que viole nossos termos de uso</li>
                        <li>Suspender contas que publiquem conteúdo inadequado</li>
                        <li>Tomar medidas legais quando necessário</li>
                    </ul>
                </div>
            </div>
            
            <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 1rem; margin-bottom: 2rem;">
                <p style="color: #1E40AF; margin: 0; font-size: 0.9rem; text-align: center;">
                    💡 <strong>Dica:</strong> Revise sempre seu conteúdo antes de publicar. Conteúdo de qualidade gera melhores resultados!
                </p>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="acceptResponsibility()" 
                        style="flex: 1; max-width: 200px; padding: 0.75rem 1.5rem; background: #10B981; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    ✅ Aceito os Termos
                </button>
                <button onclick="closeResponsibilityAlert()" 
                        style="flex: 1; max-width: 200px; padding: 0.75rem 1.5rem; background: #6B7280; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                    ❌ Cancelar
                </button>
            </div>
            
            <div style="margin-top: 1.5rem; text-align: center;">
                <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #6B7280; font-size: 0.9rem; cursor: pointer;">
                    <input type="checkbox" id="dontShowAgain" style="margin: 0;">
                    Não mostrar este alerta novamente
                </label>
            </div>
        </div>
    `;
    
    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        #responsibilityModal button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Focar no botão de aceitar
    setTimeout(() => {
        const acceptButton = modal.querySelector('button[onclick="acceptResponsibility()"]');
        if (acceptButton) acceptButton.focus();
    }, 100);
}

function acceptResponsibility() {
    const dontShowAgain = document.getElementById('dontShowAgain').checked;
    
    if (dontShowAgain) {
        localStorage.setItem('claunnetworkingworkingworking_responsibility_accepted', 'true');
    }
    
    closeResponsibilityAlert();
    
    // Mostrar confirmação
    showSuccessMessage('Termos aceitos com sucesso! Você pode prosseguir com a publicação.');
}

function closeResponsibilityAlert() {
    const modal = document.getElementById('responsibilityModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

function checkResponsibilityAcceptance() {
    const accepted = localStorage.getItem('claunnetworkingworkingworking_responsibility_accepted');
    return accepted === 'true';
}

function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">✅</span>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar animação de slide
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remover após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Função para ser chamada antes de publicar conteúdo
function validateContentResponsibility(callback) {
    if (checkResponsibilityAcceptance()) {
        // Se já aceitou, prosseguir diretamente
        if (callback) callback();
    } else {
        // Mostrar alerta e aguardar aceitação
        showResponsibilityAlert();
        
        // Sobrescrever a função de aceitar para incluir o callback
        window.originalAcceptResponsibility = window.acceptResponsibility;
        window.acceptResponsibility = function() {
            window.originalAcceptResponsibility();
            if (callback) callback();
            // Restaurar função original
            window.acceptResponsibility = window.originalAcceptResponsibility;
        };
    }
}

// Exportar funções para uso global
window.showResponsibilityAlert = showResponsibilityAlert;
window.acceptResponsibility = acceptResponsibility;
window.closeResponsibilityAlert = closeResponsibilityAlert;
window.validateContentResponsibility = validateContentResponsibility;
// Sistema de Transparência Salarial - ClaunNetworking
class SalaryTransparencySystem {
    constructor() {
        this.marketData = this.initializeMarketData();
        this.benefits = this.initializeBenefits();
    }

    initializeMarketData() {
        return {
            'desenvolvedor-frontend': { min: 4500, max: 12000, median: 7500 },
            'desenvolvedor-backend': { min: 5000, max: 15000, median: 8500 },
            'desenvolvedor-fullstack': { min: 5500, max: 16000, median: 9000 },
            'designer-ux-ui': { min: 4000, max: 11000, median: 6800 },
            'analista-dados': { min: 5500, max: 14000, median: 8200 },
            'gerente-projetos': { min: 7000, max: 18000, median: 11000 },
            'marketing-digital': { min: 3500, max: 9000, median: 5800 },
            'vendas': { min: 3000, max: 12000, median: 6500 },
            'recursos-humanos': { min: 4000, max: 10000, median: 6200 },
            'financeiro': { min: 4500, max: 13000, median: 7800 }
        };
    }

    initializeBenefits() {
        return {
            'plano-saude': { value: 350, description: 'Plano de saúde completo' },
            'plano-odonto': { value: 80, description: 'Plano odontológico' },
            'vale-refeicao': { value: 600, description: 'Vale refeição mensal' },
            'vale-alimentacao': { value: 400, description: 'Vale alimentação mensal' },
            'vale-transporte': { value: 220, description: 'Vale transporte mensal' },
            'gympass': { value: 120, description: 'Acesso a academias' },
            'home-office': { value: 200, description: 'Auxílio home office' },
            'plr': { value: 1500, description: 'Participação nos lucros (anual)' },
            'bonus': { value: 2000, description: 'Bônus por performance (anual)' },
            'treinamentos': { value: 300, description: 'Investimento em capacitação' },
            'convenios': { value: 150, description: 'Convênios e descontos' },
            'seguro-vida': { value: 100, description: 'Seguro de vida' }
        };
    }

    // Calcula valor total dos benefícios
    calculateBenefitsValue(selectedBenefits) {
        let totalMonthly = 0;
        let totalAnnual = 0;

        selectedBenefits.forEach(benefit => {
            const benefitData = this.benefits[benefit];
            if (benefitData) {
                if (benefit === 'plr' || benefit === 'bonus') {
                    totalAnnual += benefitData.value;
                } else {
                    totalMonthly += benefitData.value;
                }
            }
        });

        return {
            monthly: totalMonthly,
            annual: totalAnnual,
            monthlyEquivalent: totalMonthly + (totalAnnual / 12)
        };
    }

    // Gera calculadora de benefícios interativa
    createBenefitsCalculator(containerId, companyBenefits = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const calculatorHTML = `
            <div class="benefits-calculator">
                <h3>💰 Calculadora de Benefícios</h3>
                <div class="benefits-grid">
                    ${Object.entries(this.benefits).map(([key, benefit]) => `
                        <div class="benefit-item">
                            <label class="benefit-checkbox">
                                <input type="checkbox" value="${key}" 
                                    ${companyBenefits.includes(key) ? 'checked' : ''}>
                                <span class="checkmark"></span>
                                <div class="benefit-info">
                                    <span class="benefit-name">${benefit.description}</span>
                                    <span class="benefit-value">R$ ${benefit.value.toLocaleString('pt-BR')}</span>
                                </div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="benefits-summary">
                    <div class="summary-item">
                        <span class="summary-label">Benefícios Mensais:</span>
                        <span class="summary-value" id="monthly-benefits">R$ 0</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Benefícios Anuais:</span>
                        <span class="summary-value" id="annual-benefits">R$ 0</span>
                    </div>
                    <div class="summary-item total">
                        <span class="summary-label">Valor Total Mensal:</span>
                        <span class="summary-value" id="total-benefits">R$ 0</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = calculatorHTML;
        this.attachCalculatorEvents(container);
        this.updateBenefitsCalculation(container);
    }

    attachCalculatorEvents(container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBenefitsCalculation(container);
            });
        });
    }

    updateBenefitsCalculation(container) {
        const selectedBenefits = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        const totals = this.calculateBenefitsValue(selectedBenefits);
        
        container.querySelector('#monthly-benefits').textContent = 
            `R$ ${totals.monthly.toLocaleString('pt-BR')}`;
        container.querySelector('#annual-benefits').textContent = 
            `R$ ${totals.annual.toLocaleString('pt-BR')}`;
        container.querySelector('#total-benefits').textContent = 
            `R$ ${Math.round(totals.monthlyEquivalent).toLocaleString('pt-BR')}`;
    }

    // Cria comparativo com mercado
    createMarketComparison(position, salary, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const marketData = this.marketData[position.toLowerCase().replace(/\s+/g, '-')];
        if (!marketData) {
            container.innerHTML = '<p>Dados de mercado não disponíveis para esta posição.</p>';
            return;
        }

        const comparison = this.calculateMarketPosition(salary, marketData);
        
        const comparisonHTML = `
            <div class="market-comparison">
                <h3>📊 Comparativo com Mercado</h3>
                <div class="salary-range">
                    <div class="range-bar">
                        <div class="range-fill" style="width: ${comparison.percentile}%"></div>
                        <div class="salary-marker" style="left: ${comparison.percentile}%">
                            <span class="marker-value">R$ ${salary.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>
                    <div class="range-labels">
                        <span>R$ ${marketData.min.toLocaleString('pt-BR')}</span>
                        <span>R$ ${marketData.median.toLocaleString('pt-BR')}</span>
                        <span>R$ ${marketData.max.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
                <div class="comparison-stats">
                    <div class="stat-item">
                        <span class="stat-label">Posição no Mercado:</span>
                        <span class="stat-value ${comparison.class}">${comparison.position}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Diferença da Mediana:</span>
                        <span class="stat-value">${comparison.difference}</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = comparisonHTML;
    }

    calculateMarketPosition(salary, marketData) {
        const percentile = Math.min(100, Math.max(0, 
            ((salary - marketData.min) / (marketData.max - marketData.min)) * 100
        ));

        let position, className;
        if (percentile >= 80) {
            position = 'Acima do Mercado';
            className = 'above-market';
        } else if (percentile >= 40) {
            position = 'Dentro da Média';
            className = 'average-market';
        } else {
            position = 'Abaixo do Mercado';
            className = 'below-market';
        }

        const difference = salary - marketData.median;
        const differenceText = difference >= 0 
            ? `+R$ ${difference.toLocaleString('pt-BR')}`
            : `-R$ ${Math.abs(difference).toLocaleString('pt-BR')}`;

        return {
            percentile,
            position,
            class: className,
            difference: differenceText
        };
    }

    // Cria seção de transparência salarial para perfil de empresa
    createSalaryTransparencySection(companyData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const transparencyHTML = `
            <div class="salary-transparency-section">
                <h3>💎 Transparência Salarial</h3>
                <div class="transparency-grid">
                    <div class="salary-ranges">
                        <h4>Faixas Salariais por Cargo</h4>
                        ${companyData.positions?.map(pos => `
                            <div class="position-salary">
                                <span class="position-name">${pos.title}</span>
                                <span class="salary-range">
                                    R$ ${pos.salaryMin.toLocaleString('pt-BR')} - 
                                    R$ ${pos.salaryMax.toLocaleString('pt-BR')}
                                </span>
                            </div>
                        `).join('') || '<p>Informações não disponíveis</p>'}
                    </div>
                    <div class="investment-info">
                        <h4>Investimento em Funcionários</h4>
                        <div class="investment-stats">
                            <div class="investment-item">
                                <span class="investment-icon">📚</span>
                                <div class="investment-details">
                                    <span class="investment-label">Treinamentos/ano</span>
                                    <span class="investment-value">R$ ${companyData.trainingBudget?.toLocaleString('pt-BR') || '5.000'}</span>
                                </div>
                            </div>
                            <div class="investment-item">
                                <span class="investment-icon">📈</span>
                                <div class="investment-details">
                                    <span class="investment-label">Taxa de Promoção</span>
                                    <span class="investment-value">${companyData.promotionRate || '25'}%</span>
                                </div>
                            </div>
                            <div class="investment-item">
                                <span class="investment-icon">⏱️</span>
                                <div class="investment-details">
                                    <span class="investment-label">Tempo Médio na Empresa</span>
                                    <span class="investment-value">${companyData.avgTenure || '3.2'} anos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = transparencyHTML;
    }
}

// CSS para sistema de transparência salarial
const salaryTransparencyCSS = `
.benefits-calculator {
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
}

.benefits-calculator h3 {
    margin-bottom: 20px;
    color: #1f2937;
    font-size: 20px;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
}

.benefit-item {
    background: white;
    border-radius: 8px;
    padding: 12px;
    border: 2px solid #e5e7eb;
    transition: all 0.2s ease;
}

.benefit-item:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
}

.benefit-checkbox {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    width: 100%;
}

.benefit-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #8b5cf6;
}

.benefit-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.benefit-name {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
}

.benefit-value {
    color: #10b981;
    font-weight: 700;
    font-size: 13px;
}

.benefits-summary {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 2px solid #e5e7eb;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
}

.summary-item:last-child {
    border-bottom: none;
}

.summary-item.total {
    border-top: 2px solid #8b5cf6;
    margin-top: 12px;
    padding-top: 16px;
    font-weight: 700;
    font-size: 16px;
}

.summary-label {
    color: #6b7280;
}

.summary-value {
    color: #10b981;
    font-weight: 600;
}

.market-comparison {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 24px;
    color: white;
    margin: 20px 0;
}

.market-comparison h3 {
    margin-bottom: 20px;
    font-size: 20px;
}

.salary-range {
    margin-bottom: 20px;
}

.range-bar {
    position: relative;
    height: 12px;
    background: rgba(255,255,255,0.2);
    border-radius: 6px;
    margin-bottom: 12px;
}

.range-fill {
    height: 100%;
    background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
    border-radius: 6px;
    transition: width 0.3s ease;
}

.salary-marker {
    position: absolute;
    top: -8px;
    transform: translateX(-50%);
    background: white;
    color: #1f2937;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    opacity: 0.8;
}

.comparison-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255,255,255,0.1);
    padding: 12px;
    border-radius: 8px;
}

.stat-value.above-market { color: #10b981; }
.stat-value.average-market { color: #f59e0b; }
.stat-value.below-market { color: #ef4444; }

.salary-transparency-section {
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
}

.transparency-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.position-salary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: white;
    border-radius: 8px;
    margin-bottom: 8px;
    border-left: 4px solid #8b5cf6;
}

.position-name {
    font-weight: 600;
    color: #374151;
}

.salary-range {
    color: #10b981;
    font-weight: 700;
}

.investment-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.investment-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    padding: 16px;
    border-radius: 8px;
}

.investment-icon {
    font-size: 24px;
    width: 40px;
    text-align: center;
}

.investment-details {
    display: flex;
    flex-direction: column;
}

.investment-label {
    font-size: 14px;
    color: #6b7280;
}

.investment-value {
    font-weight: 700;
    color: #8b5cf6;
    font-size: 16px;
}

@media (max-width: 768px) {
    .transparency-grid {
        grid-template-columns: 1fr;
    }
    
    .benefits-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('salary-transparency-styles')) {
    const style = document.createElement('style');
    style.id = 'salary-transparency-styles';
    style.textContent = salaryTransparencyCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.salaryTransparencySystem = new SalaryTransparencySystem();
/**
 * Sistema Centralizado de Gerenciamento de Serviços
 * Sincroniza automaticamente entre painel admin, candidato e empresa
 */

class ServicesManager {
    constructor() {
        this.storageKey = 'claunnetworkingworkingworking_services';
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
