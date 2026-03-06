from rest_framework import serializers
from .models import Subscription
from products.serializers import ProductSerializer


class SubscriptionSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "customer",
            "product",
            "product_detail",
            "quantity_per_day",
            "schedule_type",
            "start_date",
            "end_date",
            "is_active",
            "created_at",
            "updated_at",
        ]
