from datetime import date, timedelta
from decimal import Decimal
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Bill, BillItem
from .serializers import BillSerializer
from subscription.models import Subscription
from products.models import Product
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all().order_by("-created_at")
    serializer_class = BillSerializer
    
    @action(detail=False, methods=["get"], url_path="mine", permission_classes=[IsAuthenticated])
    def mine(self, request):
        customer = getattr(request.user, "customer_profile", None)
        if customer is None:
            return Response([], status=200)
        qs = Bill.objects.filter(customer=customer).order_by("-created_at").prefetch_related("items")
        return Response(BillSerializer(qs, many=True).data)

    @action(detail=False, methods=["post"], url_path="generate")
    def generate(self, request):
        try:
            customer_id = int(request.data.get("customer_id"))
            period_start = date.fromisoformat(request.data.get("period_start"))
            period_end = date.fromisoformat(request.data.get("period_end"))
        except Exception:
            return Response({"detail": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST)

        if period_end < period_start:
            return Response({"detail": "period_end must be on or after period_start"}, status=400)

        subs = Subscription.objects.filter(
            customer_id=customer_id,
            is_active=True,
        )

        bill = Bill.objects.create(customer_id=customer_id, period_start=period_start, period_end=period_end)

        subtotal = Decimal("0.00")
        for sub in subs:
            effective_start = max(sub.start_date, period_start)
            effective_end = period_end if sub.end_date is None else min(sub.end_date, period_end)
            if effective_end < effective_start:
                continue

            days_count = _count_delivery_days(effective_start, effective_end, sub.schedule_type)

            product: Product = sub.product
            unit_price = product.price_per_unit
            line_total = (sub.quantity_per_day * days_count) * unit_price

            BillItem.objects.create(
                bill=bill,
                subscription=sub,
                product_name=product.name,
                unit=product.unit,
                unit_price=unit_price,
                quantity_per_day=sub.quantity_per_day,
                days_count=days_count,
                line_total=line_total,
            )
            subtotal += line_total

        bill.subtotal = subtotal
        bill.total = subtotal  # Placeholder for taxes/discounts later
        bill.save(update_fields=["subtotal", "total"])

        return Response(BillSerializer(bill).data, status=status.HTTP_201_CREATED)


def _count_delivery_days(start: date, end: date, schedule_type: str) -> int:
    days = 0
    current = start
    idx = 0
    while current <= end:
        weekday = current.weekday()  # Mon=0 .. Sun=6
        if schedule_type == "DAILY":
            days += 1
        elif schedule_type == "ALTERNATE":
            if idx % 2 == 0:
                days += 1
        elif schedule_type == "WEEKDAYS":
            if weekday < 5:
                days += 1
        elif schedule_type == "WEEKENDS":
            if weekday >= 5:
                days += 1
        current += timedelta(days=1)
        idx += 1
    return days


@login_required
def my_billing_view(request):
    customer = getattr(request.user, "customer_profile", None)
    bills = Bill.objects.none()
    if customer is not None:
        bills = Bill.objects.filter(customer=customer).order_by("-created_at")
    return render(request, "billing_history.html", {"bills": bills})
