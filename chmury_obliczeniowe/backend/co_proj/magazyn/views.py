from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import F
from .models import Product, Order, Supplier, Delivery, DeliveryProduct, OrderProduct
from .serializers import (
    ProductSerializer, 
    OrderSerializer, 
    SupplierSerializer, 
    DeliverySerializer,
    DeliveryProductSerializer,
    OrderProductSerializer
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
        try:
            delivery = self.get_object()
            
            if delivery.status == 'COMPLETED':
                return Response(
                    {'error': 'Delivery already processed'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            for delivery_product in delivery.deliveryproduct_set.all():
                product = delivery_product.product
                product.quantity = F('quantity') + delivery_product.quantity
                product.save()
            
            delivery.status = 'COMPLETED'
            delivery.save()
            
            return Response(
                {'message': 'Delivery processed successfully'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeliveryProductViewSet(viewsets.ModelViewSet):
    queryset = DeliveryProduct.objects.all()
    serializer_class = DeliveryProductSerializer

    def perform_create(self, serializer):
        """Validate delivery status before creating delivery product"""
        delivery_product = serializer.save()
        if delivery_product.delivery.status == 'COMPLETED':
            raise ValidationError({'error': 'Cannot modify completed delivery'})


class OrderProductViewSet(viewsets.ModelViewSet):
    queryset = OrderProduct.objects.all()
    serializer_class = OrderProductSerializer

    def perform_create(self, serializer):
        """Validate order status before creating order product"""
        order_product = serializer.save()
        if order_product.order.status != 'PENDING':
            raise ValidationError({'error': 'Can only add products to pending orders'})
