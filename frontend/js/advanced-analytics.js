// Sistema de Analytics Avançados - ClaunNetworking
class AdvancedAnalyticsSystem {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.events = [];
        this.metrics = {};
        this.heatmapData = [];
        this.performanceData = {};
        this.userJourney = [];
        this.conversionFunnels = {};
        this.realTimeData = {};
        this.init();
    }

    // Inicializa sistema de analytics
    init() {
        this.setupEventTracking();
        this.setupPerformanceTracking();
        this.setupHeatmapTracking();
        this.setupUserJourneyTracking();
        this.setupConversionTracking();
        this.setupRealTimeTracking();
        this.setupErrorTracking();
        this.startDataCollection();
        this.createAnalyticsDashboard();
    }

    // Gera ID de sessão único
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obtém ID do usuário
    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    // Configura rastreamento de eventos
    setupEventTracking() {
        // Rastreia cliques
        document.addEventListener('click', (e) => {
            this.trackEvent('click', {
                element: e.target.tagName.toLowerCase(),
                className: e.target.className,
                id: e.target.id,
                text: e.target.textContent?.substring(0, 100),
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                url: window.location.href
            });
        });

        // Rastreia submissões de formulário
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formData = new FormData(form);
            const fields = {};
            
            for (let [key, value] of formData.entries()) {
                fields[key] = typeof value === 'string' ? value.substring(0, 50) : 'file';
            }

            this.trackEvent('form_submit', {
                formId: form.id,
                formClass: form.className,
                fields: Object.keys(fields),
                fieldCount: Object.keys(fields).length,
                timestamp: Date.now(),
                url: window.location.href
            });
        });

        // Rastreia mudanças de input
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.trackEvent('input_change', {
                    fieldName: e.target.name || e.target.id,
                    fieldType: e.target.type,
                    valueLength: e.target.value.length,
                    timestamp: Date.now()
                });
            }
        });

        // Rastreia scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                this.trackEvent('scroll', {
                    scrollPercent,
                    scrollY: window.scrollY,
                    timestamp: Date.now()
                });
            }, 100);
        });

        // Rastreia tempo na página
        this.pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.pageStartTime;
            this.trackEvent('page_exit', {
                timeOnPage,
                url: window.location.href,
                timestamp: Date.now()
            });
        });

        // Rastreia mudanças de visibilidade
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                hidden: document.hidden,
                timestamp: Date.now()
            });
        });
    }

    // Configura rastreamento de performance
    setupPerformanceTracking() {
        // Performance da página
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                this.performanceData = {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    firstPaint: this.getFirstPaint(),
                    firstContentfulPaint: this.getFirstContentfulPaint(),
                    largestContentfulPaint: this.getLargestContentfulPaint(),
                    cumulativeLayoutShift: this.getCumulativeLayoutShift(),
                    firstInputDelay: this.getFirstInputDelay(),
                    timestamp: Date.now()
                };

                this.trackEvent('performance', this.performanceData);
            }, 1000);
        });

        // Rastreia recursos lentos
        this.trackSlowResources();
        
        // Rastreia erros de JavaScript
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack?.substring(0, 500),
                timestamp: Date.now()
            });
        });
    }

    // Obtém First Paint
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    // Obtém First Contentful Paint
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    // Obtém Largest Contentful Paint
    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
                
                setTimeout(() => resolve(null), 5000); // Timeout após 5s
            } else {
                resolve(null);
            }
        });
    }

    // Obtém Cumulative Layout Shift
    getCumulativeLayoutShift() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                let clsValue = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });
                
                setTimeout(() => resolve(clsValue), 5000);
            } else {
                resolve(null);
            }
        });
    }

    // Obtém First Input Delay
    getFirstInputDelay() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const firstEntry = list.getEntries()[0];
                    resolve(firstEntry.processingStart - firstEntry.startTime);
                });
                observer.observe({ entryTypes: ['first-input'] });
                
                setTimeout(() => resolve(null), 10000); // Timeout após 10s
            } else {
                resolve(null);
            }
        });
    }

    // Rastreia recursos lentos
    trackSlowResources() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(resource => resource.duration > 1000);
            
            slowResources.forEach(resource => {
                this.trackEvent('slow_resource', {
                    name: resource.name,
                    duration: resource.duration,
                    size: resource.transferSize,
                    type: resource.initiatorType,
                    timestamp: Date.now()
                });
            });
        });
    }

    // Configura rastreamento de heatmap
    setupHeatmapTracking() {
        document.addEventListener('click', (e) => {
            this.heatmapData.push({
                x: e.clientX,
                y: e.clientY,
                element: e.target.tagName.toLowerCase(),
                timestamp: Date.now(),
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
        });

        document.addEventListener('mousemove', (e) => {
            // Throttle mousemove events
            if (Math.random() < 0.01) { // 1% sampling
                this.heatmapData.push({
                    x: e.clientX,
                    y: e.clientY,
                    type: 'mousemove',
                    timestamp: Date.now(),
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                });
            }
        });
    }

    // Configura rastreamento de jornada do usuário
    setupUserJourneyTracking() {
        // Rastreia entrada na página
        this.userJourney.push({
            action: 'page_enter',
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });

        // Rastreia navegação
        window.addEventListener('beforeunload', () => {
            this.userJourney.push({
                action: 'page_exit',
                url: window.location.href,
                timeOnPage: Date.now() - this.pageStartTime,
                timestamp: Date.now()
            });
        });

        // Rastreia cliques em links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.userJourney.push({
                    action: 'link_click',
                    url: window.location.href,
                    targetUrl: e.target.href,
                    linkText: e.target.textContent?.substring(0, 50),
                    timestamp: Date.now()
                });
            }
        });
    }

    // Configura rastreamento de conversão
    setupConversionTracking() {
        // Define funis de conversão
        this.conversionFunnels = {
            job_application: [
                'page_enter:/vagas.html',
                'click:ver-detalhes',
                'click:candidatar',
                'form_submit:application-form'
            ],
            user_registration: [
                'page_enter:/',
                'click:cadastro',
                'form_submit:registration-form'
            ],
            company_signup: [
                'page_enter:/solucoes-empresas.html',
                'click:escolher-plano',
                'form_submit:company-form'
            ]
        };

        // Rastreia progresso nos funis
        this.trackFunnelProgress();
    }

    // Rastreia progresso nos funis de conversão
    trackFunnelProgress() {
        Object.keys(this.conversionFunnels).forEach(funnelName => {
            const steps = this.conversionFunnels[funnelName];
            const userEvents = this.getUserEvents();
            
            let currentStep = 0;
            const funnelProgress = [];

            userEvents.forEach(event => {
                const eventSignature = this.getEventSignature(event);
                
                if (currentStep < steps.length && steps[currentStep] === eventSignature) {
                    funnelProgress.push({
                        step: currentStep,
                        stepName: steps[currentStep],
                        timestamp: event.timestamp,
                        completed: true
                    });
                    currentStep++;
                }
            });

            if (funnelProgress.length > 0) {
                this.trackEvent('funnel_progress', {
                    funnelName,
                    stepsCompleted: currentStep,
                    totalSteps: steps.length,
                    conversionRate: currentStep / steps.length,
                    progress: funnelProgress,
                    timestamp: Date.now()
                });
            }
        });
    }

    // Obtém assinatura do evento
    getEventSignature(event) {
        switch (event.type) {
            case 'page_enter':
                return `page_enter:${new URL(event.data.url).pathname}`;
            case 'click':
                return `click:${event.data.id || event.data.className}`;
            case 'form_submit':
                return `form_submit:${event.data.formId}`;
            default:
                return `${event.type}:${event.data.element || 'unknown'}`;
        }
    }

    // Configura rastreamento em tempo real
    setupRealTimeTracking() {
        // Atualiza métricas em tempo real
        setInterval(() => {
            this.updateRealTimeMetrics();
        }, 5000); // A cada 5 segundos

        // Rastreia usuários ativos
        this.trackActiveUser();
        
        // Rastreia engagement
        this.trackEngagement();
    }

    // Atualiza métricas em tempo real
    updateRealTimeMetrics() {
        this.realTimeData = {
            activeUsers: this.getActiveUsersCount(),
            pageViews: this.getPageViewsCount(),
            bounceRate: this.getBounceRate(),
            averageSessionDuration: this.getAverageSessionDuration(),
            topPages: this.getTopPages(),
            topEvents: this.getTopEvents(),
            deviceBreakdown: this.getDeviceBreakdown(),
            trafficSources: this.getTrafficSources(),
            timestamp: Date.now()
        };

        // Atualiza dashboard se estiver visível
        this.updateDashboard();
    }

    // Rastreia usuário ativo
    trackActiveUser() {
        const heartbeat = () => {
            this.trackEvent('heartbeat', {
                timestamp: Date.now(),
                url: window.location.href
            });
        };

        // Heartbeat inicial
        heartbeat();
        
        // Heartbeat a cada 30 segundos
        setInterval(heartbeat, 30000);
    }

    // Rastreia engagement
    trackEngagement() {
        let engagementScore = 0;
        let lastActivity = Date.now();

        // Incrementa score por atividade
        const activityEvents = ['click', 'scroll', 'input_change', 'form_submit'];
        
        document.addEventListener('click', () => this.updateEngagement());
        document.addEventListener('scroll', () => this.updateEngagement());
        document.addEventListener('input', () => this.updateEngagement());
        document.addEventListener('submit', () => this.updateEngagement());

        setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivity;
            
            if (timeSinceLastActivity > 60000) { // 1 minuto sem atividade
                engagementScore = Math.max(0, engagementScore - 10);
            }

            this.trackEvent('engagement_score', {
                score: engagementScore,
                timeSinceLastActivity,
                timestamp: Date.now()
            });
        }, 30000);
    }

    // Atualiza engagement
    updateEngagement() {
        this.lastActivity = Date.now();
        this.engagementScore = Math.min(100, (this.engagementScore || 0) + 5);
    }

    // Configura rastreamento de erros
    setupErrorTracking() {
        // Erros JavaScript
        window.addEventListener('error', (e) => {
            this.trackEvent('error', {
                type: 'javascript',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack,
                timestamp: Date.now()
            });
        });

        // Promises rejeitadas
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('error', {
                type: 'promise_rejection',
                reason: e.reason?.toString(),
                timestamp: Date.now()
            });
        });

        // Erros de recursos
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.trackEvent('error', {
                    type: 'resource',
                    element: e.target.tagName,
                    source: e.target.src || e.target.href,
                    timestamp: Date.now()
                });
            }
        }, true);
    }

    // Inicia coleta de dados
    startDataCollection() {
        // Salva dados periodicamente
        setInterval(() => {
            this.saveData();
        }, 30000); // A cada 30 segundos

        // Salva dados antes de sair
        window.addEventListener('beforeunload', () => {
            this.saveData();
        });

        // Limpa dados antigos
        setInterval(() => {
            this.cleanOldData();
        }, 3600000); // A cada hora
    }

    // Rastreia evento
    trackEvent(type, data) {
        const event = {
            id: this.generateEventId(),
            type,
            data,
            sessionId: this.sessionId,
            userId: this.userId,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.events.push(event);

        // Mantém apenas últimos 1000 eventos na memória
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }

        // Processa evento para métricas
        this.processEventForMetrics(event);
    }

    // Gera ID único para evento
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Processa evento para métricas
    processEventForMetrics(event) {
        const eventType = event.type;
        
        if (!this.metrics[eventType]) {
            this.metrics[eventType] = {
                count: 0,
                firstSeen: event.timestamp,
                lastSeen: event.timestamp
            };
        }

        this.metrics[eventType].count++;
        this.metrics[eventType].lastSeen = event.timestamp;
    }

    // Cria dashboard de analytics
    createAnalyticsDashboard() {
        // Dashboard desabilitado para não sobrepor a interface principal
        // O analytics funciona em background sem interface visual
        console.log('Analytics system initialized in background mode');
        return;
    }

    // Obtém HTML do dashboard
    getDashboardHTML() {
        return `
            <div class="dashboard-header">
                <h2>📊 Analytics em Tempo Real</h2>
                <div class="dashboard-controls">
                    <button onclick="analytics.toggleDashboard()" class="toggle-btn">−</button>
                    <button onclick="analytics.exportData()" class="export-btn">📥 Exportar</button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <!-- Métricas principais -->
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value" id="active-users">0</div>
                        <div class="metric-label">Usuários Ativos</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="page-views">0</div>
                        <div class="metric-label">Visualizações</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="bounce-rate">0%</div>
                        <div class="metric-label">Taxa de Rejeição</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="avg-session">0s</div>
                        <div class="metric-label">Sessão Média</div>
                    </div>
                </div>

                <!-- Gráficos -->
                <div class="charts-grid">
                    <div class="chart-container">
                        <h3>📈 Eventos por Tipo</h3>
                        <canvas id="events-chart" width="300" height="200"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>🔥 Heatmap de Cliques</h3>
                        <div id="heatmap-container"></div>
                    </div>
                </div>

                <!-- Tabelas de dados -->
                <div class="tables-grid">
                    <div class="table-container">
                        <h3>📄 Páginas Mais Visitadas</h3>
                        <div id="top-pages-table"></div>
                    </div>
                    <div class="table-container">
                        <h3>🎯 Eventos Mais Frequentes</h3>
                        <div id="top-events-table"></div>
                    </div>
                </div>

                <!-- Performance -->
                <div class="performance-section">
                    <h3>⚡ Performance</h3>
                    <div class="performance-metrics">
                        <div class="perf-metric">
                            <span class="perf-label">Tempo de Carregamento:</span>
                            <span class="perf-value" id="load-time">-</span>
                        </div>
                        <div class="perf-metric">
                            <span class="perf-label">First Contentful Paint:</span>
                            <span class="perf-value" id="fcp-time">-</span>
                        </div>
                        <div class="perf-metric">
                            <span class="perf-label">Largest Contentful Paint:</span>
                            <span class="perf-value" id="lcp-time">-</span>
                        </div>
                    </div>
                </div>

                <!-- Funis de conversão -->
                <div class="funnels-section">
                    <h3>🎯 Funis de Conversão</h3>
                    <div id="conversion-funnels"></div>
                </div>
            </div>
        `;
    }

    // Adiciona CSS do dashboard
    addDashboardCSS() {
        if (document.getElementById('analytics-dashboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'analytics-dashboard-styles';
        style.textContent = `
            .analytics-dashboard {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 400px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                overflow: hidden;
                border: 1px solid #e5e7eb;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .dashboard-header {
                background: #1f2937;
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .dashboard-header h2 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .dashboard-controls {
                display: flex;
                gap: 8px;
            }

            .toggle-btn, .export-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }

            .dashboard-content {
                padding: 16px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .metrics-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 20px;
            }

            .metric-card {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                text-align: center;
                border: 1px solid #e5e7eb;
            }

            .metric-value {
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 4px;
            }

            .metric-label {
                font-size: 11px;
                color: #6b7280;
                text-transform: uppercase;
                font-weight: 600;
            }

            .charts-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin-bottom: 20px;
            }

            .chart-container {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .chart-container h3 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #1f2937;
            }

            .tables-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin-bottom: 20px;
            }

            .table-container {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .table-container h3 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #1f2937;
            }

            .performance-section,
            .funnels-section {
                background: #f9fafb;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                margin-bottom: 16px;
            }

            .performance-section h3,
            .funnels-section h3 {
                margin: 0 0 12px 0;
                font-size: 14px;
                color: #1f2937;
            }

            .performance-metrics {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .perf-metric {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }

            .perf-label {
                color: #6b7280;
            }

            .perf-value {
                font-weight: 600;
                color: #1f2937;
            }

            #heatmap-container {
                height: 150px;
                background: #e5e7eb;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6b7280;
                font-size: 12px;
            }

            .dashboard-collapsed .dashboard-content {
                display: none;
            }

            @media (max-width: 768px) {
                .analytics-dashboard {
                    width: 90%;
                    left: 5%;
                    top: 10px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Inicializa gráficos
    initializeCharts() {
        // Gráfico de eventos (usando canvas simples)
        this.createEventsChart();
        this.createHeatmap();
    }

    // Cria gráfico de eventos
    createEventsChart() {
        const canvas = document.getElementById('events-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const eventTypes = Object.keys(this.metrics);
        const eventCounts = eventTypes.map(type => this.metrics[type].count);

        // Gráfico de barras simples
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const maxCount = Math.max(...eventCounts, 1);
        const barWidth = canvas.width / eventTypes.length;
        const barMaxHeight = canvas.height - 40;

        eventTypes.forEach((type, index) => {
            const count = eventCounts[index];
            const barHeight = (count / maxCount) * barMaxHeight;
            const x = index * barWidth;
            const y = canvas.height - barHeight - 20;

            // Barra
            ctx.fillStyle = '#8b5cf6';
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

            // Label
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(type.substring(0, 8), x + barWidth/2, canvas.height - 5);
            
            // Valor
            ctx.fillText(count.toString(), x + barWidth/2, y - 5);
        });
    }

    // Cria heatmap
    createHeatmap() {
        const container = document.getElementById('heatmap-container');
        if (!container || this.heatmapData.length === 0) {
            if (container) {
                container.innerHTML = 'Coletando dados de cliques...';
            }
            return;
        }

        // Cria visualização simples do heatmap
        const clicks = this.heatmapData.filter(point => point.type !== 'mousemove');
        const clickCounts = {};

        clicks.forEach(click => {
            const gridX = Math.floor(click.x / 50) * 50;
            const gridY = Math.floor(click.y / 50) * 50;
            const key = `${gridX},${gridY}`;
            clickCounts[key] = (clickCounts[key] || 0) + 1;
        });

        const maxClicks = Math.max(...Object.values(clickCounts), 1);
        
        container.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
                ${Object.entries(clickCounts).map(([key, count]) => {
                    const [x, y] = key.split(',').map(Number);
                    const intensity = count / maxClicks;
                    const size = 10 + (intensity * 20);
                    const opacity = 0.3 + (intensity * 0.7);
                    
                    return `
                        <div style="
                            position: absolute;
                            left: ${(x / window.innerWidth) * 100}%;
                            top: ${(y / window.innerHeight) * 100}%;
                            width: ${size}px;
                            height: ${size}px;
                            background: radial-gradient(circle, rgba(239,68,68,${opacity}) 0%, transparent 70%);
                            border-radius: 50%;
                            pointer-events: none;
                        "></div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Atualiza dashboard
    updateDashboard() {
        if (!document.getElementById('analytics-dashboard')) return;

        // Atualiza métricas principais
        this.updateElement('active-users', this.getActiveUsersCount());
        this.updateElement('page-views', this.getPageViewsCount());
        this.updateElement('bounce-rate', this.getBounceRate() + '%');
        this.updateElement('avg-session', this.formatDuration(this.getAverageSessionDuration()));

        // Atualiza performance
        if (this.performanceData.loadTime) {
            this.updateElement('load-time', this.formatDuration(this.performanceData.loadTime));
        }
        if (this.performanceData.firstContentfulPaint) {
            this.updateElement('fcp-time', this.formatDuration(this.performanceData.firstContentfulPaint));
        }

        // Atualiza gráficos
        this.createEventsChart();
        this.createHeatmap();

        // Atualiza tabelas
        this.updateTopPagesTable();
        this.updateTopEventsTable();
        this.updateConversionFunnels();
    }

    // Atualiza elemento
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Atualiza tabela de páginas mais visitadas
    updateTopPagesTable() {
        const container = document.getElementById('top-pages-table');
        if (!container) return;

        const topPages = this.getTopPages();
        
        container.innerHTML = `
            <div style="font-size: 12px;">
                ${topPages.slice(0, 5).map(page => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">${page.url}</span>
                        <span style="color: #6b7280; font-weight: 600;">${page.views}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Atualiza tabela de eventos mais frequentes
    updateTopEventsTable() {
        const container = document.getElementById('top-events-table');
        if (!container) return;

        const topEvents = this.getTopEvents();
        
        container.innerHTML = `
            <div style="font-size: 12px;">
                ${topEvents.slice(0, 5).map(event => `
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e5e7eb;">
                        <span style="color: #374151;">${event.type}</span>
                        <span style="color: #6b7280; font-weight: 600;">${event.count}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Atualiza funis de conversão
    updateConversionFunnels() {
        const container = document.getElementById('conversion-funnels');
        if (!container) return;

        const funnels = Object.keys(this.conversionFunnels);
        
        container.innerHTML = `
            <div style="font-size: 12px;">
                ${funnels.map(funnelName => {
                    const conversionRate = this.getFunnelConversionRate(funnelName);
                    return `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="color: #374151; font-weight: 600;">${funnelName.replace('_', ' ')}</span>
                                <span style="color: #6b7280;">${conversionRate}%</span>
                            </div>
                            <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="background: #8b5cf6; height: 100%; width: ${conversionRate}%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Métodos de cálculo de métricas
    getActiveUsersCount() {
        const oneHourAgo = Date.now() - 3600000;
        const recentEvents = this.events.filter(event => event.timestamp > oneHourAgo);
        const uniqueUsers = new Set(recentEvents.map(event => event.userId));
        return uniqueUsers.size;
    }

    getPageViewsCount() {
        return this.events.filter(event => event.type === 'page_enter').length;
    }

    getBounceRate() {
        const sessions = this.getSessionData();
        const bouncedSessions = sessions.filter(session => session.pageViews === 1);
        return sessions.length > 0 ? Math.round((bouncedSessions.length / sessions.length) * 100) : 0;
    }

    getAverageSessionDuration() {
        const sessions = this.getSessionData();
        if (sessions.length === 0) return 0;
        
        const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
        return totalDuration / sessions.length;
    }

    getSessionData() {
        const sessions = {};
        
        this.events.forEach(event => {
            if (!sessions[event.sessionId]) {
                sessions[event.sessionId] = {
                    startTime: event.timestamp,
                    endTime: event.timestamp,
                    pageViews: 0,
                    events: []
                };
            }
            
            const session = sessions[event.sessionId];
            session.endTime = Math.max(session.endTime, event.timestamp);
            session.events.push(event);
            
            if (event.type === 'page_enter') {
                session.pageViews++;
            }
        });

        return Object.values(sessions).map(session => ({
            ...session,
            duration: session.endTime - session.startTime
        }));
    }

    getTopPages() {
        const pageViews = {};
        
        this.events.filter(event => event.type === 'page_enter').forEach(event => {
            const url = new URL(event.data.url).pathname;
            pageViews[url] = (pageViews[url] || 0) + 1;
        });

        return Object.entries(pageViews)
            .map(([url, views]) => ({ url, views }))
            .sort((a, b) => b.views - a.views);
    }

    getTopEvents() {
        return Object.entries(this.metrics)
            .map(([type, data]) => ({ type, count: data.count }))
            .sort((a, b) => b.count - a.count);
    }

    getDeviceBreakdown() {
        const devices = {};
        
        this.events.forEach(event => {
            const userAgent = event.userAgent;
            let deviceType = 'desktop';
            
            if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
                deviceType = 'mobile';
            } else if (/Tablet|iPad/.test(userAgent)) {
                deviceType = 'tablet';
            }
            
            devices[deviceType] = (devices[deviceType] || 0) + 1;
        });

        return devices;
    }

    getTrafficSources() {
        const sources = {};
        
        this.userJourney.filter(event => event.action === 'page_enter').forEach(event => {
            const referrer = event.referrer;
            let source = 'direct';
            
            if (referrer) {
                try {
                    const domain = new URL(referrer).hostname;
                    if (domain.includes('google')) source = 'google';
                    else if (domain.includes('facebook')) source = 'facebook';
                    else if (domain.includes('linkedin')) source = 'linkedin';
                    else source = 'referral';
                } catch (e) {
                    source = 'unknown';
                }
            }
            
            sources[source] = (sources[source] || 0) + 1;
        });

        return sources;
    }

    getFunnelConversionRate(funnelName) {
        // Implementação simplificada
        const totalUsers = this.getActiveUsersCount();
        const completedUsers = Math.floor(totalUsers * Math.random() * 0.3); // Simulado
        return totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 100) : 0;
    }

    getUserEvents() {
        return this.events.concat(this.userJourney.map(journey => ({
            type: journey.action,
            data: journey,
            timestamp: journey.timestamp
        })));
    }

    formatDuration(ms) {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        return `${(ms / 60000).toFixed(1)}m`;
    }

    // Métodos de interface pública
    toggleDashboard() {
        const dashboard = document.getElementById('analytics-dashboard');
        if (dashboard) {
            dashboard.classList.toggle('dashboard-collapsed');
        }
    }

    exportData() {
        const data = {
            events: this.events,
            metrics: this.metrics,
            heatmapData: this.heatmapData,
            performanceData: this.performanceData,
            userJourney: this.userJourney,
            realTimeData: this.realTimeData,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Métodos de persistência
    saveData() {
        try {
            localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(-500))); // Últimos 500 eventos
            localStorage.setItem('analytics_metrics', JSON.stringify(this.metrics));
            localStorage.setItem('analytics_heatmap', JSON.stringify(this.heatmapData.slice(-1000))); // Últimos 1000 pontos
        } catch (e) {
            console.warn('Erro ao salvar dados de analytics:', e);
        }
    }

    loadData() {
        try {
            const events = localStorage.getItem('analytics_events');
            const metrics = localStorage.getItem('analytics_metrics');
            const heatmap = localStorage.getItem('analytics_heatmap');

            if (events) this.events = JSON.parse(events);
            if (metrics) this.metrics = JSON.parse(metrics);
            if (heatmap) this.heatmapData = JSON.parse(heatmap);
        } catch (e) {
            console.warn('Erro ao carregar dados de analytics:', e);
        }
    }

    cleanOldData() {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        this.events = this.events.filter(event => event.timestamp > oneWeekAgo);
        this.heatmapData = this.heatmapData.filter(point => point.timestamp > oneWeekAgo);
        this.userJourney = this.userJourney.filter(journey => journey.timestamp > oneWeekAgo);
    }

    // Método de reset (para desenvolvimento)
    reset() {
        localStorage.removeItem('analytics_events');
        localStorage.removeItem('analytics_metrics');
        localStorage.removeItem('analytics_heatmap');
        localStorage.removeItem('analytics_user_id');
        location.reload();
    }
}

// Inicializa sistema automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new AdvancedAnalyticsSystem();
});

// Exporta para uso global
window.AdvancedAnalyticsSystem = AdvancedAnalyticsSystem;
