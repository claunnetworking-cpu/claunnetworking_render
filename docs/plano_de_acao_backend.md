# Plano de Ação Detalhado - Refatoração do Backend (Fase 4)

**Objetivo:** Unificar a lógica de conexão e inicialização do banco de dados (PostgreSQL e SQLite) em um módulo dedicado, removendo a mistura de responsabilidades do arquivo principal `app.py` e simplificando a importação em `db_init.py`.

## Fase 4: Refatoração do Backend - Modularização do Banco de Dados

Esta fase foca em isolar a lógica de banco de dados em um módulo de serviço dedicado, melhorando a modularidade e a testabilidade do código.

| Passo | Ação | Detalhes |
| :--- | :--- | :--- |
| **4.1** | **Criação do Módulo de Banco de Dados** | Criar o arquivo `backend/app/services/database.py`. Este arquivo será o novo local para toda a lógica de conexão, execução de SQL e inicialização do banco de dados. |
| **4.2** | **Migração da Lógica de Conexão** | Mover as funções `get_db_connection()`, `execute_sql()` e a lógica de detecção de ambiente (PostgreSQL vs. SQLite) do `backend/app.py` para o novo `backend/app/services/database.py`. |
| **4.3** | **Migração da Lógica de Inicialização** | Mover a função `init_database()` (incluindo todos os comandos `CREATE TABLE`) do `backend/app.py` para o `backend/app/services/database.py`. |
| **4.4** | **Atualização do `backend/app.py`** | Remover toda a lógica de banco de dados migrada. Importar as funções necessárias (`execute_sql`, por exemplo) do novo módulo `backend.app.services.database`. O `app.py` deve se concentrar apenas nas rotas, lógica de negócio e configuração do Flask. |
| **4.5** | **Atualização do `backend/db_init.py`** | Simplificar o `db_init.py`. Em vez de importar o `app.py` de forma complexa, ele deve importar diretamente a função `init_database()` do novo módulo `backend.app.services.database` e executá-la. Isso elimina a necessidade da solução robusta de importação (linhas 9-29 do `db_init.py` original). |
| **4.6** | **Teste de Inicialização** | Executar o `db_init.py` localmente (com e sem a variável de ambiente `DATABASE_URL`) para garantir que o banco de dados seja inicializado corretamente em ambos os ambientes (SQLite e PostgreSQL). |
| **4.7** | **Teste de Rotas** | Testar as rotas da API que interagem com o banco de dados para garantir que a nova importação e o uso de `execute_sql` estejam funcionando corretamente. |

## Exemplo de Estrutura de Arquivos Após a Refatoração

```
backend/
├── app/
│   ├── __init__.py
│   ├── models/
│   ├── routes/
│   └── services/
│       └── database.py  <-- NOVO MÓDULO DE BANCO DE DADOS
├── app.py               <-- Lógica de DB REMOVIDA, apenas importação
├── database/
├── db_init.py           <-- Lógica de importação SIMPLIFICADA
├── requirements.txt
├── run.py
└── wsgi.py
```

## Detalhamento da Alteração no `backend/db_init.py` (Passo 4.5)

O código original:

```python
# db_init.py (Original)
# ... Solução robusta de importação complexa ...
# ...
# 4. Obtém a função init_database do módulo carregado
if not hasattr(app_module, 'init_database'):
    print("Erro: A função 'init_database' não foi encontrada no app.py.")
    sys.exit(1)

init_database = app_module.init_database
# ...
```

O código após a refatoração (assumindo a criação do módulo `database.py`):

```python
# db_init.py (Refatorado)
import os
import sys
# Importa diretamente a função do novo módulo de serviço
from app.services.database import init_database 

# ----------------------------------------------------------------
# LÓGICA DE INICIALIZAÇÃO DO BANCO DE DADOS
# ----------------------------------------------------------------

try:
    # Em produção (Render), DATABASE_URL estará presente.
    if os.environ.get('DATABASE_URL'):
        print("Executando inicialização do banco de dados (PostgreSQL)...")
        init_database()
        print("Inicialização do banco de dados concluída com sucesso.")
    else:
        # Executa a inicialização do SQLite em desenvolvimento local
        print("DATABASE_URL não encontrada. Executando inicialização do SQLite para desenvolvimento local.")
        init_database()

except Exception as e:
    # Captura erros de conexão com o banco de dados
    print(f"Erro fatal durante a inicialização do banco de dados: {e}")
    print("Verifique se a DATABASE_URL está correta e se o banco de dados está ativo.")
    sys.exit(1)
```
