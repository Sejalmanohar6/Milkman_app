from rest_framework.routers import DefaultRouter
from .views import BillViewSet, my_billing_view
from django.urls import path, include

router = DefaultRouter()
router.register(r'bills', BillViewSet, basename='bill')

urlpatterns = [
    path('', include(router.urls)),
    path('my/', my_billing_view, name='my-billing'),
]
