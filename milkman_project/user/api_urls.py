from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import UserViewSet, csrf_view, login_api, logout_api, me_api

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/csrf/', csrf_view),
    path('auth/login/', login_api),
    path('auth/logout/', logout_api),
    path('auth/me/', me_api),
]
