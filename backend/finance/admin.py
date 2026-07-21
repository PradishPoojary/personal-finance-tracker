from django.contrib import admin
from .models import Transaction, Budget

# Register your models here so they appear in the admin panel
admin.site.register(Transaction)
admin.site.register(Budget)