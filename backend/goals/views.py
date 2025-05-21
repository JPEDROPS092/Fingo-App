from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Goal
from .serializers import GoalSerializer
from decimal import Decimal

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['goal_type', 'status', 'linked_account']
    search_fields = ['title', 'subtitle', 'description']
    ordering_fields = ['target_date', 'created_at', 'progress']
    ordering = ['target_date']
    
    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def contribute(self, request, pk=None):
        goal = self.get_object()
        amount = Decimal(request.data.get('amount', '0.00'))
        
        if amount <= 0:
            return Response(
                {'error': 'Amount must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update current amount
        goal.current_amount += amount
        goal.save()
        
        # If linked to an account, update account balance
        if goal.linked_account and request.data.get('update_account', False):
            if goal.goal_type == 'savings' or goal.goal_type == 'investment':
                goal.linked_account.balance -= amount
            elif goal.goal_type == 'debt':
                goal.linked_account.balance -= amount
            goal.linked_account.save()
            
        serializer = self.get_serializer(goal)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        goals = self.get_queryset()
        
        # Get counts by status
        pending_count = goals.filter(status='pending').count()
        in_progress_count = goals.filter(status='in-progress').count()
        completed_count = goals.filter(status='completed').count()
        
        # Get totals by type
        savings_total = sum(g.target_amount for g in goals if g.goal_type == 'savings')
        investment_total = sum(g.target_amount for g in goals if g.goal_type == 'investment')
        debt_total = sum(g.target_amount for g in goals if g.goal_type == 'debt')
        
        # Get overall progress
        target_total = sum(g.target_amount for g in goals)
        current_total = sum(g.current_amount for g in goals)
        overall_progress = 0
        if target_total > 0:
            overall_progress = min(round((current_total / target_total) * 100), 100)
        
        return Response({
            'pending_count': pending_count,
            'in_progress_count': in_progress_count,
            'completed_count': completed_count,
            'savings_total': str(savings_total),
            'investment_total': str(investment_total),
            'debt_total': str(debt_total),
            'target_total': str(target_total),
            'current_total': str(current_total),
            'overall_progress': overall_progress
        })
