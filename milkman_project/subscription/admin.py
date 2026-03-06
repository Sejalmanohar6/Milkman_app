from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "product",
        "quantity_per_day",
        "schedule_type",
        "start_date",
        "end_date",
        "is_active",
    )
    list_filter = ("is_active", "schedule_type", "start_date")
    search_fields = ("customer__name", "product__name")
