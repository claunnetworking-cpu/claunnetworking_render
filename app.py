#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ClaunNetworking Backend API
Sistema completo de backend para a plataforma ClaunNetworking
Suporta PostgreSQL (produção) e SQLite (desenvolvimento)
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from datetime import datetime, timedelta
import uuid
from urllib.parse import urlparse

app = Flask(__name__)

# Configuração de Secret Key via variável de ambiente
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key_change_in_production')

# Configuração de CORS - ajuste as origens conforme necessário
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')
CORS(app, 
     resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
     supports_credentials=True)

# Configurações de Banco de Dados
DATABASE_URL = os.environ.get('DATABASE_URL')
UPLOAD_FOLDER = 'uploads'

# Criar diretórios necessários
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Determinar tipo de banco de dados
USE_POSTGRESQL = DATABASE_URL is not None and DATABASE_URL.startswith('postgres')

if USE_POSTGRESQL:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    
    # Ajustar URL do PostgreSQL (Render usa postgres://, psycopg2 precisa de postgresql://)
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
else:
    import sqlite3
    DATABASE_PATH = 'database/claunnetworking.db'
    os.makedirs('database', exist_ok=True)

def get_db_connection():
    """Retorna uma conexão com o banco de dados (PostgreSQL ou SQLite)"""
    if USE_POSTGRESQL:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    else:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn

def init_database():
    """Inicializa o banco de dados com todas as tabelas necessárias"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if USE_POSTGRESQL:
        # SQL para PostgreSQL
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                user_type VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                is_verified BOOLEAN DEFAULT FALSE,
                profile_public BOOLEAN DEFAULT TRUE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS candidate_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                birth_date DATE,
                marital_status VARCHAR(50),
                nationality VARCHAR(100),
                linkedin_url VARCHAR(255),
                address_cep VARCHAR(20),
                address_street VARCHAR(255),
                address_number VARCHAR(20),
                address_complement VARCHAR(100),
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
                start_availability DATE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS company_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                cnpj VARCHAR(20),
                company_type VARCHAR(100),
                founded_year INTEGER,
                sector VARCHAR(100),
                employees_count VARCHAR(50),
                tagline VARCHAR(255),
                description TEXT,
                address_cep VARCHAR(20),
                address_street VARCHAR(255),
                address_number VARCHAR(20),
                address_complement VARCHAR(100),
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
                responsible_phone VARCHAR(50),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS institution_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                cnpj VARCHAR(20),
                institution_type VARCHAR(100),
                founded_year INTEGER,
                students_count INTEGER,
                mec_code VARCHAR(50),
                description TEXT,
                address_cep VARCHAR(20),
                address_street VARCHAR(255),
                address_number VARCHAR(20),
                address_complement VARCHAR(100),
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
                responsible_phone VARCHAR(50),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                company_id INTEGER NOT NULL,
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at DATE,
                FOREIGN KEY (company_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                job_id INTEGER NOT NULL,
                candidate_id INTEGER NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                message TEXT,
                FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
                FOREIGN KEY (candidate_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                institution_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                level VARCHAR(50),
                modality VARCHAR(50),
                duration VARCHAR(100),
                price DECIMAL(10,2) DEFAULT 0,
                is_free BOOLEAN DEFAULT TRUE,
                is_featured BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (institution_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
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
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                plan_id INTEGER NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at DATE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE CASCADE
            )
        ''')
    else:
        # SQL para SQLite
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

# Rota de Health Check
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint para monitoramento do Render"""
    try:
        # Verifica se o banco de dados está acessível
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        conn.close()
        
        db_type = 'PostgreSQL' if USE_POSTGRESQL else 'SQLite'
        
        return jsonify({
            'status': 'healthy',
            'service': 'claunnet-api',
            'database': db_type,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 503

# Rotas de autenticação
@app.route('/api/register', methods=['POST'])
def register():
    """Registro de novos usuários"""
    data = request.get_json()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar se email já existe
        cursor.execute('SELECT id FROM users WHERE email = %s' if USE_POSTGRESQL else 'SELECT id FROM users WHERE email = ?', 
                      (data['email'],))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Criar usuário
        password_hash = generate_password_hash(data['password'])
        
        if USE_POSTGRESQL:
            cursor.execute('''
                INSERT INTO users (email, password_hash, user_type, name, phone)
                VALUES (%s, %s, %s, %s, %s) RETURNING id
            ''', (data['email'], password_hash, data['user_type'], data['name'], data.get('phone', '')))
            user_id = cursor.fetchone()[0]
        else:
            cursor.execute('''
                INSERT INTO users (email, password_hash, user_type, name, phone)
                VALUES (?, ?, ?, ?, ?)
            ''', (data['email'], password_hash, data['user_type'], data['name'], data.get('phone', '')))
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
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, password_hash, user_type, name FROM users WHERE email = %s' if USE_POSTGRESQL else 'SELECT id, password_hash, user_type, name FROM users WHERE email = ?',
                      (data['email'],))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            if USE_POSTGRESQL:
                user_id, pwd_hash, user_type, name = user
            else:
                user_id, pwd_hash, user_type, name = user[0], user[1], user[2], user[3]
            
            if check_password_hash(pwd_hash, data['password']):
                session['user_id'] = user_id
                session['user_type'] = user_type
                
                return jsonify({
                    'message': 'Login realizado com sucesso',
                    'user': {
                        'id': user_id,
                        'type': user_type,
                        'name': name
                    }
                }), 200
        
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
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Filtros
        area = request.args.get('area')
        location = request.args.get('location')
        modality = request.args.get('modality')
        
        query = '''
            SELECT j.*, u.name as company_name 
            FROM jobs j 
            JOIN users u ON j.company_id = u.id 
            WHERE j.is_active = %s
        ''' if USE_POSTGRESQL else '''
            SELECT j.*, u.name as company_name 
            FROM jobs j 
            JOIN users u ON j.company_id = u.id 
            WHERE j.is_active = 1
        '''
        
        params = [True] if USE_POSTGRESQL else []
        
        if area:
            query += ' AND j.area = %s' if USE_POSTGRESQL else ' AND j.area = ?'
            params.append(area)
        if location:
            query += ' AND j.location LIKE %s' if USE_POSTGRESQL else ' AND j.location LIKE ?'
            params.append(f'%{location}%')
        if modality:
            query += ' AND j.work_modality = %s' if USE_POSTGRESQL else ' AND j.work_modality = ?'
            params.append(modality)
            
        query += ' ORDER BY j.is_featured DESC, j.created_at DESC'
        
        cursor.execute(query, params)
        jobs = cursor.fetchall()
        
        # Converter para dicionário
        job_list = []
        for job in jobs:
            if USE_POSTGRESQL:
                job_dict = dict(job) if hasattr(job, 'keys') else {
                    'id': job[0], 'company_id': job[1], 'title': job[2],
                    'description': job[3], 'requirements': job[4], 'benefits': job[5],
                    'salary_range': job[6], 'location': job[7], 'work_modality': job[8],
                    'job_type': job[9], 'area': job[10], 'level': job[11],
                    'is_featured': job[13], 'created_at': str(job[14]),
                    'company_name': job[16]
                }
            else:
                job_dict = {
                    'id': job[0], 'company_id': job[1], 'title': job[2],
                    'description': job[3], 'requirements': job[4], 'benefits': job[5],
                    'salary_range': job[6], 'location': job[7], 'work_modality': job[8],
                    'job_type': job[9], 'area': job[10], 'level': job[11],
                    'is_featured': job[13], 'created_at': job[14],
                    'company_name': job[16]
                }
            job_list.append(job_dict)
        
        conn.close()
        return jsonify(job_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs', methods=['POST'])
def create_job():
    """Criar nova vaga"""
    if 'user_id' not in session:
        return jsonify({'error': 'Não autorizado'}), 401
    
    data = request.get_json()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if USE_POSTGRESQL:
            cursor.execute('''
                INSERT INTO jobs (company_id, title, description, requirements, benefits, 
                                salary_range, location, work_modality, job_type, area, level)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            ''', (session['user_id'], data['title'], data['description'], 
                  data['requirements'], data['benefits'], data['salary_range'],
                  data['location'], data['work_modality'], data['job_type'],
                  data['area'], data['level']))
            job_id = cursor.fetchone()[0]
        else:
            cursor.execute('''
                INSERT INTO jobs (company_id, title, description, requirements, benefits, 
                                salary_range, location, work_modality, job_type, area, level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (session['user_id'], data['title'], data['description'], 
                  data['requirements'], data['benefits'], data['salary_range'],
                  data['location'], data['work_modality'], data['job_type'],
                  data['area'], data['level']))
            job_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Vaga criada com sucesso', 'job_id': job_id}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de candidaturas
@app.route('/api/apply', methods=['POST'])
def apply_to_job():
    """Candidatar-se a uma vaga"""
    if 'user_id' not in session:
        return jsonify({'error': 'Não autorizado'}), 401
    
    data = request.get_json()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar se já se candidatou
        cursor.execute('SELECT id FROM applications WHERE job_id = %s AND candidate_id = %s' if USE_POSTGRESQL else 'SELECT id FROM applications WHERE job_id = ? AND candidate_id = ?',
                      (data['job_id'], session['user_id']))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Você já se candidatou a esta vaga'}), 400
        
        cursor.execute('''
            INSERT INTO applications (job_id, candidate_id, message)
            VALUES (%s, %s, %s)
        ''' if USE_POSTGRESQL else '''
            INSERT INTO applications (job_id, candidate_id, message)
            VALUES (?, ?, ?)
        ''', (data['job_id'], session['user_id'], data.get('message', '')))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Candidatura enviada com sucesso'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de cursos
@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Listar cursos com filtros"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Filtros
        category = request.args.get('category')
        level = request.args.get('level')
        modality = request.args.get('modality')
        is_free = request.args.get('is_free')
        
        query = '''
            SELECT c.*, u.name as institution_name 
            FROM courses c 
            JOIN users u ON c.institution_id = u.id 
            WHERE c.is_active = %s
        ''' if USE_POSTGRESQL else '''
            SELECT c.*, u.name as institution_name 
            FROM courses c 
            JOIN users u ON c.institution_id = u.id 
            WHERE c.is_active = 1
        '''
        
        params = [True] if USE_POSTGRESQL else []
        
        if category:
            query += ' AND c.category = %s' if USE_POSTGRESQL else ' AND c.category = ?'
            params.append(category)
        if level:
            query += ' AND c.level = %s' if USE_POSTGRESQL else ' AND c.level = ?'
            params.append(level)
        if modality:
            query += ' AND c.modality = %s' if USE_POSTGRESQL else ' AND c.modality = ?'
            params.append(modality)
        if is_free:
            query += ' AND c.is_free = %s' if USE_POSTGRESQL else ' AND c.is_free = ?'
            params.append(True if is_free.lower() == 'true' else False)
            
        query += ' ORDER BY c.is_featured DESC, c.created_at DESC'
        
        cursor.execute(query, params)
        courses = cursor.fetchall()
        
        # Converter para dicionário
        course_list = []
        for course in courses:
            if USE_POSTGRESQL:
                course_dict = dict(course) if hasattr(course, 'keys') else {
                    'id': course[0], 'institution_id': course[1], 'title': course[2],
                    'description': course[3], 'category': course[4], 'level': course[5],
                    'modality': course[6], 'duration': course[7], 'price': float(course[8]) if course[8] else 0,
                    'is_free': course[9], 'is_featured': course[10],
                    'created_at': str(course[12]), 'institution_name': course[13]
                }
            else:
                course_dict = {
                    'id': course[0], 'institution_id': course[1], 'title': course[2],
                    'description': course[3], 'category': course[4], 'level': course[5],
                    'modality': course[6], 'duration': course[7], 'price': course[8],
                    'is_free': course[9], 'is_featured': course[10],
                    'created_at': course[12], 'institution_name': course[13]
                }
            course_list.append(course_dict)
        
        conn.close()
        return jsonify(course_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Inicializar banco de dados
init_database()

def create_app():
    return app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

