from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, signup_view
from django.urls import path, include
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup_view, name='customer-signup'),
    path('signup-success/', TemplateView.as_view(template_name="signup_success.html"), name='signup-success'),
]
