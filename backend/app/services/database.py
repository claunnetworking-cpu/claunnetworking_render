# backend/app/services/database.py
import os
import psycopg2
import sqlite3
from urllib.parse import urlparse

# ----------------------------------------------------------------
# Configuração do Banco de Dados
# ----------------------------------------------------------------

# Tenta obter a URL de conexão do PostgreSQL do ambiente
DATABASE_URL = os.environ.get('DATABASE_URL')
DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'claunnet-database.db')

# ----------------------------------------------------------------
# Funções de Conexão
# ----------------------------------------------------------------

def get_db_connection():
    """
    Retorna uma conexão com o banco de dados, usando PostgreSQL em produção 
    (se DATABASE_URL estiver definida) ou SQLite em desenvolvimento.
    """
    if DATABASE_URL:
        # PostgreSQL
        return psycopg2.connect(DATABASE_URL)
    else:
        # SQLite
        # Garante que o diretório 'database' exista
        os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
        return sqlite3.connect(DATABASE_PATH)

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
        cursor = conn.cursor()
        
        # Para SQLite, o cursor é o próprio objeto de conexão em alguns casos,
        # mas para manter a compatibilidade com psycopg2, usamos o cursor.
        
        cursor.execute(sql, params or ())
        
        if commit:
            conn.commit()
        
        if fetch:
            # Para SQLite, o fetchall() retorna tuplas, assim como o psycopg2
            return cursor.fetchall()
            
    except Exception as e:
        print(f"Erro de Banco de Dados: {e}")
        # Reverte a transação em caso de erro
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()

# ----------------------------------------------------------------
# Função de Inicialização do Banco de Dados
# ----------------------------------------------------------------

def init_database():
    """
    Cria as tabelas do banco de dados se elas não existirem.
    """
    print("Iniciando a criação das tabelas...")
    
    # Lista de comandos SQL para criar as tabelas
    # Estes comandos são compatíveis com PostgreSQL e SQLite (com pequenas ressalvas,
    # mas o psycopg2 e o sqlite3 lidam bem com a maioria das diferenças básicas aqui).
    
    # Para o SQLite, o tipo SERIAL PRIMARY KEY é mapeado para INTEGER PRIMARY KEY
    # e o TIMESTAMP WITH TIME ZONE é mapeado para TEXT ou DATETIME.
    
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
        # Usamos execute_sql com commit=True para cada comando CREATE TABLE
        # O execute_sql já trata a conexão e o fechamento
        execute_sql(sql, commit=True)
        
    print("Criação das tabelas concluída.")
