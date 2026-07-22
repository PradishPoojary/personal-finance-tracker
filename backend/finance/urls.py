from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TransactionViewSet, BudgetViewSet, RegisterView, 
    financial_dashboard, export_transactions_csv, export_transactions_pdf
)

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('dashboard/', financial_dashboard, name='dashboard'),
    
    # Report Export APIs
    path('reports/export/csv/', export_transactions_csv, name='export_csv'),
    path('reports/export/pdf/', export_transactions_pdf, name='export_pdf'),
]