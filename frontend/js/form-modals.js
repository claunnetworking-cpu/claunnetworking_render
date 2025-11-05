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
