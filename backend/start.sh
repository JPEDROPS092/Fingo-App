#!/bin/bash

echo "Starting Fingo App Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate 2>/dev/null || echo "Using system Python"

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Create sample data if database is empty
echo "Checking for sample data..."
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_project.settings')
django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='testuser').exists():
    print('Creating sample data...')
    exec(open('populate_db.py').read())
else:
    print('Sample data already exists')
"

# Start the server
echo "Starting server on http://0.0.0.0:12000"
echo "API Documentation available at:"
echo "  - Swagger UI: http://localhost:12000/swagger/"
echo "  - ReDoc: http://localhost:12000/redoc/"
echo ""
echo "Test credentials:"
echo "  Username: testuser"
echo "  Password: testpass123"
echo ""

python manage.py runserver 0.0.0.0:12000