from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, BudgetViewSet

# The router automatically maps the ViewSets to the standard CRUD URLs
router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('', include(router.urls)),
]