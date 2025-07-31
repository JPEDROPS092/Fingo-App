from django.urls import path
from .views import DashboardView, FinancialSummaryView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('summary/', FinancialSummaryView.as_view(), name='financial-summary'),
]