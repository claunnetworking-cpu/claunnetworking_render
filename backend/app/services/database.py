# backend/app/services/database.py
import os
import psycopg2
import sqlite3
from urllib.parse import urlparse
from psycopg2.pool import SimpleConnectionPool

# ----------------------------------------------------------------
# Configuração do Banco de Dados
# ----------------------------------------------------------------

DATABASE_URL = os.environ.get('DATABASE_URL')
DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'claunnet-database.db')

# Variável global para o pool de conexões
connection_pool = None

# ----------------------------------------------------------------
# Funções de Conexão
# ----------------------------------------------------------------

def initialize_connection_pool():
    """
    Inicializa o pool de conexões do PostgreSQL.
    Chamado apenas uma vez na inicialização do aplicativo.
    """
    global connection_pool
    if DATABASE_URL and connection_pool is None:
        try:
            # Configurações básicas do pool: min 1, max 10 conexões
            connection_pool = SimpleConnectionPool(1, 10, DATABASE_URL)
            print("Pool de conexões PostgreSQL inicializado com sucesso.")
        except Exception as e:
            print(f"Erro ao inicializar o pool de conexões PostgreSQL: {e}")
            # Em caso de falha, o aplicativo deve falhar ou tentar novamente
            raise

def get_db_connection():
    """
    Retorna uma conexão com o banco de dados, usando o pool em produção (PostgreSQL)
    ou uma nova conexão (SQLite) em desenvolvimento.
    """
    if DATABASE_URL:
        # PostgreSQL - Obtém uma conexão do pool
        if connection_pool is None:
            initialize_connection_pool()
        return connection_pool.getconn()
    else:
        # SQLite - Abre uma nova conexão (desenvolvimento)
        os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
        return sqlite3.connect(DATABASE_PATH)

def put_db_connection(conn):
    """
    Retorna a conexão ao pool (PostgreSQL) ou fecha a conexão (SQLite).
    """
    if DATABASE_URL and connection_pool is not None:
        # PostgreSQL - Retorna a conexão ao pool
        connection_pool.putconn(conn)
    elif conn:
        # SQLite - Fecha a conexão
        conn.close()

# ----------------------------------------------------------------
# Funções de Execução de SQL
# ----------------------------------------------------------------

def execute_sql(sql, params=None, fetch=False, commit=False):
    """
    Executa comandos SQL no banco de dados.
    
    :param sql: Comando SQL a ser executado.
    :param params: Parâmetros para o comando SQL.
    :param fetch: Se True, retorna o resultado da consulta.
    :param commit: Se True, comita a transação.
    :return: Resultado da consulta se fetch=True, senão None.
    """
    conn = None
    try:
        conn = get_db_connection()
        
        # Para PostgreSQL, usamos cursor factory para retornar dicionários (melhor serialização)
        if DATABASE_URL:
            # Importa o cursor de dicionário para PostgreSQL
            from psycopg2.extras import RealDictCursor
            cursor = conn.cursor(cursor_factory=RealDictCursor)
        else:
            # Para SQLite, usamos o row_factory para retornar dicionários
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
        
        # SQLite usa '?' como placeholder, PostgreSQL usa '%s'.
        # Se for SQLite, converte '%s' para '?' no SQL antes de executar.
        if not DATABASE_URL:
            sql_sqlite = sql.replace('%s', '?')
            cursor.execute(sql_sqlite, params or ())
        else:
            cursor.execute(sql, params or ())
        
        if commit:
            conn.commit()
        
        if fetch:
            # Retorna a lista de dicionários (ou tuplas se não for RealDictCursor/sqlite3.Row)
            results = cursor.fetchall()
            
            # Converte sqlite3.Row para dict para consistência
            if not DATABASE_URL and results and isinstance(results[0], sqlite3.Row):
                return [dict(row) for row in results]
            
            return results
            
    except Exception as e:
        print(f"Erro de Banco de Dados: {e}")
        # Reverte a transação em caso de erro
        if conn:
            conn.rollback()
        raise
    finally:
        # Retorna a conexão ao pool ou fecha (dependendo do tipo de DB)
        if conn:
            put_db_connection(conn)

# ----------------------------------------------------------------
# Função de Inicialização do Banco de Dados
# ----------------------------------------------------------------

def init_database():
    """
    Cria as tabelas do banco de dados se elas não existirem.
    """
    print("Iniciando a criação das tabelas...")
    
    # ... (Comandos SQL de criação de tabelas)
    # Nota: Os comandos SQL originais usam SERIAL PRIMARY KEY e TIMESTAMP WITH TIME ZONE,
    # que são mais adequados para PostgreSQL. O SQLite os aceita, mas os mapeia.
    # Com a refatoração para RealDictCursor/sqlite3.Row, a serialização está melhor.
    
    sql_commands = [
        # Tabela de usuários
        '''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            user_type VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE,
            is_verified BOOLEAN DEFAULT FALSE,
            profile_public BOOLEAN DEFAULT TRUE
        )
        ''',
        
        # Tabela de perfis de candidatos
        '''
        CREATE TABLE IF NOT EXISTS candidate_profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users (id),
            birth_date DATE,
            marital_status VARCHAR(50),
            nationality VARCHAR(100),
            linkedin_url VARCHAR(255),
            address_cep VARCHAR(20),
            address_street VARCHAR(255),
            address_number VARCHAR(10),
            address_complement VARCHAR(255),
            address_neighborhood VARCHAR(100),
            address_city VARCHAR(100),
            address_state VARCHAR(50),
            professional_title VARCHAR(255),
            experience_years INTEGER,
            sector VARCHAR(100),
            level VARCHAR(50),
            work_modality VARCHAR(50),
            salary_expectation DECIMAL(10,2),
            summary TEXT,
            skills TEXT,
            languages TEXT,
            education_level VARCHAR(100),
            course VARCHAR(255),
            institution VARCHAR(255),
            graduation_year INTEGER,
            availability_status VARCHAR(50),
            start_availability DATE
        )
        ''',
        
        # Tabela de perfis de empresas
        '''
        CREATE TABLE IF NOT EXISTS company_profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users (id),
            cnpj VARCHAR(50),
            company_type VARCHAR(100),
            founded_year INTEGER,
            sector VARCHAR(100),
            employees_count VARCHAR(50),
            tagline VARCHAR(255),
            description TEXT,
            address_cep VARCHAR(20),
            address_street VARCHAR(255),
            address_number VARCHAR(10),
            address_complement VARCHAR(255),
            address_neighborhood VARCHAR(100),
            address_city VARCHAR(100),
            address_state VARCHAR(50),
            work_modality VARCHAR(50),
            company_culture TEXT,
            benefits TEXT,
            areas_of_operation TEXT,
            website VARCHAR(255),
            linkedin_url VARCHAR(255),
            responsible_name VARCHAR(255),
            responsible_email VARCHAR(255),
            responsible_phone VARCHAR(50)
        )
        ''',
        
        # Tabela de perfis de instituições
        '''
        CREATE TABLE IF NOT EXISTS institution_profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users (id),
            cnpj VARCHAR(50),
            institution_type VARCHAR(100),
            founded_year INTEGER,
            students_count INTEGER,
            mec_code VARCHAR(50),
            description TEXT,
            address_cep VARCHAR(20),
            address_street VARCHAR(255),
            address_number VARCHAR(10),
            address_complement VARCHAR(255),
            address_neighborhood VARCHAR(100),
            address_city VARCHAR(100),
            address_state VARCHAR(50),
            courses_offered TEXT,
            education_levels TEXT,
            modalities TEXT,
            specialization_areas TEXT,
            special_programs TEXT,
            website VARCHAR(255),
            linkedin_url VARCHAR(255),
            responsible_name VARCHAR(255),
            responsible_email VARCHAR(255),
            responsible_phone VARCHAR(50)
        )
        ''',
        
        # Tabela de vagas
        '''
        CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            company_id INTEGER NOT NULL REFERENCES users (id),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            requirements TEXT,
            benefits TEXT,
            salary_range VARCHAR(100),
            location VARCHAR(255),
            work_modality VARCHAR(50),
            job_type VARCHAR(50),
            area VARCHAR(100),
            level VARCHAR(50),
            is_active BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            expires_at DATE
        )
        ''',
        
        # Tabela de candidaturas
        '''
        CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            job_id INTEGER NOT NULL REFERENCES jobs (id),
            candidate_id INTEGER NOT NULL REFERENCES users (id),
            status VARCHAR(50) DEFAULT 'pending',
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            message TEXT
        )
        ''',
        
        # Tabela de cursos
        '''
        CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            institution_id INTEGER NOT NULL REFERENCES users (id),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(100),
            level VARCHAR(50),
            modality VARCHAR(50),
            duration VARCHAR(50),
            price DECIMAL(10,2) DEFAULT 0,
            is_free BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        ''',
        
        # Tabela de planos
        '''
        CREATE TABLE IF NOT EXISTS plans (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            features TEXT,
            plan_type VARCHAR(50) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE
        )
        ''',
        
        # Tabela de assinaturas
        '''
        CREATE TABLE IF NOT EXISTS subscriptions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users (id),
            plan_id INTEGER NOT NULL REFERENCES plans (id),
            status VARCHAR(50) DEFAULT 'active',
            started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            expires_at DATE
        )
        '''
    ]
    
    # Executa todos os comandos SQL
    for sql in sql_commands:
        execute_sql(sql, commit=True)
        
    print("Criação das tabelas concluída.")
