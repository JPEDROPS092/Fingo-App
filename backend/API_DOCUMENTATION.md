# Fingo App - Backend API Documentation

## Overview
Fingo App is a comprehensive financial management application built with Django REST Framework. It provides features for personal and business financial management including accounts, transactions, budgets, goals, and organizational management.

## Features
- **User Authentication**: Registration, login, logout with token-based authentication
- **Account Management**: Multiple account types (checking, savings, investment, debt)
- **Transaction Management**: Income, expenses, transfers with categorization
- **Budget Management**: Create and track budgets with spending analysis
- **Goal Management**: Set and track financial goals (savings, investment, debt repayment)
- **Organization Management**: Multi-user organizations with projects and roles
- **Dashboard**: Financial overview and analytics
- **Reports**: Generate various financial reports
- **Data Export**: Export transactions in CSV format

## API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/me/` - Get current user profile
- `PUT /api/users/me/` - Update user profile
- `POST /api/token/` - Get authentication token

### Dashboard
- `GET /api/dashboard/` - Get dashboard overview
- `GET /api/dashboard/summary/` - Get financial summary with period filter

### Accounts
- `GET /api/accounts/` - List user accounts
- `POST /api/accounts/` - Create new account
- `GET /api/accounts/{id}/` - Get account details
- `PUT /api/accounts/{id}/` - Update account
- `DELETE /api/accounts/{id}/` - Delete account
- `POST /api/accounts/{id}/deposit/` - Deposit to account
- `POST /api/accounts/{id}/withdraw/` - Withdraw from account
- `GET /api/accounts/total_balance/` - Get total balance across all accounts

### Transactions
- `GET /api/transactions/` - List transactions with filters
- `POST /api/transactions/` - Create new transaction
- `GET /api/transactions/{id}/` - Get transaction details
- `PUT /api/transactions/{id}/` - Update transaction
- `DELETE /api/transactions/{id}/` - Delete transaction
- `GET /api/transactions/summary/` - Get transaction summary
- `GET /api/transactions/export/` - Export transactions

### Categories
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create new category
- `GET /api/categories/{id}/` - Get category details
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

### Budgets
- `GET /api/budgets/` - List budgets
- `POST /api/budgets/` - Create new budget
- `GET /api/budgets/{id}/` - Get budget details
- `PUT /api/budgets/{id}/` - Update budget
- `DELETE /api/budgets/{id}/` - Delete budget
- `GET /api/budgets/summary/` - Get budget summary

### Goals
- `GET /api/goals/` - List goals
- `POST /api/goals/` - Create new goal
- `GET /api/goals/{id}/` - Get goal details
- `PUT /api/goals/{id}/` - Update goal
- `DELETE /api/goals/{id}/` - Delete goal
- `POST /api/goals/{id}/contribute/` - Contribute to goal
- `GET /api/goals/summary/` - Get goals summary

### Organizations
- `GET /api/organizations/organizations/` - List organizations
- `POST /api/organizations/organizations/` - Create new organization
- `GET /api/organizations/organizations/{id}/` - Get organization details
- `PUT /api/organizations/organizations/{id}/` - Update organization
- `DELETE /api/organizations/organizations/{id}/` - Delete organization
- `POST /api/organizations/organizations/{id}/add_member/` - Add member
- `DELETE /api/organizations/organizations/{id}/remove_member/` - Remove member
- `PATCH /api/organizations/organizations/{id}/update_member_role/` - Update member role

### Projects
- `GET /api/organizations/projects/` - List projects
- `POST /api/organizations/projects/` - Create new project
- `GET /api/organizations/projects/{id}/` - Get project details
- `PUT /api/organizations/projects/{id}/` - Update project
- `DELETE /api/organizations/projects/{id}/` - Delete project
- `POST /api/organizations/projects/{id}/add_team_member/` - Add team member
- `DELETE /api/organizations/projects/{id}/remove_team_member/` - Remove team member

### Reports
- `GET /api/reports/` - List financial reports
- `POST /api/reports/` - Create new report
- `GET /api/reports/{id}/` - Get report details
- `GET /api/reports/{id}/generate/` - Generate report data

## Authentication
The API uses token-based authentication. Include the token in the Authorization header:
```
Authorization: Token your_token_here
```

## Sample Data
The backend includes sample data for testing. Use these credentials:
- **Username**: testuser
- **Password**: testpass123
- **Token**: 92759e64d76473bb1dcca8de3dc8ff0bae7f7d5b

## API Documentation
- **Swagger UI**: `/swagger/`
- **ReDoc**: `/redoc/`

## Running the Server
```bash
cd backend
python manage.py runserver 0.0.0.0:12000
```

Or use the provided script:
```bash
python run_server.py
```

## Environment Setup
1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create sample data:
```bash
python populate_db.py
```

4. Start the server:
```bash
python run_server.py
```

## Data Models

### Account Types
- `checking` - Checking Account
- `savings` - Savings Account
- `investment` - Investment Account
- `debt` - Debt Account

### Transaction Types
- `incoming` - Income/Revenue
- `outgoing` - Expense
- `transfer` - Transfer between accounts

### Goal Types
- `savings` - Savings Goal
- `investment` - Investment Goal
- `debt` - Debt Repayment Goal

### Budget Periods
- `weekly` - Weekly Budget
- `monthly` - Monthly Budget
- `quarterly` - Quarterly Budget
- `yearly` - Yearly Budget

### Organization Roles
- `admin` - Administrator
- `manager` - Financial Manager
- `accountant` - Accountant
- `viewer` - Viewer

## Error Handling
The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message explaining the issue:
```json
{
  "error": "Error message here"
}
```

## Filtering and Pagination
Most list endpoints support filtering, searching, and pagination:
- Use query parameters for filtering (e.g., `?type=incoming&status=completed`)
- Use `search` parameter for text search
- Use `ordering` parameter for sorting
- Pagination is automatic with 25 items per page