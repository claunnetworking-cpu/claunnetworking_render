#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
WSGI entry point para produção no Render
"""

import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

from app import app

# Criar aplicação Flask
application = app

# Configurações específicas para produção
if os.environ.get('FLASK_ENV') == 'production':
    application.config['DEBUG'] = False
    application.config['TESTING'] = False

# Health check endpoint para o Render
@application.route('/api/health')
def health_check():
    return {'status': 'healthy', 'service': 'claunnetworking-api'}, 200

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    application.run(host='0.0.0.0', port=port)
