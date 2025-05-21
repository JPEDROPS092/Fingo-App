from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, ProjectViewSet

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
