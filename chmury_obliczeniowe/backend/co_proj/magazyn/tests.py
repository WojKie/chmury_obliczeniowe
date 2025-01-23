from django.test import TestCase
from django.db import connection
from django.db.utils import OperationalError
from django.utils import timezone
from django.core.exceptions import ValidationError
from magazyn.models import Product, Order, Supplier, Delivery, DeliveryProduct, OrderProduct

class DatabaseConnectionTest(TestCase):
    def test_database_connection(self):
        """Test połączenia z bazą danych"""
        try:
            c = connection.cursor()
            self.assertIsNotNone(c)
        except OperationalError:
            self.fail("Nie można połączyć się z bazą danych")

class DatabaseModelTests(TestCase):
    def setUp(self):
        """Przygotowanie danych testowych dla wszystkich testów"""
        self.product = Product.objects.create(
            name='Test product',
            quantity=10,
            category='OTHER',
            price=50
        )
        
        self.supplier = Supplier.objects.create(
            name='Test supplier',
            email="test@email.com",
            phone="123456",
            address="Test"
        )
        
        self.order = Order.objects.create(
            status='PENDING',
            total_amount=250
        )
        
        self.delivery = Delivery.objects.create(
            supplier=self.supplier,
            status='PENDING',
            delivery_date=timezone.now()
        )
        
        self.order_product = OrderProduct.objects.create(
            order=self.order,
            product=self.product,
            quantity=5,
            price_at_time=self.product.price
        )
        
        self.delivery_product = DeliveryProduct.objects.create(
            delivery=self.delivery,
            product=self.product,
            quantity=5
        )

    def test_crud_operations(self):
        """Test operacji CRUD na modelach"""
        # Create
        new_product = Product.objects.create(
            name='New product',
            quantity=20,
            category='OTHER',
            price=100
        )
        self.assertTrue(Product.objects.filter(name='New product').exists())

        # Read
        fetched_product = Product.objects.get(name='New product')
        self.assertEqual(fetched_product.quantity, 20)

        # Update
        fetched_product.quantity = 30
        fetched_product.save()
        self.assertEqual(
            Product.objects.get(name='New product').quantity,
            30
        )

        # Delete
        fetched_product.delete()
        self.assertFalse(Product.objects.filter(name='New product').exists())

    def test_invalid_operations(self):
        """Test nieprawidłowych operacji"""
        # Test nieprawidłowej kategorii
        product = Product(
            name='Invalid Category Product',
            quantity=20,
            category='INVALID_CATEGORY',
            price=100
        )
        with self.assertRaises(ValidationError):
            product.full_clean()

        # Test ujemnej ceny
        product = Product(
            name='Negative Price Product',
            quantity=10,
            category='OTHER',
            price=-100
        )
        with self.assertRaises(ValidationError):
            product.full_clean()