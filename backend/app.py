#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ClaunNetworking Backend API
Sistema completo de backend para a plataforma ClaunNetworking
"""

from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from datetime import datetime, timedelta
import uuid
import psycopg2
from urllib.parse import urlparse

# ----------------------------------------------------------------
# Configuração do Banco de Dados
# ----------------------------------------------------------------

# Tenta obter a URL de conexão do PostgreSQL do ambiente
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    # Se DATABASE_URL existe, usa PostgreSQL
    print("Usando PostgreSQL em produção.")
    
    # Função para conectar ao PostgreSQL
    def get_db_connection():
        return psycopg2.connect(DATABASE_URL)

    # Função para executar comandos SQL
    def execute_sql(sql, params=None, fetch=False, commit=False):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(sql, params or ())
            
            if commit:
                conn.commit()
            
            if fetch:
                return cursor.fetchall()
            
        except Exception as e:
            print(f"Erro de Banco de Dados: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    # Função para inicializar o banco de dados (PostgreSQL)
    def init_database():
        # A inicialização do PostgreSQL será feita via comandos SQL
        
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Tabela de usuários
            cursor.execute('''
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
            ''')
            
            # Tabela de perfis de candidatos
            cursor.execute('''
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
            ''')
            
            # Tabela de perfis de empresas
            cursor.execute('''
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
            ''')
            
            # Tabela de perfis de instituições
            cursor.execute('''
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
            ''')
            
            # Tabela de vagas
            cursor.execute('''
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
            ''')
            
            # Tabela de candidaturas
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS applications (
                    id SERIAL PRIMARY KEY,
                    job_id INTEGER NOT NULL REFERENCES jobs (id),
                    candidate_id INTEGER NOT NULL REFERENCES users (id),
                    status VARCHAR(50) DEFAULT 'pending',
                    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    message TEXT
                )
            ''')
            
            # Tabela de cursos
            cursor.execute('''
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
            ''')
            
            # Tabela de planos
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS plans (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10,2) NOT NULL,
                    features TEXT,
                    plan_type VARCHAR(50) NOT NULL,
                    is_active BOOLEAN DEFAULT TRUE
                )
            ''')
            
            # Tabela de assinaturas
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS subscriptions (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users (id),
                    plan_id INTEGER NOT NULL REFERENCES plans (id),
                    status VARCHAR(50) DEFAULT 'active',
                    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    expires_at DATE
                )
            ''')
            
            conn.commit()
            
        except Exception as e:
            print(f"Erro ao inicializar o PostgreSQL: {e}")
        finally:
            if conn:
                conn.close()

else:
    # Se DATABASE_URL não existe, usa SQLite (para desenvolvimento local)
    print("Usando SQLite para desenvolvimento local.")
    import sqlite3
    DATABASE_PATH = 'database/claunnetworking.db' # <-- CORRIGIDO PARA O NOME 'claunnetworking'
    
    def get_db_connection():
        return sqlite3.connect(DATABASE_PATH)

    def execute_sql(sql, params=None, fetch=False, commit=False):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(sql, params or ())
            
            if commit:
                conn.commit()
            
            if fetch:
                return cursor.fetchall()
            
        except Exception as e:
            print(f"Erro de Banco de Dados: {e}")
            raise
        finally:
            if conn:
                conn.close()

    # Função para inicializar o banco de dados (SQLite)
    def init_database():
        # Seu código original de criação de tabelas SQLite
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Tabela de usuários
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                user_type TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1,
                is_verified BOOLEAN DEFAULT 0,
                profile_public BOOLEAN DEFAULT 1
            )
        ''')
        
        # Tabela de perfis de candidatos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS candidate_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                birth_date DATE,
                marital_status TEXT,
                nationality TEXT,
                linkedin_url TEXT,
                address_cep TEXT,
                address_street TEXT,
                address_number TEXT,
                address_complement TEXT,
                address_neighborhood TEXT,
                address_city TEXT,
                address_state TEXT,
                professional_title TEXT,
                experience_years INTEGER,
                sector TEXT,
                level TEXT,
                work_modality TEXT,
                salary_expectation DECIMAL(10,2),
                summary TEXT,
                skills TEXT,
                languages TEXT,
                education_level TEXT,
                course TEXT,
                institution TEXT,
                graduation_year INTEGER,
                availability_status TEXT,
                start_availability DATE,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Tabela de perfis de empresas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS company_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                cnpj TEXT,
                company_type TEXT,
                founded_year INTEGER,
                sector TEXT,
                employees_count TEXT,
                tagline TEXT,
                description TEXT,
                address_cep TEXT,
                address_street TEXT,
                address_number TEXT,
                address_complement TEXT,
                address_neighborhood TEXT,
                address_city TEXT,
                address_state TEXT,
                work_modality TEXT,
                company_culture TEXT,
                benefits TEXT,
                areas_of_operation TEXT,
                website TEXT,
                linkedin_url TEXT,
                responsible_name TEXT,
                responsible_email TEXT,
                responsible_phone TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Tabela de perfis de instituições
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS institution_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                cnpj TEXT,
                institution_type TEXT,
                founded_year INTEGER,
                students_count INTEGER,
                mec_code TEXT,
                description TEXT,
                address_cep TEXT,
                address_street TEXT,
                address_number TEXT,
                address_complement TEXT,
                address_neighborhood TEXT,
                address_city TEXT,
                address_state TEXT,
                courses_offered TEXT,
                education_levels TEXT,
                modalities TEXT,
                specialization_areas TEXT,
                special_programs TEXT,
                website TEXT,
                linkedin_url TEXT,
                responsible_name TEXT,
                responsible_email TEXT,
                responsible_phone TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Tabela de vagas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                requirements TEXT,
                benefits TEXT,
                salary_range TEXT,
                location TEXT,
                work_modality TEXT,
                job_type TEXT,
                area TEXT,
                level TEXT,
                is_active BOOLEAN DEFAULT 1,
                is_featured BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at DATE,
                FOREIGN KEY (company_id) REFERENCES users (id)
            )
        ''')
        
        # Tabela de candidaturas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id INTEGER NOT NULL,
                candidate_id INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                message TEXT,
                FOREIGN KEY (job_id) REFERENCES jobs (id),
                FOREIGN KEY (candidate_id) REFERENCES users (id)
            )
        ''')
        
        # Tabela de cursos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                institution_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                category TEXT,
                level TEXT,
                modality TEXT,
                duration TEXT,
                price DECIMAL(10,2) DEFAULT 0,
                is_free BOOLEAN DEFAULT 1,
                is_featured BOOLEAN DEFAULT 0,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (institution_id) REFERENCES users (id)
            )
        ''')
        
        # Tabela de planos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                features TEXT,
                plan_type TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        # Tabela de assinaturas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                plan_id INTEGER NOT NULL,
                status TEXT DEFAULT 'active',
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at DATE,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (plan_id) REFERENCES plans (id)
            )
        ''')
        
        conn.commit()
        conn.close()

# ----------------------------------------------------------------
# Fim da Configuração do Banco de Dados
# ----------------------------------------------------------------

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'claunnetworking_secret_key_2024') # Usar variável de ambiente para SECRET_KEY
CORS(app, supports_credentials=True)

# Configurações
UPLOAD_FOLDER = 'uploads'

# Criar diretórios necessários (apenas para SQLite/Desenvolvimento)
if not DATABASE_URL:
    os.makedirs('database', exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Inicializa o banco de dados
# NOTA: A chamada a init_database() foi removida daqui para ser executada
# APENAS pelo db_init.py, garantindo que o Gunicorn não a chame duas vezes.
# init_database() 

# Rotas de autenticação
@app.route('/api/register', methods=['POST'])
def register():
    """Registro de novos usuários"""
    data = request.get_json()
    
    try:
        # Usando a função genérica de execução SQL
        password_hash = generate_password_hash(data['password'])
        
        # Verificar se email já existe
        sql_check = 'SELECT id FROM users WHERE email = %s' if DATABASE_URL else 'SELECT id FROM users WHERE email = ?'
        user_exists = execute_sql(sql_check, (data['email'],), fetch=True)
        
        if user_exists:
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Criar usuário
        sql_insert = '''
            INSERT INTO users (email, password_hash, user_type, name, phone)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        ''' if DATABASE_URL else '''
            INSERT INTO users (email, password_hash, user_type, name, phone)
            VALUES (?, ?, ?, ?, ?)
        '''
        
        params = (data['email'], password_hash, data['user_type'], data['name'], data.get('phone', ''))
        
        if DATABASE_URL:
            # Para PostgreSQL, precisamos de uma conexão separada para obter o ID
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(sql_insert, params)
            user_id = cursor.fetchone()[0]
            conn.commit()
            conn.close()
        else:
            # Para SQLite, usamos o método original
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(sql_insert, params)
            user_id = cursor.lastrowid
            conn.commit()
            conn.close()
        
        return jsonify({'message': 'Usuário cadastrado com sucesso', 'user_id': user_id}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login de usuários"""
    data = request.get_json()
    
    try:
        sql_select = 'SELECT id, password_hash, user_type, name FROM users WHERE email = %s' if DATABASE_URL else 'SELECT id, password_hash, user_type, name FROM users WHERE email = ?'
        user_data = execute_sql(sql_select, (data['email'],), fetch=True)
        
        if user_data:
            user = user_data[0]
            if check_password_hash(user[1], data['password']):
                session['user_id'] = user[0]
                session['user_type'] = user[2]
                
                return jsonify({
                    'message': 'Login realizado com sucesso',
                    'user': {
                        'id': user[0],
                        'type': user[2],
                        'name': user[3]
                    }
                }), 200
            else:
                return jsonify({'error': 'Credenciais inválidas'}), 401
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout de usuários"""
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

# Rotas de vagas
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Listar vagas com filtros"""
    try:
        # Usando a função genérica de execução SQL
        area = request.args.get('area')
        location = request.args.get('location')
        modality = request.args.get('modality')
        
        query = '''
            SELECT j.*, c.name as company_name
            FROM jobs j
            JOIN users c ON j.company_id = c.id
            WHERE j.is_active = %s
        ''' if DATABASE_URL else '''
            SELECT j.*, c.name as company_name
            FROM jobs j
            JOIN users c ON j.company_id = c.id
            WHERE j.is_active = ?
        '''
        
        params = [True]
        
        if area:
            query += ' AND j.area = %s' if DATABASE_URL else ' AND j.area = ?'
            params.append(area)
        if location:
            query += ' AND j.location = %s' if DATABASE_URL else ' AND j.location = ?'
            params.append(location)
        if modality:
            query += ' AND j.work_modality = %s' if DATABASE_URL else ' AND j.work_modality = ?'
            params.append(modality)
            
        jobs_data = execute_sql(query, tuple(params), fetch=True)
        
        # Mapeamento dos resultados para JSON (simplificado)
        jobs_list = []
        if jobs_data:
            # Este mapeamento deve ser mais robusto, mas serve para o exemplo
            # Assumindo que a ordem das colunas é a mesma da criação da tabela
            for job in jobs_data:
                jobs_list.append({
                    'id': job[0],
                    'title': job[2],
                    'company_name': job[-1]
                    # ... adicione mais campos conforme necessário
                })
        
        return jsonify(jobs_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de perfil (Exemplo de uso de execute_sql para UPDATE)
@app.route('/api/profile/candidate/<int:user_id>', methods=['PUT'])
def update_candidate_profile(user_id):
    data = request.get_json()
    
    # Exemplo de como usar execute_sql para UPDATE
    # NOTA: Esta rota precisa de autenticação e autorização, que não estão implementadas aqui.
    try:
        sql_update = '''
            UPDATE candidate_profiles SET professional_title = %s, summary = %s WHERE user_id = %s
        ''' if DATABASE_URL else '''
            UPDATE candidate_profiles SET professional_title = ?, summary = ? WHERE user_id = ?
        '''
        
        params = (data.get('professional_title'), data.get('summary'), user_id)
        
        # execute_sql com commit=True
        execute_sql(sql_update, params, commit=True)
        
        return jsonify({'message': 'Perfil atualizado com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de upload (Exemplo de uso de send_from_directory)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Inicialização
if __name__ == '__main__':
    # A chamada a init_database() foi removida daqui para ser executada
    # APENAS pelo db_init.py, garantindo que o Gunicorn não a chame duas vezes.
    # Se você rodar localmente sem o db_init.py, o banco de dados não será inicializado.
    app.run(debug=True)
