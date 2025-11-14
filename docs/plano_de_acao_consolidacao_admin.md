# Plano de Ação Detalhado: Consolidação Final do Frontend

## Objetivo
Eliminar a duplicação de código remanescente e a inconsistência estrutural, consolidando o conteúdo do diretório `admin-site` dentro do diretório `frontend`. Isso permitirá o gerenciamento de ambos os sites (principal e administrativo) a partir de uma única estrutura de frontend, simplificando o deploy e a manutenção.

## Fase 5: Consolidação do `admin-site` no `frontend`

Esta fase pressupõe que a Fase 4 (Refatoração do Backend) e a limpeza inicial do frontend (remoção de `main-site`) foram concluídas.

### Passo 5.1: Preparação da Estrutura

| Ação | Descrição | Arquivos/Diretórios Envolvidos |
| :--- | :--- | :--- |
| **5.1.1** | Criar um subdiretório dedicado para o painel administrativo dentro do `frontend`. | `claunnetworkingworking_render/frontend/admin/` |
| **5.1.2** | Mover todos os arquivos HTML específicos do `admin-site` para o novo subdiretório. | `claunnetworkingworking_render/admin-site/*.html` -> `claunnetworkingworking_render/frontend/admin/` |
| **5.1.3** | Mover os arquivos JavaScript específicos do `admin-site` para o subdiretório de JS do admin. | `claunnetworkingworking_render/admin-site/js/*.js` -> `claunnetworkingworking_render/frontend/js/admin/` |
| **5.1.4** | Excluir o diretório `admin-site` original, que agora estará vazio. | `claunnetworkingworking_render/admin-site/` |

### Passo 5.2: Ajuste de Referências no Frontend

| Ação | Descrição | Arquivos/Diretórios Envolvidos |
| :--- | :--- | :--- |
| **5.2.1** | Atualizar todas as referências de caminhos (CSS, JS, imagens) dentro dos arquivos HTML movidos para refletir a nova estrutura (`/admin/`). | `claunnetworkingworking_render/frontend/admin/*.html` |
| **5.2.2** | Renomear o arquivo `admin-config.js` para um nome mais genérico, como `config.js`, e movê-lo para o diretório `frontend/js/admin/`. | `claunnetworkingworking_render/frontend/js/admin/config.js` |
| **5.2.3** | Atualizar as referências ao `admin-config.js` nos arquivos HTML do admin. | `claunnetworkingworking_render/frontend/admin/*.html` |

### Passo 5.3: Ajuste de Roteamento no Backend

| Ação | Descrição | Arquivos/Diretórios Envolvidos |
| :--- | :--- | :--- |
| **5.3.1** | Modificar a função `serve_static` em `backend/app.py` para verificar se o caminho solicitado corresponde a uma rota administrativa. | `claunnetworkingworking_render/backend/app.py` |
| **5.3.2** | Se a rota for administrativa (ex: `/admin/dashboard`), o backend deve servir o arquivo correspondente do novo subdiretório `frontend/admin/`. | `claunnetworkingworking_render/backend/app.py` |
| **5.3.3** | Garantir que a rota `/admin` sirva o arquivo principal do painel (ex: `frontend/admin/admin_dashboard.html`). | `claunnetworkingworking_render/backend/app.py` |

### Passo 5.4: Atualização Final do Deploy (Render)

| Ação | Descrição | Arquivos/Diretórios Envolvidos |
| :--- | :--- | :--- |
| **5.4.1** | Remover o serviço estático `claunnetworkingworking-admin-site` do arquivo `render.yaml`. | `claunnetworkingworking_render/render.yaml` |
| **5.4.2** | O único serviço de frontend restante será o `claunnetworkingworking-main-site`, que agora gerencia todas as rotas estáticas (principal e administrativa) através do roteamento do backend. | `claunnetworkingworking_render/render.yaml` |

## Próximos Passos (Fase 6)

A Fase 6 será dedicada a **Testes e Validação Final**, garantindo que:
1.  O site principal (`/`) funcione corretamente.
2.  O painel administrativo (`/admin/`) funcione corretamente.
3.  Todas as rotas da API (`/api/*`) funcionem corretamente com a nova estrutura de banco de dados.
4.  O deploy no Render seja bem-sucedido com o `render.yaml` simplificado.

**Observação:** A refatoração do backend (Fase 4) já incluiu a atualização do `backend/app.py` para servir arquivos estáticos de `../frontend`. O Passo 5.3 exigirá uma pequena modificação nessa lógica para incluir o roteamento específico do admin.
