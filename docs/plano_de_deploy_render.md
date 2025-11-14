## Plano de Ação Detalhado para Implantação em Produção (Render)

Este plano de ação detalha os passos necessários para implantar o projeto `claunnetworking_render` na plataforma Render, aproveitando a configuração do `render.yaml` e as melhorias de segurança e otimização implementadas.

### Fase 1: Configuração Inicial no Render

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **1.1** | **Conectar Repositório** | Conecte sua conta Render ao repositório GitHub `claunnetworking_render`. |
| **1.2** | **Criar Novo Blueprint** | No painel do Render, selecione a opção para criar um novo serviço a partir de um **Blueprint** e aponte para o arquivo `render.yaml` na raiz do repositório. |
| **1.3** | **Aprovar Deploy** | O Render irá analisar o `render.yaml` e propor a criação de dois serviços: o **Banco de Dados PostgreSQL** e o **Web Service (Backend)**. Confirme a criação. |

### Fase 2: Configuração das Variáveis de Ambiente (Segurança)

As variáveis de ambiente são cruciais para a segurança e o funcionamento do backend. Elas devem ser configuradas no painel do Render para o **Web Service (Backend)**.

| Variável | Valor | Descrição |
| :--- | :--- | :--- |
| `SECRET_KEY` | **Gerar Chave Forte** | Chave secreta forte e única para segurança de sessão do Flask. |
| `ADMIN_PASSWORD` | **Gerar Senha Forte** | Senha inicial para o usuário administrador (`admin@claunnet.com.br`). |
| `SENTRY_DSN` | **Sua Chave Sentry** | Chave DSN obtida no painel do Sentry para monitoramento de erros. |
| `DATABASE_URL` | **(Gerada Automaticamente)** | O Render injetará automaticamente a URL de conexão do Banco de Dados PostgreSQL criado na Fase 1. |

### Fase 3: Execução do Deploy e Inicialização do DB

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **3.1** | **Primeiro Deploy** | O Render iniciará o primeiro deploy. O `render.yaml` garante que: <br> a) O Banco de Dados seja provisionado. <br> b) O Backend seja construído (instalando dependências, incluindo `psycopg2-binary` e `Flask-Talisman`). |
| **3.2** | **Inicialização do Banco de Dados** | O comando `preDeployCommand: python3 db_init.py` será executado, criando todas as tabelas no PostgreSQL e o usuário administrador inicial. |
| **3.3** | **Serviço Estático (Frontend)** | O Render servirá o conteúdo do diretório `frontend` (que inclui o site principal e o admin) através do Web Service do Backend, conforme configurado no `app.py`. |

### Fase 4: Validação Pós-Deploy

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **4.1** | **Verificar Logs** | Acesse os logs do **Web Service (Backend)** para confirmar que: <br> a) O `db_init.py` foi executado com sucesso. <br> b) O Sentry foi inicializado (se a `SENTRY_DSN` foi fornecida). |
| **4.2** | **Testar Acesso** | Acesse o domínio principal do Render para o Web Service e verifique se o site principal (`/`) e o painel administrativo (`/admin`) carregam corretamente. |
| **4.3** | **Testar Login** | Tente fazer login no painel administrativo usando o e-mail `admin@claunnet.com.br` e a senha definida em `ADMIN_PASSWORD`. |
| **4.4** | **Configurar Domínios** | Se necessário, configure os domínios personalizados (ex: `claunnet.com.br`) no painel do Render e aguarde a propagação do SSL. |

### Resumo da Estrutura de Deploy

O deploy utiliza uma arquitetura simplificada de **Monolito Híbrido** no Render:

| Serviço | Tipo | Diretório | Função |
| :--- | :--- | :--- | :--- |
| `claunnetworking-db` | PostgreSQL | N/A | Armazenamento de dados. |
| `claunnetworking-backend` | Web Service | `backend` | API Flask, Servidor de Arquivos Estáticos (Frontend), Roteamento do Admin. |
