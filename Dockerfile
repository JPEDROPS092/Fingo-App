# Multi-stage Dockerfile para desenvolvimento e produção

# Stage 1: Base Python para Backend
FROM python:3.12-slim AS backend-base

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Configurar diretório de trabalho
WORKDIR /app/backend

# Copiar e instalar dependências do backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Backend Development
FROM backend-base AS backend-dev

# Instalar dependências de desenvolvimento
RUN pip install --no-cache-dir \
    django-debug-toolbar \
    django-extensions \
    ipython

# Configurar variáveis de ambiente
ENV PYTHONPATH=/app/backend
ENV DJANGO_SETTINGS_MODULE=finance_project.settings
ENV PYTHONUNBUFFERED=1

# Criar diretórios necessários
RUN mkdir -p /app/backend/staticfiles /app/backend/media

# Expor porta do Django
EXPOSE 8000

# Comando padrão para desenvolvimento
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Stage 3: Base Node.js para Frontend
FROM node:18-alpine AS frontend-base

# Instalar pnpm
RUN npm install -g pnpm

# Configurar diretório de trabalho
WORKDIR /app/frontend

# Stage 4: Frontend Development
FROM frontend-base AS frontend-dev

# Configurar variáveis de ambiente
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expor porta do Next.js
EXPOSE 3000

# Comando padrão para desenvolvimento
CMD ["pnpm", "dev"]

# Stage 5: Frontend Builder (para produção)
FROM frontend-base AS frontend-builder

# Copiar arquivos de dependências
COPY frontend/package*.json ./
COPY frontend/pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install

# Copiar código fonte
COPY frontend/ ./

# Build para produção
RUN pnpm build

# Stage 6: Produção (Backend + Frontend)
FROM python:3.12-slim AS production

# Instalar dependências do sistema incluindo Node.js
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

# Configurar diretório de trabalho
WORKDIR /app

# Copiar e instalar dependências do backend
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copiar código do backend
COPY backend/ /app/backend/

# Copiar build do frontend
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/package.json

# Navegar para o diretório do frontend e instalar apenas dependências de produção
WORKDIR /app/frontend
RUN pnpm install --prod --ignore-scripts

# Voltar para o diretório principal
WORKDIR /app

# Configurar variáveis de ambiente
ENV PYTHONPATH=/app/backend
ENV DJANGO_SETTINGS_MODULE=finance_project.settings

# Criar diretórios necessários
RUN mkdir -p /app/backend/staticfiles /app/backend/media

# Expor portas
EXPOSE 8000 3000

# Copiar script de inicialização
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Comando padrão
CMD ["/app/docker-entrypoint.sh"]
