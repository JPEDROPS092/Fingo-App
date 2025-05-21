from django.db import models
from django.contrib.auth.models import User
from accounts.models import Account
from decimal import Decimal
from organizations.models import Organization, Project
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    icon = models.CharField(max_length=50, default='shopping-cart')
    color = models.CharField(max_length=20, default='zinc')
    created_at = models.DateTimeField(auto_now_add=True)
    is_business_expense = models.BooleanField(default=False)
    is_tax_deductible = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    
    class Meta:
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('incoming', 'Incoming'),
        ('outgoing', 'Outgoing'),
        ('transfer', 'Transfer'),
    )
    
    STATUS_CHOICES = (
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
    )
    
    RECURRENCE_CHOICES = (
        ('none', 'None'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    timestamp = models.DateTimeField(auto_now_add=True)
    transaction_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    description = models.TextField(blank=True, null=True)
    
    # New fields for comprehensive financial management
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='transactions', null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    receipt = models.ImageField(upload_to='receipts/', blank=True, null=True)
    is_recurring = models.BooleanField(default=False)
    recurrence_type = models.CharField(max_length=20, choices=RECURRENCE_CHOICES, default='none')
    recurrence_end_date = models.DateField(null=True, blank=True)
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True)
    
    # For transfers between accounts
    destination_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='incoming_transfers')
    
    def save(self, *args, **kwargs):
        is_new = not self.pk
        super().save(*args, **kwargs)
        
        # Update account balance when transaction is created or status changes to completed
        if is_new or (not is_new and self.status == 'completed'):
            if self.type == 'incoming':
                self.account.balance += self.amount
                self.account.save()
            elif self.type == 'outgoing':
                self.account.balance -= self.amount
                self.account.save()
            elif self.type == 'transfer' and self.destination_account:
                # Handle transfers between accounts
                self.account.balance -= self.amount
                self.account.save()
                self.destination_account.balance += self.amount
                self.destination_account.save()
    
    def __str__(self):
        return f"{self.title} - {self.amount} ({self.get_type_display()})"

class Budget(models.Model):
    PERIOD_CHOICES = (
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='budgets', null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='budgets')
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='budgets')
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='monthly')
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def spent(self):
        from django.utils import timezone
        from datetime import timedelta
        
        # Calculate date range based on period
        today = timezone.now().date()
        if self.period == 'weekly':
            start_of_period = today - timedelta(days=today.weekday())
        elif self.period == 'monthly':
            start_of_period = today.replace(day=1)
        elif self.period == 'quarterly':
            month = ((today.month - 1) // 3) * 3 + 1
            start_of_period = today.replace(month=month, day=1)
        else:  # yearly
            start_of_period = today.replace(month=1, day=1)
        
        # Filter transactions for the current period
        transactions = Transaction.objects.filter(
            user=self.user,
            type='outgoing',
            status='completed',
            transaction_date__gte=start_of_period,
            transaction_date__lte=today
        )
        
        # Add category filter if specified
        if self.category:
            transactions = transactions.filter(category=self.category)
        
        # Add project filter if specified
        if self.project:
            transactions = transactions.filter(project=self.project)
            
        # Add organization filter if specified
        if self.organization:
            transactions = transactions.filter(organization=self.organization)
        
        # Calculate total spent
        total_spent = transactions.aggregate(models.Sum('amount'))['amount__sum'] or Decimal('0.00')
        return total_spent
    
    @property
    def remaining(self):
        return self.amount - self.spent
    
    @property
    def percentage_used(self):
        if self.amount <= 0:
            return 0
        percentage = (self.spent / self.amount) * 100
        return min(round(percentage), 100)
    
    def __str__(self):
        period_str = self.get_period_display()
        category_str = f" - {self.category.name}" if self.category else ""
        return f"{self.title} ({period_str}{category_str})"

class FinancialReport(models.Model):
    REPORT_TYPES = (
        ('income_statement', 'Income Statement'),
        ('expense_report', 'Expense Report'),
        ('cash_flow', 'Cash Flow'),
        ('budget_analysis', 'Budget Analysis'),
        ('project_finance', 'Project Finance'),
        ('tax_report', 'Tax Report'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    title = models.CharField(max_length=100)
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    parameters = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.title} ({self.get_report_type_display()})"
