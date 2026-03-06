from django.db import models
from category.models import Category

class Product(models.Model):
    name = models.CharField(max_length=150)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    unit = models.CharField(max_length=20, default="liter")
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("name", "category")

    def __str__(self):
        return f"{self.name} ({self.unit})"

    def save(self, *args, **kwargs):
        if not self.image_url and self.name:
            self.image_url = self._default_image_for_name()
        super().save(*args, **kwargs)

    def _default_image_for_name(self) -> str:
        key = self.name.lower()
        if "buffalo" in key and "milk" in key:
            return "https://images.pexels.com/photos/289368/pexels-photo-289368.jpeg?auto=compress&cs=tinysrgb&w=1200"
        if "cow" in key and "milk" in key:
            return "https://images.pexels.com/photos/5946720/pexels-photo-5946720.jpeg?auto=compress&cs=tinysrgb&w=1200"
        if "paneer" in key:
            return "https://images.pexels.com/photos/3928854/pexels-photo-3928854.png?auto=compress&cs=tinysrgb&w=1200"
        if "curd" in key or "yogurt" in key or "dahi" in key or "buttermilk" in key:
            return "https://images.pexels.com/photos/35175194/pexels-photo-35175194.jpeg?auto=compress&cs=tinysrgb&w=1200"
        if "lassi" in key:
            return "https://images.pexels.com/photos/10874048/pexels-photo-10874048.jpeg?auto=compress&cs=tinysrgb&w=1200"
        if "ghee" in key:
            return "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop"
        if "butter" in key:
            return "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1200&auto=format&fit=crop"
        if "cheese" in key:
            return "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=1200&auto=format&fit=crop"
        if "cream" in key:
            return "https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop"
        return ""
