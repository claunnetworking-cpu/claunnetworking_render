// Sistema de Transparência Salarial - ClaunNetworking
class SalaryTransparencySystem {
    constructor() {
        this.marketData = this.initializeMarketData();
        this.benefits = this.initializeBenefits();
    }

    initializeMarketData() {
        return {
            'desenvolvedor-frontend': { min: 4500, max: 12000, median: 7500 },
            'desenvolvedor-backend': { min: 5000, max: 15000, median: 8500 },
            'desenvolvedor-fullstack': { min: 5500, max: 16000, median: 9000 },
            'designer-ux-ui': { min: 4000, max: 11000, median: 6800 },
            'analista-dados': { min: 5500, max: 14000, median: 8200 },
            'gerente-projetos': { min: 7000, max: 18000, median: 11000 },
            'marketing-digital': { min: 3500, max: 9000, median: 5800 },
            'vendas': { min: 3000, max: 12000, median: 6500 },
            'recursos-humanos': { min: 4000, max: 10000, median: 6200 },
            'financeiro': { min: 4500, max: 13000, median: 7800 }
        };
    }

    initializeBenefits() {
        return {
            'plano-saude': { value: 350, description: 'Plano de saúde completo' },
            'plano-odonto': { value: 80, description: 'Plano odontológico' },
            'vale-refeicao': { value: 600, description: 'Vale refeição mensal' },
            'vale-alimentacao': { value: 400, description: 'Vale alimentação mensal' },
            'vale-transporte': { value: 220, description: 'Vale transporte mensal' },
            'gympass': { value: 120, description: 'Acesso a academias' },
            'home-office': { value: 200, description: 'Auxílio home office' },
            'plr': { value: 1500, description: 'Participação nos lucros (anual)' },
            'bonus': { value: 2000, description: 'Bônus por performance (anual)' },
            'treinamentos': { value: 300, description: 'Investimento em capacitação' },
            'convenios': { value: 150, description: 'Convênios e descontos' },
            'seguro-vida': { value: 100, description: 'Seguro de vida' }
        };
    }

    // Calcula valor total dos benefícios
    calculateBenefitsValue(selectedBenefits) {
        let totalMonthly = 0;
        let totalAnnual = 0;

        selectedBenefits.forEach(benefit => {
            const benefitData = this.benefits[benefit];
            if (benefitData) {
                if (benefit === 'plr' || benefit === 'bonus') {
                    totalAnnual += benefitData.value;
                } else {
                    totalMonthly += benefitData.value;
                }
            }
        });

        return {
            monthly: totalMonthly,
            annual: totalAnnual,
            monthlyEquivalent: totalMonthly + (totalAnnual / 12)
        };
    }

    // Gera calculadora de benefícios interativa
    createBenefitsCalculator(containerId, companyBenefits = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const calculatorHTML = `
            <div class="benefits-calculator">
                <h3>💰 Calculadora de Benefícios</h3>
                <div class="benefits-grid">
                    ${Object.entries(this.benefits).map(([key, benefit]) => `
                        <div class="benefit-item">
                            <label class="benefit-checkbox">
                                <input type="checkbox" value="${key}" 
                                    ${companyBenefits.includes(key) ? 'checked' : ''}>
                                <span class="checkmark"></span>
                                <div class="benefit-info">
                                    <span class="benefit-name">${benefit.description}</span>
                                    <span class="benefit-value">R$ ${benefit.value.toLocaleString('pt-BR')}</span>
                                </div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="benefits-summary">
                    <div class="summary-item">
                        <span class="summary-label">Benefícios Mensais:</span>
                        <span class="summary-value" id="monthly-benefits">R$ 0</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Benefícios Anuais:</span>
                        <span class="summary-value" id="annual-benefits">R$ 0</span>
                    </div>
                    <div class="summary-item total">
                        <span class="summary-label">Valor Total Mensal:</span>
                        <span class="summary-value" id="total-benefits">R$ 0</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = calculatorHTML;
        this.attachCalculatorEvents(container);
        this.updateBenefitsCalculation(container);
    }

    attachCalculatorEvents(container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBenefitsCalculation(container);
            });
        });
    }

    updateBenefitsCalculation(container) {
        const selectedBenefits = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        const totals = this.calculateBenefitsValue(selectedBenefits);
        
        container.querySelector('#monthly-benefits').textContent = 
            `R$ ${totals.monthly.toLocaleString('pt-BR')}`;
        container.querySelector('#annual-benefits').textContent = 
            `R$ ${totals.annual.toLocaleString('pt-BR')}`;
        container.querySelector('#total-benefits').textContent = 
            `R$ ${Math.round(totals.monthlyEquivalent).toLocaleString('pt-BR')}`;
    }

    // Cria comparativo com mercado
    createMarketComparison(position, salary, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const marketData = this.marketData[position.toLowerCase().replace(/\s+/g, '-')];
        if (!marketData) {
            container.innerHTML = '<p>Dados de mercado não disponíveis para esta posição.</p>';
            return;
        }

        const comparison = this.calculateMarketPosition(salary, marketData);
        
        const comparisonHTML = `
            <div class="market-comparison">
                <h3>📊 Comparativo com Mercado</h3>
                <div class="salary-range">
                    <div class="range-bar">
                        <div class="range-fill" style="width: ${comparison.percentile}%"></div>
                        <div class="salary-marker" style="left: ${comparison.percentile}%">
                            <span class="marker-value">R$ ${salary.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>
                    <div class="range-labels">
                        <span>R$ ${marketData.min.toLocaleString('pt-BR')}</span>
                        <span>R$ ${marketData.median.toLocaleString('pt-BR')}</span>
                        <span>R$ ${marketData.max.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
                <div class="comparison-stats">
                    <div class="stat-item">
                        <span class="stat-label">Posição no Mercado:</span>
                        <span class="stat-value ${comparison.class}">${comparison.position}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Diferença da Mediana:</span>
                        <span class="stat-value">${comparison.difference}</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = comparisonHTML;
    }

    calculateMarketPosition(salary, marketData) {
        const percentile = Math.min(100, Math.max(0, 
            ((salary - marketData.min) / (marketData.max - marketData.min)) * 100
        ));

        let position, className;
        if (percentile >= 80) {
            position = 'Acima do Mercado';
            className = 'above-market';
        } else if (percentile >= 40) {
            position = 'Dentro da Média';
            className = 'average-market';
        } else {
            position = 'Abaixo do Mercado';
            className = 'below-market';
        }

        const difference = salary - marketData.median;
        const differenceText = difference >= 0 
            ? `+R$ ${difference.toLocaleString('pt-BR')}`
            : `-R$ ${Math.abs(difference).toLocaleString('pt-BR')}`;

        return {
            percentile,
            position,
            class: className,
            difference: differenceText
        };
    }

    // Cria seção de transparência salarial para perfil de empresa
    createSalaryTransparencySection(companyData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const transparencyHTML = `
            <div class="salary-transparency-section">
                <h3>💎 Transparência Salarial</h3>
                <div class="transparency-grid">
                    <div class="salary-ranges">
                        <h4>Faixas Salariais por Cargo</h4>
                        ${companyData.positions?.map(pos => `
                            <div class="position-salary">
                                <span class="position-name">${pos.title}</span>
                                <span class="salary-range">
                                    R$ ${pos.salaryMin.toLocaleString('pt-BR')} - 
                                    R$ ${pos.salaryMax.toLocaleString('pt-BR')}
                                </span>
                            </div>
                        `).join('') || '<p>Informações não disponíveis</p>'}
                    </div>
                    <div class="investment-info">
                        <h4>Investimento em Funcionários</h4>
                        <div class="investment-stats">
                            <div class="investment-item">
                                <span class="investment-icon">📚</span>
                                <div class="investment-details">
                                    <span class="investment-label">Treinamentos/ano</span>
                                    <span class="investment-value">R$ ${companyData.trainingBudget?.toLocaleString('pt-BR') || '5.000'}</span>
                                </div>
                            </div>
                            <div class="investment-item">
                                <span class="investment-icon">📈</span>
                                <div class="investment-details">
                                    <span class="investment-label">Taxa de Promoção</span>
                                    <span class="investment-value">${companyData.promotionRate || '25'}%</span>
                                </div>
                            </div>
                            <div class="investment-item">
                                <span class="investment-icon">⏱️</span>
                                <div class="investment-details">
                                    <span class="investment-label">Tempo Médio na Empresa</span>
                                    <span class="investment-value">${companyData.avgTenure || '3.2'} anos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = transparencyHTML;
    }
}

// CSS para sistema de transparência salarial
const salaryTransparencyCSS = `
.benefits-calculator {
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
}

.benefits-calculator h3 {
    margin-bottom: 20px;
    color: #1f2937;
    font-size: 20px;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
}

.benefit-item {
    background: white;
    border-radius: 8px;
    padding: 12px;
    border: 2px solid #e5e7eb;
    transition: all 0.2s ease;
}

.benefit-item:hover {
    border-color: #8b5cf6;
    transform: translateY(-2px);
}

.benefit-checkbox {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    width: 100%;
}

.benefit-checkbox input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #8b5cf6;
}

.benefit-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.benefit-name {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
}

.benefit-value {
    color: #10b981;
    font-weight: 700;
    font-size: 13px;
}

.benefits-summary {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 2px solid #e5e7eb;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
}

.summary-item:last-child {
    border-bottom: none;
}

.summary-item.total {
    border-top: 2px solid #8b5cf6;
    margin-top: 12px;
    padding-top: 16px;
    font-weight: 700;
    font-size: 16px;
}

.summary-label {
    color: #6b7280;
}

.summary-value {
    color: #10b981;
    font-weight: 600;
}

.market-comparison {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 24px;
    color: white;
    margin: 20px 0;
}

.market-comparison h3 {
    margin-bottom: 20px;
    font-size: 20px;
}

.salary-range {
    margin-bottom: 20px;
}

.range-bar {
    position: relative;
    height: 12px;
    background: rgba(255,255,255,0.2);
    border-radius: 6px;
    margin-bottom: 12px;
}

.range-fill {
    height: 100%;
    background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
    border-radius: 6px;
    transition: width 0.3s ease;
}

.salary-marker {
    position: absolute;
    top: -8px;
    transform: translateX(-50%);
    background: white;
    color: #1f2937;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    opacity: 0.8;
}

.comparison-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255,255,255,0.1);
    padding: 12px;
    border-radius: 8px;
}

.stat-value.above-market { color: #10b981; }
.stat-value.average-market { color: #f59e0b; }
.stat-value.below-market { color: #ef4444; }

.salary-transparency-section {
    background: #f8fafc;
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
}

.transparency-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.position-salary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: white;
    border-radius: 8px;
    margin-bottom: 8px;
    border-left: 4px solid #8b5cf6;
}

.position-name {
    font-weight: 600;
    color: #374151;
}

.salary-range {
    color: #10b981;
    font-weight: 700;
}

.investment-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.investment-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    padding: 16px;
    border-radius: 8px;
}

.investment-icon {
    font-size: 24px;
    width: 40px;
    text-align: center;
}

.investment-details {
    display: flex;
    flex-direction: column;
}

.investment-label {
    font-size: 14px;
    color: #6b7280;
}

.investment-value {
    font-weight: 700;
    color: #8b5cf6;
    font-size: 16px;
}

@media (max-width: 768px) {
    .transparency-grid {
        grid-template-columns: 1fr;
    }
    
    .benefits-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Adiciona CSS ao documento
if (!document.getElementById('salary-transparency-styles')) {
    const style = document.createElement('style');
    style.id = 'salary-transparency-styles';
    style.textContent = salaryTransparencyCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.salaryTransparencySystem = new SalaryTransparencySystem();
