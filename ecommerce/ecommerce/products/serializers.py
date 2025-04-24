from rest_framework.serializers import ModelSerializer,PrimaryKeyRelatedField
from .models import *

class CategorySerializer(ModelSerializer):
  class Meta:
    model = Category
    fields = ['id','category_name','category_image']
    

class ProductSerializer(ModelSerializer):
    category = PrimaryKeyRelatedField(queryset=Category.objects.all())
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'quantity_available','category', 'product_image','created_at', 'updated_at']
        depth = 1