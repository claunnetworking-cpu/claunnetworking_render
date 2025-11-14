-- Dados iniciais para a plataforma ClaunNetworking
-- Execute este arquivo após inicializar o banco de dados

-- Inserir planos para empresas
INSERT INTO plans (name, description, price, features, plan_type, is_active) VALUES
('Starter', 'Plano básico para pequenas empresas', 299.00, 
 '["5 vagas ativas", "Acesso a candidatos", "Suporte básico", "Relatórios simples"]', 
 'empresa', 1),
('Professional', 'Plano completo para empresas em crescimento', 599.00,
 '["20 vagas ativas", "Busca avançada", "Suporte prioritário", "Relatórios detalhados", "Destaque de vagas"]',
 'empresa', 1),
('Enterprise', 'Plano premium para grandes empresas', 1299.00,
 '["Vagas ilimitadas", "Recursos premium", "Suporte dedicado", "Analytics avançados", "API personalizada"]',
 'empresa', 1);

-- Inserir planos para instituições
INSERT INTO plans (name, description, price, features, plan_type, is_active) VALUES
('Start', 'Plano inicial para instituições de ensino', 490.00,
 '["Até 5 cursos ativos", "Até 1 curso em destaque por mês", "Painel administrativo completo"]',
 'instituicao', 1),
('Growth', 'Plano de crescimento para instituições', 990.00,
 '["Até 20 cursos ativos", "Até 5 cursos em destaque por mês", "Painel administrativo completo", "Relatórios avançados"]',
 'instituicao', 1),
('Unlimited', 'Plano ilimitado para grandes instituições', 1990.00,
 '["Cursos ilimitados", "Destaques ilimitados", "Painel administrativo completo", "Suporte prioritário"]',
 'instituicao', 1);

-- Inserir usuário administrador
INSERT INTO users (email, password_hash, user_type, name, phone, is_active, is_verified) VALUES
('admin@claunnetworkingworkingworking.com', 'pbkdf2:sha256:260000$salt$hash', 'admin', 'Administrador', '11999999999', 1, 1);

-- Inserir dados de exemplo para empresas
INSERT INTO users (email, password_hash, user_type, name, phone, is_active, is_verified) VALUES
('contato@techcorp.com', 'pbkdf2:sha256:260000$salt$hash', 'empresa', 'TechCorp Soluções', '11987654321', 1, 1),
('rh@inovacorp.com', 'pbkdf2:sha256:260000$salt$hash', 'empresa', 'InovaCorp', '11876543210', 1, 1),
('vagas@digitalplus.com', 'pbkdf2:sha256:260000$salt$hash', 'empresa', 'Digital Plus', '11765432109', 1, 1);

-- Inserir perfis de empresas
INSERT INTO company_profiles (user_id, cnpj, company_type, founded_year, sector, employees_count, tagline, description, address_city, address_state, work_modality, website) VALUES
(2, '12.345.678/0001-90', 'Tecnologia', 2015, 'Tecnologia da Informação', '51-200', 'Inovação em cada linha de código', 'Empresa especializada em desenvolvimento de software e soluções tecnológicas inovadoras.', 'São Paulo', 'SP', 'Híbrido', 'www.techcorp.com'),
(3, '23.456.789/0001-01', 'Consultoria', 2018, 'Consultoria Empresarial', '11-50', 'Transformando negócios', 'Consultoria especializada em transformação digital e inovação empresarial.', 'Rio de Janeiro', 'RJ', 'Remoto', 'www.inovacorp.com'),
(4, '34.567.890/0001-12', 'Marketing', 2020, 'Marketing Digital', '11-50', 'Sua marca no digital', 'Agência de marketing digital focada em resultados e crescimento sustentável.', 'Belo Horizonte', 'MG', 'Presencial', 'www.digitalplus.com');

-- Inserir vagas de exemplo
INSERT INTO jobs (company_id, title, description, requirements, benefits, salary_range, location, work_modality, job_type, area, level, is_active, is_featured) VALUES
(2, 'Desenvolvedor Frontend React', 'Desenvolvimento de interfaces modernas e responsivas usando React.js', 'React, JavaScript, HTML, CSS, Git', 'VR, VA, Plano de Saúde, Home Office', 'R$ 5.000 - R$ 8.000', 'São Paulo, SP', 'Híbrido', 'CLT', 'Tecnologia', 'Pleno', 1, 1),
(2, 'Analista de Dados', 'Análise de dados e criação de dashboards para tomada de decisões', 'Python, SQL, Power BI, Excel Avançado', 'VR, VA, Plano de Saúde, Flexibilidade de horário', 'R$ 4.500 - R$ 7.000', 'São Paulo, SP', 'Remoto', 'CLT', 'Tecnologia', 'Júnior', 1, 0),
(3, 'Consultor de Negócios', 'Consultoria em processos empresariais e transformação digital', 'MBA, Experiência em consultoria, Inglês fluente', 'VR, VA, Carro da empresa, Viagens', 'R$ 8.000 - R$ 12.000', 'Rio de Janeiro, RJ', 'Presencial', 'CLT', 'Consultoria', 'Sênior', 1, 1),
(4, 'Social Media', 'Gestão de redes sociais e criação de conteúdo digital', 'Photoshop, Canva, Conhecimento em redes sociais', 'VR, VA, Ambiente descontraído', 'R$ 2.500 - R$ 4.000', 'Belo Horizonte, MG', 'Híbrido', 'CLT', 'Marketing', 'Júnior', 1, 0);

-- Inserir dados de exemplo para instituições
INSERT INTO users (email, password_hash, user_type, name, phone, is_active, is_verified) VALUES
('contato@techacademy.edu', 'pbkdf2:sha256:260000$salt$hash', 'instituicao', 'Tech Academy', '11555666777', 1, 1),
('info@businessschool.edu', 'pbkdf2:sha256:260000$salt$hash', 'instituicao', 'Business School Online', '11444555666', 1, 1);

-- Inserir perfis de instituições
INSERT INTO institution_profiles (user_id, cnpj, institution_type, founded_year, students_count, description, address_city, address_state, courses_offered, education_levels, modalities, specialization_areas, website) VALUES
(5, '45.678.901/0001-23', 'Escola Técnica', 2010, 2500, 'Instituição especializada em cursos técnicos e tecnológicos na área de TI.', 'São Paulo', 'SP', 'Desenvolvimento, Redes, Segurança', 'Técnico, Tecnólogo', 'Presencial, EAD', 'Tecnologia, Programação', 'www.techacademy.edu'),
(6, '56.789.012/0001-34', 'Escola de Negócios', 2005, 5000, 'Escola de negócios focada em formação executiva e empreendedorismo.', 'São Paulo', 'SP', 'MBA, Gestão, Marketing', 'Pós-graduação, MBA', 'EAD, Híbrido', 'Negócios, Gestão, Marketing', 'www.businessschool.edu');

-- Inserir cursos de exemplo
INSERT INTO courses (institution_id, title, description, category, level, modality, duration, price, is_free, is_featured, is_active) VALUES
(5, 'Introdução ao Python para Data Science', 'Aprenda os fundamentos do Python aplicados à ciência de dados', 'Tecnologia', 'Básico', 'Online', '40h', 0.00, 1, 1, 1),
(5, 'Desenvolvimento Web Full Stack', 'Curso completo de desenvolvimento web com React e Node.js', 'Tecnologia', 'Intermediário', 'Online', '120h', 899.00, 0, 1, 1),
(6, 'MBA em Gestão de Projetos', 'Especialização em gestão de projetos com metodologias ágeis', 'Negócios', 'Avançado', 'Híbrido', '360h', 2500.00, 0, 1, 1),
(6, 'Marketing Digital para Iniciantes', 'Fundamentos do marketing digital e estratégias online', 'Marketing', 'Básico', 'Online', '30h', 0.00, 1, 0, 1);

-- Inserir dados de exemplo para candidatos
INSERT INTO users (email, password_hash, user_type, name, phone, is_active, is_verified) VALUES
('ana.silva@email.com', 'pbkdf2:sha256:260000$salt$hash', 'candidato', 'Ana Silva Santos', '11999888777', 1, 1),
('carlos.oliveira@email.com', 'pbkdf2:sha256:260000$salt$hash', 'candidato', 'Carlos Oliveira', '11888777666', 1, 1),
('maria.costa@email.com', 'pbkdf2:sha256:260000$salt$hash', 'candidato', 'Maria Costa', '11777666555', 1, 1);

-- Inserir perfis de candidatos
INSERT INTO candidate_profiles (user_id, professional_title, experience_years, sector, level, work_modality, salary_expectation, summary, skills, education_level, course, institution, address_city, address_state) VALUES
(7, 'Desenvolvedora Frontend', 3, 'Tecnologia', 'Pleno', 'Remoto', 6500.00, 'Desenvolvedora apaixonada por criar interfaces incríveis e funcionais', 'React, JavaScript, TypeScript, CSS, HTML', 'Superior Completo', 'Sistemas de Informação', 'FIAP', 'São Paulo', 'SP'),
(8, 'Analista de Marketing', 2, 'Marketing', 'Júnior', 'Híbrido', 4000.00, 'Profissional criativo com foco em marketing digital e growth hacking', 'Google Ads, Facebook Ads, Analytics, SEO', 'Superior Completo', 'Marketing', 'ESPM', 'Rio de Janeiro', 'RJ'),
(9, 'Consultora de Negócios', 5, 'Consultoria', 'Sênior', 'Presencial', 10000.00, 'Consultora experiente em transformação digital e processos empresariais', 'Gestão de Projetos, Scrum, Lean, Six Sigma', 'Pós-graduação', 'Administração', 'FGV', 'Belo Horizonte', 'MG');
