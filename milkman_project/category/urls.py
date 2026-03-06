from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
