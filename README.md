# 💰 FinanceAPP - Sistema Moderno de Gestão Financeira

![FinanceAPP](https://img.shields.io/badge/FinanceAPP-v1.0-blue)
![Django](https://img.shields.io/badge/Django-4.2.5-green)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

Uma aplicação completa de gestão financeira com um elegante frontend em React/Next.js e um poderoso backend em Django REST API.

## 🎯 Funcionalidades

- 🏦 **Gestão de Contas**: Acompanhe várias contas financeiras (poupança, corrente, investimentos, dívidas)
- 💸 **Acompanhamento de Transações**: Registre transações de entrada e saída com categorias
- 🎯 **Metas Financeiras**: Defina e acompanhe o progresso em direção aos objetivos financeiros
- 📊 **Análises no Painel**: Visualize dados financeiros e progresso
- 🔐 **Autenticação de Usuários**: Login seguro e gerenciamento de contas
- 🎨 **Modo Escuro/Claro**: Interface bonita com suporte a temas
- 📱 **Design Responsivo**: Funciona em todos os dispositivos

## 🚀 Início Rápido

### 📋 Pré-requisitos

- Docker e Docker Compose
- Git

### 🔧 Opções de Instalação

#### 🐳 Opção 1: Docker (Recomendado para Desenvolvimento)

1. **Clone o repositório**

```bash
git clone <your-repo-url>
cd Fingo-App
```

2. **Inicie o ambiente de desenvolvimento**

```bash
./dev-start.sh
# ou
make dev-start
```

3. **Acesse a aplicação**

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin (admin/admin123)

#### 🏠 Opção 2: Instalação Local

1. **Configuração do Backend**

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. **Configuração do Frontend**

```bash
cd frontend
pnpm install
pnpm dev
```

### 🛠️ Comandos Úteis de Desenvolvimento

```bash
# Iniciar ambiente
make dev-start

# Parar ambiente
make dev-stop

# Reset completo
make dev-reset

# Ver logs
make logs

# Shell do backend
make shell-backend

# Executar migrações
make migrate

# Ver todos os comandos
make help
```

Para mais detalhes sobre desenvolvimento, veja [README-DEV.md](README-DEV.md).

## 🌐 Estrutura da Aplicação

### Backend (Django)

```
backend/
├── accounts/           # Aplicativo de gestão de contas
├── goals/              # Aplicativo de metas financeiras
├── transactions/       # Aplicativo de transações e categorias
├── finance_project/    # Configurações principais do projeto
├── manage.py           # Script de gerenciamento Django
└── db.sqlite3          # Banco de dados SQLite
```

### Frontend (Next.js)

```
app/                    # Páginas e rotas Next.js
components/             # Componentes React
├── kokonutui/          # Componentes de UI
├── theme-provider.tsx  # Gerenciamento de temas
└── auth-guard.tsx      # Proteção de autenticação
lib/                    # Utilitários e serviços
├── api.ts              # Serviço cliente de API
├── authContext.tsx     # Contexto de autenticação
└── utils.ts            # Funções auxiliares
public/                 # Ativos estáticos
styles/                 # CSS e arquivos de estilo
```

## 📱 Uso

1. **Faça login na aplicação**

   - Use a conta de administrador pré-criada:
     - Usuário: `admin`
     - Senha: `admin123`
   - Ou crie um novo usuário através do admin do Django em `http://localhost:8000/admin/`

2. **Painel**

   - Veja sua visão geral financeira
   - Acesse contas, transações e metas

3. **Gerencie Contas**

   - Adicione novas contas
   - Deposite ou retire fundos
   - Veja o histórico de transações

4. **Acompanhe Transações**

   - Registre receitas e despesas
   - Categorize transações
   - Filtre e pesquise no histórico de transações

5. **Defina Metas Financeiras**
   - Crie metas de poupança, investimento ou pagamento de dívidas
   - Acompanhe o progresso
   - Defina datas-alvo

## 🔒 Documentação da API

O backend Django fornece documentação abrangente da API:

- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`

### Principais Endpoints da API

- **Autenticação**: `/api/token/`
- **Contas**: `/api/accounts/`
- **Transações**: `/api/transactions/`
- **Categorias**: `/api/categories/`
- **Metas**: `/api/goals/`

## ⚙️ Desenvolvimento

### Desenvolvimento do Backend

- **Criar migrações**: `python manage.py makemigrations`
- **Aplicar migrações**: `python manage.py migrate`
- **Executar testes**: `python manage.py test`

### Desenvolvimento do Frontend

- **Construir para produção**: `npm run build`
- **Iniciar servidor de produção**: `npm start`
- **Verificar código**: `npm run lint`

## 📋 Arquivo de Requisitos

Para conveniência, um arquivo `requirements.txt` está incluído no diretório backend com todas as dependências Python necessárias.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

Feito com ❤️ por JP
