from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import BillViewSet

router = DefaultRouter()
router.register(r'bills', BillViewSet, basename='bill')

urlpatterns = [
    path('', include(router.urls)),
]
