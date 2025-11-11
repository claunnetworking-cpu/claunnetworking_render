# ClaunNetworking - Plataforma de Recrutamento e Educação

## 🚀 Projeto Pronto para Produção no Render

Este é o projeto ClaunNetworking configurado especificamente para implantação na plataforma Render, com uma estrutura de código **refatorada** para maior modularidade e facilidade de manutenção.

### 📋 Estrutura do Projeto (Refatorada)

A estrutura foi simplificada, consolidando o frontend e modularizando o backend:

```
claunnetworking_render/
├── backend/
│   ├── app/
│   │   └── services/
│   │       └── database.py  # Nova lógica centralizada de conexão DB (PostgreSQL/SQLite)
│   ├── app.py               # API Flask (agora também gerencia o roteamento do frontend)
│   ├── db_init.py           # Script de inicialização do DB (simplificado)
│   └── requirements.txt
├── frontend/                # Frontend unificado (Site Principal e Admin)
│   ├── admin/               # Conteúdo do Painel Administrativo (roteado via app.py)
│   ├── css/
│   ├── js/
│   └── index.html           # Página principal
├── docs/                    # Documentação de implantação
├── scripts/                 # Scripts de inicialização
└── render.yaml              # Configuração simplificada do Render
```

### 🌐 Domínios Configurados

- **Site Principal & Painel Administrativo**: `https://claunnet.com.br` (O backend em `app.py` roteia para o site principal (`/`) e para o painel administrativo (`/admin/`)).
- **API Backend**: `https://claunnet-api.onrender.com` (O Web Service do Render).

### 🔧 Implantação no Render (Simplificada)

O arquivo `render.yaml` foi simplificado para usar apenas um serviço de Web Service (Backend) e um serviço de Static Site (Frontend), com o backend gerenciando o roteamento do admin.

1. **Conecte este repositório ao Render**
2. **Crie um Blueprint** usando o arquivo `render.yaml`.
3. **Configure os domínios personalizados** conforme documentação.
4. **O comando `preDeployCommand: python3 db_init.py`** no `render.yaml` garante que o banco de dados seja inicializado automaticamente.

Para instruções detalhadas, consulte: [docs/DEPLOY_ON_RENDER.md](docs/DEPLOY_ON_RENDER.md)

### 💻 Execução Local (Desenvolvimento)

Para executar o projeto localmente, siga estes passos:

1.  **Instalar dependências:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
2.  **Inicializar o Banco de Dados (SQLite):**
    ```bash
    python3 db_init.py
    ```
3.  **Executar o Backend (API e Roteamento):**
    ```bash
    python3 app.py
    ```
    O servidor estará disponível em `http://127.0.0.1:5000/`.

### 🔐 Credenciais de Administrador

- **Email**: `admin@claunnet.com.br`
- **Senha**: Definida pela variável de ambiente `ADMIN_PASSWORD`

### 📚 Funcionalidades

- Sistema completo de autenticação
- Gestão de vagas e candidaturas
- Plataforma educacional com cursos
- Painel administrativo com métricas
- Sistema de planos de assinatura
- APIs RESTful completas

### 🛡️ Segurança

- **Estrutura Consolidada:** Redução da complexidade de deploy e manutenção.
- Certificados SSL automáticos.
- Headers de segurança configurados.
- Dados de teste removidos.
- Senhas com hash seguro.

### 📞 Suporte

Para questões técnicas sobre a implantação, consulte a documentação em `docs/` ou os comentários no código-fonte.

---

**Desenvolvido por**: Manus AI  
**Versão**: 2.0.0 - Refatorado  
**Data**: Novembro 2025
