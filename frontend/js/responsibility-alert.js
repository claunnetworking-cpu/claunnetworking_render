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
        localStorage.setItem('claunnetworking_responsibility_accepted', 'true');
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
    const accepted = localStorage.getItem('claunnetworking_responsibility_accepted');
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
