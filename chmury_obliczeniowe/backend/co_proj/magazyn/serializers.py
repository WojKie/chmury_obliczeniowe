from rest_framework import serializers
from .models import Product, Order, Supplier, Delivery, Invoice, OrderProduct, DeliveryProduct

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'quantity', 'price', 'created_at', 'updated_at']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'email', 'phone', 'address', 'created_at']

class OrderProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderProduct
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_time']

class OrderSerializer(serializers.ModelSerializer):
    order_products = OrderProductSerializer(source='orderproduct_set', many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'date', 'status', 'total_amount', 'order_products']

class DeliveryProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = DeliveryProduct
        fields = ['id', 'product', 'product_name', 'quantity']

class DeliverySerializer(serializers.ModelSerializer):
    delivery_products = DeliveryProductSerializer(source='deliveryproduct_set', many=True, read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', 'supplier', 'supplier_name', 'delivery_date', 'status', 'delivery_products', 'created_at']

class InvoiceSerializer(serializers.ModelSerializer):
    order_number = serializers.IntegerField(source='order.id', read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'order', 'order_number', 'amount', 'created_at', 'due_date', 'paid']