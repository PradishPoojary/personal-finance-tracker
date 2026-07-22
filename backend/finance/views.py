from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Transaction, Budget
from .serializers import TransactionSerializer, BudgetSerializer

from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum

import csv
from django.http import HttpResponse
from reportlab.pdfgen import canvas

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
        
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # Anyone can access this to sign up
    serializer_class = RegisterSerializer
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_dashboard(request):
    # Get only the logged-in user's transactions
    transactions = Transaction.objects.filter(user=request.user)
    
    # Calculate totals
    total_income = transactions.filter(transaction_type='Income').aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = transactions.filter(transaction_type='Expense').aggregate(Sum('amount'))['amount__sum'] or 0
    savings = total_income - total_expenses
    
    # Group expenses by category
    expenses = transactions.filter(transaction_type='Expense')
    category_breakdown = expenses.values('category').annotate(total=Sum('amount')).order_by('-total')

    return Response({
        'total_income': total_income,
        'total_expenses': total_expenses,
        'savings_overview': savings,
        'category_breakdown': category_breakdown
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_transactions_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="transactions_report.csv"'

    writer = csv.writer(response)
    writer.writerow(['Date', 'Type', 'Category', 'Amount', 'Description'])

    transactions = Transaction.objects.filter(user=request.user).order_by('-date')
    for t in transactions:
        writer.writerow([t.date, t.transaction_type, t.category, t.amount, t.description])

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_transactions_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="transactions_report.pdf"'

    p = canvas.Canvas(response)
    p.drawString(100, 800, "Financial Transactions Report")
    
    transactions = Transaction.objects.filter(user=request.user).order_by('-date')
    y_position = 750

    p.drawString(100, y_position, "Date | Type | Category | Amount")
    y_position -= 20

    for t in transactions:
        # Simple text placement; for a production app, reportlab's Table class is ideal
        line = f"{t.date} | {t.transaction_type} | {t.category} | ${t.amount}"
        p.drawString(100, y_position, line)
        y_position -= 20
        
        # Create a new page if we run out of vertical space
        if y_position < 50:
            p.showPage()
            y_position = 800

    p.showPage()
    p.save()
    return response