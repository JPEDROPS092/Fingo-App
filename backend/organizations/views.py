from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Organization, OrganizationMember, Project
from .serializers import (
    OrganizationSerializer, 
    OrganizationDetailSerializer,
    OrganizationMemberSerializer,
    ProjectSerializer,
    ProjectDetailSerializer
)
from django.db.models import Q

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['org_type']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    
    def get_queryset(self):
        user = self.request.user
        # Return organizations where user is owner or member
        return Organization.objects.filter(
            Q(owner=user) | Q(members=user)
        ).distinct()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OrganizationDetailSerializer
        return OrganizationSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        # Add owner as admin member
        org = serializer.instance
        OrganizationMember.objects.create(
            organization=org,
            user=self.request.user,
            role='admin'
        )
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        organization = self.get_object()
        serializer = OrganizationMemberSerializer(data=request.data)
        
        if serializer.is_valid():
            # Check if user is already a member
            user = serializer.validated_data['user']
            if organization.members.filter(id=user.id).exists():
                return Response(
                    {'detail': 'User is already a member of this organization.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer.save(organization=organization)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def remove_member(self, request, pk=None):
        organization = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'detail': 'User ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prevent removing the owner
        if organization.owner.id == int(user_id):
            return Response(
                {'detail': 'Cannot remove the organization owner.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        member = get_object_or_404(
            OrganizationMember,
            organization=organization,
            user_id=user_id
        )
        member.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['patch'])
    def update_member_role(self, request, pk=None):
        organization = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role')
        
        if not user_id or not role:
            return Response(
                {'detail': 'User ID and role are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        member = get_object_or_404(
            OrganizationMember,
            organization=organization,
            user_id=user_id
        )
        
        # Validate role
        valid_roles = dict(OrganizationMember.ROLE_CHOICES).keys()
        if role not in valid_roles:
            return Response(
                {'detail': f'Invalid role. Choose from {", ".join(valid_roles)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        member.role = role
        member.save()
        
        return Response(OrganizationMemberSerializer(member).data)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['organization', 'status']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'start_date', 'end_date', 'budget', 'status']
    
    def get_queryset(self):
        user = self.request.user
        # Return projects where user is manager, team member, or part of the organization
        return Project.objects.filter(
            Q(manager=user) | 
            Q(team_members=user) | 
            Q(organization__members=user)
        ).distinct()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer
    
    @action(detail=True, methods=['post'])
    def add_team_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'detail': 'User ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user is part of the organization
        if not project.organization.members.filter(id=user_id).exists():
            return Response(
                {'detail': 'User must be a member of the organization.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add user to team members
        from django.contrib.auth.models import User
        user = get_object_or_404(User, id=user_id)
        project.team_members.add(user)
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['delete'])
    def remove_team_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'detail': 'User ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remove user from team members
        from django.contrib.auth.models import User
        user = get_object_or_404(User, id=user_id)
        project.team_members.remove(user)
        
        return Response(status=status.HTTP_204_NO_CONTENT)
