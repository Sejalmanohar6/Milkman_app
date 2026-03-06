from django.db import models
from customer.models import Customer
from subscription.models import Subscription
from django.utils import timezone

class Bill(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="bills")
    period_start = models.DateField()
    period_end = models.DateField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Bill #{self.id} - {self.customer.name} ({self.period_start} to {self.period_end})"


class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name="items")
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=150)
    unit = models.CharField(max_length=20, default="liter")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    days_count = models.IntegerField()
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x {self.days_count}"
