from rest_framework import serializers
from .models import Organization, OrganizationMember, Project
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class OrganizationMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )
    
    class Meta:
        model = OrganizationMember
        fields = ['id', 'user', 'user_id', 'role', 'joined_at']

class OrganizationSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='owner',
        write_only=True
    )
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'slug', 'description', 'org_type', 'owner', 'owner_id', 
                 'logo', 'created_at', 'updated_at', 'tax_id', 'fiscal_year_start', 'members_count']
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def get_members_count(self, obj):
        return obj.members.count()

class OrganizationDetailSerializer(OrganizationSerializer):
    members = OrganizationMemberSerializer(source='organizationmember_set', many=True, read_only=True)
    
    class Meta(OrganizationSerializer.Meta):
        fields = OrganizationSerializer.Meta.fields + ['members']

class ProjectSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    manager_name = serializers.CharField(source='manager.username', read_only=True)
    budget_spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    budget_remaining = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    budget_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'slug', 'description', 'organization', 'organization_name', 
                 'manager', 'manager_name', 'start_date', 'end_date', 'budget', 
                 'budget_spent', 'budget_remaining', 'budget_percentage', 'status', 
                 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at', 'budget_spent', 
                           'budget_remaining', 'budget_percentage']

class ProjectDetailSerializer(ProjectSerializer):
    team_members = UserSerializer(many=True, read_only=True)
    
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['team_members']
