# Ambiente de Desenvolvimento - Fingo App

Este guia explica como configurar e usar o ambiente de desenvolvimento com Docker.

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose instalados
- Git

### Comandos Principais

#### Iniciar ambiente completo

```bash
./dev-start.sh
```

#### Parar ambiente

```bash
./dev-stop.sh
```

#### Reset completo (apaga dados)

```bash
./dev-reset.sh
```

## 🏗️ Arquitetura do Desenvolvimento

### Serviços

- **Backend (Django)**: Porta 8000
- **Frontend (Next.js)**: Porta 3000
- **PostgreSQL**: Porta 5432
- **Redis**: Porta 6379

### Volumes

- `./backend` → `/app/backend` (hot reload)
- `./frontend` → `/app/frontend` (hot reload)
- Volumes nomeados para dados persistentes

## 🔧 Comandos Úteis

### Backend (Django)

```bash
# Executar migrações
docker-compose run --rm backend python manage.py migrate

# Criar superusuário
docker-compose run --rm backend python manage.py createsuperuser

# Shell do Django
docker-compose run --rm backend python manage.py shell

# Executar testes
docker-compose run --rm backend python manage.py test

# Coletar arquivos estáticos
docker-compose run --rm backend python manage.py collectstatic
```

### Frontend (Next.js)

```bash
# Instalar dependências
docker-compose run --rm frontend pnpm install

# Adicionar dependência
docker-compose run --rm frontend pnpm add [package]

# Build de produção
docker-compose run --rm frontend pnpm build

# Linting
docker-compose run --rm frontend pnpm lint
```

### Banco de Dados

```bash
# Conectar ao PostgreSQL
docker-compose exec postgres-dev psql -U financeuser -d financeapp_dev

# Backup do banco
docker-compose exec postgres-dev pg_dump -U financeuser financeapp_dev > backup.sql

# Restore do banco
docker-compose exec -T postgres-dev psql -U financeuser financeapp_dev < backup.sql
```

### Logs

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🌐 URLs de Desenvolvimento

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/swagger/

### Credenciais Padrão

- **Admin**: admin / admin123

## 🔄 Hot Reload

- **Backend**: Modificações em Python são automaticamente recarregadas
- **Frontend**: Modificações em React/Next.js são automaticamente recarregadas
- **Banco**: Dados persistem entre reinicializações

## 🛠️ Desenvolvimento

### Estrutura de Pastas

```
/app/backend/    # Código Django (volume mapeado)
/app/frontend/   # Código Next.js (volume mapeado)
```

### Configurações de Desenvolvimento

- Debug habilitado
- CORS configurado para localhost:3000
- Hot reload ativo
- Logs detalhados
- Email backend para console

## 📝 Notas

1. **Primeira execução**: Pode demorar mais tempo devido ao download das imagens e build
2. **Dados persistentes**: Ficam nos volumes nomeados mesmo após parar os containers
3. **Reset completo**: Use `./dev-reset.sh` apenas quando quiser limpar tudo
4. **Performance**: Volumes mapeados podem ser mais lentos no Windows/macOS

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs [service_name]

# Rebuild forçado
docker-compose build --no-cache [service_name]
```

### Porta já em uso

```bash
# Verificar processos usando a porta
lsof -i :3000
lsof -i :8000

# Parar processo específico
kill -9 [PID]
```

### Problemas com dependências

```bash
# Reinstalar dependências do frontend
docker-compose run --rm frontend rm -rf node_modules
docker-compose run --rm frontend pnpm install

# Reinstalar dependências do backend
docker-compose build --no-cache backend
```
