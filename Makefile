# Makefile para desenvolvimento do Fingo App

.PHONY: help dev-start dev-stop dev-reset build logs shell-backend shell-frontend clean

help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-start: ## Inicia o ambiente de desenvolvimento
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	./dev-start.sh

dev-stop: ## Para o ambiente de desenvolvimento
	@echo "🛑 Parando ambiente de desenvolvimento..."
	./dev-stop.sh

dev-reset: ## Reset completo do ambiente
	@echo "🧹 Fazendo reset completo..."
	./dev-reset.sh

build: ## Build das imagens Docker
	@echo "🔧 Construindo imagens..."
	docker-compose build

logs: ## Visualiza logs de todos os serviços
	docker-compose logs -f

logs-backend: ## Visualiza logs apenas do backend
	docker-compose logs -f backend

logs-frontend: ## Visualiza logs apenas do frontend
	docker-compose logs -f frontend

shell-backend: ## Acessa shell do backend
	docker-compose exec backend bash

shell-frontend: ## Acessa shell do frontend
	docker-compose exec frontend sh

shell-db: ## Acessa shell do PostgreSQL
	docker-compose exec postgres-dev psql -U financeuser -d financeapp_dev

migrate: ## Executa migrações do Django
	docker-compose run --rm backend python manage.py migrate

makemigrations: ## Cria novas migrações
	docker-compose run --rm backend python manage.py makemigrations

test-backend: ## Executa testes do backend
	docker-compose run --rm backend python manage.py test

test-frontend: ## Executa testes do frontend
	docker-compose run --rm frontend pnpm test

lint-frontend: ## Executa lint do frontend
	docker-compose run --rm frontend pnpm lint

install-frontend: ## Instala dependências do frontend
	docker-compose run --rm frontend pnpm install

clean: ## Remove containers, imagens e volumes não utilizados
	docker system prune -f
	docker volume prune -f

status: ## Mostra status dos containers
	docker-compose ps

backup-db: ## Faz backup do banco de dados
	@echo "📦 Fazendo backup do banco..."
	docker-compose exec postgres-dev pg_dump -U financeuser financeapp_dev > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup salvo como backup_$(shell date +%Y%m%d_%H%M%S).sql"

restore-db: ## Restaura backup do banco (use: make restore-db FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then echo "❌ Erro: Especifique o arquivo com FILE=nome_do_arquivo.sql"; exit 1; fi
	@echo "📥 Restaurando backup $(FILE)..."
	docker-compose exec -T postgres-dev psql -U financeuser financeapp_dev < $(FILE)
	@echo "✅ Backup restaurado!"

superuser: ## Cria superusuário no Django
	docker-compose run --rm backend python manage.py createsuperuser
