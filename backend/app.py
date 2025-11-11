# -*- coding: utf-8 -*-
"""
ClaunNetworking Backend API
Sistema completo de backend para a plataforma ClaunNetworking
"""

from flask import Flask, request, jsonify, session, send_from_directory
from flask_talisman import Talisman
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

# --- Passo 8.4: Remover Chave Secreta Padrão ---
# A chave secreta deve ser definida via variável de ambiente e ser forte.
# Se não for definida, o aplicativo falhará, o que é o comportamento de segurança desejado.
secret_key = os.environ.get('SECRET_KEY')
if not secret_key or secret_key == 'sua_chave_secreta_padrao':
    raise ValueError("SECRET_KEY não definida ou usando valor padrão. Defina uma chave secreta forte.")
app.secret_key = secret_key
app.permanent_session_lifetime = timedelta(days=7)

# --- Passo 8.1: Hardening de Sessões e Cookies ---
app.config.update(
    SESSION_COOKIE_SECURE=True,  # Enviar cookie apenas por HTTPS
    SESSION_COOKIE_HTTPONLY=True, # Impedir acesso via JavaScript
    SESSION_COOKIE_SAMESITE='Lax', # Mitigar CSRF
)

# --- Passo 8.2.1: Implementação de Security Headers com Talisman ---
# Talisman adiciona HSTS, CSP, X-Frame-Options, etc.
# O Talisman é configurado para funcionar com CORS e Flask-Session.
Talisman(app, content_security_policy=None) # CSP é desabilitado para evitar quebras no frontend, mas HSTS e outros headers são aplicados.


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

        # Com a otimização, user_data[0] é um dicionário (ou Row/RealDictRow)
        user_dict = dict(user_data[0])
        user_id = user_dict['id']
        password_hash = user_dict['password_hash']
        user_type = user_dict['user_type']
        name = user_dict['name']

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
            # Com a otimização, profile_data[0] já é um dicionário (ou Row/RealDictRow)
            # Convertemos para dict para garantir a serialização JSON
            return jsonify({"profile": dict(profile_data[0])}), 200
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

# Serve arquivos estáticos do frontend principal e admin\n@app.route('/<path:path>')\ndef serve_static(path):\n    # Garante que o usuário não acesse arquivos sensíveis\n    if '..' in path:\n        return "Acesso negado", 403\n    \n    # 1. Tenta servir o arquivo diretamente do diretório 'frontend'\n    try:\n        return send_from_directory('../frontend', path)\n    except Exception:\n        pass # Continua para a próxima verificação\n\n    # 2. Se a rota for para o admin, tenta servir o index do admin\n    if path.startswith('admin'):\n        # Serve o index do admin para rotas como /admin ou /admin/dashboard\n        return send_from_directory('../frontend/admin', 'admin_dashboard.html')\n\n    # 3. Se não encontrar, retorna 404\n    return "Não encontrado", 404\n\n# Rota específica para o index do admin\n@app.route('/admin')\ndef serve_admin_index():\n    return send_from_directory('../frontend/admin', 'admin_dashboard.html')--------------------------------------------------------
# Execução
# ----------------------------------------------------------------

if __name__ == '__main__':
    # A inicialização do banco de dados será feita pelo db_init.py no deploy do Render
    # Em desenvolvimento local, o desenvolvedor deve executar db_init.py manualmente
    print("Atenção: A lógica de inicialização do banco de dados foi movida para db_init.py.")
    print("Execute 'python3 db_init.py' para criar o banco de dados localmente (SQLite).")
    app.run(debug=True, host='0.0.0.0', port=os.environ.get('PORT', 5000))
