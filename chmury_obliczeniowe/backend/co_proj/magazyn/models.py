from django.db import models

# Create your models here.
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    nazwa = models.CharField(max_length=200)
    ilosc = models.IntegerField()
    cena = models.DecimalField(max_digits=10, decimal_places=2)

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    data = models.DateField()
    produkty = models.ManyToManyField(Product)
    status = models.CharField(max_length=50)

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    nazwa = models.CharField(max_length=200)
    dane_kontaktowe = models.TextField()

class Delivery(models.Model):
    delivery_id = models.AutoField(primary_key=True)
    produkty = models.ManyToManyField(Product)
    data_dostawy = models.DateField()

class Invoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    zamowienia = models.ForeignKey(Order, on_delete=models.CASCADE)
    kwota = models.DecimalField(max_digits=10, decimal_places=2)