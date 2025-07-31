#!/usr/bin/env python
"""
Script to run the Django development server with proper configuration
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_project.settings')
    
    # Run the server on all interfaces and port 12000
    sys.argv = [
        'manage.py',
        'runserver',
        '0.0.0.0:12000'
    ]
    
    execute_from_command_line(sys.argv)