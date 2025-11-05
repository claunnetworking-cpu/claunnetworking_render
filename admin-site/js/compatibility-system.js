// Sistema de Compatibilidade Inteligente - ClaunNetworking
class CompatibilitySystem {
    constructor() {
        this.weights = {
            skills: 0.35,
            experience: 0.25,
            location: 0.15,
            education: 0.15,
            salary: 0.10
        };
    }

    // Calcula score de compatibilidade entre candidato e vaga
    calculateCompatibility(candidate, job) {
        let totalScore = 0;

        // Score de habilidades (35%)
        const skillsScore = this.calculateSkillsMatch(candidate.skills, job.requiredSkills);
        totalScore += skillsScore * this.weights.skills;

        // Score de experiência (25%)
        const experienceScore = this.calculateExperienceMatch(candidate.experience, job.requiredExperience);
        totalScore += experienceScore * this.weights.experience;

        // Score de localização (15%)
        const locationScore = this.calculateLocationMatch(candidate.location, job.location, job.remote);
        totalScore += locationScore * this.weights.location;

        // Score de educação (15%)
        const educationScore = this.calculateEducationMatch(candidate.education, job.requiredEducation);
        totalScore += educationScore * this.weights.education;

        // Score de salário (10%)
        const salaryScore = this.calculateSalaryMatch(candidate.expectedSalary, job.salaryRange);
        totalScore += salaryScore * this.weights.salary;

        return Math.round(totalScore * 100);
    }

    calculateSkillsMatch(candidateSkills, requiredSkills) {
        if (!candidateSkills || !requiredSkills) return 0;
        
        const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
        const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
        
        let matches = 0;
        requiredSet.forEach(skill => {
            if (candidateSet.has(skill)) matches++;
        });
        
        return matches / requiredSet.size;
    }

    calculateExperienceMatch(candidateExp, requiredExp) {
        if (!candidateExp || !requiredExp) return 0.5;
        
        if (candidateExp >= requiredExp) return 1;
        if (candidateExp >= requiredExp * 0.7) return 0.8;
        if (candidateExp >= requiredExp * 0.5) return 0.6;
        return 0.3;
    }

    calculateLocationMatch(candidateLocation, jobLocation, isRemote) {
        if (isRemote) return 1;
        if (!candidateLocation || !jobLocation) return 0.5;
        
        const candidateCity = candidateLocation.city?.toLowerCase();
        const jobCity = jobLocation.city?.toLowerCase();
        const candidateState = candidateLocation.state?.toLowerCase();
        const jobState = jobLocation.state?.toLowerCase();
        
        if (candidateCity === jobCity) return 1;
        if (candidateState === jobState) return 0.7;
        return 0.3;
    }

    calculateEducationMatch(candidateEdu, requiredEdu) {
        if (!requiredEdu) return 1;
        if (!candidateEdu) return 0.3;
        
        const eduLevels = {
            'fundamental': 1,
            'medio': 2,
            'tecnico': 3,
            'superior': 4,
            'pos': 5,
            'mestrado': 6,
            'doutorado': 7
        };
        
        const candidateLevel = eduLevels[candidateEdu.toLowerCase()] || 0;
        const requiredLevel = eduLevels[requiredEdu.toLowerCase()] || 0;
        
        if (candidateLevel >= requiredLevel) return 1;
        return candidateLevel / requiredLevel;
    }

    calculateSalaryMatch(expectedSalary, salaryRange) {
        if (!expectedSalary || !salaryRange) return 0.8;
        
        const { min, max } = salaryRange;
        if (expectedSalary >= min && expectedSalary <= max) return 1;
        if (expectedSalary <= min * 1.2) return 0.8;
        if (expectedSalary <= min * 1.5) return 0.6;
        return 0.3;
    }

    // Gera badge de compatibilidade
    getCompatibilityBadge(score) {
        if (score >= 90) return { text: 'Match Perfeito', class: 'perfect-match', color: '#10B981' };
        if (score >= 75) return { text: 'Alta Compatibilidade', class: 'high-match', color: '#3B82F6' };
        if (score >= 60) return { text: 'Boa Compatibilidade', class: 'good-match', color: '#8B5CF6' };
        if (score >= 40) return { text: 'Potencial Interessante', class: 'potential-match', color: '#F59E0B' };
        return { text: 'Baixa Compatibilidade', class: 'low-match', color: '#EF4444' };
    }

    // Renderiza badge no HTML
    renderCompatibilityBadge(score, container) {
        const badge = this.getCompatibilityBadge(score);
        const badgeHTML = `
            <div class="compatibility-badge ${badge.class}" style="background-color: ${badge.color}">
                <span class="badge-icon">🎯</span>
                <span class="badge-text">${badge.text}</span>
                <span class="badge-score">${score}%</span>
            </div>
        `;
        
        if (container) {
            container.innerHTML = badgeHTML;
        }
        
        return badgeHTML;
    }

    // Analisa perfil e sugere melhorias
    suggestProfileImprovements(candidate, topJobs) {
        const suggestions = [];
        
        // Analisa skills mais demandadas
        const demandedSkills = this.getMostDemandedSkills(topJobs);
        const candidateSkills = candidate.skills?.map(s => s.toLowerCase()) || [];
        
        demandedSkills.forEach(skill => {
            if (!candidateSkills.includes(skill.toLowerCase())) {
                suggestions.push({
                    type: 'skill',
                    message: `Considere adicionar "${skill}" às suas habilidades`,
                    impact: 'high'
                });
            }
        });
        
        // Analisa experiência
        const avgRequiredExp = this.getAverageRequiredExperience(topJobs);
        if (candidate.experience < avgRequiredExp * 0.8) {
            suggestions.push({
                type: 'experience',
                message: `Destaque projetos que demonstrem ${avgRequiredExp} anos de experiência`,
                impact: 'medium'
            });
        }
        
        return suggestions;
    }

    getMostDemandedSkills(jobs) {
        const skillCount = {};
        jobs.forEach(job => {
            job.requiredSkills?.forEach(skill => {
                skillCount[skill] = (skillCount[skill] || 0) + 1;
            });
        });
        
        return Object.entries(skillCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([skill]) => skill);
    }

    getAverageRequiredExperience(jobs) {
        const experiences = jobs.map(job => job.requiredExperience || 0);
        return experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length;
    }
}

// CSS para badges de compatibilidade
const compatibilityCSS = `
.compatibility-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin: 8px 0;
    animation: fadeInScale 0.3s ease-out;
}

.compatibility-badge .badge-icon {
    font-size: 16px;
}

.compatibility-badge .badge-score {
    background: rgba(255,255,255,0.2);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.compatibility-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 12px;
    color: white;
    margin: 20px 0;
}

.compatibility-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.compatibility-metric {
    background: rgba(255,255,255,0.1);
    padding: 12px;
    border-radius: 8px;
    text-align: center;
}

.compatibility-metric .metric-label {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 4px;
}

.compatibility-metric .metric-value {
    font-size: 18px;
    font-weight: 700;
}

.suggestions-list {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

.suggestion-icon.high { background: #ef4444; color: white; }
.suggestion-icon.medium { background: #f59e0b; color: white; }
.suggestion-icon.low { background: #10b981; color: white; }
`;

// Adiciona CSS ao documento
if (!document.getElementById('compatibility-styles')) {
    const style = document.createElement('style');
    style.id = 'compatibility-styles';
    style.textContent = compatibilityCSS;
    document.head.appendChild(style);
}

// Instância global do sistema
window.compatibilitySystem = new CompatibilitySystem();
