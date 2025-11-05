/**
 * Modal Fixes - ClaunNetworking
 * Correções e melhorias para todos os modais do projeto
 */

// Função universal para criar modais
function createModal(title, content, options = {}) {
    // Fechar qualquer modal existente
    closeAllModals();
    
    const modal = document.createElement('div');
    modal.className = 'universal-modal';
    modal.id = 'currentModal';
    
    const modalStyles = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10000',
        backdropFilter: 'blur(5px)',
        animation: 'modalFadeIn 0.3s ease-out'
    };
    
    Object.assign(modal.style, modalStyles);
    
    const maxWidth = options.maxWidth || '500px';
    const showCloseButton = options.showCloseButton !== false;
    
    modal.innerHTML = `
        <div class="modal-container" style="
            background: white; 
            padding: 2rem; 
            border-radius: 20px; 
            max-width: ${maxWidth}; 
            width: 90%; 
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease-out;
        ">
            <div class="modal-header" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #f0f0f0;
            ">
                <h2 style="color: #6B46C1; margin: 0; font-size: 1.5rem;">${title}</h2>
                ${showCloseButton ? `
                    <button onclick="closeAllModals()" class="modal-close-btn" style="
                        background: none; 
                        border: none; 
                        font-size: 1.8rem; 
                        cursor: pointer; 
                        color: #6B7280; 
                        padding: 0.25rem; 
                        width: 35px; 
                        height: 35px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
                        ×
                    </button>
                ` : ''}
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAllModals();
        }
    });
    
    // Fechar modal com tecla ESC
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    document.body.appendChild(modal);
    
    // Adicionar CSS de animação se não existir
    if (!document.getElementById('modal-animations')) {
        const style = document.createElement('style');
        style.id = 'modal-animations';
        style.textContent = `
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(-50px) scale(0.9); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
            
            .modal-close-btn:hover {
                background: #f3f4f6 !important;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    return modal;
}

// Função para fechar todos os modais
function closeAllModals() {
    // Remover modal específico por ID
    const currentModal = document.getElementById('currentModal');
    if (currentModal) {
        currentModal.style.animation = 'modalFadeOut 0.2s ease-in';
        setTimeout(() => currentModal.remove(), 200);
        return;
    }
    
    // Fallback: remover qualquer modal existente
    const allModals = document.querySelectorAll('.universal-modal, [style*="position: fixed"][style*="z-index: 10000"]');
    allModals.forEach(modal => {
        modal.style.animation = 'modalFadeOut 0.2s ease-in';
        setTimeout(() => modal.remove(), 200);
    });
    
    // Remover modais antigos do sistema
    const oldModals = document.querySelectorAll('.modal, .modal-overlay');
    oldModals.forEach(modal => modal.remove());
}

// Modal de confirmação
function showConfirmModal(title, message, onConfirm, onCancel = null) {
    const content = `
        <div style="text-align: center; padding: 1rem 0;">
            <p style="font-size: 1.1rem; margin-bottom: 2rem; color: #374151;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeAllModals(); ${onCancel ? onCancel + '()' : ''}" 
                        style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Cancelar
                </button>
                <button onclick="closeAllModals(); ${onConfirm}()" 
                        style="padding: 0.75rem 1.5rem; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Confirmar
                </button>
            </div>
        </div>
    `;
    
    createModal(title, content, { maxWidth: '400px' });
}

// Modal de sucesso
function showSuccessModal(title, message, callback = null) {
    const content = `
        <div style="text-align: center; padding: 1rem 0;">
            <div style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;">✅</div>
            <p style="font-size: 1.1rem; margin-bottom: 2rem; color: #374151;">${message}</p>
            <button onclick="closeAllModals(); ${callback ? callback + '()' : ''}" 
                    style="padding: 0.75rem 2rem; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                OK
            </button>
        </div>
    `;
    
    createModal(title, content, { maxWidth: '400px' });
}

// Modal de erro
function showErrorModal(title, message, callback = null) {
    const content = `
        <div style="text-align: center; padding: 1rem 0;">
            <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">❌</div>
            <p style="font-size: 1.1rem; margin-bottom: 2rem; color: #374151;">${message}</p>
            <button onclick="closeAllModals(); ${callback ? callback + '()' : ''}" 
                    style="padding: 0.75rem 2rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                OK
            </button>
        </div>
    `;
    
    createModal(title, content, { maxWidth: '400px' });
}

// Modal de loading
function showLoadingModal(message = 'Carregando...') {
    const content = `
        <div style="text-align: center; padding: 2rem 0;">
            <div style="
                width: 40px; 
                height: 40px; 
                border: 4px solid #f3f3f3; 
                border-top: 4px solid #6B46C1; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <p style="font-size: 1.1rem; color: #374151; margin: 0;">${message}</p>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    createModal('', content, { maxWidth: '300px', showCloseButton: false });
}

// Função para esconder modal de loading
function hideLoadingModal() {
    closeAllModals();
}

// Melhorar modais existentes do painel administrativo
if (typeof showAddServiceModal !== 'undefined') {
    const originalShowAddServiceModal = showAddServiceModal;
    showAddServiceModal = function() {
        try {
            originalShowAddServiceModal();
        } catch (error) {
            console.error('Erro ao abrir modal de serviço:', error);
            showErrorModal('Erro', 'Não foi possível abrir o modal de criação de serviço.');
        }
    };
}

// Adicionar confirmação para exclusões
function confirmDelete(itemName, deleteFunction) {
    showConfirmModal(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
        deleteFunction
    );
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal fixes carregado com sucesso!');
    
    // Adicionar CSS global para modais
    const globalModalCSS = document.createElement('style');
    globalModalCSS.textContent = `
        @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .universal-modal * {
            box-sizing: border-box;
        }
        
        .universal-modal button {
            transition: all 0.2s ease;
        }
        
        .universal-modal button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(globalModalCSS);
});
