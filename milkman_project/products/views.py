from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from django.shortcuts import render
from category.models import Category
from rest_framework.permissions import AllowAny, IsAdminUser


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by("name")
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        # Allow anyone to list/retrieve products; restrict create/update/delete to staff
        if self.action in ["list", "retrieve"]:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [cls() for cls in permission_classes]

    def get_queryset(self):
        qs = super().get_queryset()
        category_id = self.request.query_params.get("category")
        q = self.request.query_params.get("q")
        if category_id:
            qs = qs.filter(category_id=category_id)
        if q:
            qs = qs.filter(name__icontains=q)
        return qs


def categories(request):
    products_qs = Product.objects.filter(is_active=True).select_related("category").order_by("category__name", "name")
    categories = list(Category.objects.filter(is_active=True).order_by("name").values("id", "name"))
    selected_category = request.GET.get("category")
    q = request.GET.get("q")
    if selected_category:
        products_qs = products_qs.filter(category_id=selected_category)
    if q:
        products_qs = products_qs.filter(name__icontains=q)
    ctx = {"products": products_qs, "categories": categories, "selected_category": int(selected_category) if selected_category else None}
    return render(request, "categories.html", ctx)
