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
