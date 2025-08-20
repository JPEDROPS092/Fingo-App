
# 💰 FinanceAPP - Modern Financial Management System

![FinanceAPP](https://img.shields.io/badge/FinanceAPP-v1.0-blue)![Django](https://img.shields.io/badge/Django-4.2.5-green)![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)![React](https://img.shields.io/badge/React-19.0.0-blue)![License](https://img.shields.io/badge/License-MIT-yellow)

A complete financial management application featuring an elegant React/Next.js frontend and a powerful Django REST API backend.

## 🎯 Features

- 🏦 **Account Management**: Track multiple financial accounts (savings, checking, investments, debts)
- 💸 **Transaction Tracking**: Log income and expense transactions with categories
- 🎯 **Financial Goals**: Set and monitor progress toward your financial objectives
- 📊 **Dashboard Analytics**: Visualize financial data and progress
- 🔐 **User Authentication**: Secure login and account management
- 🎨 **Dark/Light Mode**: Beautiful interface with theme support
- 📱 **Responsive Design**: Works on all devices

## 🚀 Quick Start

### 📋 Prerequisites

- Docker and Docker Compose
- Git

### 🔧 Installation Options

#### 🐳 Option 1: Docker (Recommended for Development)

1.  **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd Fingo-App
    ```

2.  **Start the development environment**

    ```bash
    ./dev-start.sh
    # or
    make dev-start
    ```

3.  **Access the application**

    -   Frontend: http://localhost:3000
    -   Backend: http://localhost:8000
    -   Admin: http://localhost:8000/admin (admin/admin123)

#### 🏠 Option 2: Local Installation

1.  **Backend Setup**

    ```bash
    cd backend
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

2.  **Frontend Setup**

    ```bash
    cd frontend
    pnpm install
    pnpm dev
    ```

### 🛠️ Useful Development Commands

```bash
# Start environment
make dev-start

# Stop environment
make dev-stop

# Full reset
make dev-reset

# View logs
make logs

# Backend shell
make shell-backend

# Run migrations
make migrate

# See all commands
make help
```

For more development details, see [README-DEV.md](README-DEV.md).

## 🌐 Application Structure

### Backend (Django)

```
backend/
├── accounts/           # Account management app
├── goals/              # Financial goals app
├── transactions/       # Transactions and categories app
├── finance_project/    # Main project settings
├── manage.py           # Django management script
└── db.sqlite3          # SQLite database
```

### Frontend (Next.js)

```
app/                    # Next.js pages and routes
components/             # React components
├── kokonutui/          # UI components
├── theme-provider.tsx  # Theme management
└── auth-guard.tsx      # Authentication guard
lib/                    # Utilities and services
├── api.ts              # API client service
├── authContext.tsx     # Authentication context
└── utils.ts            # Helper functions
public/                 # Static assets
styles/                 # CSS and style files
```

## 📱 Usage

1.  **Log in to the application**

    -   Use the pre-created admin account:
        -   User: `admin`
        -   Password: `admin123`
    -   Or create a new user through the Django admin at `http://localhost:8000/admin/`

2.  **Dashboard**

    -   View your financial overview
    -   Access accounts, transactions, and goals

3.  **Manage Accounts**

    -   Add new accounts
    -   Deposit or withdraw funds
    -   View transaction history

4.  **Track Transactions**

    -   Log income and expenses
    -   Categorize transactions
    -   Filter and search transaction history

5.  **Set Financial Goals**
    -   Create savings, investment, or debt-payoff goals
    -   Track progress
    -   Set target dates

## 🔒 API Documentation

The Django backend provides comprehensive API documentation:

-   **Swagger UI**: `http://localhost:8000/swagger/`
-   **ReDoc**: `http://localhost:8000/redoc/`

### Key API Endpoints

-   **Authentication**: `/api/token/`
-   **Accounts**: `/api/accounts/`
-   **Transactions**: `/api/transactions/`
-   **Categories**: `/api/categories/`
-   **Goals**: `/api/goals/`

## ⚙️ Development

### Backend Development

-   **Create migrations**: `python manage.py makemigrations`
-   **Apply migrations**: `python manage.py migrate`
-   **Run tests**: `python manage.py test`

### Frontend Development

-   **Build for production**: `npm run build`
-   **Start production server**: `npm start`
-   **Lint code**: `npm run lint`

## 📋 Requirements File

For convenience, a `requirements.txt` file is included in the backend directory with all necessary Python dependencies.

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by JP
