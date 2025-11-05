#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
from flask import current_app

def get_db():
    db_path = current_app.config["DATABASE_PATH"]
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Inicializa o banco de dados com todas as tabelas necessárias"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Tabela de usuários
    cursor.execute("""
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
    """)
    
    # Tabela de perfis de candidatos
    cursor.execute("""
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
    """)
    
    # Tabela de perfis de empresas
    cursor.execute("""
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
    """)
    
    # Tabela de perfis de instituições
    cursor.execute("""
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
    """)
    
    # Tabela de vagas
    cursor.execute("""
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
    """)
    
    # Tabela de candidaturas
    cursor.execute("""
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
    """)
    
    # Tabela de cursos
    cursor.execute("""
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
    """)
    
    # Tabela de planos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            features TEXT,
            plan_type TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1
        )
    """)
    
    # Tabela de assinaturas
    cursor.execute("""
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
    """)
    
    conn.commit()
    conn.close()

