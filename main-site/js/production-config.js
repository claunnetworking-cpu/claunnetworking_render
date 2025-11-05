/**
 * Configuração de produção para o site principal
 * Domínio: claunnet.com.br
 */

// Configuração da API para produção
const PRODUCTION_CONFIG = {
    apiBaseURL: 'https://claunnet-api.onrender.com/api',
    mainSiteURL: 'https://claunnet.com.br',
    adminSiteURL: 'https://admin.claunnet.com.br',
    environment: 'production'
};

// Sobrescrever configuração da API se existir
if (typeof api !== 'undefined' && api.baseURL) {
    api.baseURL = PRODUCTION_CONFIG.apiBaseURL;
}

// Atualizar configuração global da API
if (typeof API_CONFIG !== 'undefined') {
    API_CONFIG.baseURL = PRODUCTION_CONFIG.apiBaseURL;
}

// Função para redirecionar para o painel admin
function redirectToAdmin() {
    window.location.href = PRODUCTION_CONFIG.adminSiteURL;
}

// Interceptar tentativas de acesso ao admin no site principal
document.addEventListener('DOMContentLoaded', function() {
    // Redirecionar links para admin
    const adminLinks = document.querySelectorAll('a[href*="admin"]');
    adminLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToAdmin();
        });
    });
    
    // Verificar se tentou acessar página admin diretamente
    if (window.location.pathname.includes('admin')) {
        redirectToAdmin();
    }
});

window.PRODUCTION_CONFIG = PRODUCTION_CONFIG;
