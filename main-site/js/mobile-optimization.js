// Sistema de Otimização Mobile - ClaunNetworking
class MobileOptimizationSystem {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchSupport = 'ontouchstart' in window;
        this.orientation = this.getOrientation();
        this.init();
    }

    // Detecta dispositivos móveis
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    // Detecta tablets
    detectTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && 
               window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    // Obtém orientação do dispositivo
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    // Inicializa otimizações mobile
    init() {
        this.addMobileClasses();
        this.optimizeViewport();
        this.optimizeForms();
        this.optimizeNavigation();
        this.optimizeModals();
        this.optimizeCards();
        this.optimizeButtons();
        this.addTouchGestures();
        this.optimizeImages();
        this.addOrientationHandler();
        this.optimizePerformance();
    }

    // Adiciona classes CSS baseadas no dispositivo
    addMobileClasses() {
        const body = document.body;
        
        if (this.isMobile) {
            body.classList.add('mobile-device');
        }
        
        if (this.isTablet) {
            body.classList.add('tablet-device');
        }
        
        if (this.touchSupport) {
            body.classList.add('touch-device');
        }
        
        body.classList.add(`orientation-${this.orientation}`);
    }

    // Otimiza viewport
    optimizeViewport() {
        // Adiciona meta viewport se não existir
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }

        // Previne zoom em inputs no iOS
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }
    }

    // Otimiza formulários para mobile
    optimizeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Adiciona classe mobile
            if (this.isMobile) {
                form.classList.add('mobile-form');
            }

            // Otimiza inputs
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                this.optimizeInput(input);
            });

            // Adiciona botão de scroll para próximo campo
            if (this.isMobile) {
                this.addFieldNavigation(form);
            }
        });
    }

    // Otimiza input individual
    optimizeInput(input) {
        // Adiciona atributos mobile-friendly
        if (input.type === 'email') {
            input.setAttribute('inputmode', 'email');
        } else if (input.type === 'tel') {
            input.setAttribute('inputmode', 'tel');
        } else if (input.type === 'number') {
            input.setAttribute('inputmode', 'numeric');
        }

        // Adiciona autocomplete apropriado
        if (input.name.includes('name')) {
            input.setAttribute('autocomplete', 'name');
        } else if (input.name.includes('email')) {
            input.setAttribute('autocomplete', 'email');
        } else if (input.name.includes('phone') || input.name.includes('tel')) {
            input.setAttribute('autocomplete', 'tel');
        }

        // Adiciona eventos touch-friendly
        if (this.touchSupport) {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        }
    }

    // Adiciona navegação entre campos
    addFieldNavigation(form) {
        const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
        
        inputs.forEach((input, index) => {
            // Adiciona botões de navegação
            const navContainer = document.createElement('div');
            navContainer.className = 'mobile-field-nav';
            navContainer.innerHTML = `
                <button type="button" class="field-nav-btn prev" ${index === 0 ? 'disabled' : ''}>
                    ← Anterior
                </button>
                <span class="field-counter">${index + 1} de ${inputs.length}</span>
                <button type="button" class="field-nav-btn next" ${index === inputs.length - 1 ? 'disabled' : ''}>
                    Próximo →
                </button>
            `;

            // Insere após o input
            input.parentNode.insertBefore(navContainer, input.nextSibling);

            // Adiciona eventos
            const prevBtn = navContainer.querySelector('.prev');
            const nextBtn = navContainer.querySelector('.next');

            prevBtn.addEventListener('click', () => {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            // Esconde navegação por padrão
            navContainer.style.display = 'none';

            // Mostra navegação quando campo está focado
            input.addEventListener('focus', () => {
                document.querySelectorAll('.mobile-field-nav').forEach(nav => {
                    nav.style.display = 'none';
                });
                navContainer.style.display = 'flex';
            });
        });
    }

    // Otimiza navegação
    optimizeNavigation() {
        if (!this.isMobile) return;

        // Converte menu horizontal em hamburger
        const navs = document.querySelectorAll('nav, .navigation');
        
        navs.forEach(nav => {
            if (!nav.classList.contains('mobile-optimized')) {
                this.createMobileMenu(nav);
                nav.classList.add('mobile-optimized');
            }
        });
    }

    // Cria menu mobile
    createMobileMenu(nav) {
        const menuItems = nav.querySelectorAll('a, button');
        
        if (menuItems.length > 3) {
            // Cria botão hamburger
            const hamburger = document.createElement('button');
            hamburger.className = 'mobile-hamburger';
            hamburger.innerHTML = '☰';
            hamburger.setAttribute('aria-label', 'Menu');

            // Cria overlay do menu
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            
            const menuContainer = document.createElement('div');
            menuContainer.className = 'mobile-menu-container';
            
            // Move itens para o menu mobile
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            
            menuItems.forEach(item => {
                const mobileItem = item.cloneNode(true);
                mobileItem.classList.add('mobile-menu-item');
                mobileMenu.appendChild(mobileItem);
            });

            // Adiciona botão de fechar
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-menu-close';
            closeBtn.innerHTML = '×';
            closeBtn.setAttribute('aria-label', 'Fechar menu');

            menuContainer.appendChild(closeBtn);
            menuContainer.appendChild(mobileMenu);
            overlay.appendChild(menuContainer);

            // Adiciona ao DOM
            nav.appendChild(hamburger);
            document.body.appendChild(overlay);

            // Eventos
            hamburger.addEventListener('click', () => {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            closeBtn.addEventListener('click', () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Esconde itens originais no mobile
            menuItems.forEach(item => {
                item.style.display = 'none';
            });
        }
    }

    // Otimiza modais para mobile
    optimizeModals() {
        const modals = document.querySelectorAll('.modal, [class*="modal"]');
        
        modals.forEach(modal => {
            if (this.isMobile) {
                modal.classList.add('mobile-modal');
                
                // Adiciona swipe para fechar
                this.addSwipeToClose(modal);
                
                // Otimiza altura
                const content = modal.querySelector('.modal-content, [class*="modal-content"]');
                if (content) {
                    content.style.maxHeight = '90vh';
                    content.style.overflow = 'auto';
                }
            }
        });
    }

    // Adiciona swipe para fechar modal
    addSwipeToClose(modal) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        modal.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
        });

        modal.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) {
                modal.style.transform = `translateY(${deltaY}px)`;
                modal.style.opacity = Math.max(0.5, 1 - deltaY / 300);
            }
        });

        modal.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaY = currentY - startY;
            
            if (deltaY > 100) {
                // Fecha modal
                modal.style.display = 'none';
            } else {
                // Volta à posição original
                modal.style.transform = '';
                modal.style.opacity = '';
            }
            
            isDragging = false;
        });
    }

    // Otimiza cards
    optimizeCards() {
        if (!this.isMobile) return;

        const cards = document.querySelectorAll('.card, [class*="card"]');
        
        cards.forEach(card => {
            card.classList.add('mobile-card');
            
            // Adiciona ripple effect
            this.addRippleEffect(card);
            
            // Otimiza layout interno
            const content = card.querySelector('.card-content, .card-body');
            if (content) {
                content.classList.add('mobile-card-content');
            }
        });
    }

    // Adiciona efeito ripple
    addRippleEffect(element) {
        element.addEventListener('touchstart', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.touches[0].clientX - rect.left - size / 2;
            const y = e.touches[0].clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Otimiza botões
    optimizeButtons() {
        const buttons = document.querySelectorAll('button, .btn, [role="button"]');
        
        buttons.forEach(button => {
            if (this.isMobile) {
                button.classList.add('mobile-button');
                
                // Aumenta área de toque
                const currentPadding = window.getComputedStyle(button).padding;
                if (currentPadding === '0px' || !currentPadding) {
                    button.style.padding = '12px 16px';
                }
                
                // Adiciona feedback tátil
                this.addTactileFeedback(button);
            }
        });
    }

    // Adiciona feedback tátil
    addTactileFeedback(element) {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.95)';
            element.style.opacity = '0.8';
            
            // Vibração se disponível
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });

        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.style.transform = '';
                element.style.opacity = '';
            }, 100);
        });
    }

    // Adiciona gestos touch
    addTouchGestures() {
        if (!this.touchSupport) return;

        // Swipe para navegação
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Detecta swipe horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });

        // Pull to refresh
        this.addPullToRefresh();
    }

    // Manipula swipe para direita
    handleSwipeRight() {
        // Volta página se possível
        if (window.history.length > 1) {
            const event = new CustomEvent('swipeRight');
            document.dispatchEvent(event);
        }
    }

    // Manipula swipe para esquerda
    handleSwipeLeft() {
        // Avança página se possível
        const event = new CustomEvent('swipeLeft');
        document.dispatchEvent(event);
    }

    // Adiciona pull to refresh
    addPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        let isPulling = false;
        
        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-refresh-indicator';
        refreshIndicator.innerHTML = '↓ Puxe para atualizar';
        refreshIndicator.style.display = 'none';
        document.body.insertBefore(refreshIndicator, document.body.firstChild);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            pullDistance = e.touches[0].clientY - startY;
            
            if (pullDistance > 0 && pullDistance < 100) {
                refreshIndicator.style.display = 'block';
                refreshIndicator.style.transform = `translateY(${pullDistance}px)`;
                refreshIndicator.style.opacity = pullDistance / 100;
                
                if (pullDistance > 60) {
                    refreshIndicator.innerHTML = '↑ Solte para atualizar';
                    refreshIndicator.classList.add('ready');
                } else {
                    refreshIndicator.innerHTML = '↓ Puxe para atualizar';
                    refreshIndicator.classList.remove('ready');
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (isPulling && pullDistance > 60) {
                refreshIndicator.innerHTML = '🔄 Atualizando...';
                refreshIndicator.classList.add('loading');
                
                // Simula refresh
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                refreshIndicator.style.display = 'none';
                refreshIndicator.style.transform = '';
                refreshIndicator.classList.remove('ready', 'loading');
            }
            
            isPulling = false;
            pullDistance = 0;
        });
    }

    // Otimiza imagens
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Responsive images
            if (this.isMobile && !img.hasAttribute('srcset')) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
            
            // Placeholder enquanto carrega
            if (!img.complete) {
                img.style.backgroundColor = '#f3f4f6';
                img.style.minHeight = '100px';
            }
        });
    }

    // Adiciona handler de orientação
    addOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.orientation = this.getOrientation();
                document.body.classList.remove('orientation-portrait', 'orientation-landscape');
                document.body.classList.add(`orientation-${this.orientation}`);
                
                // Reajusta viewport
                this.optimizeViewport();
                
                // Dispara evento customizado
                const event = new CustomEvent('orientationChanged', {
                    detail: { orientation: this.orientation }
                });
                document.dispatchEvent(event);
            }, 100);
        });
    }

    // Otimiza performance
    optimizePerformance() {
        if (!this.isMobile) return;

        // Debounce scroll events
        let scrollTimeout;
        const originalScroll = window.onscroll;
        
        window.onscroll = function(e) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (originalScroll) originalScroll.call(this, e);
            }, 16); // ~60fps
        };

        // Lazy load de componentes pesados
        const heavyComponents = document.querySelectorAll('[data-lazy-load]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    const loadFunction = component.dataset.lazyLoad;
                    
                    if (window[loadFunction]) {
                        window[loadFunction](component);
                    }
                    
                    observer.unobserve(component);
                }
            });
        });

        heavyComponents.forEach(component => {
            observer.observe(component);
        });

        // Preload de recursos críticos
        this.preloadCriticalResources();
    }

    // Preload de recursos críticos
    preloadCriticalResources() {
        const criticalCSS = [
            '/css/mobile.css',
            '/css/critical.css'
        ];

        const criticalJS = [
            '/js/mobile-core.js'
        ];

        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });

        criticalJS.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Utilitários públicos
    isMobileDevice() {
        return this.isMobile;
    }

    isTabletDevice() {
        return this.isTablet;
    }

    hasTouchSupport() {
        return this.touchSupport;
    }

    getCurrentOrientation() {
        return this.orientation;
    }

    // Força reotimização
    reoptimize() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.orientation = this.getOrientation();
        this.addMobileClasses();
    }
}

// CSS para otimizações mobile
const mobileOptimizationCSS = `
/* Mobile Device Styles */
.mobile-device {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
}

.mobile-device * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
}

.mobile-device input,
.mobile-device textarea,
.mobile-device [contenteditable] {
    -webkit-user-select: text;
    user-select: text;
}

/* Touch Device Styles */
.touch-device button,
.touch-device .btn,
.touch-device [role="button"] {
    min-height: 44px;
    min-width: 44px;
    position: relative;
    overflow: hidden;
}

/* Mobile Forms */
.mobile-form {
    padding: 16px;
}

.mobile-form input,
.mobile-form select,
.mobile-form textarea {
    font-size: 16px !important;
    padding: 12px 16px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 16px;
}

.mobile-form input:focus,
.mobile-form select:focus,
.mobile-form textarea:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.mobile-field-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-bottom: 16px;
    background: #f9fafb;
    border-radius: 8px;
    padding: 8px 16px;
}

.field-nav-btn {
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
}

.field-nav-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
}

.field-counter {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
}

/* Mobile Navigation */
.mobile-hamburger {
    display: block;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    color: #374151;
}

.mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.mobile-menu-overlay.active {
    opacity: 1;
    visibility: visible;
}

.mobile-menu-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 80%;
    max-width: 300px;
    height: 100%;
    background: white;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
}

.mobile-menu-overlay.active .mobile-menu-container {
    transform: translateX(0);
}

.mobile-menu-close {
    align-self: flex-end;
    background: none;
    border: none;
    font-size: 32px;
    padding: 16px;
    cursor: pointer;
    color: #6b7280;
}

.mobile-menu {
    flex: 1;
    padding: 0 16px;
    overflow-y: auto;
}

.mobile-menu-item {
    display: block;
    padding: 16px 0;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    text-decoration: none;
    font-weight: 500;
}

.mobile-menu-item:hover {
    color: #8b5cf6;
}

/* Mobile Modals */
.mobile-modal {
    padding: 16px;
}

.mobile-modal .modal-content {
    margin: 0;
    border-radius: 16px 16px 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 90vh;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.mobile-modal.active .modal-content {
    transform: translateY(0);
}

/* Mobile Cards */
.mobile-card {
    margin-bottom: 16px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

.mobile-card-content {
    padding: 16px;
}

/* Ripple Effect */
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Mobile Buttons */
.mobile-button {
    min-height: 44px;
    padding: 12px 20px;
    font-size: 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

/* Pull to Refresh */
.pull-refresh-indicator {
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: #8b5cf6;
    color: white;
    padding: 12px 20px;
    border-radius: 0 0 12px 12px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999;
    transition: all 0.3s ease;
}

.pull-refresh-indicator.ready {
    background: #10b981;
}

.pull-refresh-indicator.loading {
    background: #f59e0b;
}

/* Orientation Styles */
.orientation-portrait {
    /* Estilos específicos para modo retrato */
}

.orientation-landscape {
    /* Estilos específicos para modo paisagem */
}

.orientation-landscape .mobile-menu-container {
    width: 60%;
}

/* Tablet Optimizations */
.tablet-device .mobile-menu-container {
    width: 40%;
    max-width: 400px;
}

.tablet-device .mobile-form {
    max-width: 600px;
    margin: 0 auto;
}

/* Responsive Grid for Mobile */
@media (max-width: 768px) {
    .grid,
    .row,
    [class*="grid"] {
        display: block !important;
    }
    
    .grid > *,
    .row > *,
    [class*="grid"] > * {
        width: 100% !important;
        margin-bottom: 16px;
    }
    
    .container {
        padding: 16px;
    }
    
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }
    h4 { font-size: 16px; }
    h5 { font-size: 14px; }
    h6 { font-size: 12px; }
    
    .btn,
    button {
        width: 100%;
        margin-bottom: 8px;
    }
    
    .btn:last-child,
    button:last-child {
        margin-bottom: 0;
    }
    
    table {
        font-size: 12px;
    }
    
    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
}

/* Very Small Screens */
@media (max-width: 480px) {
    .mobile-menu-container {
        width: 90%;
    }
    
    .mobile-form {
        padding: 12px;
    }
    
    .mobile-button {
        min-height: 48px;
        font-size: 18px;
    }
    
    .field-nav-btn {
        padding: 8px 12px;
        font-size: 12px;
    }
}

/* High DPI Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .mobile-device img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .mobile-device {
        background-color: #1f2937;
        color: #f9fafb;
    }
    
    .mobile-form input,
    .mobile-form select,
    .mobile-form textarea {
        background: #374151;
        border-color: #4b5563;
        color: #f9fafb;
    }
    
    .mobile-menu-container {
        background: #1f2937;
    }
    
    .mobile-menu-item {
        color: #f9fafb;
        border-color: #374151;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    .mobile-modal .modal-content,
    .mobile-menu-container,
    .ripple-effect {
        transition: none;
        animation: none;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('mobile-optimization-styles')) {
    const style = document.createElement('style');
    style.id = 'mobile-optimization-styles';
    style.textContent = mobileOptimizationCSS;
    document.head.appendChild(style);
}

// Inicializa sistema automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimization = new MobileOptimizationSystem();
});

// Exporta para uso global
window.MobileOptimizationSystem = MobileOptimizationSystem;
