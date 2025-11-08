# db_init.py
import os
import sys

# Adiciona o diretório atual ao PATH para garantir que 'app' seja encontrado
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    # Importa a função init_database do app.py
    from app_final_final_v2 import init_database
    
    # A função init_database no app.py já contém a lógica para usar
    # PostgreSQL se DATABASE_URL estiver presente, ou SQLite caso contrário.
    
    # Em produção (Render), DATABASE_URL estará presente.
    if os.environ.get('DATABASE_URL'):
        print("Executando inicialização do banco de dados (PostgreSQL)...")
        init_database()
        print("Inicialização do banco de dados concluída.")
    else:
        # Executa a inicialização do SQLite em desenvolvimento local
        print("DATABASE_URL não encontrada. Executando inicialização do SQLite para desenvolvimento local.")
        init_database()

except ImportError:
    print("Erro: Não foi possível importar 'init_database' do 'app.py'. Certifique-se de que 'app.py' está no mesmo diretório.")
    sys.exit(1)
except Exception as e:
    print(f"Erro fatal durante a inicialização do banco de dados: {e}")
    sys.exit(1)
