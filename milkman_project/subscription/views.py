from rest_framework import viewsets
from .models import Subscription
from .serializers import SubscriptionSerializer
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.filter(is_active=True).order_by("-created_at")
    serializer_class = SubscriptionSerializer
    
    @action(detail=False, methods=["get"], url_path="mine", permission_classes=[IsAuthenticated])
    def mine(self, request):
        customer = getattr(request.user, "customer_profile", None)
        if customer is None:
            return Response([], status=200)
        qs = Subscription.objects.filter(customer=customer, is_active=True).select_related("product").order_by("-created_at")
        data = SubscriptionSerializer(qs, many=True).data
        return Response(data)


@login_required
def my_subscriptions_view(request):
    customer = getattr(request.user, "customer_profile", None)
    subs = Subscription.objects.none()
    if customer is not None:
        subs = Subscription.objects.filter(customer=customer).select_related("product").order_by("-created_at")
    return render(request, "my_subscriptions.html", {"subscriptions": subs})
