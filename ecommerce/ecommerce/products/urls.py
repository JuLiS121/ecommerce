from django.urls import path
from .views import *

urlpatterns = [
  path('create-product/',create_product,name='create_product'),
  path('create-category/',create_category,name='create_category'),
  path('all-products/',list_all_products,name='list_all_products'),
  path('all-categories/',list_all_categories,name='list_all_categories'),
  path('searched-products/<str:pk>',list_searched_products,name='list_searched_products'),
  path('products/<int:pk>/',get_product,name='get_product'),
  path('category/<int:pk>/',get_category,name='get_category'),
  path('category-products/<int:pk>/',get_category_product,name='get_category_product'),
]

