
"""
Script para inicializar o banco de dados ClaunNetworking para produção.

Este script cria as tabelas e popula o banco de dados com dados essenciais.
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash

# Obter o caminho absoluto do diretório do script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Configurações
DATABASE_PATH = os.path.join(script_dir, '../backend/database/claunnetworking_production.db')
SCHEMA_PATH = os.path.join(script_dir, '../backend/app/models/database.py')
DATA_PATH = os.path.join(script_dir, '../backend/database/init_data_production.sql')

def init_database_production():
    """Inicializa o banco de dados de produção com tabelas e dados essenciais."""
    if os.path.exists(DATABASE_PATH):
        print("Banco de dados de produção já existe. Removendo para recriar...")
        os.remove(DATABASE_PATH)

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    # Ler e executar o schema do banco de dados
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_script = f.read()
    
    create_table_queries = []
    for statement in schema_script.split("cursor.execute(\""\")"):
        if "CREATE TABLE" in statement:
            query = statement.split("\""\")")[0].strip()
            create_table_queries.append(query)

    for query in create_table_queries:
        cursor.execute(query)

    # Ler e executar o arquivo de dados de produção
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data_script = f.read()

    # Gerar hash de senha seguro para o administrador
    # IMPORTANTE: Substitua 'admin_secure_password' por uma senha forte em um ambiente real
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin_secure_password')
    password_hash_admin = generate_password_hash(admin_password)

    # Substituir o placeholder do hash de senha no script SQL
    data_script = data_script.replace('pbkdf2:sha256:260000$your_secure_salt$your_secure_hash', password_hash_admin)

    # Executar o script SQL com os dados de produção
    cursor.executescript(data_script)

    conn.commit()
    conn.close()

    print("Banco de dados de produção inicializado com sucesso!")
    print(f"Credenciais do administrador: admin@claunnetworkingworking.com.br / {admin_password}")

if __name__ == '__main__':
    init_database_production()

