#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Blueprint, request, jsonify, session
from app.models.database import get_db

bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')

@bp.route('/', methods=['GET'])
def get_jobs():
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        area = request.args.get('area')
        location = request.args.get('location')
        modality = request.args.get('modality')
        
        query = '''
            SELECT j.*, u.name as company_name 
            FROM jobs j 
            JOIN users u ON j.company_id = u.id 
            WHERE j.is_active = 1
        '''
        params = []
        
        if area:
            query += ' AND j.area = ?'
            params.append(area)
        if location:
            query += ' AND j.location LIKE ?'
            params.append(f'%{location}%')
        if modality:
            query += ' AND j.work_modality = ?'
            params.append(modality)
            
        query += ' ORDER BY j.is_featured DESC, j.created_at DESC'
        
        cursor.execute(query, params)
        jobs = cursor.fetchall()
        
        job_list = []
        for job in jobs:
            job_dict = {
                'id': job['id'],
                'company_id': job['company_id'],
                'title': job['title'],
                'description': job['description'],
                'requirements': job['requirements'],
                'benefits': job['benefits'],
                'salary_range': job['salary_range'],
                'location': job['location'],
                'work_modality': job['work_modality'],
                'job_type': job['job_type'],
                'area': job['area'],
                'level': job['level'],
                'is_featured': job['is_featured'],
                'created_at': job['created_at'],
                'company_name': job['company_name']
            }
            job_list.append(job_dict)
        
        conn.close()
        return jsonify(job_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/', methods=['POST'])
def create_job():
    if 'user_id' not in session:
        return jsonify({'error': 'Não autorizado'}), 401
    
    data = request.get_json()
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
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

@bp.route('/apply', methods=['POST'])
def apply_to_job():
    if 'user_id' not in session:
        return jsonify({'error': 'Não autorizado'}), 401
    
    data = request.get_json()
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM applications WHERE job_id = ? AND candidate_id = ?',
                      (data['job_id'], session['user_id']))
        if cursor.fetchone():
            return jsonify({'error': 'Você já se candidatou a esta vaga'}), 400
        
        cursor.execute('''
            INSERT INTO applications (job_id, candidate_id, message)
            VALUES (?, ?, ?)
        ''', (data['job_id'], session['user_id'], data.get('message', '')))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Candidatura enviada com sucesso'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

