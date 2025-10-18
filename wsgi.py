#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
WSGI entry point para produção
"""

from app import app

application = app

if __name__ == "__main__":
    app.run()