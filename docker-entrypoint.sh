#!/bin/bash

# Script de inicialização para Docker

echo "🚀 Iniciando FinanceAPP..."

# Navegar para o diretório do backend
cd /app/backend

echo "📦 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo "🗄️ Executando migrações do banco de dados..."
python manage.py migrate

echo "👤 Criando superusuário se não existir..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuário criado: admin/admin123')
else:
    print('Superusuário já existe')
EOF

echo "🌱 Populando banco de dados com dados de exemplo..."
python populate_db.py 2>/dev/null || echo "Dados de exemplo já existem ou houve erro"

# Iniciar backend em background
echo "🔧 Iniciando servidor Django..."
python manage.py runserver 0.0.0.0:8000 &

# Aguardar o backend inicializar
sleep 5

# Navegar para o diretório do frontend
cd /app/frontend

echo "🎨 Iniciando servidor Next.js..."
pnpm start &

echo "✅ Aplicação iniciada!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "⚙️ Admin: http://localhost:8000/admin (admin/admin123)"

# Manter o container rodando
wait
