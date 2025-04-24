from django.db import models
from products.models import Product
from django.contrib.auth import get_user_model

Account = get_user_model()

class Cart(models.Model):
    customer = models.ForeignKey(Account, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username}'s cart - {self.product.name}"