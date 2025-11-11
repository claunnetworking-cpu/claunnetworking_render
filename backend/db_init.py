# db_init.py
import os
import sys

# Importa diretamente a função do novo módulo de serviço
# Assumindo que o db_init.py está no mesmo nível de 'app' e que 'app' está no PYTHONPATH
try:
    from app.services.database import init_database
except ImportError as e:
    print(f"Erro de importação: {e}")
    print("Certifique-se de que o módulo 'app.services.database' está acessível.")
    sys.exit(1)

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
