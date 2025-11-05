// Sistema de engajamento para vagas

class JobEngagement {
    constructor() {
        this.engagementData = this.loadEngagementData();
        this.init();
    }

    init() {
        // Adicionar listeners para botões de engajamento
        this.addEngagementListeners();
    }

    loadEngagementData() {
        // Carregar dados de engajamento do localStorage
        const saved = localStorage.getItem('claunnetworking_job_engagement');
        return saved ? JSON.parse(saved) : {};
    }

    saveEngagementData() {
        localStorage.setItem('claunnetworking_job_engagement', JSON.stringify(this.engagementData));
    }

    addEngagementListeners() {
        // Adicionar listeners quando os cards são renderizados
        document.addEventListener('click', (e) => {
            if (e.target.closest('.engagement-item')) {
                const engagementItem = e.target.closest('.engagement-item');
                const jobCard = engagementItem.closest('.job-card');
                const jobId = this.getJobIdFromCard(jobCard);
                const engagementType = this.getEngagementType(engagementItem);

                if (jobId && engagementType) {
                    this.handleEngagement(jobId, engagementType, engagementItem);
                }
            }
        });
    }

    getJobIdFromCard(jobCard) {
        // Extrair ID da vaga do botão "Ver Detalhes"
        const detailsButton = jobCard.querySelector('.btn-details');
        if (detailsButton && detailsButton.onclick) {
            const onclickStr = detailsButton.getAttribute('onclick');
            const match = onclickStr.match(/viewJobDetails\((\d+)\)/);
            return match ? parseInt(match[1]) : null;
        }
        return null;
    }

    getEngagementType(engagementItem) {
        const icon = engagementItem.querySelector('span:first-child').textContent;
        switch (icon) {
            case '❤️': return 'likes';
            case '👁️': return 'views';
            case '🔗': return 'shares';
            default: return null;
        }
    }

    handleEngagement(jobId, type, element) {
        if (!this.engagementData[jobId]) {
            this.engagementData[jobId] = {
                likes: false,
                views: false,
                shares: false
            };
        }

        switch (type) {
            case 'likes':
                this.toggleLike(jobId, element);
                break;
            case 'views':
                this.incrementViews(jobId, element);
                break;
            case 'shares':
                this.incrementShares(jobId, element);
                break;
        }

        this.saveEngagementData();
    }

    toggleLike(jobId, element) {
        const isLiked = this.engagementData[jobId].likes;
        this.engagementData[jobId].likes = !isLiked;

        // Atualizar visual
        const icon = element.querySelector('span:first-child');
        const counter = element.querySelector('span:last-child');
        
        if (!isLiked) {
            icon.textContent = '💖';
            element.style.color = '#ef4444';
            this.animateEngagement(element, '+1');
        } else {
            icon.textContent = '❤️';
            element.style.color = '';
        }

        // Atualizar contador global
        this.updateGlobalCounter(jobId, 'likes', !isLiked ? 1 : -1);
    }

    incrementViews(jobId, element) {
        // Views são incrementadas automaticamente ao visualizar detalhes
        // Aqui apenas mostramos feedback visual
        this.animateEngagement(element, '+1 view');
        this.updateGlobalCounter(jobId, 'views', 1);
    }

    incrementShares(jobId, element) {
        // Shares são incrementadas ao compartilhar
        this.animateEngagement(element, '+1 share');
        this.updateGlobalCounter(jobId, 'shares', 1);
    }

    updateGlobalCounter(jobId, type, increment) {
        // Atualizar contador global da vaga
        const jobData = window.jobsData || [];
        const job = jobData.find(j => j.id === jobId);
        if (job && job.engagement) {
            job.engagement[type] += increment;
            
            // Atualizar display se a vaga estiver visível
            this.updateDisplayCounter(jobId, type, job.engagement[type]);
        }
    }

    updateDisplayCounter(jobId, type, newValue) {
        // Encontrar e atualizar o contador na interface
        const jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach(card => {
            const cardJobId = this.getJobIdFromCard(card);
            if (cardJobId === jobId) {
                const engagementItems = card.querySelectorAll('.engagement-item');
                engagementItems.forEach(item => {
                    const itemType = this.getEngagementType(item);
                    if (itemType === type) {
                        const counter = item.querySelector('span:last-child');
                        if (type === 'views') {
                            counter.textContent = `${newValue} visualizações`;
                        } else {
                            counter.textContent = newValue.toString();
                        }
                    }
                });
            }
        });
    }

    animateEngagement(element, text) {
        // Criar animação de feedback
        const feedback = document.createElement('div');
        feedback.textContent = text;
        feedback.style.cssText = `
            position: absolute;
            background: #10B981;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            z-index: 1000;
            pointer-events: none;
            animation: engagementFeedback 1.5s ease-out forwards;
        `;

        // Adicionar CSS da animação se não existir
        if (!document.querySelector('#engagement-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'engagement-animation-styles';
            style.textContent = `
                @keyframes engagementFeedback {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translateY(-10px) scale(1.1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.9);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Posicionar feedback
        const rect = element.getBoundingClientRect();
        feedback.style.left = rect.left + 'px';
        feedback.style.top = (rect.top - 30) + 'px';
        feedback.style.position = 'fixed';

        document.body.appendChild(feedback);

        // Remover após animação
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1500);
    }

    // Método para incrementar views ao visualizar detalhes
    incrementViewsOnDetails(jobId) {
        if (!this.engagementData[jobId]) {
            this.engagementData[jobId] = {
                likes: false,
                views: false,
                shares: false
            };
        }

        this.updateGlobalCounter(jobId, 'views', 1);
        this.saveEngagementData();
    }

    // Método para incrementar shares ao compartilhar
    incrementSharesOnShare(jobId) {
        if (!this.engagementData[jobId]) {
            this.engagementData[jobId] = {
                likes: false,
                views: false,
                shares: false
            };
        }

        this.updateGlobalCounter(jobId, 'shares', 1);
        this.saveEngagementData();
    }

    // Método para restaurar estado dos likes
    restoreLikeStates() {
        Object.keys(this.engagementData).forEach(jobId => {
            const jobIdNum = parseInt(jobId);
            const isLiked = this.engagementData[jobId].likes;
            
            if (isLiked) {
                const jobCards = document.querySelectorAll('.job-card');
                jobCards.forEach(card => {
                    const cardJobId = this.getJobIdFromCard(card);
                    if (cardJobId === jobIdNum) {
                        const likeElement = card.querySelector('.engagement-item');
                        if (likeElement) {
                            const icon = likeElement.querySelector('span:first-child');
                            if (icon && icon.textContent === '❤️') {
                                icon.textContent = '💖';
                                likeElement.style.color = '#ef4444';
                            }
                        }
                    }
                });
            }
        });
    }
}

// Inicializar sistema de engajamento
let jobEngagement;

document.addEventListener('DOMContentLoaded', function() {
    jobEngagement = new JobEngagement();
    
    // Restaurar estados após renderização inicial
    setTimeout(() => {
        jobEngagement.restoreLikeStates();
    }, 100);
});

// Sobrescrever funções globais para incluir engajamento
const originalViewJobDetails = window.viewJobDetails;
window.viewJobDetails = function(jobId) {
    if (jobEngagement) {
        jobEngagement.incrementViewsOnDetails(jobId);
    }
    if (originalViewJobDetails) {
        originalViewJobDetails(jobId);
    }
};

const originalShareJob = window.shareJob;
window.shareJob = function(jobId) {
    if (jobEngagement) {
        jobEngagement.incrementSharesOnShare(jobId);
    }
    if (originalShareJob) {
        originalShareJob(jobId);
    }
};

// Exportar para uso global
window.JobEngagement = JobEngagement;
