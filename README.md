# ClaunNetworking - Plataforma de Recrutamento e Educação

## 🚀 Projeto Pronto para Produção no Render

Este é o projeto ClaunNetworking configurado especificamente para implantação na plataforma Render, com uma estrutura de código **refatorada** para maior modularidade e facilidade de manutenção, **otimizado** para melhor desempenho de carregamento do frontend e **seguro** com monitoramento em tempo real.

### 📋 Estrutura do Projeto (Refatorada, Otimizada e Segura)

A estrutura foi simplificada, consolidando o frontend e modularizando o backend:

```
claunnetworking_render/
├── backend/
│   ├── app/
│   │   └── services/
│   │       └── database.py  # Lógica centralizada de conexão DB (PostgreSQL/SQLite)
│   ├── app.py               # API Flask (agora com Hardening de Segurança e Sentry)
│   ├── db_init.py           # Script de inicialização do DB (simplificado)
│   └── requirements.txt     # Inclui Flask-Talisman e sentry-sdk
├── frontend/                # Frontend unificado (Site Principal e Admin)
│   ├── admin/               # Conteúdo do Painel Administrativo (roteado via app.py)
│   ├── css/
│   ├── js/                  # Scripts consolidados e minificados para melhor performance
│   │   ├── main-bundle.min.js # Bundle minificado para o site principal
│   │   └── admin-bundle.min.js # Bundle minificado para o painel administrativo
│   └── index.html           # Página principal
├── docs/                    # Documentação de implantação
├── scripts/                 # Scripts de inicialização
└── render.yaml              # Configuração simplificada do Render
```

### 🌐 Domínios Configurados

- **Site Principal & Painel Administrativo**: `https://claunnetworkingworking.com.br` (O backend em `app.py` roteia para o site principal (`/`) e para o painel administrativo (`/admin/`)).
- **API Backend**: `https://claunnetworkingworking-api.onrender.com` (O Web Service do Render).

### 🔧 Implantação no Render (Simplificada)

O arquivo `render.yaml` foi simplificado para usar apenas um serviço de Web Service (Backend) e um serviço de Static Site (Frontend), com o backend gerenciando o roteamento do admin.

1. **Conecte este repositório ao Render**
2. **Crie um Blueprint** usando o arquivo `render.yaml`.
3. **Configure os domínios personalizados** conforme documentação.
4. **O comando `preDeployCommand: python3 db_init.py`** no `render.yaml` garante que o banco de dados seja inicializado automaticamente.

**Variáveis de Ambiente Críticas para o Backend:**

| Variável | Descrição | Uso |
| :--- | :--- | :--- |
| `SECRET_KEY` | Chave secreta forte para segurança de sessão. **Obrigatória.** | Segurança de Sessão |
| `SENTRY_DSN` | Chave de conexão do projeto Sentry. **Obrigatória para monitoramento.** | Monitoramento de Erros |
| `DATABASE_URL` | URL de conexão do PostgreSQL (fornecida pelo Render). | Conexão DB em Produção |

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
    # Defina a SECRET_KEY e, opcionalmente, a SENTRY_DSN
    export SECRET_KEY='sua_chave_secreta_local'
    python3 app.py
    ```
    O servidor estará disponível em `http://127.0.0.1:5000/`.

### ⚡ Otimização de Desempenho do Frontend

O frontend foi otimizado para reduzir o tempo de carregamento:
*   **Consolidação de Scripts:** Múltiplos arquivos JavaScript foram combinados em bundles únicos (`main-bundle.min.js` e `admin-bundle.min.js`).
*   **Minificação:** Os bundles foram minificados para reduzir o tamanho total do código.
*   **Redução de Requisições:** O número de requisições HTTP necessárias para carregar o JavaScript foi drasticamente reduzido.

### 👁️ Monitoramento de Segurança e Alertas (Sentry)

Para garantir a estabilidade e a segurança em tempo real, o backend foi integrado com o Sentry para monitoramento de erros e performance.

*   **Monitoramento de Erros:** Exceções não tratadas são automaticamente capturadas e enviadas ao Sentry.
*   **Logging Estruturado:** Eventos críticos de segurança (tentativas de login falhas, novos registros) são logados de forma estruturada para facilitar a análise e a criação de alertas.

### 🔐 Credenciais de Administrador

- **Email**: `admin@claunnetworkingworking.com.br`
- **Senha**: Definida pela variável de ambiente `ADMIN_PASSWORD`

### 📚 Funcionalidades

- Sistema completo de autenticação
- Gestão de vagas e candidaturas
- Plataforma educacional com cursos
- Painel administrativo com métricas
- Sistema de planos de assinatura
- APIs RESTful completas

### 🛡️ Segurança

- **Hardening de Sessão:** Cookies configurados como `Secure`, `HttpOnly` e `SameSite='Lax'`.
- **Security Headers:** Implementação de HSTS, X-Frame-Options, etc., via Flask-Talisman.
- **Monitoramento de Erros:** Integração com Sentry para alertas em tempo real.
- **Estrutura Consolidada:** Redução da complexidade de deploy e manutenção.
- Certificados SSL automáticos.
- Senhas com hash seguro.

### 📞 Suporte

Para questões técnicas sobre a implantação, consulte a documentação em `docs/` ou os comentários no código-fonte.

---

**Desenvolvido por**: Manus AI  
**Versão**: 4.0.0 - Monitoramento e Segurança  
**Data**: Novembro 2025
