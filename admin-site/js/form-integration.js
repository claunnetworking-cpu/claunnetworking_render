/**
 * Integração dos formulários com a API do backend
 */

// Aguardar o carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    
    // Integração do formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await api.login(credentials);
                APIUtils.setCurrentUser(response.user);
                APIUtils.showSuccess('Login realizado com sucesso!');
                
                // Redirecionar baseado no tipo de usuário
                setTimeout(() => {
                    switch(response.user.type) {
                        case 'candidato':
                            window.location.href = '/candidato_painel.html';
                            break;
                        case 'empresa':
                            window.location.href = '/company_dashboard.html';
                            break;
                        case 'instituicao':
                            window.location.href = '/institution_dashboard.html';
                            break;
                        case 'admin':
                            window.location.href = '/admin_complete.html';
                            break;
                        default:
                            window.location.href = '/index.html';
                    }
                }, 1500);
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                user_type: formData.get('user_type'),
                phone: formData.get('phone')
            };

            try {
                const response = await api.register(userData);
                APIUtils.showSuccess('Cadastro realizado com sucesso!');
                
                // Limpar formulário
                registerForm.reset();
                
                // Redirecionar para login após 2 segundos
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de criação de vaga
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(jobForm);
            const jobData = {
                title: formData.get('title'),
                description: formData.get('description'),
                requirements: formData.get('requirements'),
                benefits: formData.get('benefits'),
                salary_range: formData.get('salary_range'),
                location: formData.get('location'),
                work_modality: formData.get('work_modality'),
                job_type: formData.get('job_type'),
                area: formData.get('area'),
                level: formData.get('level')
            };

            try {
                const response = await api.createJob(jobData);
                APIUtils.showSuccess('Vaga criada com sucesso!');
                
                // Limpar formulário
                jobForm.reset();
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de candidatura
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(applicationForm);
            const applicationData = {
                job_id: formData.get('job_id'),
                message: formData.get('message')
            };

            try {
                const response = await api.applyToJob(applicationData);
                APIUtils.showSuccess('Candidatura enviada com sucesso!');
                
                // Fechar modal se existir
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                }
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Integração do formulário de criação de curso
    const courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(courseForm);
            const courseData = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                level: formData.get('level'),
                modality: formData.get('modality'),
                duration: formData.get('duration'),
                price: parseFloat(formData.get('price')) || 0,
                is_free: formData.get('is_free') === 'on'
            };

            try {
                const response = await api.createCourse(courseData);
                APIUtils.showSuccess('Curso criado com sucesso!');
                
                // Limpar formulário
                courseForm.reset();
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }

    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                await api.logout();
                APIUtils.clearCurrentUser();
                APIUtils.showSuccess('Logout realizado com sucesso!');
                
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
                
            } catch (error) {
                APIUtils.showError(error.message);
            }
        });
    }
});

// Função para carregar vagas dinamicamente
async function loadJobs(filters = {}) {
    try {
        const jobs = await api.getJobs(filters);
        const jobsContainer = document.getElementById('jobsContainer');
        
        if (jobsContainer) {
            jobsContainer.innerHTML = '';
            
            jobs.forEach(job => {
                const jobCard = createJobCard(job);
                jobsContainer.appendChild(jobCard);
            });
        }
        
    } catch (error) {
        APIUtils.showError('Erro ao carregar vagas: ' + error.message);
    }
}

// Função para carregar cursos dinamicamente
async function loadCourses(filters = {}) {
    try {
        const courses = await api.getCourses(filters);
        const coursesContainer = document.getElementById('coursesContainer');
        
        if (coursesContainer) {
            coursesContainer.innerHTML = '';
            
            courses.forEach(course => {
                const courseCard = createCourseCard(course);
                coursesContainer.appendChild(courseCard);
            });
        }
        
    } catch (error) {
        APIUtils.showError('Erro ao carregar cursos: ' + error.message);
    }
}

// Função para criar card de vaga
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-4';
    
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${job.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${job.company_name}</h6>
                <p class="card-text">${job.description.substring(0, 100)}...</p>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-map-marker-alt"></i> ${job.location}
                    </small>
                </div>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-briefcase"></i> ${job.work_modality}
                    </small>
                </div>
                ${job.salary_range ? `
                <div class="mb-2">
                    <small class="text-success">
                        <i class="fas fa-dollar-sign"></i> ${job.salary_range}
                    </small>
                </div>
                ` : ''}
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-sm" onclick="showJobDetails(${job.id})">
                    Ver Detalhes
                </button>
                <button class="btn btn-success btn-sm" onclick="applyToJob(${job.id})">
                    Candidatar-se
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Função para criar card de curso
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4 mb-4';
    
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${course.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${course.institution_name}</h6>
                <p class="card-text">${course.description.substring(0, 100)}...</p>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-clock"></i> ${course.duration}
                    </small>
                </div>
                <div class="mb-2">
                    <small class="text-muted">
                        <i class="fas fa-graduation-cap"></i> ${course.level}
                    </small>
                </div>
                <div class="mb-2">
                    ${course.is_free ? 
                        '<span class="badge bg-success">Gratuito</span>' : 
                        `<span class="badge bg-primary">R$ ${course.price}</span>`
                    }
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-sm" onclick="showCourseDetails(${course.id})">
                    Ver Detalhes
                </button>
                <button class="btn btn-success btn-sm" onclick="enrollInCourse(${course.id})">
                    Inscrever-se
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Funções auxiliares para interação
function showJobDetails(jobId) {
    // Implementar modal de detalhes da vaga
    console.log('Mostrar detalhes da vaga:', jobId);
}

function applyToJob(jobId) {
    // Verificar se está logado
    if (!APIUtils.isLoggedIn()) {
        APIUtils.showError('Você precisa estar logado para se candidatar.');
        return;
    }
    
    // Implementar modal de candidatura
    console.log('Candidatar-se à vaga:', jobId);
}

function showCourseDetails(courseId) {
    // Implementar modal de detalhes do curso
    console.log('Mostrar detalhes do curso:', courseId);
}

function enrollInCourse(courseId) {
    // Verificar se está logado
    if (!APIUtils.isLoggedIn()) {
        APIUtils.showError('Você precisa estar logado para se inscrever.');
        return;
    }
    
    // Implementar inscrição no curso
    console.log('Inscrever-se no curso:', courseId);
}

// Carregar dados ao inicializar páginas específicas
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    // Carregar vagas na página de vagas
    if (currentPage.includes('vagas.html') || currentPage.includes('buscar_')) {
        loadJobs();
    }
    
    // Carregar cursos na página de cursos
    if (currentPage.includes('cursos') || currentPage.includes('buscar_')) {
        loadCourses();
    }
});
