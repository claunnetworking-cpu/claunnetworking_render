# db_init.py
import os
import sys
import importlib.util

# ----------------------------------------------------------------
# SOLUÇÃO ROBUSTA DE IMPORTAÇÃO PARA AMBIENTES DE EXECUÇÃO (RENDER)
# ----------------------------------------------------------------

# 1. Define o caminho para o arquivo app.py
APP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app.py')

# 2. Cria uma especificação de módulo a partir do arquivo
spec = importlib.util.spec_from_file_location("app", APP_PATH)

if spec is None:
    print(f"Erro: Não foi possível encontrar o arquivo app.py no caminho: {APP_PATH}")
    sys.exit(1)

# 3. Carrega o módulo (executa o código de nível superior do app.py)
app_module = importlib.util.module_from_spec(spec)

try:
    spec.loader.exec_module(app_module)
except Exception as e:
    print(f"Erro fatal ao executar o código de nível superior do app.py durante a importação: {e}")
    print("Isso pode ser causado por uma DATABASE_URL incorreta ou um erro de sintaxe.")
    sys.exit(1)

# 4. Obtém a função init_database do módulo carregado
if not hasattr(app_module, 'init_database'):
    print("Erro: A função 'init_database' não foi encontrada no app.py.")
    sys.exit(1)

init_database = app_module.init_database

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
