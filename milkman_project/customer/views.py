from rest_framework import viewsets
from .models import Customer
from .serializers import CustomerSerializer
from django.shortcuts import render, redirect
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.filter(is_active=True).order_by("-created_at")
    serializer_class = CustomerSerializer
    
    @action(detail=False, methods=["get"], url_path="me", permission_classes=[IsAuthenticated])
    def me(self, request):
        customer = getattr(request.user, "customer_profile", None)
        if customer is None:
            return Response(None, status=200)
        return Response(CustomerSerializer(customer).data)

    @action(detail=True, methods=["post"], url_path="bind-user", permission_classes=[IsAuthenticated])
    def bind_user(self, request, pk=None):
        customer = self.get_object()
        if customer.user_id is None:
            customer.user = request.user
            customer.save(update_fields=["user"])
        elif customer.user_id != request.user.id:
            return Response({"detail": "Customer already bound to another user"}, status=400)
        return Response({"detail": "ok", "customer_id": customer.id, "user_id": request.user.id})

    @action(detail=False, methods=["post", "put"], url_path="upsert", permission_classes=[IsAuthenticated])
    def upsert(self, request):
        """
        Create or update the current user's customer profile and bind it to the user.
        Expected fields: name (required), phone (required), email, address, is_active (optional)
        """
        customer = getattr(request.user, "customer_profile", None)
        data = {
            "name": request.data.get("name", "").strip(),
            "phone": request.data.get("phone", "").strip(),
            "email": request.data.get("email", ""),
            "address": request.data.get("address", ""),
            "is_active": request.data.get("is_active", True),
        }
        if not data["name"] or not data["phone"]:
            return Response({"detail": "name and phone are required"}, status=status.HTTP_400_BAD_REQUEST)
        if customer is None:
            serializer = CustomerSerializer(data=data)
            if serializer.is_valid():
                customer = serializer.save(user=request.user)
                return Response(CustomerSerializer(customer).data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = CustomerSerializer(customer, data=data, partial=True)
            if serializer.is_valid():
                customer = serializer.save()
                if customer.user_id is None:
                    customer.user = request.user
                    customer.save(update_fields=["user"])
                return Response(CustomerSerializer(customer).data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def signup_view(request):
    error = None
    if request.method == "POST":
        try:
            name = request.POST.get("name", "").strip()
            phone = request.POST.get("phone", "").strip()
            email = request.POST.get("email", "").strip()
            address = request.POST.get("address", "").strip()
            if not name or not phone:
                error = "Name and Phone are required"
            else:
                Customer.objects.create(name=name, phone=phone, email=email or "", address=address or "")
                return redirect("/signup-success/")
        except Exception as exc:
            error = str(exc)
    return render(request, "customer_signup.html", {"error": error})
