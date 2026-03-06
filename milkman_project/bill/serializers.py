from rest_framework import serializers
from .models import Bill, BillItem


class BillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillItem
        fields = [
            "id",
            "product_name",
            "unit",
            "unit_price",
            "quantity_per_day",
            "days_count",
            "line_total",
            "subscription",
        ]


class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True, read_only=True)

    class Meta:
        model = Bill
        fields = [
            "id",
            "customer",
            "period_start",
            "period_end",
            "subtotal",
            "total",
            "created_at",
            "items",
        ]
