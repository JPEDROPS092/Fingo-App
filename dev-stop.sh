#!/bin/bash

# Script para parar ambiente de desenvolvimento

echo "🛑 Parando ambiente de desenvolvimento..."

# Parar e remover containers
docker-compose down

# Opcional: remover volumes (descomente se quiser limpar dados)
# docker-compose down -v

echo "✅ Ambiente parado!"
echo "💡 Para reiniciar: ./dev-start.sh"
