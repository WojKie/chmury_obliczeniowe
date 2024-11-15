from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'suppliers', views.SupplierViewSet)
router.register(r'deliveries', views.DeliveryViewSet)
router.register(r'delivery-products', views.DeliveryProductViewSet)  # Dodane
router.register(r'order-products', views.OrderProductViewSet)  # Dodane

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]