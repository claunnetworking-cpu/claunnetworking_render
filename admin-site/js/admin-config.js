/**
 * Configuração específica para o painel administrativo
 * Subdomínio: admin.claunnet.com.br
 */

// Configuração da API para produção
const ADMIN_CONFIG = {
    apiBaseURL: 'https://claunnet-api.onrender.com/api',
    mainSiteURL: 'https://claunnet.com.br',
    adminSiteURL: 'https://admin.claunnet.com.br',
    environment: 'production'
};

// Sobrescrever configuração da API global se existir
if (typeof API_CONFIG !== 'undefined') {
    API_CONFIG.baseURL = ADMIN_CONFIG.apiBaseURL;
}

// Configurar redirecionamentos específicos do admin
window.ADMIN_CONFIG = ADMIN_CONFIG;

// Função para redirecionar para o site principal
function redirectToMainSite(path = '') {
    window.location.href = ADMIN_CONFIG.mainSiteURL + path;
}

// Verificar se o usuário tem permissão de admin
function checkAdminPermissions() {
    const user = APIUtils?.getCurrentUser();
    if (!user || user.type !== 'admin') {
        alert('Acesso negado. Apenas administradores podem acessar este painel.');
        redirectToMainSite();
        return false;
    }
    return true;
}

// Executar verificação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar permissões apenas se APIUtils estiver disponível
    if (typeof APIUtils !== 'undefined') {
        checkAdminPermissions();
    }
});
