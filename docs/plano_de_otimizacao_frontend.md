# Plano de Ação Detalhado: Otimização de Desempenho do Frontend

## Objetivo
Melhorar o desempenho de carregamento e execução do `main-site` (e, por extensão, do `admin-site`) através da otimização e consolidação dos arquivos JavaScript.

## Fase 6: Otimização de Desempenho do Frontend

A análise da estrutura `frontend/js/` revelou uma grande quantidade de arquivos JavaScript separados, o que pode levar a um alto número de requisições HTTP e impactar negativamente o *First Contentful Paint (FCP)* e o *Largest Contentful Paint (LCP)*.

### Passo 6.1: Consolidação e Minificação de Scripts

| Ação | Descrição | Arquivos Envolvidos | Impacto Esperado |
| :--- | :--- | :--- | :--- |
| **6.1.1** | **Consolidar Scripts Comuns:** Unir todos os scripts que são carregados em todas as páginas (ex: `auth-system.js`, `api-config.js`, `design-system.js`) em um único arquivo. | `auth-system.js`, `api-config.js`, `design-system.js`, `navigation-fix.js`, `modal-fixes.js` | Redução drástica no número de requisições HTTP. |
| **6.1.2** | **Minificar o Arquivo Consolidado:** Aplicar minificação (remoção de espaços, comentários e encurtamento de variáveis) ao arquivo JavaScript final. | Novo arquivo `main-bundle.min.js` | Redução do tamanho total do arquivo, acelerando o download. |
| **6.1.3** | **Consolidar Scripts do Admin:** Unir os scripts específicos do painel administrativo. | `frontend/js/admin/*.js` | Otimização do carregamento do painel administrativo. |

### Passo 6.2: Implementação de Lazy Loading (Carregamento Sob Demanda)

| Ação | Descrição | Arquivos Envolvidos | Impacto Esperado |
| :--- | :--- | :--- | :--- |
| **6.2.1** | **Identificar Scripts Específicos:** Mapear scripts que só são necessários em páginas específicas (ex: `job-engagement.js` na página de vagas, `course-pricing-logic.js` na página de cursos). | `job-engagement.js`, `course-pricing-logic.js`, `form-modals.js`, etc. | Evitar o carregamento de código desnecessário na página inicial e em outras páginas. |
| **6.2.2** | **Implementar Carregamento Assíncrono:** Alterar a forma como esses scripts são incluídos no HTML, usando o atributo `defer` ou carregamento dinâmico via JavaScript. | Arquivos HTML relevantes (`index.html`, `buscar_vagas.html`, etc.) | Melhoria do tempo de interatividade (Time to Interactive - TTI). |

### Passo 6.3: Revisão e Remoção de Código Morto

| Ação | Descrição | Arquivos Envolvidos | Impacto Esperado |
| :--- | :--- | :--- | :--- |
| **6.3.1** | **Revisão de Scripts Duplicados/Redundantes:** Analisar scripts com nomes suspeitos de redundância ou que parecem ser "códigos de teste" (ex: `responsibility-alert.js`, `mobile-optimization.js`). | Todos os arquivos em `frontend/js/` | Redução do tamanho total do código e eliminação de possíveis conflitos. |
| **6.3.2** | **Remoção de Código Morto:** Excluir os arquivos originais após a consolidação e minificação. | Arquivos originais em `frontend/js/` | Limpeza final do repositório. |

## Próximos Passos (Fase 7)

A Fase 7 será a **Execução da Otimização**, onde as ferramentas de minificação e consolidação serão aplicadas e os arquivos HTML serão atualizados para usar os novos *bundles* de scripts.

**Recomendação de Ferramenta:** Para a consolidação e minificação, recomenda-se o uso de ferramentas como **Webpack** ou **Rollup**, mas para uma otimização rápida e manual, pode-se usar um minificador online ou um script simples em Node.js/Python. Para fins deste plano, assumiremos uma consolidação manual seguida de minificação.

---

**Desenvolvido por**: Manus AI  
**Versão**: 1.0.0 - Otimização de Desempenho  
**Data**: Novembro 2025
