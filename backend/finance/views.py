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

import calendar
from datetime import datetime

def calculate_projected_spend(expense_transactions):
    """
    Uses Linear Regression to predict end-of-month spending based on current velocity.
    """
    if not expense_transactions:
        return 0.0

    today = datetime.now()
    _, days_in_month = calendar.monthrange(today.year, today.month)
    current_day = today.day

    # 1. Group expenses by day
    daily_totals = {day: 0.0 for day in range(1, current_day + 1)}
    for t in expense_transactions:
        if t.date.month == today.month and t.date.year == today.year:
            daily_totals[t.date.day] += float(t.amount)

    # 2. Calculate cumulative spending (y-values) per day (x-values)
    x_values = []
    y_values = []
    cumulative = 0.0
    
    for day in range(1, current_day + 1):
        cumulative += daily_totals[day]
        x_values.append(day)
        y_values.append(cumulative)

    n = len(x_values)
    if n <= 1:
        # Not enough data for regression, return current cumulative
        return cumulative

    # 3. Linear Regression Calculations
    sum_x = sum(x_values)
    sum_y = sum(y_values)
    sum_xy = sum(x * y for x, y in zip(x_values, y_values))
    sum_x_squared = sum(x ** 2 for x in x_values)

    denominator = (n * sum_x_squared) - (sum_x ** 2)
    
    # Prevent division by zero if someone logs multiple things on day 1 and nothing else
    if denominator == 0:
        return cumulative 

    slope_m = ((n * sum_xy) - (sum_x * sum_y)) / denominator
    intercept_b = (sum_y - (slope_m * sum_x)) / n

    # 4. Predict for the last day of the month (y = mx + b)
    projected_total = (slope_m * days_in_month) + intercept_b
    
    # Ensure we don't predict less than what is already spent
    return max(round(projected_total, 2), cumulative)

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
    
    current_month_expenses = Transaction.objects.filter(
        user=request.user, 
        transaction_type='Expense',
        date__month=datetime.now().month,
        date__year=datetime.now().year
    )
    
    # Call our AI helper function
    projected_spend = calculate_projected_spend(current_month_expenses)

    return Response({
        'total_income': total_income,
        'total_expenses': total_expenses,
        'savings_overview': savings,
        'category_breakdown': category_breakdown,
        'projected_spend': projected_spend
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