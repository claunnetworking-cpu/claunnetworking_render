-- Dados de produção para a plataforma ClaunNetworking

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
('admin@claunnetworking.com.br', 'pbkdf2:sha256:260000$your_secure_salt$your_secure_hash', 'admin', 'Administrador ClaunNetworking', '11999999999', 1, 1);

