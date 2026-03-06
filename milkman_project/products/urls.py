from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, categories
from django.urls import path, include
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', categories, name='categories'),
    path('', TemplateView.as_view(template_name="home.html"), name='home'),
]
