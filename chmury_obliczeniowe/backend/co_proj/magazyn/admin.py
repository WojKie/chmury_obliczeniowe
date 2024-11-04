# inventory/admin.py
from django.contrib import admin
from .models import Product, Order, Supplier, Delivery, Invoice, OrderProduct, DeliveryProduct

admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Supplier)
admin.site.register(Delivery)
admin.site.register(Invoice)
admin.site.register(OrderProduct)
admin.site.register(DeliveryProduct)