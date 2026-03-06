from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User

class Customer(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15, validators=[RegexValidator(r'^\+?\d{7,15}$')], unique=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="customer_profile")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"
