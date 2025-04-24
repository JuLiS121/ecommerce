from django.urls import path
from .views import *

urlpatterns = [
  path('cart-products/<int:pk>/',get_cart_products,name='get_cart_products'),
  path('add-cart-product/',add_cart_product,name='add_cart_product'),
  path('carts/<int:id>/products/<int:product>/',set_quantity,name='set_quantity'),
  path('delete-cart-product/<int:pk>/<int:product>/',delete_cart_product,name='delete_cart_product'),
  path('clear-cart/<int:pk>/',clear_cart,name='clear_cart'),
  path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
]