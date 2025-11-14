# Plano de Ação Detalhado para Refatoração do Frontend

**Objetivo:** Eliminar a duplicação de código entre os diretórios `frontend`, `main-site` e `admin-site`, consolidar a estrutura do projeto e atualizar a configuração de deploy para a plataforma Render.

## Fase 1: Consolidação e Limpeza da Estrutura

Esta fase visa definir um único diretório como a fonte de verdade para o frontend principal e remover as cópias redundantes.

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **1.1** | **Definir o Diretório Principal** | Escolher o diretório `frontend` como o diretório principal do site, pois ele contém o conjunto mais completo de arquivos HTML e JS. |
| **1.2** | **Remover Diretório Redundante** | Excluir o diretório `main-site` e todo o seu conteúdo, pois é uma cópia quase exata do `frontend`. |
| **1.3** | **Renomear Diretório Principal** | Renomear o diretório `frontend` para um nome mais claro e conciso, como `web-app` ou mantê-lo como `frontend` (a escolha é do desenvolvedor, mas `frontend` é funcional). **Recomendação:** Manter `frontend` por enquanto. |
| **1.4** | **Limpeza do `admin-site`** | Excluir todos os arquivos JavaScript duplicados do diretório `admin-site/js`. O `admin-site` deve manter apenas seu `index.html` e quaisquer arquivos estáticos exclusivos. |

## Fase 2: Centralização e Refatoração do JavaScript

Esta fase visa criar um local centralizado para os scripts JavaScript compartilhados e atualizar todas as referências nos arquivos HTML.

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **2.1** | **Criar Diretório Compartilhado** | Criar um novo diretório na raiz do projeto ou dentro do `frontend` (ex: `frontend/js/shared/`) para abrigar todos os scripts JS que são usados tanto pelo site principal quanto pelo painel administrativo. |
| **2.2** | **Mover Scripts Compartilhados** | Mover os scripts JS comuns (ex: `auth-system.js`, `api-config.js`, `design-system.js`, etc.) do `frontend/js` para o novo diretório compartilhado. |
| **2.3** | **Atualizar Referências no `frontend`** | Revisar todos os arquivos HTML dentro de `frontend/` e atualizar os caminhos de referência para os scripts JS movidos (ex: de `js/auth-system.js` para `js/shared/auth-system.js`). |
| **2.4** | **Atualizar Referências no `admin-site`** | Revisar o `admin-site/index.html` e atualizar os caminhos de referência para os scripts JS compartilhados. |
| **2.5** | **Revisar Scripts Exclusivos** | Garantir que scripts exclusivos de cada aplicação (`admin-config.js` no admin e `production-config.js` no frontend) permaneçam em seus respectivos diretórios e que a lógica de configuração da API seja consistente. |

## Fase 3: Atualização da Configuração de Deploy (Render)

Esta fase garante que a nova estrutura de diretórios seja corretamente refletida no ambiente de produção.

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **3.1** | **Atualizar Serviço Principal** | Editar o arquivo `render.yaml` e alterar o `rootDir` do serviço `claunnetworkingworking-main-site` para apontar para o diretório principal consolidado (ex: `rootDir: frontend`). |
| **3.2** | **Adicionar Serviço do Admin** | Adicionar um novo serviço estático (`type: static`) no `render.yaml` para o painel administrativo. |
| **3.3** | **Configurar Admin Deploy** | Definir o `rootDir` do novo serviço como `admin-site` e configurar um subdomínio ou caminho para ele (ex: `admin.claunnetworking.com.br`). |
| **3.4** | **Revisar Backend `rootDir`** | Confirmar que o `rootDir` do serviço `claunnetworkingworking-backend` ainda está corretamente definido como `backend`. |

## Resumo das Alterações no `render.yaml` (Exemplo)

```yaml
# ... (Serviço de Banco de Dados e Backend permanecem inalterados)

# ----------------------------------------------------------------
# 3. Serviço de Frontend (Site Estático Principal) - ATUALIZADO
# ----------------------------------------------------------------
- type: static
  name: claunnetworkingworking-main-site
  rootDir: frontend # Alterado de 'main-site' para 'frontend'
  buildCommand: ""
  publishPath: .
  envVars:
    - key: SKIP_INSTALL_DEPS
      value: true

# ----------------------------------------------------------------
# 4. Serviço de Frontend (Painel Administrativo) - NOVO
# ----------------------------------------------------------------
- type: static
  name: claunnetworkingworking-admin-site
  rootDir: admin-site
  buildCommand: ""
  publishPath: .
  envVars:
    - key: SKIP_INSTALL_DEPS
      value: true
  # Adicionar regras de subdomínio ou caminho se necessário na configuração do Render
```

## Fase 4: Testes e Validação

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **4.1** | **Teste Local** | Executar o frontend principal (`frontend/index.html`) e o painel administrativo (`admin-site/index.html`) localmente para garantir que todos os scripts JS e ativos estejam sendo carregados corretamente. |
| **4.2** | **Teste de Deploy** | Realizar um deploy de teste na plataforma Render para validar se os dois serviços estáticos (site principal e admin) estão funcionando e acessando o backend corretamente. |
| **4.3** | **Validação de Funcionalidades** | Testar as principais funcionalidades que dependem dos scripts compartilhados (ex: login, registro, chamadas de API) em ambos os sites. |
