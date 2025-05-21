from rest_framework import serializers
from .models import Category, Transaction, Budget, FinancialReport
from accounts.models import Account
from organizations.models import Organization, Project
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'created_at', 'organization', 
                 'is_business_expense', 'is_tax_deductible', 'parent']
        read_only_fields = ['created_at']

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'slug', 'organization']

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'title', 'balance', 'type', 'slug']

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    account_name = serializers.CharField(source='account.title', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True, allow_null=True)
    project_name = serializers.CharField(source='project.name', read_only=True, allow_null=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'title', 'amount', 'type', 'category', 'category_name', 
                 'account', 'account_name', 'timestamp', 'transaction_date', 'status', 
                 'description', 'organization', 'organization_name', 'project', 
                 'project_name', 'receipt', 'is_recurring', 'recurrence_type', 
                 'recurrence_end_date', 'reference_number', 'tags', 'destination_account']
        read_only_fields = ['timestamp']

class TransactionDetailSerializer(TransactionSerializer):
    category = CategorySerializer(read_only=True)
    account = AccountSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    destination_account = AccountSerializer(read_only=True)
    
    class Meta(TransactionSerializer.Meta):
        pass

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True, allow_null=True)
    project_name = serializers.CharField(source='project.name', read_only=True, allow_null=True)
    spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    remaining = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    percentage_used = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Budget
        fields = ['id', 'title', 'amount', 'category', 'category_name', 
                 'period', 'start_date', 'end_date', 'created_at', 'updated_at',
                 'organization', 'organization_name', 'project', 'project_name',
                 'spent', 'remaining', 'percentage_used']
        read_only_fields = ['created_at', 'updated_at', 'spent', 'remaining', 'percentage_used']

class BudgetDetailSerializer(BudgetSerializer):
    category = CategorySerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    class Meta(BudgetSerializer.Meta):
        pass

class FinancialReportSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True, allow_null=True)
    
    class Meta:
        model = FinancialReport
        fields = ['id', 'title', 'report_type', 'start_date', 'end_date', 
                 'created_at', 'organization', 'organization_name', 'parameters']
        read_only_fields = ['created_at']
