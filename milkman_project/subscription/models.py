from django.db import models
from django.utils import timezone
from customer.models import Customer
from products.models import Product

class Subscription(models.Model):
    DAILY = "DAILY"
    ALTERNATE = "ALTERNATE"
    WEEKDAYS = "WEEKDAYS"
    WEEKENDS = "WEEKENDS"
    SCHEDULE_CHOICES = [
        (DAILY, "Daily"),
        (ALTERNATE, "Alternate Days"),
        (WEEKDAYS, "Weekdays (Mon-Fri)"),
        (WEEKENDS, "Weekends (Sat-Sun)"),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="subscriptions")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="subscriptions")
    quantity_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    schedule_type = models.CharField(max_length=12, choices=SCHEDULE_CHOICES, default=DAILY)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer.name} -> {self.product.name}"
