#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
from datetime import date, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finance_project.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from accounts.models import Account
from transactions.models import Category, Transaction, Budget
from goals.models import Goal
from organizations.models import Organization, OrganizationMember, Project


def create_sample_data():
    print("Creating sample data...")
    
    # Create test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Created user: {user.username}")
    
    # Create token for user
    token, created = Token.objects.get_or_create(user=user)
    print(f"User token: {token.key}")
    
    # Create sample accounts
    accounts_data = [
        {'title': 'Main Checking', 'type': 'checking', 'balance': Decimal('2500.00')},
        {'title': 'Emergency Savings', 'type': 'savings', 'balance': Decimal('5000.00')},
        {'title': 'Investment Portfolio', 'type': 'investment', 'balance': Decimal('15000.00')},
        {'title': 'Credit Card', 'type': 'debt', 'balance': Decimal('-1200.00')},
    ]
    
    accounts = []
    for acc_data in accounts_data:
        account, created = Account.objects.get_or_create(
            user=user,
            title=acc_data['title'],
            defaults={
                'type': acc_data['type'],
                'balance': acc_data['balance'],
                'description': f"Sample {acc_data['title']} account"
            }
        )
        accounts.append(account)
        if created:
            print(f"Created account: {account.title}")
    
    # Create sample categories
    categories_data = [
        {'name': 'Food & Dining', 'icon': 'utensils', 'color': 'red'},
        {'name': 'Transportation', 'icon': 'car', 'color': 'blue'},
        {'name': 'Shopping', 'icon': 'shopping-bag', 'color': 'green'},
        {'name': 'Entertainment', 'icon': 'film', 'color': 'purple'},
        {'name': 'Bills & Utilities', 'icon': 'receipt', 'color': 'orange'},
        {'name': 'Salary', 'icon': 'dollar-sign', 'color': 'emerald'},
        {'name': 'Investment', 'icon': 'trending-up', 'color': 'indigo'},
    ]
    
    categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            user=user,
            name=cat_data['name'],
            defaults={
                'icon': cat_data['icon'],
                'color': cat_data['color']
            }
        )
        categories.append(category)
        if created:
            print(f"Created category: {category.name}")
    
    # Create sample transactions
    today = date.today()
    transactions_data = [
        # Income
        {'title': 'Monthly Salary', 'amount': Decimal('4500.00'), 'type': 'incoming', 'category': 'Salary', 'days_ago': 1},
        {'title': 'Freelance Project', 'amount': Decimal('800.00'), 'type': 'incoming', 'category': 'Salary', 'days_ago': 5},
        
        # Expenses
        {'title': 'Grocery Shopping', 'amount': Decimal('120.50'), 'type': 'outgoing', 'category': 'Food & Dining', 'days_ago': 2},
        {'title': 'Gas Station', 'amount': Decimal('45.00'), 'type': 'outgoing', 'category': 'Transportation', 'days_ago': 3},
        {'title': 'Netflix Subscription', 'amount': Decimal('15.99'), 'type': 'outgoing', 'category': 'Entertainment', 'days_ago': 7},
        {'title': 'Electric Bill', 'amount': Decimal('89.50'), 'type': 'outgoing', 'category': 'Bills & Utilities', 'days_ago': 10},
        {'title': 'Online Shopping', 'amount': Decimal('67.99'), 'type': 'outgoing', 'category': 'Shopping', 'days_ago': 4},
        {'title': 'Restaurant Dinner', 'amount': Decimal('85.00'), 'type': 'outgoing', 'category': 'Food & Dining', 'days_ago': 6},
    ]
    
    for trans_data in transactions_data:
        category = next((c for c in categories if c.name == trans_data['category']), None)
        account = accounts[0] if trans_data['type'] in ['incoming', 'outgoing'] else accounts[1]
        
        transaction, created = Transaction.objects.get_or_create(
            user=user,
            title=trans_data['title'],
            amount=trans_data['amount'],
            defaults={
                'type': trans_data['type'],
                'category': category,
                'account': account,
                'transaction_date': today - timedelta(days=trans_data['days_ago']),
                'description': f"Sample transaction: {trans_data['title']}"
            }
        )
        if created:
            print(f"Created transaction: {transaction.title}")
    
    # Create sample goals
    goals_data = [
        {
            'title': 'Emergency Fund',
            'target_amount': Decimal('10000.00'),
            'current_amount': Decimal('5000.00'),
            'goal_type': 'savings',
            'target_date': today + timedelta(days=365),
            'icon': 'shield'
        },
        {
            'title': 'Vacation Fund',
            'target_amount': Decimal('3000.00'),
            'current_amount': Decimal('800.00'),
            'goal_type': 'savings',
            'target_date': today + timedelta(days=180),
            'icon': 'plane'
        },
        {
            'title': 'Pay Off Credit Card',
            'target_amount': Decimal('1200.00'),
            'current_amount': Decimal('300.00'),
            'goal_type': 'debt',
            'target_date': today + timedelta(days=90),
            'icon': 'credit-card'
        }
    ]
    
    for goal_data in goals_data:
        goal, created = Goal.objects.get_or_create(
            user=user,
            title=goal_data['title'],
            defaults={
                'target_amount': goal_data['target_amount'],
                'current_amount': goal_data['current_amount'],
                'goal_type': goal_data['goal_type'],
                'target_date': goal_data['target_date'],
                'icon': goal_data['icon'],
                'description': f"Sample goal: {goal_data['title']}"
            }
        )
        if created:
            print(f"Created goal: {goal.title}")
    
    # Create sample budgets
    budgets_data = [
        {'title': 'Monthly Food Budget', 'amount': Decimal('500.00'), 'category': 'Food & Dining', 'period': 'monthly'},
        {'title': 'Transportation Budget', 'amount': Decimal('200.00'), 'category': 'Transportation', 'period': 'monthly'},
        {'title': 'Entertainment Budget', 'amount': Decimal('150.00'), 'category': 'Entertainment', 'period': 'monthly'},
    ]
    
    for budget_data in budgets_data:
        category = next((c for c in categories if c.name == budget_data['category']), None)
        budget, created = Budget.objects.get_or_create(
            user=user,
            title=budget_data['title'],
            defaults={
                'amount': budget_data['amount'],
                'category': category,
                'period': budget_data['period'],
                'start_date': today.replace(day=1)
            }
        )
        if created:
            print(f"Created budget: {budget.title}")
    
    # Create sample organization
    org, created = Organization.objects.get_or_create(
        name='Sample Company',
        defaults={
            'owner': user,
            'description': 'A sample company for testing',
            'org_type': 'business'
        }
    )
    if created:
        print(f"Created organization: {org.name}")
        
        # Add user as admin member
        OrganizationMember.objects.get_or_create(
            organization=org,
            user=user,
            defaults={'role': 'admin'}
        )
        
        # Create sample project
        project, created = Project.objects.get_or_create(
            name='Website Redesign',
            defaults={
                'organization': org,
                'manager': user,
                'description': 'Redesign company website',
                'start_date': today,
                'end_date': today + timedelta(days=90),
                'budget': Decimal('5000.00'),
                'status': 'active'
            }
        )
        if created:
            print(f"Created project: {project.name}")
    
    print("Sample data creation completed!")
    print(f"Test user credentials: username='testuser', password='testpass123'")
    print(f"API Token: {token.key}")


if __name__ == '__main__':
    create_sample_data()