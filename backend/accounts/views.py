from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Account
from .serializers import AccountSerializer
from decimal import Decimal

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def deposit(self, request, pk=None):
        account = self.get_object()
        amount = Decimal(request.data.get('amount', '0.00'))
        
        if amount <= 0:
            return Response(
                {'error': 'Amount must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        account.balance += amount
        account.save()
        
        serializer = self.get_serializer(account)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        account = self.get_object()
        amount = Decimal(request.data.get('amount', '0.00'))
        
        if amount <= 0:
            return Response(
                {'error': 'Amount must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if amount > account.balance:
            return Response(
                {'error': 'Insufficient funds'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        account.balance -= amount
        account.save()
        
        serializer = self.get_serializer(account)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def total_balance(self, request):
        total = sum(account.balance for account in self.get_queryset())
        return Response({'total_balance': str(total)})
