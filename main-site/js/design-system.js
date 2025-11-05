// Sistema de Design Avançado - ClaunNetworking
class AdvancedDesignSystem {
    constructor() {
        this.themes = {
            light: {
                primary: '#8b5cf6',
                secondary: '#10b981',
                accent: '#f59e0b',
                background: '#ffffff',
                surface: '#f9fafb',
                text: '#1f2937',
                textSecondary: '#6b7280',
                border: '#e5e7eb',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
            },
            dark: {
                primary: '#a78bfa',
                secondary: '#34d399',
                accent: '#fbbf24',
                background: '#111827',
                surface: '#1f2937',
                text: '#f9fafb',
                textSecondary: '#9ca3af',
                border: '#374151',
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171',
                info: '#60a5fa'
            }
        };

        this.currentTheme = 'light';
        this.animations = {};
        this.components = {};
        this.breakpoints = {
            xs: '320px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        };

        this.init();
    }

    // Inicializa o sistema de design
    init() {
        this.loadUserPreferences();
        this.createCSSVariables();
        this.setupThemeToggle();
        this.setupAnimations();
        this.setupComponents();
        this.setupResponsiveHelpers();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        this.createDesignTokens();
    }

    // Carrega preferências do usuário
    loadUserPreferences() {
        const savedTheme = localStorage.getItem('design_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Escuta mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('design_theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Cria variáveis CSS para o tema
    createCSSVariables() {
        const theme = this.themes[this.currentTheme];
        const root = document.documentElement;

        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Adiciona classes de tema
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${this.currentTheme}`);

        // Cria variáveis de espaçamento
        const spacing = {
            '0': '0',
            '1': '0.25rem',
            '2': '0.5rem',
            '3': '0.75rem',
            '4': '1rem',
            '5': '1.25rem',
            '6': '1.5rem',
            '8': '2rem',
            '10': '2.5rem',
            '12': '3rem',
            '16': '4rem',
            '20': '5rem',
            '24': '6rem',
            '32': '8rem'
        };

        Object.entries(spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
        });

        // Cria variáveis de tipografia
        const typography = {
            'xs': '0.75rem',
            'sm': '0.875rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.75rem'
        };

        Object.entries(typography).forEach(([key, value]) => {
            root.style.setProperty(`--text-${key}`, value);
        });

        // Cria variáveis de sombras
        const shadows = {
            'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        };

        Object.entries(shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });

        // Cria variáveis de border radius
        const borderRadius = {
            'none': '0',
            'sm': '0.125rem',
            'base': '0.25rem',
            'md': '0.375rem',
            'lg': '0.5rem',
            'xl': '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            'full': '9999px'
        };

        Object.entries(borderRadius).forEach(([key, value]) => {
            root.style.setProperty(`--radius-${key}`, value);
        });
    }

    // Configura alternador de tema
    setupThemeToggle() {
        // Cria botão de alternância de tema
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = `Alternar para tema ${this.currentTheme === 'dark' ? 'claro' : 'escuro'}`;
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Adiciona CSS para o botão
        this.addThemeToggleCSS();
        
        // Adiciona ao DOM
        document.body.appendChild(themeToggle);
    }

    // Adiciona CSS para o alternador de tema
    addThemeToggleCSS() {
        if (document.getElementById('theme-toggle-styles')) return;

        const style = document.createElement('style');
        style.id = 'theme-toggle-styles';
        style.textContent = `
            .theme-toggle {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: var(--radius-full);
                border: 2px solid var(--color-border);
                background: var(--color-surface);
                color: var(--color-text);
                font-size: 20px;
                cursor: pointer;
                z-index: 9999;
                transition: all 0.3s ease;
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-xl);
            }

            .theme-toggle:active {
                transform: scale(0.95);
            }

            @media (max-width: 768px) {
                .theme-toggle {
                    width: 45px;
                    height: 45px;
                    top: 15px;
                    right: 15px;
                    font-size: 18px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Alterna tema
    toggleTheme() {
        this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }

    // Define tema
    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('design_theme', theme);
        this.createCSSVariables();
        
        // Atualiza ícone do botão
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            toggle.title = `Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`;
        }

        // Dispara evento personalizado
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    // Configura animações
    setupAnimations() {
        this.animations = {
            fadeIn: {
                keyframes: [
                    { opacity: 0 },
                    { opacity: 1 }
                ],
                options: { duration: 300, easing: 'ease-out' }
            },
            fadeOut: {
                keyframes: [
                    { opacity: 1 },
                    { opacity: 0 }
                ],
                options: { duration: 300, easing: 'ease-in' }
            },
            slideInUp: {
                keyframes: [
                    { transform: 'translateY(20px)', opacity: 0 },
                    { transform: 'translateY(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            slideInDown: {
                keyframes: [
                    { transform: 'translateY(-20px)', opacity: 0 },
                    { transform: 'translateY(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            slideInLeft: {
                keyframes: [
                    { transform: 'translateX(-20px)', opacity: 0 },
                    { transform: 'translateX(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            slideInRight: {
                keyframes: [
                    { transform: 'translateX(20px)', opacity: 0 },
                    { transform: 'translateX(0)', opacity: 1 }
                ],
                options: { duration: 400, easing: 'ease-out' }
            },
            scaleIn: {
                keyframes: [
                    { transform: 'scale(0.8)', opacity: 0 },
                    { transform: 'scale(1)', opacity: 1 }
                ],
                options: { duration: 300, easing: 'ease-out' }
            },
            bounce: {
                keyframes: [
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(-10px)' },
                    { transform: 'translateY(0)' }
                ],
                options: { duration: 600, easing: 'ease-in-out' }
            },
            pulse: {
                keyframes: [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.05)' },
                    { transform: 'scale(1)' }
                ],
                options: { duration: 1000, easing: 'ease-in-out', iterations: Infinity }
            },
            shake: {
                keyframes: [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(5px)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(0)' }
                ],
                options: { duration: 500, easing: 'ease-in-out' }
            }
        };

        // Adiciona CSS para animações
        this.addAnimationCSS();
    }

    // Adiciona CSS para animações
    addAnimationCSS() {
        if (document.getElementById('animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-fade-in {
                animation: fadeIn 0.3s ease-out forwards;
            }

            .animate-fade-out {
                animation: fadeOut 0.3s ease-in forwards;
            }

            .animate-slide-in-up {
                animation: slideInUp 0.4s ease-out forwards;
            }

            .animate-slide-in-down {
                animation: slideInDown 0.4s ease-out forwards;
            }

            .animate-slide-in-left {
                animation: slideInLeft 0.4s ease-out forwards;
            }

            .animate-slide-in-right {
                animation: slideInRight 0.4s ease-out forwards;
            }

            .animate-scale-in {
                animation: scaleIn 0.3s ease-out forwards;
            }

            .animate-bounce {
                animation: bounce 0.6s ease-in-out;
            }

            .animate-pulse {
                animation: pulse 1s ease-in-out infinite;
            }

            .animate-shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes slideInUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideInDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes slideInLeft {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideInRight {
                from { transform: translateX(20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            /* Transições suaves para elementos interativos */
            .transition-all {
                transition: all 0.3s ease;
            }

            .transition-colors {
                transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
            }

            .transition-transform {
                transition: transform 0.3s ease;
            }

            .transition-opacity {
                transition: opacity 0.3s ease;
            }

            /* Efeitos de hover */
            .hover-lift:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }

            .hover-scale:hover {
                transform: scale(1.05);
            }

            .hover-glow:hover {
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
            }

            /* Redução de movimento para acessibilidade */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Anima elemento
    animate(element, animationName, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element || !this.animations[animationName]) return;

        const animation = this.animations[animationName];
        const animationOptions = { ...animation.options, ...options };

        return element.animate(animation.keyframes, animationOptions);
    }

    // Configura componentes
    setupComponents() {
        this.components = {
            button: this.createButtonComponent(),
            card: this.createCardComponent(),
            modal: this.createModalComponent(),
            tooltip: this.createTooltipComponent(),
            notification: this.createNotificationComponent(),
            loading: this.createLoadingComponent(),
            badge: this.createBadgeComponent(),
            avatar: this.createAvatarComponent()
        };

        this.addComponentCSS();
    }

    // Cria componente de botão
    createButtonComponent() {
        return {
            create: (text, options = {}) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.className = `btn ${options.variant || 'primary'} ${options.size || 'md'} ${options.className || ''}`;
                
                if (options.icon) {
                    const icon = document.createElement('span');
                    icon.innerHTML = options.icon;
                    icon.className = 'btn-icon';
                    button.insertBefore(icon, button.firstChild);
                }

                if (options.loading) {
                    button.classList.add('btn-loading');
                    button.disabled = true;
                }

                if (options.onClick) {
                    button.addEventListener('click', options.onClick);
                }

                return button;
            }
        };
    }

    // Cria componente de card
    createCardComponent() {
        return {
            create: (content, options = {}) => {
                const card = document.createElement('div');
                card.className = `card ${options.variant || 'default'} ${options.className || ''}`;
                
                if (options.header) {
                    const header = document.createElement('div');
                    header.className = 'card-header';
                    header.innerHTML = options.header;
                    card.appendChild(header);
                }

                const body = document.createElement('div');
                body.className = 'card-body';
                body.innerHTML = content;
                card.appendChild(body);

                if (options.footer) {
                    const footer = document.createElement('div');
                    footer.className = 'card-footer';
                    footer.innerHTML = options.footer;
                    card.appendChild(footer);
                }

                return card;
            }
        };
    }

    // Cria componente de modal
    createModalComponent() {
        return {
            create: (content, options = {}) => {
                const modal = document.createElement('div');
                modal.className = 'modal-overlay';
                modal.innerHTML = `
                    <div class="modal ${options.size || 'md'}">
                        <div class="modal-header">
                            <h3 class="modal-title">${options.title || ''}</h3>
                            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
                    </div>
                `;

                // Fecha modal ao clicar fora
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });

                // Fecha modal com ESC
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        modal.remove();
                    }
                });

                return modal;
            },
            show: (modal) => {
                document.body.appendChild(modal);
                this.animate(modal, 'fadeIn');
                this.animate(modal.querySelector('.modal'), 'scaleIn');
            }
        };
    }

    // Cria componente de tooltip
    createTooltipComponent() {
        return {
            create: (element, text, options = {}) => {
                if (typeof element === 'string') {
                    element = document.querySelector(element);
                }

                if (!element) return;

                const tooltip = document.createElement('div');
                tooltip.className = `tooltip ${options.position || 'top'}`;
                tooltip.textContent = text;

                element.addEventListener('mouseenter', () => {
                    document.body.appendChild(tooltip);
                    this.positionTooltip(tooltip, element, options.position || 'top');
                    this.animate(tooltip, 'fadeIn');
                });

                element.addEventListener('mouseleave', () => {
                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }
                });

                return tooltip;
            }
        };
    }

    // Posiciona tooltip
    positionTooltip(tooltip, element, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        switch (position) {
            case 'top':
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
                break;
            case 'bottom':
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
                tooltip.style.top = `${rect.bottom + 8}px`;
                break;
            case 'left':
                tooltip.style.left = `${rect.left - tooltipRect.width - 8}px`;
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                break;
            case 'right':
                tooltip.style.left = `${rect.right + 8}px`;
                tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
                break;
        }
    }

    // Cria componente de notificação
    createNotificationComponent() {
        return {
            show: (message, options = {}) => {
                const notification = document.createElement('div');
                notification.className = `notification ${options.type || 'info'}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-icon">${this.getNotificationIcon(options.type)}</span>
                        <span class="notification-message">${message}</span>
                        <button class="notification-close" onclick="this.parentNode.parentNode.remove()">×</button>
                    </div>
                `;

                // Adiciona ao container de notificações
                let container = document.getElementById('notifications-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'notifications-container';
                    container.className = 'notifications-container';
                    document.body.appendChild(container);
                }

                container.appendChild(notification);
                this.animate(notification, 'slideInRight');

                // Remove automaticamente após delay
                const delay = options.duration || 5000;
                setTimeout(() => {
                    if (notification.parentNode) {
                        this.animate(notification, 'slideInRight').reverse();
                        setTimeout(() => notification.remove(), 300);
                    }
                }, delay);

                return notification;
            }
        };
    }

    // Obtém ícone da notificação
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Cria componente de loading
    createLoadingComponent() {
        return {
            show: (message = 'Carregando...') => {
                const loading = document.createElement('div');
                loading.className = 'loading-overlay';
                loading.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <div class="loading-message">${message}</div>
                    </div>
                `;

                document.body.appendChild(loading);
                this.animate(loading, 'fadeIn');

                return loading;
            },
            hide: (loading) => {
                if (loading && loading.parentNode) {
                    this.animate(loading, 'fadeOut').addEventListener('finish', () => {
                        loading.remove();
                    });
                }
            }
        };
    }

    // Cria componente de badge
    createBadgeComponent() {
        return {
            create: (text, options = {}) => {
                const badge = document.createElement('span');
                badge.className = `badge ${options.variant || 'primary'} ${options.size || 'md'}`;
                badge.textContent = text;
                return badge;
            }
        };
    }

    // Cria componente de avatar
    createAvatarComponent() {
        return {
            create: (options = {}) => {
                const avatar = document.createElement('div');
                avatar.className = `avatar ${options.size || 'md'}`;
                
                if (options.src) {
                    const img = document.createElement('img');
                    img.src = options.src;
                    img.alt = options.alt || 'Avatar';
                    avatar.appendChild(img);
                } else {
                    avatar.textContent = options.initials || '?';
                }

                if (options.status) {
                    const status = document.createElement('div');
                    status.className = `avatar-status ${options.status}`;
                    avatar.appendChild(status);
                }

                return avatar;
            }
        };
    }

    // Adiciona CSS dos componentes
    addComponentCSS() {
        if (document.getElementById('component-styles')) return;

        const style = document.createElement('style');
        style.id = 'component-styles';
        style.textContent = `
            /* Botões */
            .btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-2);
                padding: var(--spacing-2) var(--spacing-4);
                border: 1px solid transparent;
                border-radius: var(--radius-md);
                font-size: var(--text-sm);
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .btn.primary {
                background: var(--color-primary);
                color: white;
            }

            .btn.primary:hover:not(:disabled) {
                background: color-mix(in srgb, var(--color-primary) 90%, black);
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }

            .btn.secondary {
                background: var(--color-secondary);
                color: white;
            }

            .btn.secondary:hover:not(:disabled) {
                background: color-mix(in srgb, var(--color-secondary) 90%, black);
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }

            .btn.outline {
                background: transparent;
                color: var(--color-primary);
                border-color: var(--color-primary);
            }

            .btn.outline:hover:not(:disabled) {
                background: var(--color-primary);
                color: white;
            }

            .btn.ghost {
                background: transparent;
                color: var(--color-text);
            }

            .btn.ghost:hover:not(:disabled) {
                background: var(--color-surface);
            }

            .btn.sm {
                padding: var(--spacing-1) var(--spacing-3);
                font-size: var(--text-xs);
            }

            .btn.lg {
                padding: var(--spacing-3) var(--spacing-6);
                font-size: var(--text-lg);
            }

            .btn.xl {
                padding: var(--spacing-4) var(--spacing-8);
                font-size: var(--text-xl);
            }

            .btn-loading::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            /* Cards */
            .card {
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                overflow: hidden;
                box-shadow: var(--shadow-sm);
                transition: all 0.3s ease;
            }

            .card:hover {
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }

            .card-header {
                padding: var(--spacing-4);
                border-bottom: 1px solid var(--color-border);
                font-weight: 600;
                color: var(--color-text);
            }

            .card-body {
                padding: var(--spacing-4);
                color: var(--color-text);
            }

            .card-footer {
                padding: var(--spacing-4);
                border-top: 1px solid var(--color-border);
                background: color-mix(in srgb, var(--color-surface) 95%, var(--color-border));
            }

            .card.elevated {
                box-shadow: var(--shadow-lg);
            }

            .card.bordered {
                border: 2px solid var(--color-primary);
            }

            /* Modais */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: var(--spacing-4);
            }

            .modal {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-2xl);
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .modal.sm { width: 100%; max-width: 400px; }
            .modal.md { width: 100%; max-width: 600px; }
            .modal.lg { width: 100%; max-width: 800px; }
            .modal.xl { width: 100%; max-width: 1200px; }

            .modal-header {
                padding: var(--spacing-4);
                border-bottom: 1px solid var(--color-border);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .modal-title {
                margin: 0;
                font-size: var(--text-lg);
                font-weight: 600;
                color: var(--color-text);
            }

            .modal-close {
                background: none;
                border: none;
                font-size: var(--text-2xl);
                cursor: pointer;
                color: var(--color-textSecondary);
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-md);
                transition: all 0.2s ease;
            }

            .modal-close:hover {
                background: var(--color-border);
                color: var(--color-text);
            }

            .modal-body {
                padding: var(--spacing-4);
                overflow-y: auto;
                flex: 1;
                color: var(--color-text);
            }

            .modal-footer {
                padding: var(--spacing-4);
                border-top: 1px solid var(--color-border);
                display: flex;
                gap: var(--spacing-2);
                justify-content: flex-end;
            }

            /* Tooltips */
            .tooltip {
                position: absolute;
                background: var(--color-text);
                color: var(--color-surface);
                padding: var(--spacing-2) var(--spacing-3);
                border-radius: var(--radius-md);
                font-size: var(--text-sm);
                white-space: nowrap;
                z-index: 9999;
                pointer-events: none;
                box-shadow: var(--shadow-lg);
            }

            .tooltip::after {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border: 4px solid transparent;
            }

            .tooltip.top::after {
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-top-color: var(--color-text);
            }

            .tooltip.bottom::after {
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-bottom-color: var(--color-text);
            }

            .tooltip.left::after {
                left: 100%;
                top: 50%;
                transform: translateY(-50%);
                border-left-color: var(--color-text);
            }

            .tooltip.right::after {
                right: 100%;
                top: 50%;
                transform: translateY(-50%);
                border-right-color: var(--color-text);
            }

            /* Notificações */
            .notifications-container {
                position: fixed;
                top: var(--spacing-4);
                right: var(--spacing-4);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-2);
                max-width: 400px;
            }

            .notification {
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                overflow: hidden;
            }

            .notification.success {
                border-left: 4px solid var(--color-success);
            }

            .notification.error {
                border-left: 4px solid var(--color-error);
            }

            .notification.warning {
                border-left: 4px solid var(--color-warning);
            }

            .notification.info {
                border-left: 4px solid var(--color-info);
            }

            .notification-content {
                padding: var(--spacing-4);
                display: flex;
                align-items: center;
                gap: var(--spacing-3);
            }

            .notification-icon {
                font-size: var(--text-lg);
                flex-shrink: 0;
            }

            .notification-message {
                flex: 1;
                color: var(--color-text);
                font-size: var(--text-sm);
            }

            .notification-close {
                background: none;
                border: none;
                font-size: var(--text-lg);
                cursor: pointer;
                color: var(--color-textSecondary);
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                background: var(--color-border);
                color: var(--color-text);
            }

            /* Loading */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }

            .loading-content {
                background: var(--color-surface);
                padding: var(--spacing-8);
                border-radius: var(--radius-lg);
                text-align: center;
                box-shadow: var(--shadow-2xl);
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--color-border);
                border-top: 4px solid var(--color-primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto var(--spacing-4);
            }

            .loading-message {
                color: var(--color-text);
                font-size: var(--text-sm);
            }

            /* Badges */
            .badge {
                display: inline-flex;
                align-items: center;
                padding: var(--spacing-1) var(--spacing-2);
                border-radius: var(--radius-full);
                font-size: var(--text-xs);
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.025em;
            }

            .badge.primary {
                background: var(--color-primary);
                color: white;
            }

            .badge.secondary {
                background: var(--color-secondary);
                color: white;
            }

            .badge.success {
                background: var(--color-success);
                color: white;
            }

            .badge.warning {
                background: var(--color-warning);
                color: white;
            }

            .badge.error {
                background: var(--color-error);
                color: white;
            }

            .badge.outline {
                background: transparent;
                border: 1px solid currentColor;
            }

            .badge.sm {
                padding: 2px var(--spacing-1);
                font-size: 10px;
            }

            .badge.lg {
                padding: var(--spacing-2) var(--spacing-3);
                font-size: var(--text-sm);
            }

            /* Avatars */
            .avatar {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-full);
                background: var(--color-primary);
                color: white;
                font-weight: 500;
                overflow: hidden;
            }

            .avatar.sm {
                width: 32px;
                height: 32px;
                font-size: var(--text-sm);
            }

            .avatar.md {
                width: 40px;
                height: 40px;
                font-size: var(--text-base);
            }

            .avatar.lg {
                width: 48px;
                height: 48px;
                font-size: var(--text-lg);
            }

            .avatar.xl {
                width: 64px;
                height: 64px;
                font-size: var(--text-xl);
            }

            .avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .avatar-status {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 25%;
                height: 25%;
                border-radius: 50%;
                border: 2px solid var(--color-surface);
            }

            .avatar-status.online {
                background: var(--color-success);
            }

            .avatar-status.offline {
                background: var(--color-textSecondary);
            }

            .avatar-status.busy {
                background: var(--color-error);
            }

            .avatar-status.away {
                background: var(--color-warning);
            }
        `;
        
        document.head.appendChild(style);
    }

    // Configura helpers responsivos
    setupResponsiveHelpers() {
        // Adiciona classes utilitárias responsivas
        this.addResponsiveCSS();
        
        // Configura observer para mudanças de viewport
        this.setupViewportObserver();
    }

    // Adiciona CSS responsivo
    addResponsiveCSS() {
        if (document.getElementById('responsive-styles')) return;

        const style = document.createElement('style');
        style.id = 'responsive-styles';
        style.textContent = `
            /* Utilitários de display */
            .hidden { display: none !important; }
            .block { display: block !important; }
            .inline { display: inline !important; }
            .inline-block { display: inline-block !important; }
            .flex { display: flex !important; }
            .inline-flex { display: inline-flex !important; }
            .grid { display: grid !important; }

            /* Utilitários de flexbox */
            .flex-row { flex-direction: row !important; }
            .flex-col { flex-direction: column !important; }
            .flex-wrap { flex-wrap: wrap !important; }
            .flex-nowrap { flex-wrap: nowrap !important; }
            .items-start { align-items: flex-start !important; }
            .items-center { align-items: center !important; }
            .items-end { align-items: flex-end !important; }
            .justify-start { justify-content: flex-start !important; }
            .justify-center { justify-content: center !important; }
            .justify-end { justify-content: flex-end !important; }
            .justify-between { justify-content: space-between !important; }

            /* Utilitários de espaçamento */
            .m-0 { margin: 0 !important; }
            .m-1 { margin: var(--spacing-1) !important; }
            .m-2 { margin: var(--spacing-2) !important; }
            .m-3 { margin: var(--spacing-3) !important; }
            .m-4 { margin: var(--spacing-4) !important; }
            .m-5 { margin: var(--spacing-5) !important; }
            .m-6 { margin: var(--spacing-6) !important; }
            .m-8 { margin: var(--spacing-8) !important; }

            .p-0 { padding: 0 !important; }
            .p-1 { padding: var(--spacing-1) !important; }
            .p-2 { padding: var(--spacing-2) !important; }
            .p-3 { padding: var(--spacing-3) !important; }
            .p-4 { padding: var(--spacing-4) !important; }
            .p-5 { padding: var(--spacing-5) !important; }
            .p-6 { padding: var(--spacing-6) !important; }
            .p-8 { padding: var(--spacing-8) !important; }

            /* Utilitários de texto */
            .text-left { text-align: left !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .text-xs { font-size: var(--text-xs) !important; }
            .text-sm { font-size: var(--text-sm) !important; }
            .text-base { font-size: var(--text-base) !important; }
            .text-lg { font-size: var(--text-lg) !important; }
            .text-xl { font-size: var(--text-xl) !important; }
            .text-2xl { font-size: var(--text-2xl) !important; }

            .font-normal { font-weight: 400 !important; }
            .font-medium { font-weight: 500 !important; }
            .font-semibold { font-weight: 600 !important; }
            .font-bold { font-weight: 700 !important; }

            /* Breakpoints responsivos */
            @media (min-width: 640px) {
                .sm\\:hidden { display: none !important; }
                .sm\\:block { display: block !important; }
                .sm\\:flex { display: flex !important; }
                .sm\\:grid { display: grid !important; }
                .sm\\:text-left { text-align: left !important; }
                .sm\\:text-center { text-align: center !important; }
                .sm\\:text-right { text-align: right !important; }
            }

            @media (min-width: 768px) {
                .md\\:hidden { display: none !important; }
                .md\\:block { display: block !important; }
                .md\\:flex { display: flex !important; }
                .md\\:grid { display: grid !important; }
                .md\\:text-left { text-align: left !important; }
                .md\\:text-center { text-align: center !important; }
                .md\\:text-right { text-align: right !important; }
            }

            @media (min-width: 1024px) {
                .lg\\:hidden { display: none !important; }
                .lg\\:block { display: block !important; }
                .lg\\:flex { display: flex !important; }
                .lg\\:grid { display: grid !important; }
                .lg\\:text-left { text-align: left !important; }
                .lg\\:text-center { text-align: center !important; }
                .lg\\:text-right { text-align: right !important; }
            }

            @media (min-width: 1280px) {
                .xl\\:hidden { display: none !important; }
                .xl\\:block { display: block !important; }
                .xl\\:flex { display: flex !important; }
                .xl\\:grid { display: grid !important; }
                .xl\\:text-left { text-align: left !important; }
                .xl\\:text-center { text-align: center !important; }
                .xl\\:text-right { text-align: right !important; }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Configura observer de viewport
    setupViewportObserver() {
        const updateViewportClass = () => {
            const width = window.innerWidth;
            const body = document.body;
            
            // Remove classes existentes
            body.classList.remove('viewport-xs', 'viewport-sm', 'viewport-md', 'viewport-lg', 'viewport-xl', 'viewport-2xl');
            
            // Adiciona classe baseada no viewport
            if (width >= 1536) body.classList.add('viewport-2xl');
            else if (width >= 1280) body.classList.add('viewport-xl');
            else if (width >= 1024) body.classList.add('viewport-lg');
            else if (width >= 768) body.classList.add('viewport-md');
            else if (width >= 640) body.classList.add('viewport-sm');
            else body.classList.add('viewport-xs');
        };

        updateViewportClass();
        window.addEventListener('resize', updateViewportClass);
    }

    // Configura acessibilidade
    setupAccessibility() {
        // Adiciona suporte a navegação por teclado
        this.setupKeyboardNavigation();
        
        // Adiciona suporte a leitores de tela
        this.setupScreenReaderSupport();
        
        // Adiciona suporte a alto contraste
        this.setupHighContrast();
        
        // Adiciona suporte a redução de movimento
        this.setupReducedMotion();
    }

    // Configura navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC fecha modais
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal-overlay');
                modals.forEach(modal => modal.remove());
            }
            
            // Tab navigation
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    // Lida com navegação por tab
    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    // Configura suporte a leitores de tela
    setupScreenReaderSupport() {
        // Adiciona landmarks ARIA
        this.addAriaLandmarks();
        
        // Adiciona live regions
        this.addLiveRegions();
    }

    // Adiciona landmarks ARIA
    addAriaLandmarks() {
        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }

        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }

        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    // Adiciona live regions
    addLiveRegions() {
        if (!document.getElementById('live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
    }

    // Anuncia mensagem para leitores de tela
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Configura alto contraste
    setupHighContrast() {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const updateContrast = (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };

        updateContrast(mediaQuery);
        mediaQuery.addEventListener('change', updateContrast);
    }

    // Configura redução de movimento
    setupReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const updateMotion = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        updateMotion(mediaQuery);
        mediaQuery.addEventListener('change', updateMotion);
    }

    // Configura otimizações de performance
    setupPerformanceOptimizations() {
        // Lazy loading para imagens
        this.setupLazyLoading();
        
        // Debounce para eventos de scroll e resize
        this.setupEventDebouncing();
        
        // Intersection Observer para animações
        this.setupIntersectionObserver();
    }

    // Configura lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Configura debouncing de eventos
    setupEventDebouncing() {
        let scrollTimeout;
        let resizeTimeout;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                window.dispatchEvent(new CustomEvent('debouncedScroll'));
            }, 100);
        });

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                window.dispatchEvent(new CustomEvent('debouncedResize'));
            }, 250);
        });
    }

    // Configura Intersection Observer
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('[data-animate]').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // Cria tokens de design
    createDesignTokens() {
        this.tokens = {
            colors: this.themes[this.currentTheme],
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem'
            },
            typography: {
                fontFamily: {
                    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                },
                fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem'
                },
                fontWeight: {
                    normal: '400',
                    medium: '500',
                    semibold: '600',
                    bold: '700'
                },
                lineHeight: {
                    tight: '1.25',
                    normal: '1.5',
                    relaxed: '1.75'
                }
            },
            borderRadius: {
                none: '0',
                sm: '0.125rem',
                md: '0.375rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px'
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
        };
    }

    // Métodos públicos para uso da API
    getComponent(name) {
        return this.components[name];
    }

    getToken(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.tokens);
    }

    createButton(text, options) {
        return this.components.button.create(text, options);
    }

    createCard(content, options) {
        return this.components.card.create(content, options);
    }

    createModal(content, options) {
        return this.components.modal.create(content, options);
    }

    showModal(modal) {
        return this.components.modal.show(modal);
    }

    createTooltip(element, text, options) {
        return this.components.tooltip.create(element, text, options);
    }

    showNotification(message, options) {
        return this.components.notification.show(message, options);
    }

    showLoading(message) {
        return this.components.loading.show(message);
    }

    hideLoading(loading) {
        return this.components.loading.hide(loading);
    }

    createBadge(text, options) {
        return this.components.badge.create(text, options);
    }

    createAvatar(options) {
        return this.components.avatar.create(options);
    }
}

// Inicializa sistema automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.designSystem = new AdvancedDesignSystem();
});

// Exporta para uso global
window.AdvancedDesignSystem = AdvancedDesignSystem;
