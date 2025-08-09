#!/bin/bash

# Script para reset completo do ambiente de desenvolvimento

echo "🧹 Fazendo reset completo do ambiente..."

# Parar containers
docker-compose down

# Remover volumes
docker-compose down -v

# Remover imagens
docker-compose down --rmi all

# Limpar cache do Docker
docker system prune -f

echo "✅ Reset completo finalizado!"
echo "💡 Para iniciar novamente: ./dev-start.sh"
