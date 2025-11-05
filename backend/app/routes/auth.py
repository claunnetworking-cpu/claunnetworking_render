#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.database import get_db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
        if cursor.fetchone():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        password_hash = generate_password_hash(data['password'])
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

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, password_hash, user_type, name FROM users WHERE email = ?', (data['email'],))
        user = cursor.fetchone()
        
        if user and check_password_hash(user['password_hash'], data['password']):
            session['user_id'] = user['id']
            session['user_type'] = user['user_type']
            
            return jsonify({
                'message': 'Login realizado com sucesso',
                'user': {
                    'id': user['id'],
                    'type': user['user_type'],
                    'name': user['name']
                }
            }), 200
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

