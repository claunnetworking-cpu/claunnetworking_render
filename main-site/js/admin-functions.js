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
                user: 'admin@claunnetworking.com',
                action: 'Aprovação',
                resource: 'Vaga',
                resourceId: 'vaga_123',
                details: 'Vaga "Desenvolvedor React" aprovada'
            },
            {
                id: 'audit_002',
                datetime: '2025-10-03 13:45:22',
                user: 'admin@claunnetworking.com',
                action: 'Criação',
                resource: 'Curso',
                resourceId: 'curso_456',
                details: 'Novo curso "Python Básico" criado'
            },
            {
                id: 'audit_003',
                datetime: '2025-10-03 12:15:08',
                user: 'admin@claunnetworking.com',
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
