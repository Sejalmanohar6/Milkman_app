from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from customer.models import Customer
from rest_framework import viewsets
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie


def register_view(request):
    error = None
    if request.method == "POST":
        try:
            username = request.POST.get("username", "").strip()
            password1 = request.POST.get("password1", "")
            password2 = request.POST.get("password2", "")
            name = request.POST.get("name", "").strip()
            phone = request.POST.get("phone", "").strip()
            email = request.POST.get("email", "").strip()
            address = request.POST.get("address", "").strip()
            if not username or not password1 or not name or not phone:
                error = "Username, Password, Name and Phone are required"
            elif password1 != password2:
                error = "Passwords do not match"
            elif User.objects.filter(username=username).exists():
                error = "Username already taken"
            else:
                user = User.objects.create_user(username=username, email=email or None, password=password1)
                customer, _ = Customer.objects.get_or_create(phone=phone, defaults={"name": name, "email": email, "address": address})
                if customer.user_id is None:
                    customer.user = user
                    customer.save(update_fields=["user"])
                login(request, user)
                return redirect("/")
        except Exception as exc:
            error = str(exc)
    return render(request, "user_register.html", {"error": error})


def login_view(request):
    error = None
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/")
        error = "Invalid credentials"
    return render(request, "user_login.html", {"error": error})


def logout_view(request):
    logout(request)
    return redirect("/")


def staff_register_view(request):
    error = None
    if request.method == "POST":
        try:
            username = request.POST.get("username", "").strip()
            password1 = request.POST.get("password1", "")
            password2 = request.POST.get("password2", "")
            email = request.POST.get("email", "").strip()
            if not username or not password1:
                error = "Username and Password are required"
            elif password1 != password2:
                error = "Passwords do not match"
            elif User.objects.filter(username=username).exists():
                error = "Username already taken"
            else:
                user = User.objects.create_user(username=username, email=email or None, password=password1)
                user.is_staff = True
                user.save(update_fields=["is_staff"])
                login(request, user)
                return redirect("/admin/")
        except Exception as exc:
            error = str(exc)
    return render(request, "staff_register.html", {"error": error})


def staff_login_view(request):
    error = None
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_staff:
            login(request, user)
            return redirect("/admin/")
        error = "Invalid staff credentials"
    return render(request, "staff_login.html", {"error": error})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer

@api_view(["GET"])
@ensure_csrf_cookie
@permission_classes([AllowAny])
def csrf_view(request):
    return Response({"detail": "ok"})

@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    data = request.data or {}
    username = data.get("username", "")
    password = data.get("password", "")
    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({"detail": "Invalid credentials"}, status=400)
    login(request, user)
    return Response({"id": user.id, "username": user.username, "email": user.email, "is_staff": user.is_staff})

@api_view(["POST"])
def logout_api(request):
    logout(request)
    return Response({"detail": "ok"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_api(request):
    u = request.user
    return Response({"id": u.id, "username": u.username, "email": u.email, "is_staff": u.is_staff})
