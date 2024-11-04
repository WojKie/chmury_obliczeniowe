from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import F
from .models import Product, Order, Supplier, Delivery, Invoice
from .serializers import (
    ProductSerializer, OrderSerializer, SupplierSerializer,
    DeliverySerializer, InvoiceSerializer
)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        product = self.get_object()
        quantity = int(request.data.get('quantity', 0))
        
        product.quantity = F('quantity') + quantity
        product.save()
        product.refresh_from_db()
        
        return Response({
            'message': f'Stock adjusted by {quantity}',
            'new_quantity': product.quantity
        })

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        status = request.data.get('status')
        
        if status in dict(Order.STATUS_CHOICES):
            order.status = status
            order.save()
            return Response({'message': f'Order status updated to {status}'})
        return Response({'error': 'Invalid status'}, status=400)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer

    @action(detail=True, methods=['post'])
    def process_delivery(self, request, pk=None):
        delivery = self.get_object()
        
        for delivery_product in delivery.deliveryproduct_set.all():
            product = delivery_product.product
            product.quantity = F('quantity') + delivery_product.quantity
            product.save()
        
        delivery.status = 'COMPLETED'
        delivery.save()
        
        return Response({'message': 'Delivery processed successfully'})

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=True, methods=['post'])
    def mark_as_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.paid = True
        invoice.save()
        return Response({'message': 'Invoice marked as paid'})