from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_view, login_view, logout_view, staff_register_view, staff_login_view, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('register/', register_view, name='user-register'),
    path('login/', login_view, name='user-login'),
    path('logout/', logout_view, name='user-logout'),
    path('staff/register/', staff_register_view, name='staff-register'),
    path('staff/login/', staff_login_view, name='staff-login'),
    path('', include(router.urls)),
]
