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
        const userType = localStorage.getItem('claunnetworking_user_type');
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
        return localStorage.getItem('claunnetworking_active_plan') === 'true';
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
