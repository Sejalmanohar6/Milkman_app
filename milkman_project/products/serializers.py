from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "unit",
            "price_per_unit",
            "image_url",
            "is_active",
            "created_at",
            "updated_at",
        ]
