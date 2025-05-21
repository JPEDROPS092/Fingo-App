from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
import csv
from django.http import HttpResponse
import json

from .models import Category, Transaction, Budget, FinancialReport
from .serializers import (
    CategorySerializer,
    TransactionSerializer,
    TransactionDetailSerializer,
    BudgetSerializer,
    BudgetDetailSerializer,
    FinancialReportSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_business_expense', 'is_tax_deductible', 'organization']
    search_fields = ['name']
    
    def get_queryset(self):
        user = self.request.user
        # Return user's personal categories and categories from their organizations
        return Category.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['account', 'type', 'category', 'status', 'organization', 'project', 'is_recurring']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['amount', 'timestamp', 'transaction_date']
    
    def get_queryset(self):
        user = self.request.user
        # Return user's personal transactions and transactions from their organizations
        return Transaction.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        ).distinct()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TransactionDetailSerializer
        return TransactionSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        user = request.user
        
        # Get query parameters
        period = request.query_params.get('period', 'month')
        organization_id = request.query_params.get('organization')
        project_id = request.query_params.get('project')
        
        # Calculate date range
        today = timezone.now().date()
        if period == 'week':
            start_date = today - timedelta(days=today.weekday())
        elif period == 'month':
            start_date = today.replace(day=1)
        elif period == 'quarter':
            month = ((today.month - 1) // 3) * 3 + 1
            start_date = today.replace(month=month, day=1)
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
        else:  # all time
            start_date = None
        
        # Base queryset
        transactions = Transaction.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        )
        
        # Apply date filter if needed
        if start_date:
            transactions = transactions.filter(transaction_date__gte=start_date)
        
        # Apply organization filter if needed
        if organization_id:
            transactions = transactions.filter(organization_id=organization_id)
        
        # Apply project filter if needed
        if project_id:
            transactions = transactions.filter(project_id=project_id)
        
        # Calculate income, expenses, and balance
        income = transactions.filter(type='incoming', status='completed').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        expenses = transactions.filter(type='outgoing', status='completed').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Get top categories for expenses
        top_expense_categories = transactions.filter(
            type='outgoing', 
            status='completed'
        ).values(
            'category__name'
        ).annotate(
            total=Sum('amount')
        ).order_by('-total')[:5]
        
        # Get recent transactions
        recent_transactions = transactions.order_by('-transaction_date')[:5]
        recent = TransactionSerializer(recent_transactions, many=True).data
        
        return Response({
            'income': income,
            'expenses': expenses,
            'balance': income - expenses,
            'top_expense_categories': top_expense_categories,
            'recent_transactions': recent,
            'period': period,
            'start_date': start_date,
            'end_date': today
        })
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        user = request.user
        
        # Get query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        format_type = request.query_params.get('format', 'csv')
        
        # Base queryset
        transactions = Transaction.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        )
        
        # Apply date filters if provided
        if start_date:
            transactions = transactions.filter(transaction_date__gte=start_date)
        if end_date:
            transactions = transactions.filter(transaction_date__lte=end_date)
        
        # Order by date
        transactions = transactions.order_by('transaction_date')
        
        if format_type == 'csv':
            # Create CSV response
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="transactions.csv"'
            
            writer = csv.writer(response)
            writer.writerow([
                'Date', 'Title', 'Amount', 'Type', 'Category', 
                'Account', 'Status', 'Description', 'Organization', 
                'Project', 'Reference'
            ])
            
            for transaction in transactions:
                writer.writerow([
                    transaction.transaction_date,
                    transaction.title,
                    transaction.amount,
                    transaction.get_type_display(),
                    transaction.category.name if transaction.category else '',
                    transaction.account.title,
                    transaction.get_status_display(),
                    transaction.description,
                    transaction.organization.name if transaction.organization else '',
                    transaction.project.name if transaction.project else '',
                    transaction.reference_number or ''
                ])
            
            return response
        else:
            # Return JSON
            return Response(TransactionSerializer(transactions, many=True).data)

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['period', 'category', 'organization', 'project']
    search_fields = ['title']
    ordering_fields = ['amount', 'start_date', 'end_date']
    
    def get_queryset(self):
        user = self.request.user
        # Return user's personal budgets and budgets from their organizations
        return Budget.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        ).distinct()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BudgetDetailSerializer
        return BudgetSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        user = request.user
        
        # Get query parameters
        organization_id = request.query_params.get('organization')
        project_id = request.query_params.get('project')
        
        # Base queryset
        budgets = Budget.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        )
        
        # Apply organization filter if needed
        if organization_id:
            budgets = budgets.filter(organization_id=organization_id)
        
        # Apply project filter if needed
        if project_id:
            budgets = budgets.filter(project_id=project_id)
        
        # Calculate budget statistics
        total_budget = sum(budget.amount for budget in budgets)
        total_spent = sum(budget.spent for budget in budgets)
        total_remaining = sum(budget.remaining for budget in budgets)
        
        # Get budgets with highest percentage used
        budgets_data = BudgetSerializer(budgets, many=True).data
        
        return Response({
            'total_budget': total_budget,
            'total_spent': total_spent,
            'total_remaining': total_remaining,
            'percentage_used': round((total_spent / total_budget * 100) if total_budget > 0 else 0),
            'budgets': budgets_data
        })

class FinancialReportViewSet(viewsets.ModelViewSet):
    queryset = FinancialReport.objects.all()
    serializer_class = FinancialReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['report_type', 'organization']
    search_fields = ['title']
    
    def get_queryset(self):
        user = self.request.user
        # Return user's personal reports and reports from their organizations
        return FinancialReport.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def generate(self, request, pk=None):
        report = self.get_object()
        user = request.user
        
        # Get report parameters
        start_date = report.start_date
        end_date = report.end_date
        report_type = report.report_type
        organization = report.organization
        
        # Base queryset for transactions
        transactions = Transaction.objects.filter(
            Q(user=user) | 
            Q(organization__members=user)
        ).filter(
            transaction_date__gte=start_date,
            transaction_date__lte=end_date
        )
        
        # Apply organization filter if needed
        if organization:
            transactions = transactions.filter(organization=organization)
        
        # Generate different reports based on type
        if report_type == 'income_statement':
            # Income statement report
            income = transactions.filter(type='incoming', status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            expenses = transactions.filter(type='outgoing', status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            # Get expenses by category
            expenses_by_category = transactions.filter(
                type='outgoing', 
                status='completed'
            ).values(
                'category__name'
            ).annotate(
                total=Sum('amount')
            ).order_by('-total')
            
            report_data = {
                'income': income,
                'expenses': expenses,
                'net_income': income - expenses,
                'expenses_by_category': list(expenses_by_category)
            }
            
        elif report_type == 'expense_report':
            # Expense report
            expenses = transactions.filter(type='outgoing', status='completed')
            
            # Get expenses by category
            expenses_by_category = expenses.values(
                'category__name'
            ).annotate(
                total=Sum('amount')
            ).order_by('-total')
            
            # Get expenses by date
            expenses_by_date = expenses.values(
                'transaction_date'
            ).annotate(
                total=Sum('amount')
            ).order_by('transaction_date')
            
            report_data = {
                'total_expenses': expenses.aggregate(total=Sum('amount'))['total'] or 0,
                'expenses_by_category': list(expenses_by_category),
                'expenses_by_date': list(expenses_by_date),
                'transactions': TransactionSerializer(expenses, many=True).data
            }
            
        elif report_type == 'cash_flow':
            # Cash flow report
            transactions_by_date = transactions.filter(
                status='completed'
            ).values(
                'transaction_date', 'type'
            ).annotate(
                total=Sum('amount')
            ).order_by('transaction_date')
            
            # Process data for cash flow
            cash_flow_data = []
            balance = 0
            
            for entry in transactions_by_date:
                if entry['type'] == 'incoming':
                    balance += entry['total']
                else:
                    balance -= entry['total']
                
                cash_flow_data.append({
                    'date': entry['transaction_date'],
                    'type': entry['type'],
                    'amount': entry['total'],
                    'balance': balance
                })
            
            report_data = {
                'cash_flow': cash_flow_data,
                'starting_balance': 0,  # Would need to calculate actual starting balance
                'ending_balance': balance
            }
            
        elif report_type == 'budget_analysis':
            # Budget analysis report
            budgets = Budget.objects.filter(
                Q(user=user) | 
                Q(organization__members=user)
            )
            
            if organization:
                budgets = budgets.filter(organization=organization)
            
            budget_data = []
            
            for budget in budgets:
                budget_data.append({
                    'title': budget.title,
                    'amount': budget.amount,
                    'spent': budget.spent,
                    'remaining': budget.remaining,
                    'percentage_used': budget.percentage_used,
                    'category': budget.category.name if budget.category else None,
                    'period': budget.get_period_display()
                })
            
            report_data = {
                'budgets': budget_data,
                'total_budget': sum(b.amount for b in budgets),
                'total_spent': sum(b.spent for b in budgets),
                'total_remaining': sum(b.remaining for b in budgets)
            }
            
        elif report_type == 'project_finance':
            # Project finance report
            project_id = report.parameters.get('project_id')
            
            if not project_id:
                return Response(
                    {'detail': 'Project ID is required for project finance report.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Filter transactions for the project
            project_transactions = transactions.filter(project_id=project_id)
            
            # Calculate income and expenses
            income = project_transactions.filter(type='incoming', status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            expenses = project_transactions.filter(type='outgoing', status='completed').aggregate(
                total=Sum('amount')
            )['total'] or 0
            
            # Get project budget
            from organizations.models import Project
            project = get_object_or_404(Project, id=project_id)
            
            report_data = {
                'project': {
                    'id': project.id,
                    'name': project.name,
                    'budget': project.budget,
                    'budget_spent': project.budget_spent,
                    'budget_remaining': project.budget_remaining,
                    'budget_percentage': project.budget_percentage
                },
                'income': income,
                'expenses': expenses,
                'net': income - expenses,
                'transactions': TransactionSerializer(project_transactions, many=True).data
            }
            
        elif report_type == 'tax_report':
            # Tax report
            tax_deductible_expenses = transactions.filter(
                type='outgoing',
                status='completed',
                category__is_tax_deductible=True
            )
            
            # Group by category
            expenses_by_category = tax_deductible_expenses.values(
                'category__name'
            ).annotate(
                total=Sum('amount')
            ).order_by('-total')
            
            report_data = {
                'total_tax_deductible': tax_deductible_expenses.aggregate(total=Sum('amount'))['total'] or 0,
                'expenses_by_category': list(expenses_by_category),
                'transactions': TransactionSerializer(tax_deductible_expenses, many=True).data
            }
            
        else:
            report_data = {
                'error': 'Unsupported report type'
            }
        
        # Save report data to parameters
        report.parameters = report_data
        report.save()
        
        return Response(report_data)
