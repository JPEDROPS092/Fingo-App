from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet

router = DefaultRouter()
router.register('', AccountViewSet, basename='account')

urlpatterns = [
    path('', include(router.urls)),
]
