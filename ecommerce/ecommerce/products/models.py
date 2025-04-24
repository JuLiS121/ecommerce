from django.db import models
# Create your models here.

def get_image_upload(instance,filename):
  return f'images/{instance.category_name}/{filename}'

def get_image_upload_path(instance, filename):
    return f'images/{instance.category.category_name}/{filename}'

class Category(models.Model):
    category_name = models.CharField(max_length=100)
    category_image = models.ImageField(upload_to=get_image_upload)

    def __str__(self):
        return self.category_name


class Product(models.Model):
  name = models.CharField(max_length=50)
  description = models.TextField()
  price = models.CharField(max_length=10)
  quantity_available = models.PositiveIntegerField(default=0)
  product_image = models.ImageField(upload_to=get_image_upload_path)
  category = models.ForeignKey(Category,on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self) -> str:
    return self.name
  