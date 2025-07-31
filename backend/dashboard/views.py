from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from accounts.models import Account
from transactions.models import Transaction, Budget
from goals.models import Goal
from organizations.models import Organization


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        today = timezone.now().date()
        
        # Get user's accounts
        accounts = Account.objects.filter(user=user, is_active=True)
        total_balance = sum(account.balance for account in accounts)
        
        # Get this month's transactions
        start_of_month = today.replace(day=1)
        monthly_transactions = Transaction.objects.filter(
            user=user,
            transaction_date__gte=start_of_month,
            status='completed'
        )
        
        monthly_income = monthly_transactions.filter(type='incoming').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        monthly_expenses = monthly_transactions.filter(type='outgoing').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        # Get recent transactions
        recent_transactions = Transaction.objects.filter(
            user=user
        ).order_by('-transaction_date')[:5]
        
        # Get goals summary
        goals = Goal.objects.filter(user=user)
        goals_summary = {
            'total': goals.count(),
            'completed': goals.filter(status='completed').count(),
            'in_progress': goals.filter(status='in-progress').count(),
            'pending': goals.filter(status='pending').count(),
        }
        
        # Get budgets summary
        budgets = Budget.objects.filter(user=user)
        budgets_summary = {
            'total': budgets.count(),
            'total_amount': sum(budget.amount for budget in budgets),
            'total_spent': sum(budget.spent for budget in budgets),
        }
        
        # Get top expense categories this month
        top_categories = monthly_transactions.filter(
            type='outgoing'
        ).values(
            'category__name'
        ).annotate(
            total=Sum('amount')
        ).order_by('-total')[:5]
        
        # Get account types breakdown
        account_breakdown = []
        for account_type, display_name in Account.ACCOUNT_TYPES:
            type_accounts = accounts.filter(type=account_type)
            if type_accounts.exists():
                account_breakdown.append({
                    'type': account_type,
                    'display_name': display_name,
                    'count': type_accounts.count(),
                    'total_balance': sum(acc.balance for acc in type_accounts)
                })
        
        # Get organizations count
        organizations_count = Organization.objects.filter(
            Q(owner=user) | Q(members=user)
        ).distinct().count()
        
        return Response({
            'total_balance': str(total_balance),
            'accounts_count': accounts.count(),
            'monthly_income': str(monthly_income),
            'monthly_expenses': str(monthly_expenses),
            'monthly_net': str(monthly_income - monthly_expenses),
            'recent_transactions': [
                {
                    'id': t.id,
                    'title': t.title,
                    'amount': str(t.amount),
                    'type': t.type,
                    'date': t.transaction_date,
                    'category': t.category.name if t.category else None,
                    'account': t.account.title
                } for t in recent_transactions
            ],
            'goals_summary': goals_summary,
            'budgets_summary': {
                'total': budgets_summary['total'],
                'total_amount': str(budgets_summary['total_amount']),
                'total_spent': str(budgets_summary['total_spent']),
                'remaining': str(budgets_summary['total_amount'] - budgets_summary['total_spent'])
            },
            'top_expense_categories': [
                {
                    'category': cat['category__name'] or 'Uncategorized',
                    'amount': str(cat['total'])
                } for cat in top_categories
            ],
            'account_breakdown': [
                {
                    'type': acc['type'],
                    'display_name': acc['display_name'],
                    'count': acc['count'],
                    'total_balance': str(acc['total_balance'])
                } for acc in account_breakdown
            ],
            'organizations_count': organizations_count,
            'period': {
                'start_date': start_of_month,
                'end_date': today
            }
        })


class FinancialSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        period = request.query_params.get('period', 'month')  # week, month, quarter, year
        
        today = timezone.now().date()
        
        # Calculate date range based on period
        if period == 'week':
            start_date = today - timedelta(days=today.weekday())
        elif period == 'month':
            start_date = today.replace(day=1)
        elif period == 'quarter':
            month = ((today.month - 1) // 3) * 3 + 1
            start_date = today.replace(month=month, day=1)
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
        else:
            start_date = today.replace(day=1)  # default to month
        
        # Get transactions for the period
        transactions = Transaction.objects.filter(
            user=user,
            transaction_date__gte=start_date,
            transaction_date__lte=today,
            status='completed'
        )
        
        # Calculate totals
        income = transactions.filter(type='incoming').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        expenses = transactions.filter(type='outgoing').aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.00')
        
        # Get daily breakdown
        daily_data = []
        current_date = start_date
        while current_date <= today:
            day_transactions = transactions.filter(transaction_date=current_date)
            day_income = day_transactions.filter(type='incoming').aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00')
            day_expenses = day_transactions.filter(type='outgoing').aggregate(
                total=Sum('amount')
            )['total'] or Decimal('0.00')
            
            daily_data.append({
                'date': current_date,
                'income': str(day_income),
                'expenses': str(day_expenses),
                'net': str(day_income - day_expenses)
            })
            current_date += timedelta(days=1)
        
        # Get category breakdown
        category_breakdown = transactions.filter(
            type='outgoing'
        ).values(
            'category__name'
        ).annotate(
            total=Sum('amount')
        ).order_by('-total')
        
        return Response({
            'period': period,
            'start_date': start_date,
            'end_date': today,
            'total_income': str(income),
            'total_expenses': str(expenses),
            'net_income': str(income - expenses),
            'daily_data': daily_data,
            'category_breakdown': [
                {
                    'category': cat['category__name'] or 'Uncategorized',
                    'amount': str(cat['total'])
                } for cat in category_breakdown
            ]
        })