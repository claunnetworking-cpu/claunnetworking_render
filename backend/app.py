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

# Importa as funções de banco de dados do novo módulo
from app.services.database import execute_sql

# ----------------------------------------------------------------
# Configuração do Aplicativo
# ----------------------------------------------------------------

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.environ.get('SECRET_KEY', 'sua_chave_secreta_padrao')
app.permanent_session_lifetime = timedelta(days=7)

# ----------------------------------------------------------------
# Rotas de Autenticação
# ----------------------------------------------------------------

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('user_type')
    name = data.get('name')
    
    if not all([email, password, user_type, name]):
        return jsonify({"error": "Dados incompletos"}), 400

    password_hash = generate_password_hash(password)
    
    # 1. Inserir na tabela 'users'
    sql_insert = """
        INSERT INTO users (email, password_hash, user_type, name, phone)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """
    
    params = (email, password_hash, user_type, name, data.get('phone', ''))
    
    try:
        # Usa a função centralizada para executar o SQL
        result = execute_sql(sql_insert, params, fetch=True, commit=True)
        user_id = result[0][0]
        
        # 2. Inserir na tabela de perfil específica
        if user_type == 'candidate':
            sql_profile = "INSERT INTO candidate_profiles (user_id) VALUES (%s);"
        elif user_type == 'company':
            sql_profile = "INSERT INTO company_profiles (user_id) VALUES (%s);"
        elif user_type == 'institution':
            sql_profile = "INSERT INTO institution_profiles (user_id) VALUES (%s);"
        else:
            # Se o tipo de usuário for inválido, apenas retorna o sucesso do registro
            return jsonify({"message": "Registro de usuário bem-sucedido, mas tipo de perfil desconhecido."}), 201

        execute_sql(sql_profile, (user_id,), commit=True)
        
        return jsonify({"message": "Registro bem-sucedido", "user_id": user_id}), 201
        
    except Exception as e:
        # Verifica se é um erro de email duplicado (exemplo simplificado)
        if "unique constraint" in str(e).lower() or "duplicate key" in str(e).lower():
            return jsonify({"error": "Este e-mail já está registrado."}), 409
        
        print(f"Erro no registro: {e}")
        return jsonify({"error": "Erro interno do servidor durante o registro."}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"error": "E-mail e senha são obrigatórios"}), 400

    sql = "SELECT id, password_hash, user_type, name FROM users WHERE email = %s;"
    
    try:
        user_data = execute_sql(sql, (email,), fetch=True)
        
        if not user_data:
            return jsonify({"error": "E-mail ou senha inválidos"}), 401

        user_id, password_hash, user_type, name = user_data[0]

        if check_password_hash(password_hash, password):
            session.permanent = True
            session['user_id'] = user_id
            session['user_type'] = user_type
            session['name'] = name
            
            return jsonify({"message": "Login bem-sucedido", "user_type": user_type, "name": name}), 200
        else:
            return jsonify({"error": "E-mail ou senha inválidos"}), 401

    except Exception as e:
        print(f"Erro no login: {e}")
        return jsonify({"error": "Erro interno do servidor durante o login."}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    session.pop('user_type', None)
    session.pop('name', None)
    return jsonify({"message": "Logout bem-sucedido"}), 200

@app.route('/api/status', methods=['GET'])
def status():
    if 'user_id' in session:
        return jsonify({
            "logged_in": True,
            "user_id": session['user_id'],
            "user_type": session['user_type'],
            "name": session['name']
        }), 200
    else:
        return jsonify({"logged_in": False}), 200

# ----------------------------------------------------------------
# Rotas de Perfil (Exemplo)
# ----------------------------------------------------------------

@app.route('/api/profile', methods=['GET'])
def get_profile():
    if 'user_id' not in session:
        return jsonify({"error": "Não autorizado"}), 401

    user_id = session['user_id']
    user_type = session['user_type']
    
    # Exemplo de como buscar dados do perfil
    if user_type == 'candidate':
        sql = """
            SELECT u.email, u.name, p.*
            FROM users u
            JOIN candidate_profiles p ON u.id = p.user_id
            WHERE u.id = %s;
        """
    elif user_type == 'company':
        sql = """
            SELECT u.email, u.name, p.*
            FROM users u
            JOIN company_profiles p ON u.id = p.user_id
            WHERE u.id = %s;
        """
    elif user_type == 'institution':
        sql = """
            SELECT u.email, u.name, p.*
            FROM users u
            JOIN institution_profiles p ON u.id = p.user_id
            WHERE u.id = %s;
        """
    else:
        return jsonify({"error": "Tipo de usuário desconhecido"}), 400

    try:
        profile_data = execute_sql(sql, (user_id,), fetch=True)
        
        if profile_data:
            # Simplificação: converte a tupla em um dicionário (idealmente, usar um ORM ou nomear colunas)
            # Para este exemplo, apenas retornamos os dados brutos
            return jsonify({"profile": profile_data[0]}), 200
        else:
            return jsonify({"error": "Perfil não encontrado"}), 404

    except Exception as e:
        print(f"Erro ao buscar perfil: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

# ----------------------------------------------------------------
# Rotas Estáticas (para servir o frontend)
# ----------------------------------------------------------------

# Serve o index.html do frontend principal
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

# Serve arquivos estáticos do frontend principal
@app.route('/<path:path>')
def serve_static(path):
    # Garante que o usuário não acesse arquivos sensíveis
    if '..' in path:
        return "Acesso negado", 403
    
    # Tenta servir o arquivo do diretório 'frontend'
    try:
        return send_from_directory('../frontend', path)
    except Exception:
        # Se não encontrar, retorna 404
        return "Não encontrado", 404

# ----------------------------------------------------------------
# Execução
# ----------------------------------------------------------------

if __name__ == '__main__':
    # A inicialização do banco de dados será feita pelo db_init.py no deploy do Render
    # Em desenvolvimento local, o desenvolvedor deve executar db_init.py manualmente
    print("Atenção: A lógica de inicialização do banco de dados foi movida para db_init.py.")
    print("Execute 'python3 db_init.py' para criar o banco de dados localmente (SQLite).")
    app.run(debug=True, host='0.0.0.0', port=os.environ.get('PORT', 5000))
