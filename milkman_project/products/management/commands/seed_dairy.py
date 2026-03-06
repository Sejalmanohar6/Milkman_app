from django.core.management.base import BaseCommand
from category.models import Category
from products.models import Product
from decimal import Decimal


class Command(BaseCommand):
    help = "Seed default dairy categories and products"

    def handle(self, *args, **options):
        categories = [
            "Milk",
            "Curd",
            "Ghee",
            "Paneer",
            "Butter",
            "Cheese",
            "Yogurt",
            "Lassi",
        ]
        cat_objs = {}
        for name in categories:
            cat, _ = Category.objects.get_or_create(name=name, defaults={"description": f"{name} products"})
            cat_objs[name] = cat
        products = [
            ("Cow Milk", "Milk", "liter", "55.00"),
            ("Buffalo Milk", "Milk", "liter", "60.00"),
            ("Toned Milk", "Milk", "liter", "48.00"),
            ("Curd (Plain)", "Curd", "kg", "90.00"),
            ("Ghee (Cow)", "Ghee", "kg", "650.00"),
            ("Paneer Fresh", "Paneer", "kg", "420.00"),
            ("Butter Salted", "Butter", "kg", "520.00"),
            ("Cheddar Cheese", "Cheese", "kg", "700.00"),
            ("Greek Yogurt", "Yogurt", "kg", "350.00"),
            ("Sweet Lassi", "Lassi", "liter", "80.00"),
        ]
        for name, cat_name, unit, price in products:
            Product.objects.get_or_create(
                name=name,
                category=cat_objs[cat_name],
                defaults={"unit": unit, "price_per_unit": Decimal(price), "is_active": True},
            )
        self.stdout.write(self.style.SUCCESS("Dairy categories and products seeded"))
