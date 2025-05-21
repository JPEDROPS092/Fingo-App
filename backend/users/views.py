from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import authenticate

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key,
            "message": "User registered successfully"
        })

import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        logger.info(f"Login attempt for user: {username}")
        
        if not username or not password:
            logger.warning(f"Login failed: Missing credentials for {username}")
            return Response({"error": "Please provide both username and password"},
                            status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if not user:
            logger.warning(f"Login failed: Invalid credentials for {username}")
            return Response({"error": "Invalid credentials"},
                            status=status.HTTP_401_UNAUTHORIZED)
        
        token, created = Token.objects.get_or_create(user=user)
        
        logger.info(f"Login successful for user: {username} (ID: {user.id})")
        
        return Response({
            "token": token.key,
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "success": True,
            "message": "Login successful"
        })

class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
