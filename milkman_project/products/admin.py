from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "unit", "price_per_unit", "is_active")
    list_filter = ("is_active", "category")
    search_fields = ("name",)
