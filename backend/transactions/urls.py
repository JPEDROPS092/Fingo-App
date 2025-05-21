from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, BudgetViewSet, FinancialReportViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'budgets', BudgetViewSet)
router.register(r'reports', FinancialReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
