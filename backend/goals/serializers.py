from rest_framework import serializers
from .models import Goal
from accounts.serializers import AccountSerializer

class GoalSerializer(serializers.ModelSerializer):
    linked_account_details = AccountSerializer(source='linked_account', read_only=True)
    progress = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Goal
        fields = ['id', 'title', 'subtitle', 'goal_type', 'target_amount', 
                  'current_amount', 'target_date', 'status', 'icon', 
                  'linked_account', 'linked_account_details', 'created_at', 
                  'updated_at', 'description', 'progress']
        read_only_fields = ['id', 'created_at', 'updated_at', 'progress', 'status']
    
    def create(self, validated_data):
        user = self.context['request'].user
        goal = Goal.objects.create(user=user, **validated_data)
        return goal
