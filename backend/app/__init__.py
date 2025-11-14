
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask
from flask_cors import CORS
import os

from .routes import auth, jobs, courses
from .models import database

def create_app():
    app = Flask(__name__, static_folder='../../frontend', static_url_path='/')
    app.secret_key = 'claunnetworkingworking_secret_key_2024'
    CORS(app, supports_credentials=True)

    # Configurar o caminho do banco de dados
    app.config['DATABASE_PATH'] = os.path.join(app.instance_path, 'database', 'claunnetworkingworking.db')
    app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, 'uploads')

    # Criar diretórios necessários
    os.makedirs(os.path.join(app.instance_path, 'database'), exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Inicializar o banco de dados
    with app.app_context():
        database.init_database()

    # Registrar blueprints
    app.register_blueprint(auth.bp)
    app.register_blueprint(jobs.bp)
    app.register_blueprint(courses.bp)

    @app.route('/')
    def serve_index():
        return app.send_static_file('index.html')

    return app

