#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
WSGI entry point para produção
"""

from app import create_app

application = create_app()

if __name__ == "__main__":
    application.run()
