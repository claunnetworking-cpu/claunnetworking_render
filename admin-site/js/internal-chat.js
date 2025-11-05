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
