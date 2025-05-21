from rest_framework import serializers
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'title', 'description', 'balance', 'type', 'created_at', 'updated_at', 'slug', 'is_active']
        read_only_fields = ['id', 'created_at', 'updated_at', 'slug']
    
    def create(self, validated_data):
        user = self.context['request'].user
        account = Account.objects.create(user=user, **validated_data)
        return account
