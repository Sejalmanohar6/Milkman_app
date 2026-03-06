from django.contrib import admin
from .models import Bill, BillItem

class BillItemInline(admin.TabularInline):
    model = BillItem
    extra = 0
    readonly_fields = ("line_total",)


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "period_start", "period_end", "subtotal", "total", "created_at")
    date_hierarchy = "created_at"
    inlines = [BillItemInline]


@admin.register(BillItem)
class BillItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "bill",
        "product_name",
        "unit",
        "unit_price",
        "quantity_per_day",
        "days_count",
        "line_total",
    )
