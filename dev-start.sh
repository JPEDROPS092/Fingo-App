#!/bin/bash

# Script para desenvolvimento - inicia todos os serviços

echo "🚀 Iniciando ambiente de desenvolvimento..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Build das imagens de desenvolvimento
echo "🔧 Construindo imagens de desenvolvimento..."
docker-compose build

# Iniciar serviços em background
echo "🌐 Iniciando serviços..."
docker-compose up -d postgres-dev redis-dev

# Aguardar o banco de dados
echo "⏳ Aguardando banco de dados..."
sleep 10

# Executar migrações
echo "🗄️ Executando migrações..."
docker-compose run --rm backend python manage.py migrate

# Criar superusuário se não existir
echo "👤 Verificando superusuário..."
docker-compose run --rm backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuário criado: admin/admin123')
else:
    print('Superusuário já existe')
"

# Popular banco de dados
echo "🌱 Populando banco de dados..."
docker-compose run --rm backend python populate_db.py 2>/dev/null || echo "Dados já existem ou erro na população"

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
docker-compose run --rm frontend pnpm install

# Iniciar todos os serviços
echo "🎯 Iniciando aplicação completa..."
docker-compose up

echo "✅ Ambiente de desenvolvimento iniciado!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "⚙️ Admin: http://localhost:8000/admin (admin/admin123)"
echo "🗄️ PostgreSQL: localhost:5432"
echo "📊 Redis: localhost:6379"
