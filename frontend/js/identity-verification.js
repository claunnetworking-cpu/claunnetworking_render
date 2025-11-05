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
