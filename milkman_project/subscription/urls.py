from rest_framework.routers import DefaultRouter
from .views import SubscriptionViewSet, my_subscriptions_view
from django.urls import path, include

router = DefaultRouter()
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('', include(router.urls)),
    path('my/', my_subscriptions_view, name='my-subscriptions'),
]
