from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Transaction, Budget
from .serializers import TransactionSerializer, BudgetSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated] # Secures the API using our JWT setup

    def get_queryset(self):
        # Ensures a user only sees their own transactions
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically attaches the current user to the new transaction
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)