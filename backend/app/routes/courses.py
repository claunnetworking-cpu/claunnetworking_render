#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Blueprint, request, jsonify
from app.models.database import get_db

bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@bp.route('/', methods=['GET'])
def get_courses():
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        category = request.args.get('category')
        level = request.args.get('level')
        modality = request.args.get('modality')
        is_free = request.args.get('is_free')
        
        query = '''
            SELECT c.*, u.name as institution_name 
            FROM courses c 
            JOIN users u ON c.institution_id = u.id 
            WHERE c.is_active = 1
        '''
        params = []
        
        if category:
            query += ' AND c.category = ?'
            params.append(category)
        if level:
            query += ' AND c.level = ?'
            params.append(level)
        if modality:
            query += ' AND c.modality = ?'
            params.append(modality)
        if is_free:
            query += ' AND c.is_free = ?'
            params.append(1 if is_free.lower() == 'true' else 0)
            
        query += ' ORDER BY c.is_featured DESC, c.created_at DESC'
        
        cursor.execute(query, params)
        courses = cursor.fetchall()
        
        course_list = []
        for course in courses:
            course_dict = {
                'id': course['id'],
                'institution_id': course['institution_id'],
                'title': course['title'],
                'description': course['description'],
                'category': course['category'],
                'level': course['level'],
                'modality': course['modality'],
                'duration': course['duration'],
                'price': course['price'],
                'is_free': course['is_free'],
                'is_featured': course['is_featured'],
                'created_at': course['created_at'],
                'institution_name': course['institution_name']
            }
            course_list.append(course_dict)
        
        conn.close()
        return jsonify(course_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

