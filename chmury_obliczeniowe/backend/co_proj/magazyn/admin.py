from django.contrib import admin
from .models import Product, Order, Supplier, Delivery, Invoice

# Register your models here.
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Supplier)
admin.site.register(Delivery)
admin.site.register(Invoice)